'use client';

import { forwardRef } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AutocompleteTriggerProps } from './types';
import { useAutocompleteContext } from './Autocomplete';

/**
 * Trigger component that displays the input field
 */
export const AutocompleteTrigger = forwardRef<
  HTMLInputElement,
  AutocompleteTriggerProps
>(({ placeholder, className, icon, clearable = true, onClear }, ref) => {
  const { state, computed, handlers, refs, ids, props } =
    useAutocompleteContext();

  const { query, loading, open } = state;
  const { hasValue, selectedOptions } = computed;
  const {
    onInputChange,
    onInputKeyDown,
    onInputFocus,
    onInputBlur,
    onClear: defaultOnClear,
  } = handlers;
  const { multiple = false, disabled, error } = props;

  // Use provided ref or internal ref
  const inputRef = ref || refs.triggerRef;

  // Display text in input
  const displayText =
    query ||
    (!multiple && hasValue && selectedOptions.length > 0
      ? selectedOptions[0].label
      : '');

  // For multi-select, show badges instead of text in the input
  const showBadges =
    multiple && hasValue && selectedOptions.length > 0 && !open;

  return (
    <PopoverPrimitive.Trigger asChild>
      <div className={cn('relative w-full', className)}>
        <div
          className={cn(
            'flex min-h-10 w-full items-center gap-2 rounded-lg',
            'border-2 bg-white px-3 py-2',
            'text-sm text-neutral-900 transition-all',
            'focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-200',
            error
              ? 'border-error-500 focus-within:border-error-500 focus-within:ring-error-200'
              : 'border-neutral-200',
            disabled && 'bg-neutral-100 cursor-not-allowed opacity-50'
          )}
        >
          {/* Search icon */}
          <div className="flex-shrink-0 text-neutral-400">
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              icon || <Search size={16} />
            )}
          </div>

          {/* Badges for multi-select */}
          {showBadges && (
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedOptions.map((option) => (
                <span
                  key={String(option.value)}
                  className="inline-flex items-center gap-1 rounded-md bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700"
                >
                  {option.label}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Remove individual item in multi-select
                        // This will be implemented when we add multi-select support
                      }}
                      className="hover:text-accent-900 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Input field */}
          {(!showBadges || open) && (
            <input
              ref={inputRef}
              id={ids.trigger}
              type="text"
              value={displayText}
              onChange={onInputChange}
              onKeyDown={onInputKeyDown}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              placeholder={placeholder || props.placeholder || 'Search...'}
              disabled={disabled}
              className={cn(
                'flex-1 bg-transparent text-sm outline-none',
                'placeholder:text-neutral-400',
                disabled && 'cursor-not-allowed'
              )}
              role="combobox"
              aria-expanded={open}
              aria-controls={ids.content}
              aria-autocomplete="list"
              aria-haspopup="listbox"
              aria-invalid={!!error}
              aria-required={props.required}
              aria-activedescendant={
                computed.focusedOption
                  ? ids.getOptionId(computed.focusedOption.value)
                  : undefined
              }
            />
          )}

          {/* Clear button */}
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                (onClear ?? defaultOnClear)();
              }}
              className={cn(
                'flex-shrink-0 text-neutral-400 hover:text-neutral-600',
                'transition-colors rounded-sm hover:bg-neutral-100 p-0.5'
              )}
              tabIndex={-1}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Error message */}
        {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
      </div>
    </PopoverPrimitive.Trigger>
  );
});

AutocompleteTrigger.displayName = 'AutocompleteTrigger';
