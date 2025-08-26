'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, THEMES, SUPPORTED_LANGUAGES } from '@/lib/constants';

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  sidebarCollapsed: boolean;
  notificationsEnabled: boolean;
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  language: 'es',
  sidebarCollapsed: false,
  notificationsEnabled: true,
};

/**
 * Hook para manejar el estado global de la aplicación
 */
export function useAppState() {
  const [preferences, setPreferences] = useLocalStorage(
    STORAGE_KEYS.preferences,
    defaultPreferences
  );

  // Función para actualizar tema
  const setTheme = (theme: 'light' | 'dark') => {
    setPreferences(prev => ({ ...prev, theme }));
    
    // Aplicar tema al documento
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  };

  // Función para alternar tema
  const toggleTheme = () => {
    const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Función para cambiar idioma
  const setLanguage = (language: string) => {
    if (language in SUPPORTED_LANGUAGES) {
      setPreferences(prev => ({ ...prev, language }));
    }
  };

  // Función para alternar sidebar
  const toggleSidebar = () => {
    setPreferences(prev => ({ 
      ...prev, 
      sidebarCollapsed: !prev.sidebarCollapsed 
    }));
  };

  // Función para alternar notificaciones
  const toggleNotifications = () => {
    setPreferences(prev => ({ 
      ...prev, 
      notificationsEnabled: !prev.notificationsEnabled 
    }));
  };

  // Función para resetear preferencias
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return {
    preferences,
    setTheme,
    toggleTheme,
    setLanguage,
    toggleSidebar,
    toggleNotifications,
    resetPreferences,
  };
}

/**
 * Hook para detectar preferencias del sistema
 */
export function useSystemPreferences() {
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  };

  const getSystemLanguage = (): string => {
    if (typeof navigator === 'undefined') return 'es';
    
    const browserLang = navigator.language.split('-')[0];
    return browserLang in SUPPORTED_LANGUAGES ? browserLang : 'es';
  };

  return {
    systemTheme: getSystemTheme(),
    systemLanguage: getSystemLanguage(),
  };
}