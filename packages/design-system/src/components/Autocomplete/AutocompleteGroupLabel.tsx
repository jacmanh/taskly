'use client';

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { AutocompleteGroupLabelProps } from './types';

/**
 * Group label component for category headers
 */
export const AutocompleteGroupLabel = forwardRef<
  HTMLDivElement,
  AutocompleteGroupLabelProps
>(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      role="presentation"
      className={cn(
        'px-2 py-1.5 text-xs font-semibold text-neutral-500',
        className
      )}
    >
      {children}
    </div>
  );
});

AutocompleteGroupLabel.displayName = 'AutocompleteGroupLabel';
