'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DesktopSidebarProps {
  children: ReactNode;
  className?: string;
}

export function DesktopSidebar({ children, className }: DesktopSidebarProps) {
  return (
    <aside 
      className={cn(
        "hidden md:block w-80 border-r border-border bg-card",
        className
      )}
      role="navigation"
      aria-label="Navegación de escritorio"
    >
      {children}
    </aside>
  );
}
