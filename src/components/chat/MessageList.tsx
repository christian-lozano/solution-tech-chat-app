'use client';

import { useEffect, useRef } from 'react';
import { FileAttachmentList } from './FileAttachment';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Message } from '@/types';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
}

export function MessageList({ messages, isLoading = false, className }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Formatear timestamp
  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const messageDate = new Date(date);
    
    // Si es hoy, mostrar solo la hora
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Si es de ayer
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Ayer ${messageDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    }
    
    // Para fechas más antiguas
    return messageDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex-1 overflow-y-auto p-4 space-y-4",
        className
      )}
    >
      {/* Lista de mensajes */}
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.sender === 'user' ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-lg px-3 md:px-4 py-2 shadow-sm break-words",
              message.sender === 'user'
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            {/* Contenido del mensaje */}
            {message.content && (
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
            )}
            
            {/* Archivos adjuntos */}
            {message.attachments && message.attachments.length > 0 && (
              <div className={cn(
                "mt-2",
                message.content && "border-t pt-2 border-current/20"
              )}>
                <FileAttachmentList files={message.attachments} />
              </div>
            )}
            
            {/* Timestamp */}
            <div className={cn(
              "text-xs mt-1 opacity-70",
              message.sender === 'user' ? "text-right" : "text-left"
            )}>
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
        </div>
      ))}
      
      {/* Indicador de carga */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-muted rounded-lg px-4 py-2 shadow-sm">
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-muted-foreground">
                Escribiendo...
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Elemento para auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
}

// Componente para estado vacío
export function EmptyMessageList() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl">💬</div>
        <h3 className="text-lg font-semibold">¡Comienza una conversación!</h3>
        <p className="text-muted-foreground">
          Haz una pregunta sobre SOLUTION TECH para comenzar. Puedes preguntar sobre 
          nuestro organigrama, misión, visión, proyectos y más.
        </p>
      </div>
    </div>
  );
}

// Componente para error en la lista de mensajes
interface MessageListErrorProps {
  error: string;
  onRetry?: () => void;
}

export function MessageListError({ error, onRetry }: MessageListErrorProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl">⚠️</div>
        <h3 className="text-lg font-semibold">Error al cargar mensajes</h3>
        <p className="text-muted-foreground">{error}</p>
        {onRetry && (
          <Button onClick={onRetry}>
            Reintentar
          </Button>
        )}
      </div>
    </div>
  );
}