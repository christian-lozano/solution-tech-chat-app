import { 
  SendMessageRequest, 
  SendMessageResponse,
  CreateChatRequest,
  CreateChatResponse,
  GetChatHistoryResponse,
  GetChatResponse,
  SearchChatsRequest,
  SearchChatsResponse,
  UploadFileRequest,
  UploadFileResponse,
  DeleteChatRequest
} from '@/types';
import { API_ENDPOINTS } from './constants';

// Configuración base para fetch
const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Función helper para manejar respuestas de API
async function handleApiResponse<T>(response: Response): Promise<T> {
  try {
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Si no se puede parsear el JSON del error, usar el mensaje por defecto
      }
      
      throw new Error(errorMessage);
    }

    // Verificar si la respuesta tiene contenido
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta no es JSON válido');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al procesar la respuesta');
  }
}

// API para enviar mensajes
export async function sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
  const response = await fetch(API_ENDPOINTS.chat.send, {
    method: 'POST',
    ...fetchConfig,
    body: JSON.stringify(request),
  });
  
  return handleApiResponse<SendMessageResponse>(response);
}

// API para crear nuevo chat
export async function createChat(request: CreateChatRequest): Promise<CreateChatResponse> {
  const response = await fetch(API_ENDPOINTS.chat.create, {
    method: 'POST',
    ...fetchConfig,
    body: JSON.stringify(request),
  });
  
  return handleApiResponse<CreateChatResponse>(response);
}

// API para obtener chat específico
export async function getChat(chatId: string): Promise<GetChatResponse> {
  const response = await fetch(API_ENDPOINTS.chat.get(chatId), {
    method: 'GET',
  });
  
  return handleApiResponse<GetChatResponse>(response);
}

// API para obtener historial de chats
export async function getChatHistory(): Promise<GetChatHistoryResponse> {
  const response = await fetch(API_ENDPOINTS.chat.history, {
    method: 'GET',
  });
  
  return handleApiResponse<GetChatHistoryResponse>(response);
}

// API para buscar en chats
export async function searchChats(request: SearchChatsRequest): Promise<SearchChatsResponse> {
  const params = new URLSearchParams({
    query: request.query,
    limit: request.limit?.toString() || '10',
  });
  
  const response = await fetch(`${API_ENDPOINTS.chat.search}?${params}`, {
    method: 'GET',
  });
  
  return handleApiResponse<SearchChatsResponse>(response);
}

// API para eliminar chat
export async function deleteChat(request: DeleteChatRequest): Promise<{ success: boolean }> {
  const response = await fetch(API_ENDPOINTS.chat.delete(request.chatId), {
    method: 'DELETE',
  });
  
  return handleApiResponse<{ success: boolean }>(response);
}

// API para subir archivos
export async function uploadFile(file: File, chatId: string): Promise<UploadFileResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('chatId', chatId);
  
  const response = await fetch(API_ENDPOINTS.files.upload, {
    method: 'POST',
    body: formData, // No incluir Content-Type para FormData
  });
  
  return handleApiResponse<UploadFileResponse>(response);
}

// API para descargar archivos
export async function downloadFile(fileId: string): Promise<{ downloadUrl: string; expiresAt: Date }> {
  const response = await fetch(API_ENDPOINTS.files.download(fileId), {
    method: 'GET',
  });
  
  return handleApiResponse<{ downloadUrl: string; expiresAt: Date }>(response);
}

// Función para verificar si MSW está activo
export function isMSWEnabled(): boolean {
  return process.env.NEXT_PUBLIC_MSW_ENABLED === 'true';
}

// Función para obtener la configuración de la API
export function getApiConfig() {
  return {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    mswEnabled: isMSWEnabled(),
    timeout: 10000, // 10 segundos
  };
}