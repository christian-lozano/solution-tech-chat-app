'use client';

import { useErrorContext } from '@/contexts/ErrorContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function ErrorNotifications() {
  const { errors, removeError } = useErrorContext();

  if (errors.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {errors.map((error) => (
        <Card
          key={error.id}
          className={cn(
            "shadow-lg border-l-4 animate-in slide-in-from-right-full",
            error.type === 'error' && "border-l-destructive bg-destructive/5",
            error.type === 'warning' && "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
            error.type === 'info' && "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">
                    {error.type === 'error' && '❌'}
                    {error.type === 'warning' && '⚠️'}
                    {error.type === 'info' && 'ℹ️'}
                  </span>
                  <p className="font-medium text-sm truncate">
                    {error.message}
                  </p>
                </div>
                
                {error.details && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {error.details}
                  </p>
                )}
                
                <p className="text-xs text-muted-foreground mt-1">
                  {error.timestamp.toLocaleTimeString()}
                </p>
                
                {error.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 h-7 text-xs"
                    onClick={error.action.onClick}
                  >
                    {error.action.label}
                  </Button>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-background/80"
                onClick={() => removeError(error.id)}
              >
                ✕
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}