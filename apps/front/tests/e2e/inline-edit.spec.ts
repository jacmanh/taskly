import { test, expect, type Page } from '@playwright/test';

/**
 * E2E tests for inline editing task fields.
 * Tests cover User Story 1: Inline edit core task details
 *
 * Scenarios:
 * - @inline-edit-core: Edit title, description, status, dueDate with optimistic save
 * - @inline-edit-offline: Offline/API failure handling with retry flow
 */

test.describe('Inline Edit - Core Fields', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the workspaces page, app will redirect into the default one
    await page.goto('/workspaces');
    await page.waitForLoadState('networkidle');

    // Click on the project link (since we are already in a workspace)
    await page.getByRole('link', { name: /test project/i }).click();
    await page.waitForLoadState('networkidle');

    // Click on the task row to open the editor drawer
    await page.getByRole('cell', { name: /original task title/i }).click();

    // Verify the task drawer is open before each test
    await expect(page.getByRole('dialog', { name: /original task title/i })).toBeVisible();
  });

  test('@inline-edit-core should edit task title inline', async ({ page }) => {
    // Find the title field by accessible name
    const titleButton = page.getByRole('button', { name: /edit.*title/i });
    await expect(titleButton).toBeVisible();

    // Enter edit mode
    await titleButton.click();

    // Should show input in edit mode
    const titleInput = page.getByRole('textbox', { name: /task title/i });
    await expect(titleInput).toBeVisible();
    await expect(titleInput).toBeFocused();

    // Edit the title
    await titleInput.fill('Updated Task Title');

    // Save the changes
    const saveButton = page.getByRole('button', { name: /^save$/i });
    await saveButton.click();

    // Should show optimistic update and return to read mode
    await expect(titleButton).toBeVisible();
    await expect(titleInput).not.toBeVisible();

    // Verify the new value is displayed
    await expect(titleButton).toContainText('Updated Task Title');
  });

  test('@inline-edit-core should edit task description inline', async ({ page }) => {
    const descriptionButton = page.getByRole('button', { name: /edit.*description/i });
    await expect(descriptionButton).toBeVisible();

    await descriptionButton.click();

    // Textarea should be visible for description
    const descriptionTextarea = page.getByRole('textbox', { name: /task description/i });
    await expect(descriptionTextarea).toBeVisible();
    await expect(descriptionTextarea).toBeFocused();

    await descriptionTextarea.fill('Updated task description with more details');

    const saveButton = page.getByRole('button', { name: /^save$/i });
    await saveButton.click();

    await expect(descriptionButton).toBeVisible();
    await expect(descriptionButton).toContainText('Updated task description');
  });

  test('@inline-edit-core should edit task status inline', async ({ page }) => {
    const statusButton = page.getByRole('button', { name: /edit.*status/i });
    await expect(statusButton).toBeVisible();

    await statusButton.click();

    // Select should be visible
    const statusSelect = page.getByRole('combobox', { name: /task status/i });
    await expect(statusSelect).toBeVisible();

    // Change status
    await statusSelect.selectOption('IN_PROGRESS');

    const saveButton = page.getByRole('button', { name: /^save$/i });
    await saveButton.click();

    await expect(statusButton).toBeVisible();
    await expect(statusButton).toContainText(/in progress/i);
  });

  test('@inline-edit-core should edit task due date inline', async ({ page }) => {
    const dueDateButton = page.getByRole('button', { name: /edit.*due date/i });
    await expect(dueDateButton).toBeVisible();

    await dueDateButton.click();

    // Date input should be visible
    const dueDateInput = page.getByLabel(/due date/i);
    await expect(dueDateInput).toBeVisible();

    // Set a future date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0];

    await dueDateInput.fill(dateString);

    const saveButton = page.getByRole('button', { name: /^save$/i });
    await saveButton.click();

    await expect(dueDateButton).toBeVisible();
  });

  test('@inline-edit-core should handle validation errors', async ({ page }) => {
    const titleButton = page.getByRole('button', { name: /edit.*title/i });
    await titleButton.click();

    const titleInput = page.getByRole('textbox', { name: /task title/i });

    // Clear the title (should fail validation)
    await titleInput.clear();

    const saveButton = page.getByRole('button', { name: /^save$/i });
    await saveButton.click();

    // Should show validation error
    await expect(page.getByText(/title.*required/i)).toBeVisible();

    // Should still be in edit mode
    await expect(titleInput).toBeVisible();
    await expect(saveButton).toBeVisible();

    // Fix the validation error
    await titleInput.fill('Valid Title');
    await saveButton.click();

    // Should save successfully
    await expect(titleButton).toBeVisible();
    await expect(page.getByText(/title.*required/i)).not.toBeVisible();
  });

  test('@inline-edit-core should cancel edit with Escape key', async ({ page }) => {
    const titleButton = page.getByRole('button', { name: /edit.*title/i });
    const originalText = await titleButton.textContent();

    await titleButton.click();

    const titleInput = page.getByRole('textbox', { name: /task title/i });
    await titleInput.fill('This should be cancelled');

    // Press Escape to cancel
    await page.keyboard.press('Escape');

    // Should return to read mode with original value
    await expect(titleButton).toBeVisible();
    await expect(titleButton).toContainText(originalText || '');
  });

  test('@inline-edit-core should save with Enter key for text inputs', async ({ page }) => {
    const titleButton = page.getByRole('button', { name: /edit.*title/i });
    await titleButton.click();

    const titleInput = page.getByRole('textbox', { name: /task title/i });
    await titleInput.fill('Saved with Enter');

    // Press Enter to save
    await page.keyboard.press('Enter');

    // Should save and return to read mode
    await expect(titleButton).toBeVisible();
    await expect(titleButton).toContainText('Saved with Enter');
  });

  test('@inline-edit-core should NOT save with Enter key for textareas', async ({ page }) => {
    const descriptionButton = page.getByRole('button', { name: /edit.*description/i });
    await descriptionButton.click();

    const descriptionTextarea = page.getByRole('textbox', { name: /task description/i });
    await descriptionTextarea.fill('Line 1');

    // Press Enter should add newline, not save
    await page.keyboard.press('Enter');
    await descriptionTextarea.type('Line 2');

    // Textarea should still be visible (not saved)
    await expect(descriptionTextarea).toBeVisible();

    // Content should have newline
    const content = await descriptionTextarea.inputValue();
    expect(content).toContain('Line 1\nLine 2');
  });

  test('@inline-edit-core should handle concurrent edit conflict (409)', async ({ page }) => {
    // Mock a 409 conflict response
    await page.route('**/api/tasks/*', async (route) => {
      const request = route.request();
      if (request.method() === 'PATCH') {
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Task was modified by another user',
            latest: {
              id: 'test-task-id',
              title: 'Title Changed By Someone Else',
              updatedAt: new Date().toISOString(),
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    const titleButton = page.getByRole('button', { name: /edit.*title/i });
    await titleButton.click();

    const titleInput = page.getByRole('textbox', { name: /task title/i });
    await titleInput.fill('My Changes');

    const saveButton = page.getByRole('button', { name: /^save$/i });
    await saveButton.click();

    // Should show conflict error
    await expect(page.getByText(/modified by another user/i)).toBeVisible();

    // Should still be in edit mode to allow retry
    await expect(saveButton).toBeVisible();
  });
});

test.describe('Inline Edit - Offline & Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the workspaces page, app will redirect into the default one
    await page.goto('/workspaces');
    await page.waitForLoadState('networkidle');

    // Click on the project link (since we are already in a workspace)
    await page.getByRole('link', { name: /test project/i }).click();
    await page.waitForLoadState('networkidle');

    // Click on the task row to open the editor drawer
    await page.getByRole('cell', { name: /original task title/i }).click();

    // Verify the task drawer is open before each test
    await expect(page.getByRole('dialog', { name: /original task title/i })).toBeVisible();
  });

  test('@inline-edit-offline should handle network failure with retry', async ({ page }) => {
    // Simulate offline by blocking the API
    await page.route('**/api/tasks/*', async (route) => {
      await route.abort('failed');
    });

    const titleButton = page.getByRole('button', { name: /edit.*title/i });
    await titleButton.click();

    const titleInput = page.getByRole('textbox', { name: /task title/i });
    await titleInput.fill('Offline Edit');

    const saveButton = page.getByRole('button', { name: /^save$/i });
    await saveButton.click();

    // Should show network error
    await expect(page.getByText(/network.*error|failed.*save|offline/i)).toBeVisible();

    // Should retain value and allow retry
    await expect(titleInput).toBeVisible();
    await expect(titleInput).toHaveValue('Offline Edit');
    await expect(saveButton).toBeVisible();

    // Restore network and retry
    await page.unroute('**/api/tasks/*');

    // Mock successful response
    await page.route('**/api/tasks/*', async (route) => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'test-task-id',
            title: 'Offline Edit',
            updatedAt: new Date().toISOString(),
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Retry save
    await saveButton.click();

    // Should save successfully
    await expect(titleButton).toBeVisible();
    await expect(page.getByText(/network.*error|failed.*save/i)).not.toBeVisible();
  });

  test('@inline-edit-offline should handle API validation errors (400)', async ({ page }) => {
    await page.route('**/api/tasks/*', async (route) => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Validation failed',
            fieldErrors: [
              { field: 'title', message: 'Title must be at least 3 characters' },
            ],
          }),
        });
      } else {
        await route.continue();
      }
    });

    const titleButton = page.getByRole('button', { name: /edit.*title/i });
    await titleButton.click();

    const titleInput = page.getByRole('textbox', { name: /task title/i });
    await titleInput.fill('AB'); // Too short

    const saveButton = page.getByRole('button', { name: /^save$/i });
    await saveButton.click();

    // Should show server validation error
    await expect(page.getByText(/at least 3 characters/i)).toBeVisible();
    await expect(titleInput).toBeVisible();
  });

  test('@inline-edit-offline should handle permission errors (403)', async ({ page }) => {
    await page.route('**/api/tasks/*', async (route) => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'You do not have permission to edit this task',
          }),
        });
      } else {
        await route.continue();
      }
    });

    const titleButton = page.getByRole('button', { name: /edit.*title/i });
    await titleButton.click();

    const titleInput = page.getByRole('textbox', { name: /task title/i });
    await titleInput.fill('No Permission');

    const saveButton = page.getByRole('button', { name: /^save$/i });
    await saveButton.click();

    // Should show permission error
    await expect(page.getByText(/permission.*edit/i)).toBeVisible();
  });
});

