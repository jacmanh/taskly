'use client';

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  type KeyboardEvent,
} from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { Input, type InputProps } from '../Input';
import { cn } from '../../lib/utils';

export interface EditableInputProps extends Omit<InputProps, 'label'> {
  label?: string;
  value?: string | number;
  onSave?: (value: string | number) => void | Promise<void>;
  onCancel?: () => void;
  validate?: (value: string | number) => string | undefined;
  viewClassName?: string;
  emptyPlaceholder?: string;
  inline?: boolean;
}

export const EditableInput = forwardRef<HTMLInputElement, EditableInputProps>(
  (
    {
      label,
      value,
      onSave,
      onCancel,
      validate,
      viewClassName,
      emptyPlaceholder = 'Click to edit',
      type = 'text',
      className,
      disabled,
      inline = false,
      ...inputProps
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState<string | number>(value ?? '');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    // Sync editValue when value prop changes
    useEffect(() => {
      if (!isEditing) {
        setEditValue(value ?? '');
      }
    }, [value, isEditing]);

    // Focus input when entering edit mode
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing, inputRef]);

    const handleViewClick = useCallback(() => {
      if (!disabled) {
        setIsEditing(true);
      }
    }, [disabled]);

    const handleCancel = useCallback(() => {
      setEditValue(value ?? '');
      setError(undefined);
      setIsEditing(false);
      onCancel?.();
    }, [value, onCancel]);

    const handleSave = useCallback(async () => {
      if (isSaving) return;

      // Validate before saving
      if (validate) {
        const validationError = validate(editValue);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      try {
        setIsSaving(true);
        setError(undefined);
        await onSave?.(editValue);
        setIsEditing(false);
      } catch (err) {
        console.error('EditableInput save error:', err);
      } finally {
        setIsSaving(false);
      }
    }, [editValue, onSave, isSaving, validate]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSave();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          handleCancel();
        }
      },
      [handleSave, handleCancel]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue =
          type === 'number' ? Number(e.target.value) : e.target.value;
        setEditValue(newValue);

        // Validate on change and clear error if valid
        if (validate) {
          const validationError = validate(newValue);
          setError(validationError);
        }

        // Also call the original onChange if provided (for react-hook-form)
        if (inputProps.onChange) {
          (
            inputProps.onChange as (
              e: React.ChangeEvent<HTMLInputElement>
            ) => void
          )(e);
        }
      },
      [type, inputProps.onChange, validate]
    );

    // View mode
    if (!isEditing) {
      const displayValue = value ?? '';
      const isEmpty = displayValue === '' || displayValue === null;

      return (
        <div
          className={cn(
            'flex flex-col gap-2',
            inline && 'w-full inline-flex flex-row items-center'
          )}
        >
          {label && (
            <label
              htmlFor={inputProps.id}
              className={cn(
                'text-lg font-bold',
                inline && 'text-sm',
                error ? 'text-error-600' : 'text-neutral-700'
              )}
            >
              {label}
            </label>
          )}
          <div
            onClick={handleViewClick}
            className={cn(
              'text-sm group cursor-pointer px-3 py-2 rounded-xs',
              'border-transparent flex items-center justify-between',
              'hover:bg-neutral-100',
              disabled && 'cursor-not-allowed opacity-50',
              inline && 'w-full h-10',
              viewClassName
            )}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleViewClick();
              }
            }}
          >
            <span
              className={cn(
                'text-sm text-neutral-900',
                isEmpty && 'text-neutral-400 italic'
              )}
            >
              {isEmpty ? emptyPlaceholder : displayValue}
            </span>
          </div>
        </div>
      );
    }

    // Edit mode
    const hasError = Boolean(error);

    return (
      <div
        className={cn(
          'flex flex-col gap-2',
          inline && 'w-full inline-flex flex-row items-center'
        )}
      >
        {label && (
          <label
            htmlFor={inputProps.id}
            className={cn(
              'text-lg font-bold',
              inline && 'text-sm',
              error ? 'text-error-600' : 'text-neutral-700'
            )}
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex flex-col gap-2',
            inline && 'flex-1 flex-row items-center'
          )}
        >
          <div className={cn('w-full', inline && 'w-full h-10')}>
            <Input
              ref={inputRef}
              type={type}
              value={editValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={isSaving || disabled}
              error={error}
              className={cn('py-1.5', inline && 'h-10', className)}
              {...inputProps}
            />
          </div>
          <div
            className={cn(
              'flex justify-end items-center gap-1',
              inline && 'justify-start'
            )}
          >
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || hasError}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                'text-accent-500 hover:text-accent-700 hover:bg-accent-50',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              aria-label="Save"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

EditableInput.displayName = 'EditableInput';
