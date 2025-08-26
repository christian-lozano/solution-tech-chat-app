import { z } from 'zod';

// Esquemas para archivos
export const fileValidationSchema = z.object({
  type: z.enum(['image/jpeg', 'image/png', 'video/mp4', 'application/pdf']),
  size: z.number().max(10 * 1024 * 1024), // 10MB max
  name: z.string().min(1).max(255),
});

// Esquemas para mensajes
export const messageSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1).max(4000),
  sender: z.enum(['user', 'system']),
  timestamp: z.date(),
  attachments: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.string(),
    size: z.number(),
    url: z.string().url(),
    thumbnailUrl: z.string().url().optional(),
  })).optional(),
});

// Esquemas para chats
export const chatSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  messages: z.array(messageSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Esquemas para requests de API
export const sendMessageRequestSchema = z.object({
  chatId: z.string().uuid(),
  content: z.string().min(1).max(4000),
  attachments: z.array(z.instanceof(File)).optional(),
});

export const createChatRequestSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  initialMessage: z.string().min(1).max(4000).optional(),
});

export const searchChatsRequestSchema = z.object({
  query: z.string().min(1).max(100),
  limit: z.number().min(1).max(50).default(10),
});

// Esquemas para localStorage
export const localStorageDataSchema = z.object({
  chats: z.array(chatSchema),
  userPreferences: z.object({
    theme: z.enum(['light', 'dark']),
    language: z.string(),
  }),
  lastChatId: z.string().uuid().optional(),
});

// Funciones de validación
export const validateFile = (file: File) => {
  return fileValidationSchema.parse({
    type: file.type,
    size: file.size,
    name: file.name,
  });
};

export const validateMessage = (message: unknown) => {
  return messageSchema.parse(message);
};

export const validateChat = (chat: unknown) => {
  return chatSchema.parse(chat);
};

export const validateSendMessageRequest = (request: unknown) => {
  return sendMessageRequestSchema.parse(request);
};

export const validateCreateChatRequest = (request: unknown) => {
  return createChatRequestSchema.parse(request);
};

export const validateSearchChatsRequest = (request: unknown) => {
  return searchChatsRequestSchema.parse(request);
};

export const validateLocalStorageData = (data: unknown) => {
  return localStorageDataSchema.parse(data);
};

// Constantes de validación
export const FILE_VALIDATION_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.mp4', '.pdf'],
} as const;

export const MESSAGE_VALIDATION_CONFIG = {
  minLength: 1,
  maxLength: 4000,
} as const;

export const CHAT_VALIDATION_CONFIG = {
  titleMinLength: 1,
  titleMaxLength: 200,
  maxMessagesPerChat: 1000,
} as const;