'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AttachedFile } from '@/types';

interface FileAttachmentProps {
  file: AttachedFile;
  className?: string;
}

export function FileAttachment({ file, className }: FileAttachmentProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Obtener icono según tipo de archivo
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type === 'application/pdf') return '📄';
    return '📎';
  };

  // Renderizar imagen inline
  if (file.type.startsWith('image/') && !imageError) {
    return (
      <div className={cn("relative max-w-sm", className)}>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {isLoading && (
              <div className="flex items-center justify-center h-32 bg-muted">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
              </div>
            )}
            <img
              src={file.url}
              alt={file.name}
              className={cn(
                "w-full h-auto max-h-64 object-cover transition-opacity",
                isLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setImageError(true);
                setIsLoading(false);
              }}
            />
            {!isLoading && (
              <div className="p-3 bg-background/95 backdrop-blur-sm">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizar enlace de descarga para videos, PDFs y otros archivos
  return (
    <Card className={cn("max-w-sm", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Icono del archivo */}
          <div className="flex-shrink-0 text-2xl">
            {getFileIcon(file.type)}
          </div>
          
          {/* Información del archivo */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
            
            {/* Tipo de archivo */}
            <p className="text-xs text-muted-foreground capitalize">
              {file.type.split('/')[1] || 'Archivo'}
            </p>
          </div>
          
          {/* Botón de descarga */}
          <Button
            variant="outline"
            size="sm"
            
            className="flex-shrink-0"
          >
            <a
              href={file.url}
              download={file.name}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Descargar ${file.name}`}
            >
              ⬇️
            </a>
          </Button>
        </div>
        
        {/* Vista previa para videos */}
        {file.type.startsWith('video/') && file.thumbnailUrl && (
          <div className="mt-3">
            <img
              src={file.thumbnailUrl}
              alt={`Vista previa de ${file.name}`}
              className="w-full h-24 object-cover rounded border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente para mostrar múltiples archivos
interface FileAttachmentListProps {
  files: AttachedFile[];
  className?: string;
}

export function FileAttachmentList({ files, className }: FileAttachmentListProps) {
  if (files.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {files.map((file) => (
        <FileAttachment key={file.id} file={file} />
      ))}
    </div>
  );
}

// Componente para error de carga de archivos
interface FileErrorProps {
  fileName: string;
  error: string;
  onRetry?: () => void;
}

export function FileError({ fileName, error, onRetry }: FileErrorProps) {
  return (
    <Card className="max-w-sm border-destructive/50 bg-destructive/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 text-2xl">
            ❌
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-destructive">
              Error al cargar: {fileName}
            </p>
            <p className="text-xs text-muted-foreground">
              {error}
            </p>
          </div>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="flex-shrink-0"
            >
              🔄
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}