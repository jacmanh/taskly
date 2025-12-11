'use client';

import { forwardRef, useCallback, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AutocompleteCreateItemProps } from './types';
import { useAutocompleteContext } from './Autocomplete';

/**
 * Special item for creating new entries
 * Shows when onCreate handler is provided and no exact match exists
 */
export const AutocompleteCreateItem = forwardRef<
  HTMLDivElement,
  AutocompleteCreateItemProps
>(({ children, className }, ref) => {
  const { state, actions, props } = useAutocompleteContext();
  const [isCreating, setIsCreating] = useState(false);

  const { onCreate, createLabel } = props;
  const { query } = state;

  // Don't show if no onCreate handler or empty query
  if (!onCreate || !query.trim()) {
    return null;
  }

  // Check if there's an exact match already
  const hasExactMatch = state.displayOptions.some(
    (opt) => opt.label.toLowerCase() === query.toLowerCase()
  );

  if (hasExactMatch) {
    return null;
  }

  const handleCreate = useCallback(async () => {
    if (isCreating) return;

    try {
      setIsCreating(true);
      const newOption = await onCreate(query);

      // Select the newly created option
      actions.selectOption(newOption);
      actions.setQuery('');
    } catch (error) {
      console.error('Failed to create option:', error);
    } finally {
      setIsCreating(false);
    }
  }, [onCreate, query, actions, isCreating]);

  const label =
    typeof createLabel === 'function' ? createLabel(query) : createLabel;
  const displayLabel = children || label || `Create "${query}"`;

  return (
    <div
      ref={ref}
      onClick={handleCreate}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center',
        'rounded-md px-2 py-1.5 text-sm text-accent-600 outline-none',
        'transition-colors font-medium',
        'hover:bg-accent-50',
        isCreating && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <span className="mr-2">
        {isCreating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Plus size={16} />
        )}
      </span>
      <span>{displayLabel}</span>
    </div>
  );
});

AutocompleteCreateItem.displayName = 'AutocompleteCreateItem';
