'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  type: 'spinner' | 'skeleton' | 'pulse' | 'dots';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingState({ type, message, size = 'md', className }: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  switch (type) {
    case 'spinner':
      return (
        <div className={cn("flex items-center gap-2", className)}>
          <LoadingSpinner size={size} />
          {message && <span className="text-sm text-muted-foreground">{message}</span>}
        </div>
      );

    case 'skeleton':
      return (
        <div className={cn("space-y-3", className)}>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
          {message && (
            <p className="text-sm text-muted-foreground text-center">{message}</p>
          )}
        </div>
      );

    case 'pulse':
      return (
        <div className={cn("flex items-center justify-center", className)}>
          <div className={cn(
            "rounded-full bg-primary animate-pulse",
            sizeClasses[size]
          )} />
          {message && (
            <span className="ml-2 text-sm text-muted-foreground">{message}</span>
          )}
        </div>
      );

    case 'dots':
      return (
        <div className={cn("flex items-center gap-1", className)}>
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full bg-primary animate-bounce",
                  size === 'sm' && "h-2 w-2",
                  size === 'md' && "h-3 w-3",
                  size === 'lg' && "h-4 w-4"
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          {message && (
            <span className="ml-2 text-sm text-muted-foreground">{message}</span>
          )}
        </div>
      );

    default:
      return null;
  }
}

// Componente de loading para listas
export function ListLoadingSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-1/6"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Componente de loading para mensajes
export function MessageLoadingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* Mensaje del usuario */}
      <div className="flex justify-end">
        <div className="max-w-[70%] animate-pulse">
          <div className="bg-muted rounded-lg p-3 space-y-2">
            <div className="h-3 bg-muted-foreground/20 rounded w-32"></div>
            <div className="h-3 bg-muted-foreground/20 rounded w-24"></div>
          </div>
        </div>
      </div>
      
      {/* Mensaje del sistema (cargando) */}
      <div className="flex justify-start">
        <div className="max-w-[70%]">
          <div className="bg-muted rounded-lg p-3">
            <LoadingState type="dots" message="Escribiendo..." size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de loading con timeout
interface LoadingWithTimeoutProps {
  timeout?: number;
  onTimeout?: () => void;
  children: React.ReactNode;
}

export function LoadingWithTimeout({ 
  timeout = 30000, 
  onTimeout, 
  children 
}: LoadingWithTimeoutProps) {
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeout(true);
      onTimeout?.();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onTimeout]);

  if (isTimeout) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">⏰</div>
        <h3 className="font-semibold">Tiempo de espera agotado</h3>
        <p className="text-muted-foreground text-sm">
          La operación está tomando más tiempo del esperado.
        </p>
        <Button onClick={() => window.location.reload()}>
          Recargar página
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}