import { useQuery } from '@tanstack/react-query';
import type { User } from '@taskly/types';
import { authService } from '../services/auth.service';
import { getAccessToken } from '../services/axios';
import { authQueryKeys } from '../constants/query-keys';

interface UseCurrentUserOptions {
  enabled?: boolean;
}

/**
 * Hook to get current authenticated user
 */
export function useCurrentUser(options?: UseCurrentUserOptions) {
  return useQuery<User, Error>({
    queryKey: authQueryKeys.user(),
    queryFn: () => authService.getMe(),
    retry: false,
    // Only enable if we have an access token
    enabled: options?.enabled ?? !!getAccessToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
