// Utilidades para archivos
export function validateFileRequirements(file: File) {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'video/mp4', 'video/webm',
    'application/pdf', 'text/plain'
  ];

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'El archivo es demasiado grande (máximo 10MB)'
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipo de archivo no permitido'
    };
  }

  return { isValid: true };
}

export function getFileType(mimeType: string): 'image' | 'video' | 'document' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'document';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utilidades para chat
export function generateChatTitle(message: string): string {
  const maxLength = 50;
  const cleaned = message.trim().replace(/\n/g, ' ');
  
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  return cleaned.substring(0, maxLength - 3) + '...';
}

// Utilidades para fechas
export function formatMessageTime(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatChatDate(date: Date): string {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Hace unos minutos';
  } else if (diffInHours < 24) {
    return `Hace ${Math.floor(diffInHours)} horas`;
  } else if (diffInHours < 48) {
    return 'Ayer';
  } else {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short'
    }).format(date);
  }
}

// Re-export text utilities for search
export {
  searchInText,
  normalizeSearchText,
  extractSearchSnippet,
} from './text';