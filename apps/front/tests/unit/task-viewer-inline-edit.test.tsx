import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  InlineEditableField,
  type InlineEditableFieldProps,
} from '@taskly/design-system';

describe('InlineEditableField Component', () => {
  const defaultProps: InlineEditableFieldProps = {
    value: 'Test Value',
    onSave: jest.fn(),
    label: 'Test Field',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Read Mode', () => {
    it('should render in read mode by default', () => {
      render(<InlineEditableField {...defaultProps} />);

      const editButton = screen.getByRole('button', { name: /edit test field/i });
      expect(editButton).toBeInTheDocument();
      expect(editButton).not.toBeDisabled();
    });

    it('should display placeholder when value is empty', () => {
      render(
        <InlineEditableField
          {...defaultProps}
          value=""
          placeholder="Click to edit"
          ariaLabel="Empty field"
        />
      );

      const button = screen.getByRole('button', { name: /empty field/i });
      expect(button).toBeInTheDocument();
    });

    it('should show label when provided', () => {
      const { container } = render(<InlineEditableField {...defaultProps} />);

      const label = container.querySelector('label');
      expect(label).toHaveTextContent('Test Field');
    });

    it('should enter edit mode when clicked', async () => {
      const user = userEvent.setup();
      render(<InlineEditableField {...defaultProps} />);

      const button = screen.getByRole('button', { name: /edit test field/i });
      await user.click(button);

      // Should show input in edit mode
      expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should not enter edit mode when canEdit is false', async () => {
      const user = userEvent.setup();
      render(<InlineEditableField {...defaultProps} canEdit={false} />);

      const button = screen.getByRole('button', { name: /edit test field/i });
      await user.click(button);

      // Should still be in read mode
      expect(screen.queryByDisplayValue('Test Value')).not.toBeInTheDocument();
    });

    it('should show read-only tooltip when canEdit is false', () => {
      render(
        <InlineEditableField
          {...defaultProps}
          canEdit={false}
          readOnlyTooltip="You do not have permission"
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'You do not have permission');
      expect(button).toBeDisabled();
    });
  });

  describe('Edit Mode', () => {
    it('should focus input when entering edit mode', async () => {
      const user = userEvent.setup();
      render(<InlineEditableField {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const input = screen.getByDisplayValue('Test Value');
      expect(input).toHaveFocus();
    });

    it('should allow editing the value', async () => {
      const user = userEvent.setup();
      render(<InlineEditableField {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const input = screen.getByDisplayValue('Test Value');
      await user.clear(input);
      await user.type(input, 'New Value');

      expect(screen.getByDisplayValue('New Value')).toBeInTheDocument();
    });

    it('should call onSave with new value when save button is clicked', async () => {
      const user = userEvent.setup();
      const onSave = jest.fn();
      render(<InlineEditableField {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const input = screen.getByDisplayValue('Test Value');
      await user.clear(input);
      await user.type(input, 'New Value');

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(onSave).toHaveBeenCalledWith('New Value');
    });

    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();
      render(<InlineEditableField {...defaultProps} onCancel={onCancel} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const input = screen.getByDisplayValue('Test Value');
      await user.clear(input);
      await user.type(input, 'New Value');

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onCancel).toHaveBeenCalled();
      // Should return to read mode
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('should save on Enter key press', async () => {
      const user = userEvent.setup();
      const onSave = jest.fn();
      render(<InlineEditableField {...defaultProps} onSave={onSave} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const input = screen.getByDisplayValue('Test Value');
      await user.clear(input);
      await user.type(input, 'New Value{Enter}');

      expect(onSave).toHaveBeenCalledWith('New Value');
    });

    it('should cancel on Escape key press', async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();
      render(<InlineEditableField {...defaultProps} onCancel={onCancel} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const input = screen.getByDisplayValue('Test Value');
      await user.type(input, ' Modified');
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(onCancel).toHaveBeenCalled();
      // Should return to read mode
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('should not save on Enter in textarea', async () => {
      const user = userEvent.setup();
      const onSave = jest.fn();
      render(
        <InlineEditableField
          {...defaultProps}
          inputType="textarea"
          onSave={onSave}
        />
      );

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const textarea = screen.getByDisplayValue('Test Value');
      await user.type(textarea, '{Enter}');

      // Should not save (textarea allows newlines)
      expect(onSave).not.toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('should show validation error when validation fails', async () => {
      const user = userEvent.setup();
      const validate = jest.fn((value: string) =>
        value.trim() === '' ? 'Field is required' : undefined
      );
      render(<InlineEditableField {...defaultProps} validate={validate} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const input = screen.getByDisplayValue('Test Value');
      await user.clear(input);
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(validate).toHaveBeenCalledWith('');
      // Error message should be announced for accessibility
      const errorMessage = screen.getByText('Field is required');
      expect(errorMessage).toBeInTheDocument();
      // Should still be in edit mode
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('should show external error when provided', async () => {
      const user = userEvent.setup();
      render(
        <InlineEditableField {...defaultProps} error="Server error occurred" />
      );

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const errorMessage = screen.getByText('Server error occurred');
      expect(errorMessage).toBeInTheDocument();
    });

    it('should clear validation error on successful save', async () => {
      const user = userEvent.setup();
      const validate = jest.fn((value: string) =>
        value.trim() === '' ? 'Field is required' : undefined
      );
      const onSave = jest.fn();
      render(
        <InlineEditableField
          {...defaultProps}
          validate={validate}
          onSave={onSave}
        />
      );

      await user.click(screen.getByRole('button', { name: /edit/i }));

      // Try to save with empty value
      const input = screen.getByDisplayValue('Test Value');
      await user.clear(input);
      await user.click(screen.getByRole('button', { name: /save/i }));

      const errorMessage = screen.getByText('Field is required');
      expect(errorMessage).toBeInTheDocument();

      // Fix the value and save again
      await user.type(input, 'Valid Value');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(onSave).toHaveBeenCalledWith('Valid Value');
      expect(screen.queryByText('Field is required')).not.toBeInTheDocument();
    });
  });

  describe('Different Input Types', () => {
    it('should render textarea when inputType is textarea', async () => {
      const user = userEvent.setup();
      render(
        <InlineEditableField
          {...defaultProps}
          inputType="textarea"
          ariaLabel="Task description"
        />
      );

      await user.click(screen.getByRole('button', { name: /task description/i }));

      // Textarea should be accessible and allow multiline input
      const textarea = screen.getByRole('textbox', { name: /task description/i });
      expect(textarea).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument();
    });

    it('should render select when inputType is select', async () => {
      const user = userEvent.setup();
      const selectOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];
      render(
        <InlineEditableField
          {...defaultProps}
          value="option1"
          inputType="select"
          selectOptions={selectOptions}
          ariaLabel="Select option"
        />
      );

      await user.click(screen.getByRole('button', { name: /select option/i }));

      // Select should be accessible via combobox role
      const select = screen.getByRole('combobox', { name: /select option/i });
      expect(select).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
    });

    it('should render date input when inputType is date', async () => {
      const user = userEvent.setup();
      render(
        <InlineEditableField
          {...defaultProps}
          value="2024-01-15"
          inputType="date"
          ariaLabel="Due date"
        />
      );

      await user.click(screen.getByRole('button', { name: /due date/i }));

      // Date input should be accessible
      const dateInput = screen.getByDisplayValue('2024-01-15');
      expect(dateInput).toBeInTheDocument();
      expect(dateInput).toHaveAttribute('aria-label', 'Due date');
    });
  });

  describe('ARIA and Accessibility', () => {
    it('should have proper aria-label', () => {
      render(<InlineEditableField {...defaultProps} ariaLabel="Task title" />);

      const button = screen.getByRole('button', { name: /task title/i });
      expect(button).toHaveAttribute('aria-label', 'Task title');
    });

    it('should have proper focus management', async () => {
      const user = userEvent.setup();
      render(<InlineEditableField {...defaultProps} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const input = screen.getByDisplayValue('Test Value');
      expect(input).toHaveFocus();
    });

    it('should show error message and keep focus on invalid input', async () => {
      const user = userEvent.setup();
      const validate = jest.fn(() => 'Error message');
      render(<InlineEditableField {...defaultProps} validate={validate} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      // Error message should be visible
      expect(screen.getByText('Error message')).toBeInTheDocument();
      // Should still be in edit mode with input available
      const input = screen.getByDisplayValue('Test Value');
      expect(input).toBeInTheDocument();
      // Save button should still be available to retry
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });
  });

  describe('Save Loading State', () => {
    it('should show loading state during save', async () => {
      const user = userEvent.setup();
      render(<InlineEditableField {...defaultProps} isSaving={true} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
    });

    it('should disable cancel button during save', async () => {
      const user = userEvent.setup();
      render(<InlineEditableField {...defaultProps} isSaving={true} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    });
  });

  describe('Custom Render Functions', () => {
    it('should use custom renderReadMode when provided', () => {
      const renderReadMode = jest.fn((value: string) => (
        <span role="status">Custom: {value}</span>
      ));
      render(
        <InlineEditableField {...defaultProps} renderReadMode={renderReadMode} />
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(renderReadMode).toHaveBeenCalledWith('Test Value');
    });

    it('should use custom renderEditMode when provided', async () => {
      const user = userEvent.setup();
      const renderEditMode = jest.fn((props) => (
        <input
          value={props.value as string}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="Custom input"
        />
      ));
      render(
        <InlineEditableField
          {...defaultProps}
          renderEditMode={renderEditMode}
        />
      );

      await user.click(screen.getByRole('button', { name: /edit/i }));

      expect(screen.getByPlaceholderText('Custom input')).toBeInTheDocument();
      expect(renderEditMode).toHaveBeenCalled();
    });
  });
});
