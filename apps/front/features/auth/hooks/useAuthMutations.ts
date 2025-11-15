import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { LoginCredentials, RegisterCredentials } from '@taskly/types';
import { authService } from '../services/auth.service';
import { authQueryKeys } from '../constants/query-keys';

/**
 * Hook for login mutation
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(authQueryKeys.user(), data.user);
      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
}

/**
 * Hook for register mutation
 */
export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authService.register(credentials),
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(authQueryKeys.user(), data.user);
      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
}

/**
 * Hook for logout mutation
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear only auth-related queries
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
      // Redirect to login
      router.push('/login');
    },
  });
}
