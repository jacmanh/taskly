import { chromium, type FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Playwright Global Setup
 *
 * Authenticates test user once before all tests run and saves
 * the browser storage state (cookies, localStorage, sessionStorage)
 * to `.auth/user.json` for reuse across all tests.
 *
 * This approach provides:
 * - Fast test execution (auth happens once, not per test)
 * - Realistic authentication flow testing
 * - Proper cookie/token management
 *
 * Test credentials (seeded via prisma/seed.ts):
 * - Email: test-user@taskly.com
 * - Password: Test123!@#
 */

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const storageStatePath = 'apps/front/.auth/user.json';
  const authDir = path.dirname(storageStatePath);

  // Ensure auth directory exists and set up logging
  fs.mkdirSync(authDir, { recursive: true });
  const logPath = path.resolve(authDir, 'setup.log');
  const log = (msg: string) =>
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);

  // Clear log for new run
  if (fs.existsSync(logPath)) {
    fs.unlinkSync(logPath);
  }

  log('🔐 Starting global authentication setup...');
  log(`📂 Auth directory: ${authDir}`);

  // Launch browser
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    log(`📍 Navigating to ${baseURL}/login`);
    await page.goto(`${baseURL}/login`);
    log(`➡️ On page: ${page.url()}`);

    // Wait for login page to load
    await page.waitForLoadState('networkidle');

    log('📝 Filling login form...');

    // Fill in test user credentials
    await page.getByLabel(/email/i).fill('test-user@taskly.com');
    await page.getByLabel(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();

    log('🚀 Submitting login, awaiting navigation...');

    // Submit form and wait for navigation
    await page.waitForURL('**/workspaces', { timeout: 10000 });

    log(`✅ Redirected to: ${page.url()}`);

    // Wait for auth to settle
    await page.waitForLoadState('networkidle');

    // Verify authentication worked
    const cookies = await context.cookies();
    const isAuthenticated = cookies.some(
      (cookie) => cookie.name === 'refreshToken'
    );

    if (!isAuthenticated) {
      throw new Error('Authentication failed: refreshToken cookie not found');
    }

    log('🍪 Refresh token cookie detected');

    // Save authenticated state
    log(`💾 Saving storage state to ${storageStatePath}...`);
    await context.storageState({ path: storageStatePath });

    log('✅ Global setup complete! Authentication state saved.');
  } catch (error: any) {
    log('❌ Global setup failed!');
    log(`Error: ${error.message}`);
    log(`Stack: ${error.stack}`);

    // Extended debugging information
    const currentUrl = page.url();
    log(`Failed at URL: ${currentUrl}`);
    try {
      const pageContent = await page.content();
      log(
        `📄 Page content on failure (first 5k chars):\n${pageContent.substring(
          0,
          5000
        )}`
      );
    } catch (contentError: any) {
      log(`Could not get page content: ${contentError.message}`);
    }

    // Take screenshot for debugging
    const screenshotPath = path.resolve(authDir, 'login-failure.png');
    try {
      await page.screenshot({ path: screenshotPath, fullPage: true });
      log(`📸 Screenshot saved to: ${screenshotPath}`);
    } catch (screenshotError: any) {
      log(`Could not save screenshot: ${screenshotError.message}`);
    }

    throw error;
  } finally {
    log('Ending global setup.');
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
