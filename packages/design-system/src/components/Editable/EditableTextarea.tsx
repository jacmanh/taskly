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
import { Textarea, type TextareaProps } from '../Textarea';
import { cn } from '../../lib/utils';

export interface EditableTextareaProps extends Omit<TextareaProps, 'label'> {
  label?: string;
  value?: string;
  onSave?: (value: string) => void | Promise<void>;
  onCancel?: () => void;
  validate?: (value: string) => string | undefined;
  viewClassName?: string;
  labelClassName?: string;
  emptyPlaceholder?: string;
  minRows?: number;
  maxRows?: number;
}

export const EditableTextarea = forwardRef<
  HTMLTextAreaElement,
  EditableTextareaProps
>(
  (
    {
      label,
      value,
      onSave,
      onCancel,
      validate,
      viewClassName,
      labelClassName,
      emptyPlaceholder = 'Click to edit',
      minRows = 3,
      maxRows = 10,
      className,
      disabled,
      ...textareaProps
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState<string>(value ?? '');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef =
      (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    // Sync editValue when value prop changes
    useEffect(() => {
      if (!isEditing) {
        setEditValue(value ?? '');
      }
    }, [value, isEditing]);

    // Auto-resize textarea
    const autoResize = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset height to get accurate scrollHeight
      textarea.style.height = 'auto';

      // Calculate line height and desired height
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
      const minHeight = lineHeight * minRows;
      const maxHeight = lineHeight * maxRows;
      const desiredHeight = Math.min(
        Math.max(textarea.scrollHeight, minHeight),
        maxHeight
      );

      textarea.style.height = `${desiredHeight}px`;
      textarea.style.overflowY =
        textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }, [minRows, maxRows]);

    // Focus textarea when entering edit mode
    useEffect(() => {
      if (isEditing && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
        autoResize();
      }
    }, [isEditing, textareaRef, autoResize]);

    // Auto-resize on value change
    useEffect(() => {
      if (isEditing) {
        autoResize();
      }
    }, [editValue, isEditing, autoResize]);

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
        console.error('EditableTextarea save error:', err);
      } finally {
        setIsSaving(false);
      }
    }, [editValue, onSave, isSaving, validate]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLTextAreaElement>) => {
        // Cmd/Ctrl + Enter to save
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
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
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setEditValue(newValue);

        // Auto-resize after value change
        autoResize();

        // Validate on change and clear error if valid
        if (validate) {
          const validationError = validate(newValue);
          setError(validationError);
        }

        // Also call the original onChange if provided (for react-hook-form)
        if (textareaProps.onChange) {
          (
            textareaProps.onChange as (
              e: React.ChangeEvent<HTMLTextAreaElement>
            ) => void
          )(e);
        }
      },
      [textareaProps.onChange, validate, autoResize]
    );

    // View mode
    if (!isEditing) {
      const displayValue = value ?? '';
      const isEmpty = displayValue === '' || displayValue === null;

      return (
        <div className="flex flex-col gap-2">
          {label && (
            <label
              htmlFor={textareaProps.id}
              className={cn(
                'text-lg font-bold',
                error ? 'text-error-600' : 'text-neutral-700',
                labelClassName
              )}
            >
              {label}
            </label>
          )}
          <div
            onClick={handleViewClick}
            className={cn(
              'text-sm group cursor-pointer px-4 py-2 rounded-xs',
              'border-transparent',
              'hover:bg-neutral-100',
              disabled && 'cursor-not-allowed opacity-50',
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
                'text-sm text-neutral-900 whitespace-pre-wrap',
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
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={textareaProps.id}
            className={cn(
              'text-lg font-bold',
              error ? 'text-error-600' : 'text-neutral-700',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <div className="flex flex-col items-start gap-2">
          <div className="w-full">
            <Textarea
              ref={textareaRef}
              value={editValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={isSaving || disabled}
              error={error}
              className={cn('py-1.5 resize-none', className)}
              rows={minRows}
              {...textareaProps}
            />
          </div>
          <div className="flex w-full justify-end items-center gap-1">
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

EditableTextarea.displayName = 'EditableTextarea';
