'use client';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AutocompleteListProps } from './types';
import { useAutocompleteContext } from './Autocomplete';

/**
 * List container component for options
 * This will later support virtual scrolling for large datasets
 */
export const AutocompleteList = forwardRef<
  HTMLDivElement,
  AutocompleteListProps
>(({ children, className }, ref) => {
  const { state, refs, props } = useAutocompleteContext();

  // Use provided ref or internal ref
  const listRef = ref || refs.listRef;

  const loadingMessage = props.loadingMessage || 'Loading...';

  return (
    <div
      ref={listRef}
      className={cn('max-h-[300px] overflow-y-auto p-1', className)}
    >
      {state.loading ? (
        <div className="flex items-center justify-center py-6 text-sm text-neutral-500">
          <Loader2 size={16} className="animate-spin mr-2" />
          {loadingMessage}
        </div>
      ) : (
        children
      )}
    </div>
  );
});

AutocompleteList.displayName = 'AutocompleteList';
