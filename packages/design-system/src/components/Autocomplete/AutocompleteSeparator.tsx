'use client';

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { AutocompleteSeparatorProps } from './types';

/**
 * Visual separator component
 */
export const AutocompleteSeparator = forwardRef<
  HTMLDivElement,
  AutocompleteSeparatorProps
>(({ className }, ref) => {
  return (
    <div
      ref={ref}
      role="separator"
      className={cn('-mx-1 my-1 h-px bg-neutral-200', className)}
    />
  );
});

AutocompleteSeparator.displayName = 'AutocompleteSeparator';
