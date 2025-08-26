'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ErrorInfo {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
  details?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ErrorContextType {
  errors: ErrorInfo[];
  addError: (error: Omit<ErrorInfo, 'id' | 'timestamp'>) => string;
  removeError: (id: string) => void;
  clearErrors: () => void;
  hasErrors: boolean;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);

  const addError = useCallback((error: Omit<ErrorInfo, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newError: ErrorInfo = {
      ...error,
      id,
      timestamp: new Date(),
    };

    setErrors(prev => [...prev, newError]);

    // Auto-remover después de 10 segundos para errores info/warning
    if (error.type !== 'error') {
      setTimeout(() => {
        removeError(id);
      }, 10000);
    }

    return id;
  }, []);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const hasErrors = errors.length > 0;

  return (
    <ErrorContext.Provider value={{
      errors,
      addError,
      removeError,
      clearErrors,
      hasErrors,
    }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useErrorContext() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
}