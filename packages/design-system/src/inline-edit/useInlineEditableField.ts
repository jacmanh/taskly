'use client';

import { useState, useCallback, useEffect, type KeyboardEvent } from 'react';

export interface UseInlineEditableFieldOptions<T = string> {
  /** Initial value */
  initialValue: T;
  /** Callback when save is triggered */
  onSave?: (value: T) => void | Promise<void>;
  /** Callback when cancel is triggered */
  onCancel?: () => void;
  /** Callback when edit mode is entered */
  onEnterEdit?: () => void;
  /** Callback when edit mode is exited */
  onExitEdit?: () => void;
  /** Validation function */
  validate?: (value: T) => string | undefined;
  /** Whether to auto-save on blur */
  autoSaveOnBlur?: boolean;
}

export interface UseInlineEditableFieldReturn<T = string> {
  /** Current value being edited */
  value: T;
  /** Whether the field is in edit mode */
  isEditing: boolean;
  /** Whether a save operation is in progress */
  isSaving: boolean;
  /** Current validation error */
  error: string | undefined;
  /** Whether the value has changed from initial */
  isDirty: boolean;
  /** Enter edit mode */
  enterEditMode: () => void;
  /** Exit edit mode without saving */
  cancel: () => void;
  /** Save the current value */
  save: () => Promise<void>;
  /** Update the value */
  setValue: (value: T) => void;
  /** Handle keyboard events (Enter to save, Escape to cancel) */
  handleKeyDown: (e: KeyboardEvent) => void;
  /** Handle blur events */
  handleBlur: () => void;
  /** Reset to initial value */
  reset: () => void;
}

/**
 * Hook to manage inline editable field state and behavior.
 * Handles focus management, keyboard shortcuts, validation, and save/cancel logic.
 *
 * @example
 * ```tsx
 * const { value, isEditing, enterEditMode, save, cancel, setValue } = useInlineEditableField({
 *   initialValue: task.title,
 *   onSave: async (newTitle) => {
 *     await updateTask({ title: newTitle });
 *   },
 *   validate: (value) => value.trim() ? undefined : 'Title is required'
 * });
 * ```
 */
export function useInlineEditableField<T = string>({
  initialValue,
  onSave,
  onCancel,
  onEnterEdit,
  onExitEdit,
  validate,
  autoSaveOnBlur = false,
}: UseInlineEditableFieldOptions<T>): UseInlineEditableFieldReturn<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Track if value has changed from initial
  const isDirty = value !== initialValue;

  // Update value when initialValue changes (e.g., from parent re-render)
  useEffect(() => {
    if (!isEditing) {
      setValue(initialValue);
    }
  }, [initialValue, isEditing]);

  const enterEditMode = useCallback(() => {
    if (!isEditing) {
      setIsEditing(true);
      setError(undefined);
      onEnterEdit?.();
    }
  }, [isEditing, onEnterEdit]);

  const cancel = useCallback(() => {
    setValue(initialValue);
    setIsEditing(false);
    setError(undefined);
    setIsSaving(false);
    onCancel?.();
    onExitEdit?.();
  }, [initialValue, onCancel, onExitEdit]);

  const save = useCallback(async () => {
    // Validate
    if (validate) {
      const validationError = validate(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Skip save if value hasn't changed
    if (value === initialValue) {
      setIsEditing(false);
      onExitEdit?.();
      return;
    }

    // Save
    try {
      setError(undefined);
      setIsSaving(true);
      await onSave?.(value);
      setIsEditing(false);
      onExitEdit?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [value, initialValue, validate, onSave, onExitEdit]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        // Allow Shift+Enter for new lines in textareas
        const target = e.target as HTMLElement;
        if (target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          save();
        }
      }
    },
    [cancel, save]
  );

  const handleBlur = useCallback(() => {
    if (autoSaveOnBlur && !error) {
      save();
    }
  }, [autoSaveOnBlur, error, save]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(undefined);
    setIsSaving(false);
  }, [initialValue]);

  return {
    value,
    isEditing,
    isSaving,
    error,
    isDirty,
    enterEditMode,
    cancel,
    save,
    setValue,
    handleKeyDown,
    handleBlur,
    reset,
  };
}
