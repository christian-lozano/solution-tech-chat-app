'use client';

import { useEffect, useCallback, useRef } from 'react';

interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: (shiftKey: boolean) => void;
  onHome?: () => void;
  onEnd?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    onHome,
    onEnd,
    enabled = true,
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    switch (event.key) {
      case 'Escape':
        onEscape?.();
        break;
      case 'Enter':
        if (!event.shiftKey) {
          onEnter?.();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        onArrowUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        onArrowDown?.();
        break;
      case 'ArrowLeft':
        onArrowLeft?.();
        break;
      case 'ArrowRight':
        onArrowRight?.();
        break;
      case 'Tab':
        onTab?.(event.shiftKey);
        break;
      case 'Home':
        onHome?.();
        break;
      case 'End':
        onEnd?.();
        break;
    }
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab, onHome, onEnd]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  return { handleKeyDown };
}

// Hook para navegación en listas
export function useListNavigation<T>(
  items: T[],
  onSelect: (item: T, index: number) => void,
  options: {
    loop?: boolean;
    initialIndex?: number;
    enabled?: boolean;
  } = {}
) {
  const { loop = true, initialIndex = -1, enabled = true } = options;
  const currentIndexRef = useRef(initialIndex);

  const moveUp = useCallback(() => {
    if (items.length === 0) return;
    
    const newIndex = currentIndexRef.current <= 0 
      ? (loop ? items.length - 1 : 0)
      : currentIndexRef.current - 1;
    
    currentIndexRef.current = newIndex;
    onSelect(items[newIndex], newIndex);
  }, [items, onSelect, loop]);

  const moveDown = useCallback(() => {
    if (items.length === 0) return;
    
    const newIndex = currentIndexRef.current >= items.length - 1
      ? (loop ? 0 : items.length - 1)
      : currentIndexRef.current + 1;
    
    currentIndexRef.current = newIndex;
    onSelect(items[newIndex], newIndex);
  }, [items, onSelect, loop]);

  const selectCurrent = useCallback(() => {
    if (currentIndexRef.current >= 0 && currentIndexRef.current < items.length) {
      onSelect(items[currentIndexRef.current], currentIndexRef.current);
    }
  }, [items, onSelect]);

  const setCurrentIndex = useCallback((index: number) => {
    currentIndexRef.current = Math.max(-1, Math.min(index, items.length - 1));
  }, [items.length]);

  useKeyboardNavigation({
    onArrowUp: moveUp,
    onArrowDown: moveDown,
    onEnter: selectCurrent,
    enabled,
  });

  return {
    currentIndex: currentIndexRef.current,
    setCurrentIndex,
    moveUp,
    moveDown,
    selectCurrent,
  };
}