import { ReactNode } from 'react';
import { Chat, Message, AttachedFile, FileType } from './chat';

// Props para componentes principales
export interface ChatInterfaceProps {
  chatId?: string;
  isNewChat: boolean;
}

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export interface MessageInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export interface ChatHistoryProps {
  chats: Chat[];
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  currentChatId?: string;
}

export interface FileAttachmentProps {
  file: AttachedFile;
  type: FileType;
  onRemove?: (fileId: string) => void;
  showRemove?: boolean;
}

// Props para componentes de UI
export interface ErrorBoundaryProps {
  fallback: React.ComponentType<{ error: Error; resetError: () => void }>;
  children: ReactNode;
}

export interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  type: 'network' | 'validation' | 'file' | 'general';
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Props para modales y diálogos
export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}