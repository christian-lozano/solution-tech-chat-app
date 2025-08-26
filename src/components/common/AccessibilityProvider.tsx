'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useScreenReaderAnnouncements, useSkipLinks } from '@/hooks/useFocusManagement';

interface AccessibilityContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  addSkipLink: (targetId: string, label: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const { announce, LiveRegion } = useScreenReaderAnnouncements();
  const { addSkipLink, SkipLinks } = useSkipLinks();

  return (
    <AccessibilityContext.Provider value={{ announce, addSkipLink }}>
      <SkipLinks />
      <LiveRegion />
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Componente para landmarks principales
export function MainLandmarks({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Saltar al contenido principal
      </a>
      <a href="#sidebar" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Ir a la navegación
      </a>
      {children}
    </>
  );
}