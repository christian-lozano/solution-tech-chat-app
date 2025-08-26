'use client';

import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { MobileSidebar } from './MobileSidebar';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileChatHistory } from '@/components/chat/MobileChatHistory';

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
  className?: string;
}

export function Layout({ children, sidebar, header, className }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on md+ screens automatically
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={cn(
      "flex h-screen bg-background text-foreground",
      className
    )}>
      {/* Sidebars */}
      {sidebar && (
        <>
          {/* Mobile Sidebar */}
          <MobileSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
            <MobileChatHistory
              onSelectChat={(chatId) => {
                // Aquí necesitarías pasar las props del ChatHistory original
                // Por ahora usamos el sidebar original
                if (typeof sidebar === 'object' && sidebar && 'props' in sidebar) {
                  const originalProps = (sidebar as any).props;
                  if (originalProps.onSelectChat) {
                    originalProps.onSelectChat(chatId);
                  }
                }
                closeSidebar();
              }}
              onNewChat={() => {
                if (typeof sidebar === 'object' && sidebar && 'props' in sidebar) {
                  const originalProps = (sidebar as any).props;
                  if (originalProps.onNewChat) {
                    originalProps.onNewChat();
                  }
                }
                closeSidebar();
              }}
              onChatDeleted={(chatId) => {
                if (typeof sidebar === 'object' && sidebar && 'props' in sidebar) {
                  const originalProps = (sidebar as any).props;
                  if (originalProps.onChatDeleted) {
                    originalProps.onChatDeleted(chatId);
                  }
                }
              }}
              currentChatId={
                typeof sidebar === 'object' && sidebar && 'props' in sidebar
                  ? (sidebar as any).props.currentChatId
                  : undefined
              }
              onClose={closeSidebar}
            />
          </MobileSidebar>

          {/* Desktop Sidebar */}
          <DesktopSidebar>
            {sidebar}
          </DesktopSidebar>
        </>
      )}
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        {header && (
          <header 
            className="border-b bg-card px-4 py-3 md:px-6 md:py-4"
            role="banner"
            aria-label="Encabezado de la aplicación"
          >
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              {sidebar && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="md:hidden border bg-card text-foreground hover:bg-muted"
                  aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
                  aria-pressed={isSidebarOpen}
                  onClick={() => (isSidebarOpen ? closeSidebar() : openSidebar())}
                >
                  {/* Hamburger / Close icons */}
                  <span className={cn("relative block h-4 w-4")}
                    aria-hidden="true"
                  >
                    <span className={cn(
           "absolute inset-x-0 top-0 h-0.5  transition-transform bg-gray-700",
                      isSidebarOpen && "translate-y-1.5 rotate-45 bg-gray-700"
                    )} />
                    <span className={cn(
                   "absolute inset-x-0 top-1.5 h-0.5  transition-opacity bg-gray-700",
                      isSidebarOpen && "opacity-0"
                    )} />
                    <span className={cn(
                    "absolute inset-x-0 top-3 h-0.5  transition-transform bg-gray-700",
                      isSidebarOpen && "-translate-y-1.5 -rotate-45"
                    )} />
                  </span>
                </Button>
              )}
              <div className="flex-1 min-w-0">
                {header}
              </div>
              <ThemeToggle />
            </div>
          </header>
        )}
        
        {/* Content */}
        <main 
          id="main-content"
          className="flex-1 overflow-hidden bg-background"
          role="main"
          aria-label="Contenido principal"
        >
          {children}
        </main>
      </div>
    </div>
  );
}