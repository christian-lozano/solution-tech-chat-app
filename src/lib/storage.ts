'use client';

import { Chat } from '@/types';

// Versión actual del esquema de datos
const STORAGE_VERSION = '1.0.0';

// Claves de localStorage
const STORAGE_KEYS = {
  CHATS: 'empresa-chat-chats',
  PREFERENCES: 'empresa-chat-preferences',
  LAST_CHAT_ID: 'empresa-chat-last-chat-id',
  VERSION: 'empresa-chat-version',
} as const;

// Interfaz para preferencias de usuario
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  sidebarCollapsed: boolean;
  autoSave: boolean;
}

// Preferencias por defecto
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'es',
  sidebarCollapsed: false,
  autoSave: true,
};

// Clase para gestión de almacenamiento
class StorageManager {
  private isClient = typeof window !== 'undefined';

  // Verificar si localStorage está disponible
  private isStorageAvailable(): boolean {
    if (!this.isClient) return false;
    
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Obtener item del localStorage con manejo de errores
  private getItem<T>(key: string, defaultValue: T): T {
    if (!this.isStorageAvailable()) return defaultValue;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  // Guardar item en localStorage con manejo de errores
  private setItem<T>(key: string, value: T): boolean {
    if (!this.isStorageAvailable()) return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  }

  // Eliminar item del localStorage
  private removeItem(key: string): boolean {
    if (!this.isStorageAvailable()) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  }

  // Migrar datos si es necesario
  private migrateData(): void {
    const currentVersion = this.getItem<string>(STORAGE_KEYS.VERSION, '0.0.0');
    
    if (String(currentVersion) !== STORAGE_VERSION) {
      console.log(`Migrating data from version ${currentVersion} to ${STORAGE_VERSION}`);
      
      // Aquí se pueden agregar migraciones específicas en el futuro
      // Por ahora, solo actualizamos la versión
      this.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
    }
  }

  // Inicializar el almacenamiento
  initialize(): void {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage no está disponible');
      return;
    }

    this.migrateData();
  }

  // Gestión de chats
  getChats(): Chat[] {
    const chats = this.getItem(STORAGE_KEYS.CHATS, []);
    // Asegurar que siempre devolvemos un array válido
    if (!Array.isArray(chats)) {
      console.warn('getChats: datos corruptos en localStorage, limpiando...');
      this.setItem(STORAGE_KEYS.CHATS, []);
      return [];
    }
    return chats;
  }

  saveChats(chats: Chat[]): boolean {
    return this.setItem(STORAGE_KEYS.CHATS, chats);
  }

  getChat(chatId: string): Chat | null {
    const chats = this.getChats();
    return chats.find(chat => chat.id === chatId) || null;
  }

  saveChat(chat: Chat): boolean {
    const chats = this.getChats();
    const existingIndex = chats.findIndex(c => c.id === chat.id);
    
    if (existingIndex >= 0) {
      chats[existingIndex] = chat;
    } else {
      chats.push(chat);
    }
    
    return this.saveChats(chats);
  }

  deleteChat(chatId: string): boolean {
    const chats = this.getChats();
    const filteredChats = chats.filter(chat => chat.id !== chatId);
    
    // También eliminar de último chat si es el mismo
    const lastChatId = this.getLastChatId();
    if (lastChatId === chatId) {
      this.removeItem(STORAGE_KEYS.LAST_CHAT_ID);
    }
    
    return this.saveChats(filteredChats);
  }

  // Gestión del último chat
  getLastChatId(): string | null {
    return this.getItem(STORAGE_KEYS.LAST_CHAT_ID, null);
  }

  setLastChatId(chatId: string): boolean {
    return this.setItem(STORAGE_KEYS.LAST_CHAT_ID, chatId);
  }

  // Gestión de preferencias
  getPreferences(): UserPreferences {
    return this.getItem(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
  }

  savePreferences(preferences: Partial<UserPreferences>): boolean {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    return this.setItem(STORAGE_KEYS.PREFERENCES, updated);
  }

  // Limpieza de datos antiguos
  cleanupOldData(maxAge: number = 30 * 24 * 60 * 60 * 1000): number { // 30 días por defecto
    const chats = this.getChats();
    const now = new Date().getTime();
    let removedCount = 0;

    const filteredChats = chats.filter(chat => {
      const chatAge = now - new Date(chat.updatedAt).getTime();
      if (chatAge > maxAge) {
        removedCount++;
        return false;
      }
      return true;
    });

    if (removedCount > 0) {
      this.saveChats(filteredChats);
      console.log(`Cleaned up ${removedCount} old chats`);
    }

    return removedCount;
  }

  // Exportar datos
  exportData(): string {
    const data = {
      version: STORAGE_VERSION,
      chats: this.getChats(),
      preferences: this.getPreferences(),
      lastChatId: this.getLastChatId(),
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  // Importar datos
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.chats) {
        this.saveChats(data.chats);
      }
      
      if (data.preferences) {
        this.savePreferences(data.preferences);
      }
      
      if (data.lastChatId) {
        this.setLastChatId(data.lastChatId);
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Limpiar todos los datos
  clearAllData(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        this.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  // Obtener estadísticas de uso
  getStorageStats(): {
    totalChats: number;
    totalMessages: number;
    storageUsed: string;
    oldestChat: Date | null;
    newestChat: Date | null;
  } {
    const chats = this.getChats();
    const totalMessages = Array.isArray(chats) 
      ? chats.reduce((sum, chat) => sum + (chat.messages?.length || 0), 0)
      : 0;
    
    let storageUsed = '0 KB';
    if (this.isStorageAvailable()) {
      try {
        const totalSize = Object.values(STORAGE_KEYS)
          .map(key => localStorage.getItem(key) || '')
          .join('')
          .length;
        storageUsed = `${(totalSize / 1024).toFixed(2)} KB`;
      } catch {
        storageUsed = 'Unknown';
      }
    }

    const dates = Array.isArray(chats) 
      ? chats.map(chat => new Date(chat.createdAt)).filter(date => !isNaN(date.getTime()))
      : [];
    const oldestChat = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : null;
    const newestChat = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;

    return {
      totalChats: chats.length,
      totalMessages,
      storageUsed,
      oldestChat,
      newestChat,
    };
  }
}

// Instancia singleton del gestor de almacenamiento
export const storageManager = new StorageManager();

// Hook para usar el gestor de almacenamiento
export function useStorageManager() {
  return storageManager;
}

// Inicializar automáticamente en el cliente
if (typeof window !== 'undefined') {
  storageManager.initialize();
}