'use client';

import { useState, useCallback } from 'react';
import { ERROR_MESSAGES } from '@/lib/constants';

interface ErrorState {
  message: string;
  type: 'network' | 'validation' | 'file' | 'general';
  timestamp: Date;
  details?: unknown;
}

/**
 * Hook para manejar errores de manera centralizada
 */
export function useErrorHandler() {
  const [errors, setErrors] = useState<ErrorState[]>([]);

  // Función para añadir error
  const addError = useCallback((
    error: string | Error,
    type: ErrorState['type'] = 'general',
    details?: unknown
  ) => {
    const errorMessage = error instanceof Error ? error.message : error;
    
    const newError: ErrorState = {
      message: errorMessage,
      type,
      timestamp: new Date(),
      details,
    };

    setErrors(prev => [...prev, newError]);

    // Log del error para debugging
    console.error(`[${type.toUpperCase()}] ${errorMessage}`, details);
  }, []);

  // Función para limpiar errores
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Función para remover error específico
  const removeError = useCallback((index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Función para obtener mensaje de error amigable
  const getFriendlyErrorMessage = useCallback((error: string | Error, type?: ErrorState['type']) => {
    const errorMessage = error instanceof Error ? error.message : error;
    
    // Mapear errores comunes a mensajes amigables
    if (errorMessage.includes('fetch')) {
      return ERROR_MESSAGES.network;
    }
    
    if (errorMessage.includes('file') || errorMessage.includes('upload')) {
      return ERROR_MESSAGES.fileType;
    }
    
    if (type === 'network') {
      return ERROR_MESSAGES.network;
    }
    
    if (type === 'file') {
      return ERROR_MESSAGES.fileType;
    }
    
    if (type === 'validation') {
      return errorMessage; // Los errores de validación ya son amigables
    }
    
    return ERROR_MESSAGES.generic;
  }, []);

  // Función para manejar errores de API
  const handleApiError = useCallback((error: unknown) => {
    const err = error as { name?: string; message?: string; status?: number };
    if (err?.name === 'NetworkError' || err?.message?.includes('fetch')) {
      addError(ERROR_MESSAGES.network, 'network', err);
    } else if (err?.status === 404) {
      addError('Recurso no encontrado', 'general', err);
    } else if (err?.status === 400) {
      addError('Solicitud inválida', 'validation', err);
    } else if ((err?.status ?? 0) >= 500) {
      addError('Error del servidor', 'general', err);
    } else {
      addError(err?.message || ERROR_MESSAGES.generic, 'general', err);
    }
  }, [addError]);

  // Función para manejar errores de archivos
  const handleFileError = useCallback((error: string | Error, file?: File) => {
    const errorMessage = error instanceof Error ? error.message : error;
    const details = file ? { fileName: file.name, fileSize: file.size, fileType: file.type } : undefined;
    
    addError(errorMessage, 'file', details);
  }, [addError]);

  // Función para manejar errores de validación
  const handleValidationError = useCallback((field: string, value: unknown, message: string) => {
    addError(`${field}: ${message}`, 'validation', { field, value });
  }, [addError]);

  // Obtener el último error
  const lastError = errors.length > 0 ? errors[errors.length - 1] : null;

  // Verificar si hay errores de un tipo específico
  const hasErrorOfType = useCallback((type: ErrorState['type']) => {
    return errors.some(error => error.type === type);
  }, [errors]);

  return {
    errors,
    lastError,
    hasErrors: errors.length > 0,
    addError,
    clearErrors,
    removeError,
    getFriendlyErrorMessage,
    handleApiError,
    handleFileError,
    handleValidationError,
    hasErrorOfType,
  };
}

/**
 * Hook para retry automático con backoff exponencial
 */
export function useRetry() {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async (
    fn: () => Promise<unknown>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ) => {
    setIsRetrying(true);
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn();
        setRetryCount(0);
        setIsRetrying(false);
        return result;
      } catch (error) {
        setRetryCount(attempt + 1);
        
        if (attempt === maxRetries) {
          setIsRetrying(false);
          throw error;
        }
        
        // Backoff exponencial
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }, []);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    retryCount,
    isRetrying,
    retry,
    reset,
  };
}