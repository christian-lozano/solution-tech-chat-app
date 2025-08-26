'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { ChatHistory } from '@/components/chat/ChatHistory';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Chat } from '@/types';
import { useCreateChat, useCurrentChat } from '@/hooks/useChat';

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  
  const createChat = useCreateChat();
  const { currentChat, selectChat } = useCurrentChat();

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowHistory(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Seleccionar chat actual si existe
  useEffect(() => {
    if (currentChat && !selectedChat) {
      setSelectedChat(currentChat);
    }
  }, [currentChat, selectedChat]);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    selectChat(chat.id);
    
    // En móvil, ocultar historial al seleccionar chat
    if (isMobile) {
      setShowHistory(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const result = await createChat.mutateAsync({
        title: 'Nueva conversación',
        firstMessage: '¡Hola! Soy el asistente virtual de SOLUTION TECH. ¿En qué puedo ayudarte hoy?'
      });
      
      setSelectedChat(result.chat);
      selectChat(result.chat.id);
      
      // En móvil, mostrar el chat
      if (isMobile) {
        setShowHistory(false);
      }
    } catch (error) {
      console.error('Error creando chat:', error);
    }
  };

  const handleBackToHistory = () => {
    setShowHistory(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Inicio
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">SOLUTION TECH</span>
              </div>
            </div>
            
            {/* Controles móviles */}
            {isMobile && (
              <div className="flex items-center gap-2">
                {!showHistory && (
                  <Button variant="outline" size="sm" onClick={handleBackToHistory}>
                    Historial
                  </Button>
                )}
                <Button size="sm" onClick={handleNewChat}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-88px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {/* Historial de Chats */}
          <div className={`${
            isMobile 
              ? (showHistory ? 'block' : 'hidden') 
              : 'block'
          } md:col-span-1`}>
            <ChatHistory
              onSelectChat={(chatId) => {
                const chat = selectedChat && selectedChat.id === chatId ? selectedChat : currentChat;
                if (chat && chat.id === chatId) {
                  handleChatSelect(chat);
                } else {
                  // Si no tenemos el objeto completo, al menos seleccionamos por id
                  selectChat(chatId);
                }
              }}
              onNewChat={handleNewChat}
              onChatDeleted={(deletedId) => {
                if (selectedChat?.id === deletedId) {
                  setSelectedChat(null);
                }
              }}
              currentChatId={selectedChat?.id}
            />
          </div>
          
          {/* Interfaz de Chat */}
          <div className={`${
            isMobile 
              ? (showHistory ? 'hidden' : 'block') 
              : 'block'
          } md:col-span-2`}>
            {selectedChat ? (
              <ChatInterface
                chat={selectedChat}
                onMessageSent={(message) => {
                  // Actualizar el chat seleccionado con el nuevo mensaje
                  setSelectedChat(prev => prev ? {
                    ...prev,
                    messages: [...prev.messages, message],
                    updatedAt: new Date()
                  } : null);
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-muted">
                <div className="text-center space-y-4">
                  <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/50" />
                  <div>
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      Bienvenido al Chat de SOLUTION TECH
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Selecciona una conversación existente o inicia una nueva
                    </p>
                  </div>
                  <Button onClick={handleNewChat} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Iniciar Nueva Conversación
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}