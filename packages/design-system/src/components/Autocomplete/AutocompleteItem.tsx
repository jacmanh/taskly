'use client';

import { forwardRef, useCallback } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AutocompleteItemProps } from './types';
import { useAutocompleteContext } from './Autocomplete';
import { isOptionSelected } from './utils';

/**
 * Individual option item component
 */
export const AutocompleteItem = forwardRef<
  HTMLDivElement,
  AutocompleteItemProps
>(({ value, disabled = false, children, className }, ref) => {
  const { state, computed, actions, props, ids } = useAutocompleteContext();

  const { multiple = false, renderOption } = props;
  const { focusedIndex } = state;

  // Find the option data
  const option = state.displayOptions.find((opt) => opt.value === value);
  const optionIndex = state.displayOptions.findIndex(
    (opt) => opt.value === value
  );

  if (!option) {
    console.warn(
      `AutocompleteItem: Option with value "${String(value)}" not found`
    );
    return null;
  }

  const isSelected = isOptionSelected(option, state.value, multiple);
  const isFocused = optionIndex === focusedIndex;
  const isDisabled = Boolean(disabled || option.disabled);

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      actions.selectOption(option);
    }
  }, [isDisabled, actions, option]);

  const handleMouseEnter = useCallback(() => {
    if (!isDisabled) {
      // Update focused index on mouse enter
      if (optionIndex >= 0) {
        // We'll add a method to set focused index directly in a future update
      }
    }
  }, [isDisabled, optionIndex]);

  // Custom rendering if provided
  const content = renderOption
    ? renderOption(option, {
        selected: isSelected,
        focused: isFocused,
        disabled: isDisabled,
      })
    : children || option.label;

  return (
    <div
      ref={ref}
      id={ids.getOptionId(value)}
      role="option"
      aria-selected={isSelected}
      aria-disabled={isDisabled}
      data-value={String(value)}
      data-selected={isSelected}
      data-focused={isFocused}
      data-disabled={isDisabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center',
        'rounded-md px-2 py-1.5 text-sm text-neutral-800 outline-none',
        'transition-colors',
        isFocused && 'bg-neutral-100',
        !isFocused && 'hover:bg-neutral-100',
        isDisabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      {/* Checkbox indicator for multi-select */}
      {multiple && (
        <span
          className={cn(
            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
            isSelected
              ? 'border-accent-600 bg-accent-600 text-white'
              : 'border-neutral-300'
          )}
        >
          {isSelected && <Check size={12} strokeWidth={3} />}
        </span>
      )}

      {/* Content */}
      <span className="flex-1">
        {content}
        {option.description && (
          <span className="block text-xs text-neutral-500 mt-0.5">
            {option.description}
          </span>
        )}
      </span>

      {/* Check mark for single-select */}
      {!multiple && isSelected && (
        <Check size={16} className="ml-2 text-accent-600" strokeWidth={2.5} />
      )}
    </div>
  );
});

AutocompleteItem.displayName = 'AutocompleteItem';
