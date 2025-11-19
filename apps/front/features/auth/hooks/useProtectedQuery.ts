import {
  useQuery,
  useSuspenseQuery,
  UseQueryOptions,
  UseQueryResult,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
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

/**
 * Wrapper around useSuspenseQuery that automatically suspends
 * if auth is loading.
 */
export function useProtectedSuspenseQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>(
  options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseSuspenseQueryResult<TData, TError> {
  const { user, isLoading: authLoading } = useAuth();

  // Note: AuthProvider blocks rendering until initialization is complete,
  // so we don't need to manually suspend for authLoading here.

  if (!user) {
    // If auth is ready but no user, we can't run the query.
    // In a protected route, this should be handled by redirection,
    // but for the query, we might need to throw or return a dummy?
    // useSuspenseQuery doesn't support 'enabled', so we must ensure this is only called
    // when we expect a user.
    throw new Error('User not authenticated');
  }

  return useSuspenseQuery({
    ...options,
  });
}
