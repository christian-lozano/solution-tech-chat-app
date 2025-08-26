'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Componente simple sin Layout complejo
function SimpleChat() {
  const router = useRouter();
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();

  const handleSelectChat = (chatId: string) => {
    console.log('Simple handleSelectChat called with:', chatId);
    setCurrentChatId(chatId);
    router.push(`/chat/${chatId}`);
  };

  const handleNewChat = () => {
    console.log('Simple handleNewChat called');
    setCurrentChatId(undefined);
    router.push('/');
  };

  const handleChatDeleted = (chatId: string) => {
    console.log('Simple handleChatDeleted called with:', chatId);
    if (currentChatId === chatId) {
      setCurrentChatId(undefined);
      router.push('/');
    }
  };

  // Verificar que las funciones están definidas
  console.log('Functions defined:', {
    handleSelectChat: typeof handleSelectChat,
    handleNewChat: typeof handleNewChat,
    handleChatDeleted: typeof handleChatDeleted
  });

  return (
    <div className="flex h-screen">
      {/* Sidebar simple */}
      <div className="w-80 border-r bg-card p-4">
        <h2 className="text-lg font-semibold mb-4">SOLUTION TECH</h2>
        
        <button 
          onClick={handleNewChat}
          className="w-full mb-4 p-2 bg-primary text-primary-foreground rounded"
        >
          Nueva Conversación
        </button>

        <div className="space-y-2">
          <div 
            onClick={() => handleSelectChat('chat-1')}
            className={`p-3 rounded cursor-pointer hover:bg-muted ${
              currentChatId === 'chat-1' ? 'bg-muted' : ''
            }`}
          >
            <h3 className="font-medium">Chat de Prueba 1</h3>
            <p className="text-sm text-muted-foreground">Mensaje de ejemplo</p>
          </div>
          
          <div 
            onClick={() => handleSelectChat('chat-2')}
            className={`p-3 rounded cursor-pointer hover:bg-muted ${
              currentChatId === 'chat-2' ? 'bg-muted' : ''
            }`}
          >
            <h3 className="font-medium">Chat de Prueba 2</h3>
            <p className="text-sm text-muted-foreground">Otro mensaje</p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">SOLUTION TECH Chat</h1>
          <p className="text-muted-foreground mb-4">
            Chat actual: {currentChatId || 'Ninguno'}
          </p>
          <button 
            onClick={handleNewChat}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Iniciar Nueva Conversación
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimpleChat;