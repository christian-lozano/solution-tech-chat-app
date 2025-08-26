'use client';

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { storageManager } from '@/lib/storage';
import { Chat } from '@/types';

// Hook para sincronización automática de datos
export function useDataSync() {
  const queryClient = useQueryClient();

  // Sincronizar chats con localStorage
  const syncChats = useCallback((chats: Chat[]) => {
    storageManager.saveChats(chats);
  }, []);

  // Cargar datos iniciales desde localStorage
  const loadInitialData = useCallback(() => {
    const chats = storageManager.getChats();
    const lastChatId = storageManager.getLastChatId();
    
    // Precargar datos en React Query cache
    queryClient.setQueryData(['chatHistory'], chats);
    
    // Precargar chats individuales
    chats.forEach(chat => {
      queryClient.setQueryData(['chat', chat.id], chat);
    });

    return { chats, lastChatId };
  }, [queryClient]);

  // Limpiar datos antiguos periódicamente
  const cleanupOldData = useCallback(() => {
    const removedCount = storageManager.cleanupOldData();
    if (removedCount > 0) {
      // Invalidar queries para refrescar la UI
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    }
  }, [queryClient]);

  // Auto-guardar cuando cambian los datos en React Query
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.query.queryKey[0] === 'chatHistory') {
        const chats = event.query.state.data as Chat[];
        if (chats) {
          syncChats(chats);
        }
      }
    });

    return unsubscribe;
  }, [queryClient, syncChats]);

  // Limpiar datos antiguos al inicializar
  useEffect(() => {
    const timer = setTimeout(cleanupOldData, 1000); // Después de 1 segundo
    return () => clearTimeout(timer);
  }, [cleanupOldData]);

  return {
    loadInitialData,
    syncChats,
    cleanupOldData,
    storageManager,
  };
}

// Hook para estadísticas de almacenamiento
export function useStorageStats() {
  const stats = storageManager.getStorageStats();
  
  return {
    ...stats,
    exportData: () => storageManager.exportData(),
    importData: (data: string) => storageManager.importData(data),
    clearAllData: () => storageManager.clearAllData(),
  };
}

// Hook para preferencias de usuario
export function useUserPreferences() {
  const preferences = storageManager.getPreferences();
  
  const updatePreferences = useCallback((updates: Partial<typeof preferences>) => {
    return storageManager.savePreferences(updates);
  }, []);

  return {
    preferences,
    updatePreferences,
  };
}