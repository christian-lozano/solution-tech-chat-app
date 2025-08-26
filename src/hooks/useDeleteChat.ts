'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storageManager } from '@/lib/storage';
import { Chat } from '@/types';

interface DeleteChatOptions {
  onSuccess?: (deletedChatId: string) => void;
  onError?: (error: Error) => void;
}

export function useDeleteChat(options: DeleteChatOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (chatId: string): Promise<string> => {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar que el chat existe
      const chat = storageManager.getChat(chatId);
      if (!chat) {
        throw new Error('La conversación no existe');
      }
      
      // Eliminar del almacenamiento
      const success = storageManager.deleteChat(chatId);
      if (!success) {
        throw new Error('Error al eliminar la conversación');
      }
      
      return chatId;
    },
    onSuccess: (deletedChatId) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
      queryClient.removeQueries({ queryKey: ['chat', deletedChatId] });
      
      // Callback de éxito
      options.onSuccess?.(deletedChatId);
    },
    onError: (error: Error) => {
      console.error('Error eliminando conversación:', error);
      options.onError?.(error);
    },
  });

  return {
    deleteChat: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}