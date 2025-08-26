'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  MessageSquare, 
  Trash2, 
  Clock,
  Plus
} from 'lucide-react';
import { Chat } from '@/types';
import { useChatHistory, useDeleteChat, useSearchChats } from '@/hooks/useChat';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatHistoryProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onChatDeleted: (chatId: string) => void;
  currentChatId?: string;
}

export function ChatHistory({ onSelectChat, onNewChat, onChatDeleted, currentChatId }: ChatHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const { data: historyData, isLoading: isLoadingHistory } = useChatHistory();
  const { data: searchData, isLoading: isLoadingSearch } = useSearchChats(
    searchQuery, 
    isSearching && searchQuery.trim().length > 0
  );
  const deleteChat = useDeleteChat();

  // Determinar qué chats mostrar
  const chatsToShow: Chat[] = isSearching && searchQuery.trim().length > 0 
    ? (searchData?.results?.map((result) => result.chat) ?? [])
    : (historyData?.chats ?? []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.trim().length > 0);
  };

  const handleDeleteChat = async (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
      try {
        await deleteChat.mutateAsync({ chatId });
        onChatDeleted(chatId);
      } catch (error) {
        console.error('Error eliminando chat:', error);
      }
    }
  };

  const getLastMessagePreview = (chat: Chat): string => {
    if (chat.messages.length === 0) return 'Sin mensajes';
    
    const lastMessage = chat.messages[chat.messages.length - 1];
    const preview = lastMessage.content || '[Archivo adjunto]';
    return preview.length > 50 ? preview.substring(0, 50) + '...' : preview;
  };

  const formatChatDate = (date: Date): string => {
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true, 
        locale: es 
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  if (isLoadingHistory) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Historial de Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Historial de Chats
          </span>
          <Button size="sm" onClick={onNewChat}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
        
        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar en conversaciones..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-0">
        {/* Estado de búsqueda */}
        {isSearching && (
          <div className="p-4 border-b bg-muted">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              {isLoadingSearch ? (
                'Buscando...'
              ) : (
                `${chatsToShow.length} resultado(s) para "${searchQuery}"`
              )}
            </div>
          </div>
        )}
        
        {/* Lista de chats */}
        <div className="divide-y">
          {chatsToShow.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {isSearching ? (
                <div>
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No se encontraron conversaciones</p>
                  <p className="text-sm">Intenta con otros términos de búsqueda</p>
                </div>
              ) : (
                <div>
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay conversaciones aún</p>
                  <p className="text-sm">Inicia tu primera conversación</p>
                </div>
              )}
            </div>
          ) : (
            chatsToShow.map((chat: Chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`p-4 hover:bg-muted cursor-pointer transition-colors ${
                  currentChatId === chat.id ? 'bg-muted border-r-2 border-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{chat.title}</h3>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {getLastMessagePreview(chat)}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatChatDate(chat.updatedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {chat.messages.length} mensajes
                      </span>
                    </div>
                  </div>
                  
                  {/* Indicador de mensajes no leídos */}
                  {'unreadCount' in chat && (chat as unknown as { unreadCount?: number }).unreadCount! > 0 && (
                    <div className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {(chat as unknown as { unreadCount?: number }).unreadCount}
                    </div>
                  )}
                  
                  {/* Botón eliminar */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      {/* Footer con estadísticas */}
      {!isSearching && historyData && (
        <div className="border-t p-4 text-center text-sm text-muted-foreground">
          {historyData.total} conversación(es) total
        </div>
      )}
    </Card>
  );
}