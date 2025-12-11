'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  EditableAutocompleteProps,
  type AutocompleteOption,
} from '../Autocomplete/types';
import {
  Autocomplete,
  useAutocompleteContext,
} from '../Autocomplete/Autocomplete';
import { AutocompleteTrigger } from '../Autocomplete/AutocompleteTrigger';
import { AutocompleteContent } from '../Autocomplete/AutocompleteContent';
import { AutocompleteList } from '../Autocomplete/AutocompleteList';
import { AutocompleteItem } from '../Autocomplete/AutocompleteItem';
import { AutocompleteGroup } from '../Autocomplete/AutocompleteGroup';
import { AutocompleteGroupLabel } from '../Autocomplete/AutocompleteGroupLabel';
import { AutocompleteEmpty } from '../Autocomplete/AutocompleteEmpty';
import { AutocompleteCreateItem } from '../Autocomplete/AutocompleteCreateItem';
import { findOptionByValue, flattenOptions } from '../Autocomplete/utils';

/**
 * Component to render async search results from context
 */
const AsyncAutocompleteItems = () => {
  const { state } = useAutocompleteContext();

  return (
    <>
      {state.displayOptions.map((option) => (
        <AutocompleteItem key={String(option.value)} value={option.value}>
          {option.label}
        </AutocompleteItem>
      ))}
    </>
  );
};

/**
 * Editable wrapper for Autocomplete component with view/edit modes
 * Works like EditableSelect - opens immediately on click and saves automatically
 *
 * @example
 * <EditableAutocomplete
 *   label="Assignee"
 *   value={userId}
 *   options={users}
 *   onSave={async (newValue) => {
 *     await updateTask({ userId: newValue });
 *   }}
 *   inline
 *   emptyPlaceholder="Unassigned"
 * />
 */
export const EditableAutocomplete = ({
  label,
  value,
  onSave,
  viewClassName,
  labelClassName,
  emptyPlaceholder = 'Click to edit',
  inline = false,
  disabled,
  options = [],
  groups = [],
  renderValue,
  multiple = false,
  ...autocompleteProps
}: EditableAutocompleteProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleViewClick = useCallback(() => {
    if (!disabled) {
      // Get current display text to use as initial query
      const allOptions = flattenOptions(options, groups);
      const isEmpty =
        value === undefined || (Array.isArray(value) && value.length === 0);

      let displayText = '';
      if (!isEmpty) {
        if (renderValue) {
          // Use renderValue to get display text
          const rendered = renderValue(value, allOptions);
          displayText = typeof rendered === 'string' ? rendered : '';
        } else if (!multiple) {
          // Find the option label
          const option = findOptionByValue(value, allOptions);
          displayText = option ? option.label : '';
        }
      }

      setInitialQuery(displayText);
      setIsEditing(true);
    }
  }, [disabled, value, options, groups, renderValue, multiple]);

  // Auto-focus and select input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Use requestAnimationFrame to wait for DOM updates
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        // Wait one more frame for the value to be rendered
        requestAnimationFrame(() => {
          if (inputRef.current && inputRef.current.value) {
            inputRef.current.setSelectionRange(
              0,
              inputRef.current.value.length
            );
          }
        });
      });
    }
  }, [isEditing, initialQuery]);

  // Handle value change - save immediately like EditableSelect
  const handleValueChange = useCallback(
    async (
      newValue: typeof value,
      option:
        | AutocompleteOption<unknown>
        | AutocompleteOption<unknown>[]
        | undefined
    ) => {
      if (isSaving) return;

      try {
        setIsSaving(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await onSave?.(newValue, option as any);
        setIsEditing(false);
      } catch (err) {
        console.error('EditableAutocomplete save error:', err);
      } finally {
        setIsSaving(false);
      }
    },
    [onSave, isSaving]
  );

  // Handle dropdown close - exit edit mode
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setIsEditing(false);
    }
  }, []);

  // Get all flat options for display
  const allOptions = flattenOptions(options, groups);

  // Check if we're using async search
  const isAsyncMode = Boolean(autocompleteProps.onSearch);

  // View mode
  if (!isEditing) {
    const isEmpty =
      value === undefined || (Array.isArray(value) && value.length === 0);

    // Get selected options for display
    const selectedOptions = (() => {
      if (isEmpty) return [];

      if (multiple && Array.isArray(value)) {
        return value
          .map((v) => findOptionByValue(v, allOptions))
          .filter((opt) => opt !== undefined);
      }

      const option = findOptionByValue(value, allOptions);
      return option ? [option] : [];
    })();

    // Display text
    const displayText = (() => {
      if (isEmpty) return emptyPlaceholder;

      // Use custom renderValue if provided
      if (renderValue) {
        return renderValue(value, allOptions);
      }

      // Default display for single select
      if (!multiple && selectedOptions.length > 0) {
        return selectedOptions[0].label;
      }

      // Default display for multi-select
      if (multiple && selectedOptions.length > 0) {
        return selectedOptions.map((opt) => opt.label).join(', ');
      }

      return emptyPlaceholder;
    })();

    return (
      <div
        className={cn(
          'flex flex-col gap-2',
          inline && 'w-full inline-flex flex-row items-center'
        )}
      >
        {label && (
          <label
            className={cn(
              'text-lg font-bold text-neutral-700',
              inline && 'text-sm',
              labelClassName
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
            {displayText}
          </span>
          {isSaving && (
            <Loader2 size={16} className="animate-spin text-neutral-400" />
          )}
        </div>
      </div>
    );
  }

  // Edit mode - show autocomplete
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        inline && 'w-full inline-flex flex-row items-center'
      )}
    >
      {label && (
        <label
          className={cn(
            'text-lg font-bold text-neutral-700',
            inline && 'text-sm',
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <Autocomplete
        {...autocompleteProps}
        value={value}
        onValueChange={handleValueChange}
        options={options}
        groups={groups}
        multiple={multiple}
        disabled={isSaving || disabled}
        open={isEditing}
        onOpenChange={handleOpenChange}
        initialQuery={initialQuery}
      >
        <AutocompleteTrigger ref={inputRef} />
        <AutocompleteContent>
          <AutocompleteList>
            {/* For async mode, render items dynamically from context */}
            {isAsyncMode ? (
              <AsyncAutocompleteItems />
            ) : (
              <>
                {/* Render groups if provided */}
                {groups && groups.length > 0
                  ? groups.map((group) => (
                      <AutocompleteGroup key={group.label}>
                        <AutocompleteGroupLabel>
                          {group.label}
                        </AutocompleteGroupLabel>
                        {group.options.map((option) => (
                          <AutocompleteItem
                            key={String(option.value)}
                            value={option.value}
                          >
                            {option.label}
                          </AutocompleteItem>
                        ))}
                      </AutocompleteGroup>
                    ))
                  : // Render flat options
                    options.map((option) => (
                      <AutocompleteItem
                        key={String(option.value)}
                        value={option.value}
                      >
                        {option.label}
                      </AutocompleteItem>
                    ))}
              </>
            )}
            <AutocompleteEmpty />
            <AutocompleteCreateItem />
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  );
};

EditableAutocomplete.displayName = 'EditableAutocomplete';
