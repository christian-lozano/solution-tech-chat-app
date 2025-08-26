'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para manejar localStorage con tipado y sincronización
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  }
) {
  const { serialize = JSON.stringify, deserialize = JSON.parse } = options || {};

  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.warn(`Error leyendo localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permitir que el valor sea una función para la misma API que useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serialize(valueToStore));
          
          // Disparar evento personalizado para sincronización entre pestañas
          window.dispatchEvent(
            new CustomEvent('localStorage-change', {
              detail: { key, value: valueToStore },
            })
          );
        }
      } catch (error) {
        console.warn(`Error escribiendo en localStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue]
  );

  // Función para remover el valor
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        
        window.dispatchEvent(
          new CustomEvent('localStorage-change', {
            detail: { key, value: null },
          })
        );
      }
    } catch (error) {
      console.warn(`Error removiendo localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Escuchar cambios en localStorage (sincronización entre pestañas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ('key' in e && e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserialize(e.newValue));
        } catch (error) {
          console.warn(`Error parseando localStorage key "${key}":`, error);
        }
      } else if ('detail' in e && e.detail.key === key) {
        setStoredValue(e.detail.value || initialValue);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('localStorage-change', handleStorageChange as EventListener);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('localStorage-change', handleStorageChange as EventListener);
      };
    }
  }, [key, deserialize, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}