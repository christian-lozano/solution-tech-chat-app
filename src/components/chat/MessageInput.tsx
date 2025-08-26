'use client';

import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFileUpload, useErrorHandler } from '@/hooks';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Escribe tu mensaje..." 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleValidationError } = useErrorHandler();

  // Hook para manejo de archivos
  const {
    files,
    errors: fileErrors,
    isUploading,
    addFiles,
    removeFile,
    clearFiles,
    clearErrors,
  } = useFileUpload({
    maxFiles: 5,
    onUploadError: (error) => {
      console.error('Error subiendo archivo:', error);
    },
  });

  // Función para enviar mensaje
  const handleSend = useCallback(async () => {
    const trimmedMessage = message.trim();
    
    // Validar mensaje
    if (!trimmedMessage && files.length === 0) {
      handleValidationError('mensaje', message, 'El mensaje no puede estar vacío');
      return;
    }

    if (trimmedMessage.length > 1000) {
      handleValidationError(
        'mensaje', 
        message, 
        'El mensaje no puede exceder 1000 caracteres'
      );
      return;
    }

    try {
      // Enviar mensaje con archivos
      await onSendMessage(trimmedMessage, files);
      
      // Limpiar formulario
      setMessage('');
      clearFiles();
      clearErrors();
      
      // Enfocar textarea
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  }, [message, files, onSendMessage, handleValidationError, clearFiles, clearErrors]);

  // Manejar Enter para enviar
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !isUploading) {
        handleSend();
      }
    }
  }, [handleSend, disabled, isUploading]);

  // Manejar selección de archivos
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      addFiles(selectedFiles);
    }
    // Limpiar input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = '';
  }, [addFiles]);

  // Manejar drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, [addFiles]);

  // Obtener icono para tipo de archivo
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    return '📄';
  };

  return (
    <div className="border-t bg-card p-4">
      {/* Área de archivos adjuntos */}
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm"
            >
              <span>{getFileIcon(file.type)}</span>
              <span className="truncate max-w-32">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file)}
                aria-label={`Eliminar ${file.name}`}
                className="h-6 px-2 text-muted-foreground hover:text-foreground"
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Errores de archivos */}
      {fileErrors.length > 0 && (
        <div className="mb-3 space-y-1">
          {fileErrors.map((error, index) => (
            <p key={index} className="text-sm text-destructive">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Área de entrada principal */}
      <div
        className={cn(
          "relative rounded-lg border bg-background transition-colors",
          isDragOver && "border-primary bg-primary/5",
          "focus-within:border-primary"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isUploading}
          className="min-h-[80px] resize-none border-0 focus-visible:ring-0"
          aria-label="Escribir mensaje"
          aria-describedby="file-help message-instructions"
          role="textbox"
          aria-multiline="true"
          aria-required="false"
        />
        
        {/* Controles inferiores */}
        <div className="flex items-center justify-between p-3 pt-0">
          <div className="flex items-center gap-2">
            {/* Botón de adjuntar archivos */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.mp4,.pdf"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Seleccionar archivos"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              aria-label="Adjuntar archivo"
            >
              📎
            </Button>
            
            {/* Información de ayuda */}
            <span id="file-help" className="text-xs text-muted-foreground">
              JPG, PNG, MP4, PDF (máx. 10MB)
            </span>
            <span id="message-instructions" className="sr-only">
              Presiona Enter para enviar, Shift+Enter para nueva línea
            </span>
          </div>

          {/* Botón de enviar */}
          <Button
            onClick={handleSend}
            disabled={disabled || isUploading || (!message.trim() && files.length === 0)}
            size="sm"
            aria-label="Enviar mensaje"
          >
            {isUploading ? '⏳' : '➤'}
          </Button>
        </div>

        {/* Overlay de drag & drop */}
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary/15 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-sm font-medium">Suelta los archivos aquí</p>
              <p className="text-xs text-muted-foreground">JPG, PNG, MP4, PDF</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}