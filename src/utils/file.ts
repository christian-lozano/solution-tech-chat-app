import { FILE_CONFIG, FILE_LIMITS } from '@/lib/constants';
import { FileType } from '@/types';

/**
 * Determina el tipo de archivo basado en su MIME type
 */
export function getFileType(mimeType: string): FileType {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType.startsWith('video/')) {
    return 'video';
  }
  if (mimeType === 'application/pdf' || mimeType === 'text/plain' || mimeType.startsWith('application/')) {
    return 'document';
  }
  throw new Error(`Tipo de archivo no soportado: ${mimeType}`);
}

/**
 * Verifica si un archivo es una imagen
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Verifica si un archivo es un video
 */
export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

/**
 * Verifica si un archivo es un documento
 */
export function isDocumentFile(mimeType: string): boolean {
  return mimeType === 'application/pdf' || mimeType === 'text/plain' || mimeType.startsWith('application/');
}

/**
 * Verifica si un archivo puede ser previsualizad
 */
export function canPreviewFile(mimeType: string): boolean {
  return mimeType.startsWith('image/') || mimeType.startsWith('video/') || mimeType === 'application/pdf';
}

/**
 * Formatea el tamaño de archivo en formato legible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Genera una URL temporal para previsualizar un archivo
 */
export function createFilePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Libera la URL temporal de previsualización
 */
export function revokeFilePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Valida si un archivo cumple con los requisitos
 */
export function validateFileRequirements(file: File): {
  isValid: boolean;
  error?: string;
} {
  // Verificar tamaño
  if (file.size > FILE_CONFIG.maxSize) {
    const maxSize = FILE_LIMITS.maxSize;
    return {
      isValid: false,
      error: `El archivo es demasiado grande. Máximo ${formatFileSize(maxSize)}.`,
    };
  }

  // Verificar tipo
  const isAllowed = file.type.startsWith('image/') || file.type.startsWith('video/') || file.type === 'application/pdf' || file.type === 'text/plain';

  if (!isAllowed) {
    return {
      isValid: false,
      error: 'Tipo de archivo no soportado. Solo se permiten imágenes (JPG, PNG), videos (MP4) y documentos (PDF).',
    };
  }

  return { isValid: true };
}

/**
 * Extrae la extensión de un nombre de archivo
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Genera un nombre único para un archivo
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const extension = getFileExtension(originalName);
  const nameWithoutExtension = originalName.replace(`.${extension}`, '');
  
  return `${nameWithoutExtension}_${timestamp}.${extension}`;
}