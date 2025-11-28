'use client';

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import type { LoginCredentials, RegisterCredentials } from '@taskly/types';
import type { AuthContextType } from '../types/auth-context';
import { useLogin, useRegister, useLogout } from '../hooks/useAuthMutations';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { authService } from '../services/auth.service';
import { getAccessToken } from '../services/axios';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: React.ReactNode;
}

const publicRoutes = ['/', '/login', '/register'];

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const [hasToken, setHasToken] = useState(() => !!getAccessToken());
  const [isInitializing, setIsInitializing] = useState(true);

  // Don't enable the query by default - it will be enabled when needed
  const {
    data: user,
    isLoading,
    refetch,
  } = useCurrentUser({ enabled: hasToken });

  // Initialize auth state on mount only for protected routes
  useEffect(() => {
    const isPublicRoute = publicRoutes.includes(pathname);

    if (isPublicRoute) {
      setIsInitializing(false);
      return; // Don't try to refresh on public routes
    }

    const initializeAuth = async () => {
      try {
        // Try to get a fresh access token from refresh token
        await authService.refreshToken();
        setHasToken(true);
        // This will trigger useCurrentUser to fetch the user
        await refetch();
      } catch (error) {
        // No valid session - middleware will handle redirect
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    // Only initialize if we don't have a token yet
    if (!hasToken) {
      initializeAuth();
    } else {
      setIsInitializing(false);
    }
  }, [pathname, refetch, hasToken]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      await loginMutation.mutateAsync(credentials);
      setHasToken(true);
    },
    [loginMutation]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      await registerMutation.mutateAsync(credentials);
      setHasToken(true);
    },
    [registerMutation]
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    setHasToken(false);
  }, [logoutMutation]);

  const refreshToken = useCallback(async () => {
    await authService.refreshToken();
    setHasToken(true);
    await refetch();
  }, [refetch]);

  const accessToken = hasToken ? getAccessToken() : null;

  const value: AuthContextType = useMemo(
    () => ({
      user: user || null,
      accessToken,
      isAuthenticated: !!user && !!accessToken,
      isLoading:
        isLoading ||
        isInitializing ||
        loginMutation.isPending ||
        registerMutation.isPending ||
        logoutMutation.isPending,
      login,
      register,
      logout,
      refreshToken,
    }),
    [
      accessToken,
      isLoading,
      isInitializing,
      loginMutation.isPending,
      registerMutation.isPending,
      logoutMutation.isPending,
      user,
      login,
      logout,
      refreshToken,
      register,
    ]
  );

  if (isInitializing || (hasToken && isLoading)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
