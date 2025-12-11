'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../Select';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface EditableSelectProps {
  label?: string;
  value?: string;
  options: SelectOption[];
  onSave?: (value: string) => void | Promise<void>;
  viewClassName?: string;
  emptyPlaceholder?: string;
  selectPlaceholder?: string;
  disabled?: boolean;
  inline?: boolean;
  renderValue?: (value: string, option?: SelectOption) => ReactNode;
}

export const EditableSelect: React.FC<EditableSelectProps> = ({
  label,
  value,
  options,
  onSave,
  viewClassName,
  emptyPlaceholder = 'Click to edit',
  selectPlaceholder = 'Select an option',
  disabled,
  renderValue,
  inline = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleViewClick = useCallback(() => {
    if (!disabled) {
      setIsEditing(true);
    }
  }, [disabled]);

  const handleValueChange = useCallback(
    async (newValue: string) => {
      if (isSaving) return;

      try {
        setIsSaving(true);
        await onSave?.(newValue);
        setIsEditing(false);
      } catch (err) {
        console.error('EditableSelect save error:', err);
      } finally {
        setIsSaving(false);
      }
    },
    [onSave, isSaving]
  );

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setIsEditing(false);
    }
  }, []);

  // Find the selected option
  const selectedOption = options.find((opt) => opt.value === value);

  const displayValue = value ?? '';
  const isEmpty = displayValue === '' || displayValue === null;

  // View mode
  if (!isEditing) {
    return (
      <div
        className={cn(
          'flex flex-col gap-2',
          inline && 'inline-flex flex-row items-center'
        )}
      >
        {label && (
          <label
            className={cn(
              'text-lg font-bold text-neutral-700',
              inline && 'text-sm'
            )}
          >
            {label}
          </label>
        )}
        <div
          onClick={handleViewClick}
          className={cn(
            'group cursor-pointer',
            'flex h-10 w-full items-center justify-between rounded-xs bg-white px-3 py-2',
            'text-sm text-neutral-900 transition-colors',
            'hover:bg-neutral-100',
            disabled && 'cursor-not-allowed opacity-50',
            isSaving && 'opacity-50',
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
              'text-sm',
              isEmpty ? 'text-neutral-400' : 'text-neutral-900'
            )}
          >
            {isEmpty
              ? emptyPlaceholder
              : renderValue
                ? renderValue(displayValue, selectedOption)
                : selectedOption?.label || displayValue}
          </span>
          {isSaving && (
            <Loader2 size={16} className="animate-spin text-neutral-400" />
          )}
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        inline && 'inline-flex flex-row items-center'
      )}
    >
      {label && (
        <label
          className={cn(
            'text-lg font-bold text-neutral-700',
            inline && 'text-sm'
          )}
        >
          {label}
        </label>
      )}
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={isSaving || disabled}
        open={isEditing}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={selectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

EditableSelect.displayName = 'EditableSelect';
