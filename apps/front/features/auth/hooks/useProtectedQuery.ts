import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { getAccessToken } from '../services/axios';

/**
 * Wrapper around useQuery that automatically disables the query
 * if there's no access token available.
 *
 * This prevents 401 errors on initial render when tokens haven't been loaded yet.
 */
export function useProtectedQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  return useQuery({
    ...options,
    // Only enable if we have an access token
    enabled: options.enabled ?? !!getAccessToken(),
  });
}
