'use client';

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { AxiosError } from 'axios';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            // The axios interceptor already handles 401 refresh/redirect
            // This is just for logging or debugging
            if (error instanceof AxiosError && error.response?.status === 401) {
              console.log('Auth error caught by query cache');
            }
          },
        }),
        defaultOptions: {
          queries: {
            // Disable automatic refetching on window focus in development
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            // Don't retry on 401/403 - the axios interceptor handles refresh
            retry: (failureCount, error) => {
              if (error instanceof AxiosError) {
                if ([401, 403].includes(error.response?.status ?? 0)) {
                  return false;
                }
              }
              return failureCount < 1;
            },
            // Cache time
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
          mutations: {
            // Retry failed mutations
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
