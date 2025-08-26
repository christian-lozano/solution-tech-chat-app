'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function MobileSidebar({ isOpen, onClose, children }: MobileSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile sidebar panel */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 max-w-[90vw] bg-background border-r border-border shadow-2xl transition-transform duration-300 ease-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="navigation"
        aria-label="Navegación móvil"
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold text-foreground text-gray-200">Menú</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-muted"
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </aside>
    </>
  );
}
