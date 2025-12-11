'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { Calendar, type CalendarProps } from './calendar/Calendar';
import { Input, type InputProps } from './Input';
import { DateRange, OnSelectHandler } from 'react-day-picker';

export type DatePickerProps = CalendarProps & {
  value?: Date | Date[] | DateRange | undefined;
  onChange?: (date: Date | Date[] | DateRange | undefined) => void;
  label?: string;
  placeholder?: string;
  dateFormat?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  inputProps?: Omit<InputProps, 'value' | 'onChange' | 'disabled' | 'error'>;
};

function DatePickerInternal(
  {
    label,
    value,
    onChange,
    placeholder = 'Pick a date',
    dateFormat = 'PPP',
    disabled = false,
    error,
    className,
    inputProps,
    ...calendarProps
  }: DatePickerProps,
  ref: React.Ref<HTMLInputElement>
) {
  const [open, setOpen] = React.useState(false);

  const handleSelect: OnSelectHandler<Date | Date[] | DateRange | undefined> =
    React.useCallback(
      (selected) => {
        onChange?.(selected);
        setOpen(false);
      },
      [onChange]
    );

  const handleReset = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(undefined);
    },
    [onChange]
  );

  const hasValue = Boolean(
    value &&
      (value instanceof Date ||
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === 'object' && 'from' in value && value.from))
  );

  // Format the display value based on selected type
  const getDisplayValue = () => {
    if (!value) return '';

    if (value instanceof Date) {
      return format(value, dateFormat);
    }

    if (Array.isArray(value)) {
      return value.map((d: Date) => format(d, dateFormat)).join(', ');
    }

    // DateRange
    if (typeof value === 'object' && 'from' in value) {
      const { from, to } = value;
      if (from && to) {
        return `${format(from, dateFormat)} - ${format(to, dateFormat)}`;
      }
      if (from) {
        return format(from, dateFormat);
      }
    }

    return '';
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputProps?.id}
          className={cn(
            'text-sm font-medium',
            error ? 'text-error-600' : 'text-neutral-700'
          )}
        >
          {label}
        </label>
      )}
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <div className="relative group hover:bg-neutral-100 rounded-xs">
            <Input
              ref={ref}
              value={getDisplayValue()}
              placeholder={placeholder}
              disabled={disabled}
              error={error}
              readOnly
              borderless
              className={cn(
                'cursor-pointer group-hover:bg-neutral-100',
                hasValue ? 'pr-16' : 'pr-10',
                className
              )}
              {...inputProps}
            />
            {hasValue && !disabled && (
              <button
                type="button"
                onClick={handleReset}
                className={cn(
                  'absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6',
                  'text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 transition-colors',
                  'flex items-center justify-center rounded-lg'
                )}
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <CalendarIcon
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500',
                disabled && 'opacity-50'
              )}
            />
          </div>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            className={cn(
              'z-50 w-auto rounded-lg border border-neutral-200 bg-white p-0 shadow-md',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
            )}
            sideOffset={4}
          >
            <Calendar
              selected={value as any}
              onSelect={handleSelect}
              {...calendarProps}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}

export const DatePicker = React.forwardRef(DatePickerInternal);

DatePicker.displayName = 'DatePicker';
