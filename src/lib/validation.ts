import { Chat, Message } from '@/types';

/**
 * Valida que un objeto sea un chat válido
 */
export function isValidChat(obj: unknown): obj is Chat {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof (obj as Record<string, unknown>).id === 'string' &&
    typeof (obj as Record<string, unknown>).title === 'string' &&
    Array.isArray((obj as Record<string, unknown>).messages) &&
    (obj as Record<string, unknown>).createdAt !== undefined &&
    (obj as Record<string, unknown>).updatedAt !== undefined
  );
}

/**
 * Valida que un objeto sea un mensaje válido
 */
export function isValidMessage(obj: unknown): obj is Message {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof (obj as Record<string, unknown>).id === 'string' &&
    typeof (obj as Record<string, unknown>).content === 'string' &&
    (((obj as Record<string, unknown>).sender === 'user') || ((obj as Record<string, unknown>).sender === 'system')) &&
    (obj as Record<string, unknown>).timestamp !== undefined
  );
}

/**
 * Valida y limpia un array de chats
 */
export function validateChatsArray(data: unknown): Chat[] {
  if (!Array.isArray(data)) {
    console.warn('validateChatsArray: data no es un array, devolviendo array vacío');
    return [];
  }

  return data.filter((item, index) => {
    const isValid = isValidChat(item);
    if (!isValid) {
      console.warn(`validateChatsArray: chat en índice ${index} no es válido:`, item);
    }
    return isValid;
  });
}

/**
 * Valida y limpia un array de mensajes
 */
export function validateMessagesArray(data: unknown): Message[] {
  if (!Array.isArray(data)) {
    console.warn('validateMessagesArray: data no es un array, devolviendo array vacío');
    return [];
  }

  return data.filter((item, index) => {
    const isValid = isValidMessage(item);
    if (!isValid) {
      console.warn(`validateMessagesArray: mensaje en índice ${index} no es válido:`, item);
    }
    return isValid;
  });
}

/**
 * Valida respuesta de API de historial de chats
 */
export function validateChatHistoryResponse(data: unknown): { chats: Chat[]; total: number } {
  if (!data || typeof data !== 'object') {
    console.warn('validateChatHistoryResponse: respuesta inválida');
    return { chats: [], total: 0 };
  }

  const raw = data as { chats?: unknown; total?: unknown };
  const chats = validateChatsArray(raw.chats ?? []);
  const total = typeof raw.total === 'number' ? raw.total : chats.length;

  return { chats, total };
}

/**
 * Función de utilidad para manejar errores de manera segura
 */
export function safeArrayOperation<T, R>(
  array: unknown,
  operation: (arr: T[]) => R,
  fallback: R
): R {
  try {
    if (!Array.isArray(array)) {
      console.warn('safeArrayOperation: no es un array, usando fallback');
      return fallback;
    }
    return operation(array);
  } catch (error) {
    console.error('safeArrayOperation: error en operación:', error);
    return fallback;
  }
}