export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: Date;
  attachments?: AttachedFile[];
}

export interface AttachedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  currentChat: Chat | null;
  chatHistory: Chat[];
  isLoading: boolean;
  error: string | null;
}

export interface LocalStorageData {
  chats: Chat[];
  userPreferences: {
    theme: 'light' | 'dark';
    language: string;
  };
  lastChatId?: string;
}

export type FileType = 'image' | 'video' | 'document';

export interface FileValidation {
  maxSize: number;
  allowedTypes: string[];
}

export interface SearchResult {
  chatId: string;
  messageId: string;
  content: string;
  timestamp: Date;
  matches: string[];
}