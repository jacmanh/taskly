'use client';

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { AutocompleteEmptyProps } from './types';
import { useAutocompleteContext } from './Autocomplete';

/**
 * Empty state component shown when no options match
 */
export const AutocompleteEmpty = forwardRef<
  HTMLDivElement,
  AutocompleteEmptyProps
>(({ children, className }, ref) => {
  const { state, props } = useAutocompleteContext();

  // Only show if there are no options and not loading
  if (state.displayOptions.length > 0 || state.loading) {
    return null;
  }

  const message = children || props.emptyMessage || 'No results found';

  return (
    <div
      ref={ref}
      role="status"
      className={cn(
        'px-2 py-6 text-center text-sm text-neutral-500',
        className
      )}
    >
      {message}
    </div>
  );
});

AutocompleteEmpty.displayName = 'AutocompleteEmpty';
