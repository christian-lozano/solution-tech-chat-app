'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/hooks/useAppState';

export function ThemeToggle() {
  const { preferences, toggleTheme } = useAppState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = preferences.theme === 'dark';

  const label = useMemo(() => (
    isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
  ), [isDark]);

  if (!mounted) {
    // Evita desajustes de hidratación hasta que el cliente monte
    return (
      <Button
        type="button"
        variant="secondary"
       
        aria-label="Cambiar tema"
        title="Cambiar tema"
        onClick={toggleTheme}
      >
        <span aria-hidden suppressHydrationWarning>☀️</span>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
     
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      onClick={toggleTheme}
    >
      <span aria-hidden suppressHydrationWarning>
        {isDark ? '🌙' : '☀️'}
      </span>
    </Button>
  );
}


