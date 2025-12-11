import { useMemo } from 'react';
import {
  AutocompleteOption,
  AutocompleteGroup,
  AutocompleteFilterFn,
  AutocompleteFilterOptions,
} from './types';
import { defaultFilter, flattenOptions } from './utils';

export interface UseAutocompleteFilterOptions<TValue> {
  options: AutocompleteOption<TValue>[];
  groups?: AutocompleteGroup<TValue>[];
  query: string;
  filter: AutocompleteFilterFn<TValue> | 'default' | false;
  filterOptions?: AutocompleteFilterOptions;
}

export interface UseAutocompleteFilterReturn<TValue> {
  filteredOptions: AutocompleteOption<TValue>[];
  filteredGroups?: AutocompleteGroup<TValue>[];
}

/**
 * Hook for client-side filtering of autocomplete options
 */
export function useAutocompleteFilter<TValue>({
  options,
  groups,
  query,
  filter,
  filterOptions,
}: UseAutocompleteFilterOptions<TValue>): UseAutocompleteFilterReturn<TValue> {
  return useMemo(() => {
    // If filter is disabled, return all options
    if (filter === false) {
      return {
        filteredOptions: options,
        filteredGroups: groups,
      };
    }

    // Determine the filter function to use
    const filterFn: AutocompleteFilterFn<TValue> =
      filter === 'default'
        ? (opts, q) => defaultFilter(opts, q, filterOptions)
        : filter;

    // If we have groups, filter each group separately
    if (groups && groups.length > 0) {
      const filteredGroups: AutocompleteGroup<TValue>[] = groups
        .map((group) => ({
          label: group.label,
          options: filterFn(group.options, query),
        }))
        .filter((group) => group.options.length > 0);

      // Also apply filter to ungrouped options
      const filteredUngroupedOptions = filterFn(options, query);

      return {
        filteredOptions: filteredUngroupedOptions,
        filteredGroups,
      };
    }

    // Filter flat options
    const filteredOptions = filterFn(options, query);

    return {
      filteredOptions,
      filteredGroups: undefined,
    };
  }, [options, groups, query, filter, filterOptions]);
}
