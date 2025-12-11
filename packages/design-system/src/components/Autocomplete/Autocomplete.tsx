'use client';

import { createContext, useContext, useMemo } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { AutocompleteProps, AutocompleteOption } from './types';
import { useAutocomplete, UseAutocompleteReturn } from './useAutocomplete';
import { generateId } from './utils';

/**
 * Context for sharing autocomplete state across compound components
 */
type AutocompleteContextValue<
  TValue = string,
  TMultiple extends boolean = false
> = UseAutocompleteReturn<TValue, TMultiple> & {
  props: AutocompleteProps<TValue, TMultiple>;
  ids: {
    trigger: string;
    content: string;
    getOptionId: (value: TValue) => string;
  };
};

// Create context with unknown type since we can't know the generic types at context creation time
// The context will be properly typed when accessed through the hook
const AutocompleteContext = createContext<
  AutocompleteContextValue<unknown, boolean> | null
>(null);

/**
 * Hook to access autocomplete context
 * This hook properly types the context based on the component's generic parameters
 */
export function useAutocompleteContext<
  TValue = string,
  TMultiple extends boolean = false
>(): AutocompleteContextValue<TValue, TMultiple> {
  const context = useContext(AutocompleteContext);
  if (!context) {
    throw new Error(
      'Autocomplete compound components must be used within <Autocomplete>'
    );
  }
  // Type assertion is safe here because the context is always created with matching types
  // from the parent Autocomplete component
  return context as AutocompleteContextValue<TValue, TMultiple>;
}

/**
 * Root Autocomplete component with context provider
 *
 * @example
 * // Simple usage with options prop
 * <Autocomplete
 *   options={[{ value: '1', label: 'Option 1' }]}
 *   value={value}
 *   onValueChange={setValue}
 * />
 *
 * @example
 * // Compound component usage
 * <Autocomplete value={value} onValueChange={setValue}>
 *   <AutocompleteTrigger />
 *   <AutocompleteContent>
 *     <AutocompleteList>
 *       <AutocompleteItem value="1">Option 1</AutocompleteItem>
 *     </AutocompleteList>
 *   </AutocompleteContent>
 * </Autocomplete>
 *
 * @example
 * // Async search
 * <Autocomplete
 *   onSearch={async (query) => {
 *     const res = await fetch(`/api/search?q=${query}`);
 *     return res.json();
 *   }}
 *   value={value}
 *   onValueChange={setValue}
 * />
 */
export function Autocomplete<
  TValue = string,
  TMultiple extends boolean = false
>(props: AutocompleteProps<TValue, TMultiple>) {
  const { children, id } = props;

  // Use the core hook
  const autocomplete = useAutocomplete(props);

  // Generate unique IDs for ARIA
  const ids = useMemo(
    () => ({
      trigger: id || generateId('autocomplete-trigger'),
      content: generateId('autocomplete-content'),
      getOptionId: (value: TValue) =>
        generateId(`autocomplete-option-${String(value)}`),
    }),
    [id]
  );

  // Create context value
  const contextValue = useMemo(
    () => ({
      ...autocomplete,
      props,
      ids,
    }),
    [autocomplete, props, ids]
  );

  return (
    <AutocompleteContext.Provider
      value={contextValue as AutocompleteContextValue<unknown, boolean>}
    >
      <PopoverPrimitive.Root
        open={autocomplete.state.open}
        onOpenChange={autocomplete.actions.setOpen}
      >
        {children}
      </PopoverPrimitive.Root>
    </AutocompleteContext.Provider>
  );
}

Autocomplete.displayName = 'Autocomplete';
