'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { ChatHistory } from '@/components/chat/ChatHistory';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { FullScreenLoading } from '@/components/common/LoadingSpinner';
import { useChat } from '@/hooks/useChat';
import { storageManager } from '@/lib/storage';
import { Button } from '@/components/ui/button';

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;
  const [currentChatId, setCurrentChatId] = useState<string>(chatId);
  const [totalChats, setTotalChats] = useState(0);

  // Hook para obtener datos del chat
  const { data: chat, isLoading, error } = useChat(chatId);

  // Cargar datos iniciales
  useEffect(() => {
    try {
      const stats = storageManager.getStorageStats();
      setTotalChats(stats.totalChats);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }, []);

  // Actualizar currentChatId cuando cambie el parámetro
  useEffect(() => {
    setCurrentChatId(chatId);
  }, [chatId]);

  // Manejar selección de chat
  const handleSelectChat = (newChatId: string) => {
    setCurrentChatId(newChatId);
    storageManager.setLastChatId(newChatId);
    router.push(`/chat/${newChatId}`);
  };

  // Manejar nuevo chat
  const handleNewChat = () => {
    router.push('/');
  };

  // Manejar chat eliminado
  const handleChatDeleted = (deletedChatId: string) => {
    if (currentChatId === deletedChatId) {
      router.push('/');
    }
    // Actualizar contador
    const stats = storageManager.getStorageStats();
    setTotalChats(stats.totalChats);
  };

  // Mostrar loading mientras carga
  if (isLoading) {
    return <FullScreenLoading message="Cargando conversación..." />;
  }

  // Mostrar error si el chat no existe
  if (error || !chat) {
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
              <h1 className="text-xl font-semibold">SOLUTION TECH</h1>
              <p className="text-sm text-muted-foreground">
                Chat Empresarial - {totalChats} conversación{totalChats !== 1 ? 'es' : ''}
              </p>
            </div>
          </div>
        }
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-6xl">❌</div>
            <h2 className="text-xl font-semibold">Conversación no encontrada</h2>
            <p className="text-muted-foreground">
              La conversación que buscas no existe o ha sido eliminada.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleNewChat}>
                Nueva conversación
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Volver
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
            <h1 className="text-xl font-semibold">SOLUTION TECH</h1>
            <p className="text-sm text-muted-foreground">
              Chat Empresarial - {totalChats} conversación{totalChats !== 1 ? 'es' : ''}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            💬 {chat.chat.title}
          </div>
        </div>
      }
    >
      <ChatInterface chat={chat.chat} />
    </Layout>
  );
}