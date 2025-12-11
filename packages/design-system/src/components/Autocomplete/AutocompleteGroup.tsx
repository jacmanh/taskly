'use client';

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { AutocompleteGroupProps } from './types';

/**
 * Group container component for categorizing options
 */
export const AutocompleteGroup = forwardRef<
  HTMLDivElement,
  AutocompleteGroupProps
>(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      className={cn('py-1', className)}
    >
      {children}
    </div>
  );
});

AutocompleteGroup.displayName = 'AutocompleteGroup';
