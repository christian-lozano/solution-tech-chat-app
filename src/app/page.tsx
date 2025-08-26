'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { ChatHistory } from '@/components/chat/ChatHistory';
import { NewChat } from '@/components/chat/NewChat';
import { storageManager } from '@/lib/storage';

export default function Home() {
  const router = useRouter();
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const [totalChats, setTotalChats] = useState(0);

  // Cargar datos iniciales
  useEffect(() => {
    try {
      const lastChatId = storageManager.getLastChatId();
      const stats = storageManager.getStorageStats();
      
      if (lastChatId) {
        setCurrentChatId(lastChatId);
      }
      setTotalChats(stats.totalChats);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }, []);

  // Manejar selección de chat - usando función normal en lugar de useCallback
  const handleSelectChat = (chatId: string) => {
    if (!chatId) {
      console.error('handleSelectChat: chatId is required');
      return;
    }
    console.log('Selecting chat:', chatId);
    setCurrentChatId(chatId);
    storageManager.setLastChatId(chatId);
    router.push(`/chat/${chatId}`);
  };

  // Manejar nuevo chat
  const handleNewChat = () => {
    console.log('Creating new chat');
    setCurrentChatId(undefined);
    router.push('/');
  };

  // Manejar chat creado
  const handleChatCreated = (chatId: string) => {
    if (!chatId) {
      console.error('handleChatCreated: chatId is required');
      return;
    }
    console.log('Chat created:', chatId);
    setCurrentChatId(chatId);
    storageManager.setLastChatId(chatId);
    router.push(`/chat/${chatId}`);
  };

  // Manejar chat eliminado
  const handleChatDeleted = (deletedChatId: string) => {
    if (!deletedChatId) {
      console.error('handleChatDeleted: deletedChatId is required');
      return;
    }
    console.log('Chat deleted:', deletedChatId);
    if (currentChatId === deletedChatId) {
      setCurrentChatId(undefined);
      router.push('/');
    }
    // Actualizar contador
    const stats = storageManager.getStorageStats();
    setTotalChats(stats.totalChats);
  };

  return (
    <Layout
      sidebar={
        <ChatHistory
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onChatDeleted={handleChatDeleted}
          currentChatId={currentChatId}
        />
      }
      header={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="xl:text-xl text-sm font-semibold">SOLUTION TECH</h1>
            <p className="xl:text-sm text-xs text-muted-foreground">
              Chat Empresarial - {totalChats} conversación{totalChats !== 1 ? 'es' : ''}
            </p>
          </div>
          {/* <div className="text-sm  text-muted-foreground">
            💬 Nueva conversación
          </div> */}
        </div>
      }
    >
      <NewChat onChatCreated={handleChatCreated} />
    </Layout>
  );
}