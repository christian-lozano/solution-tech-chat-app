'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  sendMessage, 
  createChat, 
  getChat, 
  getChatHistory, 
  deleteChat,
  searchChats 
} from '@/lib/api';
import { 
  SendMessageRequest, 
  CreateChatRequest, 
  DeleteChatRequest,
  SearchChatsRequest,
  Chat 
} from '@/types';
import { QUERY_KEYS, QUERY_CONFIG } from '@/lib/constants';
import { useLocalStorage } from './useLocalStorage';
import { storageManager } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

/**
 * Hook para obtener el historial de chats
 */
export function useChatHistory() {
  return useQuery({
    queryKey: QUERY_KEYS.chatHistory,
    queryFn: getChatHistory,
    staleTime: QUERY_CONFIG.staleTime,
    retry: 1, // Menos reintentos para ser más rápido
    retryDelay: 1000, // Delay más corto
  });
}

/**
 * Hook para obtener un chat específico
 */
export function useChat(chatId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.chat(chatId),
    queryFn: () => getChat(chatId),
    enabled: !!chatId,
    staleTime: QUERY_CONFIG.staleTime,
    retry: QUERY_CONFIG.retry,
    retryDelay: QUERY_CONFIG.retryDelay,
  });
}

/**
 * Hook para buscar en chats
 */
export function useSearchChats(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.searchChats(query),
    queryFn: () => searchChats({ query, limit: 10 }),
    enabled: enabled && query.trim().length > 0,
    staleTime: QUERY_CONFIG.staleTime,
    retry: QUERY_CONFIG.retry,
    retryDelay: QUERY_CONFIG.retryDelay,
  });
}

/**
 * Hook para enviar mensajes
 */
export function useSendMessage() {
  const queryClient = useQueryClient();
  const [, setLastChatId] = useLocalStorage(STORAGE_KEYS.lastChatId, '');

  return useMutation({
    mutationFn: (request: SendMessageRequest) => sendMessage(request),
    onSuccess: (data, variables) => {
      // Actualizar el cache del chat específico
      queryClient.setQueryData(
        QUERY_KEYS.chat(variables.chatId),
        (oldData: { chat?: Chat } | undefined) => {
          if (oldData?.chat) {
            return {
              ...oldData,
              chat: data.chat,
            };
          }
          return { chat: data.chat };
        }
      );

      // Invalidar el historial de chats para refrescar la lista
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatHistory });
      
      // Guardar el último chat ID
      setLastChatId(variables.chatId);
    },
    onError: (error) => {
      console.error('Error enviando mensaje:', error);
    },
  });
}

/**
 * Hook para crear nuevo chat
 */
export function useCreateChat() {
  const queryClient = useQueryClient();
  const [, setLastChatId] = useLocalStorage(STORAGE_KEYS.lastChatId, '');

  return useMutation({
    mutationFn: (request: CreateChatRequest) => createChat(request),
    onSuccess: (data) => {
      // Añadir el nuevo chat al cache del historial
      queryClient.setQueryData(
        QUERY_KEYS.chatHistory,
        (oldData: { chats?: Chat[]; total?: number } | undefined) => {
          if (oldData?.chats) {
            return {
              ...oldData,
              chats: [data.chat, ...oldData.chats],
              total: ((oldData.total ?? oldData.chats.length) + 1),
            };
          }
          return { chats: [data.chat], total: 1 };
        }
      );

      // Crear entrada en cache para el nuevo chat
      queryClient.setQueryData(
        QUERY_KEYS.chat(data.chat.id),
        { chat: data.chat }
      );

      // Guardar como último chat
      setLastChatId(data.chat.id);
    },
    onError: (error) => {
      console.error('Error creando chat:', error);
    },
  });
}

/**
 * Hook para eliminar chat
 */
export function useDeleteChat() {
  const queryClient = useQueryClient();
  const [lastChatId, setLastChatId] = useLocalStorage(STORAGE_KEYS.lastChatId, '');

  return useMutation({
    mutationFn: (request: DeleteChatRequest) => deleteChat(request),
    onSuccess: (_, variables) => {
      // Remover del cache del historial
      queryClient.setQueryData(
        QUERY_KEYS.chatHistory,
        (oldData: { chats?: Chat[]; total?: number } | undefined) => {
          if (oldData?.chats) {
            const filteredChats = oldData.chats.filter(
              (chat: Chat) => chat.id !== variables.chatId
            );
            return {
              ...oldData,
              chats: filteredChats,
              total: filteredChats.length,
            };
          }
          return oldData;
        }
      );

      // Remover del cache individual
      queryClient.removeQueries({ queryKey: QUERY_KEYS.chat(variables.chatId) });

      // Si era el último chat activo, limpiar
      if (lastChatId === variables.chatId) {
        setLastChatId('');
      }

      // Invalidar búsquedas que puedan contener este chat
      queryClient.invalidateQueries({ 
        queryKey: ['searchChats'],
        exact: false 
      });
    },
    onError: (error) => {
      console.error('Error eliminando chat:', error);
    },
  });
}

/**
 * Hook para obtener el último chat ID guardado
 */
export function useLastChatId() {
  const [lastChatId] = useLocalStorage(STORAGE_KEYS.lastChatId, '');
  return lastChatId;
}

/**
 * Hook para manejar el estado del chat actual
 */
export function useCurrentChat() {
  const [currentChatId, setCurrentChatId] = useLocalStorage(STORAGE_KEYS.lastChatId, '');
  const { data: chatData, isLoading, error } = useChat(currentChatId);

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const clearCurrentChat = () => {
    setCurrentChatId('');
  };

  return {
    currentChat: chatData?.chat || null,
    currentChatId,
    isLoading,
    error,
    selectChat,
    clearCurrentChat,
  };
}