import { useState, useEffect, useRef } from 'react';
import { AutocompleteOption, AutocompleteAsyncSearchFn } from './types';

export interface UseAutocompleteAsyncOptions<TValue> {
  onSearch?: AutocompleteAsyncSearchFn<TValue>;
  query: string;
  debounceMs: number;
  enabled: boolean;
}

export interface UseAutocompleteAsyncReturn<TValue> {
  options: AutocompleteOption<TValue>[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for async search with debouncing and abort support
 */
export function useAutocompleteAsync<TValue>({
  onSearch,
  query,
  debounceMs,
  enabled,
}: UseAutocompleteAsyncOptions<TValue>): UseAutocompleteAsyncReturn<TValue> {
  const [options, setOptions] = useState<AutocompleteOption<TValue>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If async search is not enabled or no search function provided, do nothing
    if (!enabled || !onSearch) {
      setOptions([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Cancel any pending debounced search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // If query is empty, clear results
    if (!query.trim()) {
      setOptions([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Set loading state immediately
    setLoading(true);
    setError(null);

    // Debounce the search
    timeoutRef.current = setTimeout(async () => {
      // Create new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const results = await onSearch(query, abortController.signal);

        // Only update state if this request wasn't aborted
        if (!abortController.signal.aborted) {
          setOptions(results);
          setError(null);
        }
      } catch (err) {
        // Only update error if this request wasn't aborted
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err : new Error('Search failed'));
          setOptions([]);
        }
      } finally {
        // Only update loading if this request wasn't aborted
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    }, debounceMs);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [onSearch, query, debounceMs, enabled]);

  return {
    options,
    loading,
    error,
  };
}
