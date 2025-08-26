import { Chat, AttachedFile } from './chat';

// Tipos para requests de API
export interface SendMessageRequest {
  chatId: string;
  content: string;
  files?: AttachedFile[];
}

export interface SendMessageResponse {
  chat: Chat;
}

export interface CreateChatRequest {
  title?: string;
  firstMessage?: string;
}

export interface CreateChatResponse {
  chat: Chat;
  chatId: string;
}

export interface UploadFileRequest {
  file: File;
  chatId: string;
}

export interface UploadFileResponse {
  file: AttachedFile;
}

export interface GetChatHistoryResponse {
  chats: Chat[];
  total: number;
}

export interface GetChatResponse {
  chat: Chat;
}

export interface DeleteChatRequest {
  chatId: string;
}

export interface SearchChatsRequest {
  query: string;
  limit?: number;
}

export interface SearchChatsResponse {
  results: Array<{
    chat: Chat;
    matches: Array<{
      messageId: string;
      content: string;
      snippet: string;
    }>;
  }>;
}

// Tipos para errores de API
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ValidationError extends ApiError {
  field: string;
  value: unknown;
}

// Tipos para configuración de MSW
export interface MockResponse<T = unknown> {
  data: T;
  status: number;
  delay?: number;
}

export interface MockConfig {
  enabled: boolean;
  delay: {
    min: number;
    max: number;
  };
  errorRate: number;
}