'use client';

import { useRef, useCallback, useEffect } from 'react';
import type React from 'react';

export function useFocusManagement() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && document.contains(previousFocusRef.current)) {
      previousFocusRef.current.focus();
    }
  }, []);

  const focusFirst = useCallback((container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, []);

  const focusLast = useCallback((container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, []);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement.focus();
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return { saveFocus, restoreFocus, focusFirst, focusLast, trapFocus };
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)).filter((element) => {
    const htmlElement = element as HTMLElement;
    return (
      htmlElement.offsetWidth > 0 &&
      htmlElement.offsetHeight > 0 &&
      !htmlElement.hidden &&
      window.getComputedStyle(htmlElement).visibility !== 'hidden'
    );
  }) as HTMLElement[];
}

export function useSkipLinks() {
  const skipLinksRef = useRef<HTMLDivElement>(null);

  const addSkipLink = useCallback((targetId: string, label: string) => {
    if (!skipLinksRef.current) return;
    const link = document.createElement('a');
    link.href = `#${targetId}`;
    link.textContent = label;
    link.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md';
    skipLinksRef.current.appendChild(link);
  }, []);

  const SkipLinks: React.FC = () => (
    <div ref={skipLinksRef} className="skip-links" />
  );

  return { addSkipLink, SkipLinks };
}

export function useScreenReaderAnnouncements() {
  const announcementRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcementRef.current) return;
    announcementRef.current.textContent = '';
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = message;
        announcementRef.current.setAttribute('aria-live', priority);
      }
    }, 100);
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = '';
      }
    }, 5000);
  }, []);

  const LiveRegion: React.FC = () => (
    <div ref={announcementRef} aria-live="polite" aria-atomic="true" className="sr-only" />
  );

  return { announce, LiveRegion };
}


