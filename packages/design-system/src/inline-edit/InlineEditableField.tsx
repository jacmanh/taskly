'use client';

import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';
import { cn } from '../lib/utils';

export interface InlineEditableFieldProps<T = string> {
  /** Current value to display */
  value: T;
  /** Callback when value is saved */
  onSave: (value: T) => void | Promise<void>;
  /** Callback when edit is cancelled */
  onCancel?: () => void;
  /** Whether the field can be edited */
  canEdit?: boolean;
  /** Label for accessibility */
  label?: string;
  /** ARIA label for screen readers */
  ariaLabel?: string;
  /** Custom render function for read mode */
  renderReadMode?: (value: T) => ReactNode;
  /** Custom render function for edit mode */
  renderEditMode?: (props: {
    value: T;
    onChange: (value: T) => void;
    onBlur: (e: FocusEvent) => void;
    onKeyDown: (e: KeyboardEvent) => void;
    inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  }) => ReactNode;
  /** Validation function */
  validate?: (value: T) => string | undefined;
  /** Error message to display */
  error?: string;
  /** Placeholder text for empty values */
  placeholder?: string;
  /** Type of input field */
  inputType?: 'text' | 'textarea' | 'select' | 'date';
  /** Options for select input */
  selectOptions?: Array<{ value: string; label: string }>;
  /** Custom className for the container */
  className?: string;
  /** Tooltip to show when field is not editable */
  readOnlyTooltip?: string;
  /** Whether to show save/cancel buttons */
  showButtons?: boolean;
  /** Whether save is in progress */
  isSaving?: boolean;
}

export function InlineEditableField<T = string>({
  value,
  onSave,
  onCancel,
  canEdit = true,
  label,
  ariaLabel,
  renderReadMode,
  renderEditMode,
  validate,
  error: externalError,
  placeholder = 'Click to edit',
  inputType = 'text',
  selectOptions = [],
  className,
  readOnlyTooltip = 'You do not have permission to edit this field',
  showButtons = true,
  isSaving = false,
}: InlineEditableFieldProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<T>(value);
  const [internalError, setInternalError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const error = externalError || internalError;

  // Update edit value when prop value changes
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Select all text for easier editing
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleEnterEditMode = () => {
    if (canEdit && !isEditing) {
      setIsEditing(true);
      setInternalError(undefined);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setInternalError(undefined);
    onCancel?.();
  };

  const handleSave = async () => {
    // Validate
    if (validate) {
      const validationError = validate(editValue);
      if (validationError) {
        setInternalError(validationError);
        return;
      }
    }

    // Clear error and save
    setInternalError(undefined);
    await onSave(editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Enter' && inputType !== 'textarea') {
      e.preventDefault();
      handleSave();
    }
  };

  const handleBlur = (e: FocusEvent) => {
    // Don't auto-save on blur if buttons are shown
    // (user might be clicking save/cancel button)
    if (!showButtons) {
      handleSave();
    }
  };

  // Read mode display
  const displayValue: ReactNode = renderReadMode
    ? renderReadMode(value)
    : (value as ReactNode) || placeholder;

  // Render read mode
  if (!isEditing) {
    return (
      <div className={cn('group relative', className)}>
        {label && (
          <label className="text-sm font-medium text-neutral-700 mb-1 block">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={handleEnterEditMode}
          disabled={!canEdit}
          aria-label={ariaLabel || `Edit ${label || 'field'}`}
          title={!canEdit ? readOnlyTooltip : 'Click to edit'}
          className={cn(
            'w-full text-left px-3 py-2 rounded-lg border-2 border-transparent transition-all',
            canEdit &&
              'hover:border-neutral-200 hover:bg-neutral-50 cursor-pointer focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-200',
            !canEdit && 'cursor-not-allowed opacity-60',
            !value && 'text-neutral-400'
          )}
        >
          {displayValue}
        </button>
      </div>
    );
  }

  // Render edit mode
  return (
    <div className={cn('relative', className)}>
      {label && (
        <label className="text-sm font-medium text-neutral-700 mb-1 block">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {renderEditMode ? (
          renderEditMode({
            value: editValue,
            onChange: setEditValue,
            onBlur: handleBlur,
            onKeyDown: handleKeyDown,
            inputRef,
          })
        ) : (
          <>
            {inputType === 'textarea' ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={editValue as string}
                onChange={(e) => setEditValue(e.target.value as T)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                aria-label={ariaLabel || `Edit ${label || 'field'}`}
                className={cn(
                  'w-full px-4 py-2 rounded-lg border-2 border-neutral-200 text-neutral-900 transition-all focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-200 placeholder-neutral-400',
                  error &&
                    'border-error-500 focus:border-error-500 focus:ring-error-200'
                )}
                rows={4}
              />
            ) : inputType === 'select' ? (
              <select
                value={editValue as string}
                onChange={(e) => setEditValue(e.target.value as T)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                aria-label={ariaLabel || `Edit ${label || 'field'}`}
                className={cn(
                  'w-full px-4 py-2 rounded-lg border-2 border-neutral-200 text-neutral-900 transition-all focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-200',
                  error &&
                    'border-error-500 focus:border-error-500 focus:ring-error-200'
                )}
              >
                {selectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type={inputType}
                value={editValue as string}
                onChange={(e) => setEditValue(e.target.value as T)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                aria-label={ariaLabel || `Edit ${label || 'field'}`}
                className={cn(
                  'w-full px-4 py-2 rounded-lg border-2 border-neutral-200 text-neutral-900 transition-all focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-200 placeholder-neutral-400',
                  error &&
                    'border-error-500 focus:border-error-500 focus:ring-error-200'
                )}
              />
            )}
          </>
        )}

        {error && <p className="text-sm text-error-600">{error}</p>}

        {showButtons && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm bg-accent-500 text-white rounded-lg hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
