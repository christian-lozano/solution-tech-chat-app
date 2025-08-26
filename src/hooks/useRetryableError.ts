'use client';

import { useState, useCallback } from 'react';
import { useErrorContext } from '@/contexts/ErrorContext';

interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

interface RetryableErrorState {
  isRetrying: boolean;
  retryCount: number;
  lastError: Error | null;
}

export function useRetryableError(config: RetryConfig = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2,
    shouldRetry = (error, attempt) => {
      // No reintentar errores 4xx (cliente)
      if ('status' in error && typeof error.status === 'number') {
        return error.status >= 500 && attempt < maxRetries;
      }
      return attempt < maxRetries;
    },
  } = config;

  const { addError } = useErrorContext();
  const [state, setState] = useState<RetryableErrorState>({
    isRetrying: false,
    retryCount: 0,
    lastError: null,
  });

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string = 'Operación'
  ): Promise<T> => {
    let attempt = 0;
    let lastError: Error;

    while (attempt <= maxRetries) {
      try {
        setState(prev => ({
          ...prev,
          isRetrying: attempt > 0,
          retryCount: attempt,
        }));

        const result = await operation();
        
        // Éxito - limpiar estado de error
        setState({
          isRetrying: false,
          retryCount: 0,
          lastError: null,
        });

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        setState(prev => ({
          ...prev,
          lastError,
        }));

        // Verificar si debemos reintentar
        if (attempt < maxRetries && shouldRetry(lastError, attempt)) {
          attempt++;
          
          // Mostrar notificación de reintento
          addError({
            message: `${operationName} falló, reintentando... (${attempt}/${maxRetries})`,
            type: 'warning',
            details: lastError.message,
          });

          // Esperar antes del siguiente intento con backoff exponencial
          const delay = retryDelay * Math.pow(backoffMultiplier, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // No más reintentos - mostrar error final
          setState(prev => ({
            ...prev,
            isRetrying: false,
          }));

          addError({
            message: `${operationName} falló después de ${attempt} intento${attempt !== 1 ? 's' : ''}`,
            type: 'error',
            details: lastError.message,
            action: {
              label: 'Reintentar',
              onClick: () => executeWithRetry(operation, operationName),
            },
          });

          throw lastError;
        }
      }
    }

    throw lastError!;
  }, [maxRetries, retryDelay, backoffMultiplier, shouldRetry, addError]);

  const reset = useCallback(() => {
    setState({
      isRetrying: false,
      retryCount: 0,
      lastError: null,
    });
  }, []);

  return {
    executeWithRetry,
    isRetrying: state.isRetrying,
    retryCount: state.retryCount,
    lastError: state.lastError,
    reset,
  };
}