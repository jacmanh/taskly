'use client';

import { forwardRef } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '../../lib/utils';
import { AutocompleteContentProps } from './types';
import { useAutocompleteContext } from './Autocomplete';

/**
 * Content component that wraps the dropdown options
 */
export const AutocompleteContent = forwardRef<
  HTMLDivElement,
  AutocompleteContentProps
>(({ className, align = 'start', sideOffset = 4, children }, ref) => {
  const { refs, ids, props } = useAutocompleteContext();

  // Use provided ref or internal ref
  const contentRef = ref || refs.contentRef;

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={contentRef}
        id={ids.content}
        align={align}
        sideOffset={sideOffset}
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        className={cn(
          'z-50 rounded-lg',
          'border border-neutral-200 bg-white shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2',
          'data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        role="listbox"
        aria-label="Options"
        aria-multiselectable={props.multiple}
        onInteractOutside={(e) => {
          // Prevent closing when clicking on the trigger input
          const target = e.target as HTMLElement;
          if (refs.triggerRef.current?.contains(target)) {
            e.preventDefault();
          }
        }}
        onWheel={(e) => {
          // Allow wheel scrolling within the popover content
          e.stopPropagation();
        }}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});

AutocompleteContent.displayName = 'AutocompleteContent';
