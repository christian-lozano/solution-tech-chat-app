'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { MSWProvider } from '@/components/common/MSWProvider';
import { MSWStatus } from '@/components/common/MSWStatus';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { ErrorNotifications } from '@/components/common/ErrorNotifications';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos
            gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
            retry: (failureCount, error) => {
              // No reintentar en errores 4xx
              if (error instanceof Error && 'status' in error) {
                const status = (error as { status?: number }).status ?? 0;
                if (status >= 400 && status < 500) {
                  return false;
                }
              }
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <ErrorBoundary>
      <ErrorProvider>
        <MSWProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <ErrorNotifications />
            <MSWStatus />
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </MSWProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}