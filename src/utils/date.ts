/**
 * Formatea una fecha en formato relativo (ej: "hace 2 horas")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Ahora mismo';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
  }

  // Para fechas más antiguas, mostrar fecha completa
  return formatDate(date);
}

/**
 * Formatea una fecha en formato legible
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Formatea una fecha con hora
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Formatea solo la hora
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Verifica si una fecha es de hoy
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Verifica si una fecha es de ayer
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Agrupa fechas por día para mostrar en el chat
 */
export function groupMessagesByDate<T extends { timestamp: Date }>(messages: T[]) {
  const groups: Array<{
    date: string;
    messages: T[];
  }> = [];

  messages.forEach((message) => {
    let dateLabel: string;
    
    if (isToday(message.timestamp)) {
      dateLabel = 'Hoy';
    } else if (isYesterday(message.timestamp)) {
      dateLabel = 'Ayer';
    } else {
      dateLabel = formatDate(message.timestamp);
    }

    const existingGroup = groups.find((group) => group.date === dateLabel);
    if (existingGroup) {
      existingGroup.messages.push(message);
    } else {
      groups.push({
        date: dateLabel,
        messages: [message],
      });
    }
  });

  return groups;
}