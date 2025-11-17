import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useAuth } from './useAuth';

/**
 * Wrapper around useQuery that automatically disables the query
 * if there's no access token available.
 *
 * This prevents 401 errors on initial render when tokens haven't been loaded yet.
 *
 * The query will automatically re-enable when authentication is complete,
 * ensuring proper reactivity to auth state changes.
 */
export function useProtectedQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const { user, isLoading: authLoading } = useAuth();

  // Enable the query only when:
  // 1. Auth has finished loading
  // 2. User is authenticated
  // 3. Custom enabled condition (if provided) is true
  const isEnabled = !authLoading && !!user && (options.enabled ?? true);

  return useQuery({
    ...options,
    enabled: isEnabled,
  });
}