test.describe('Inline Edit - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the workspaces page, app will redirect into the default one
    await page.goto('/workspaces');
    await page.waitForLoadState('networkidle');

    // Click on the project link (since we are already in a workspace)
    await page.getByRole('link', { name: /test project/i }).click();
    await page.waitForLoadState('networkidle');

    // Click on the task row to open the editor drawer
    await page.getByRole('cell', { name: /original task title/i }).click();

    // Verify the task drawer is open before each test
    await expect(page.getByRole('dialog', { name: /original task title/i })).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab to title field
    await page.keyboard.press('Tab');

    // Should be able to activate with Enter/Space
    await page.keyboard.press('Enter');

    // Input should be focused
    const titleInput = page.getByRole('textbox', { name: /task title/i });
    await expect(titleInput).toBeFocused();

    // Tab should move to save button
    await page.keyboard.press('Tab');
    const saveButton = page.getByRole('button', { name: /^save$/i });
    await expect(saveButton).toBeFocused();

    // Tab should move to cancel button
    await page.keyboard.press('Tab');
    const cancelButton = page.getByRole('button', { name: /cancel/i });
    await expect(cancelButton).toBeFocused();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    const titleButton = page.getByRole('button', { name: /edit.*title/i });

    // Should have accessible name
    await expect(titleButton).toHaveAttribute('aria-label', /.+/);

    await titleButton.click();

    const titleInput = page.getByRole('textbox', { name: /task title/i });
    await expect(titleInput).toHaveAttribute('aria-label', /.+/);
  });
});
