// Exportar todos los tipos de chat
export type {
  Message,
  AttachedFile,
  Chat,
  ChatState,
  LocalStorageData,
  FileType,
  FileValidation,
  SearchResult,
} from './chat';

// Exportar todos los tipos de componentes
export type {
  ChatInterfaceProps,
  MessageListProps,
  MessageInputProps,
  ChatHistoryProps,
  FileAttachmentProps,
  ErrorBoundaryProps,
  ErrorMessageProps,
  LoadingSpinnerProps,
  EmptyStateProps,
  ConfirmDialogProps,
  SearchInputProps,
} from './components';

// Exportar todos los tipos de API
export type {
  SendMessageRequest,
  SendMessageResponse,
  CreateChatRequest,
  CreateChatResponse,
  UploadFileRequest,
  UploadFileResponse,
  GetChatHistoryResponse,
  GetChatResponse,
  DeleteChatRequest,
  SearchChatsRequest,
  SearchChatsResponse,
  ApiError,
  ValidationError,
  MockResponse,
  MockConfig,
} from './api';