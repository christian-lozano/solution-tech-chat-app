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
  Plus,
  X
} from 'lucide-react';
import { Chat } from '@/types';
import { useChatHistory, useDeleteChat, useSearchChats } from '@/hooks/useChat';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface MobileChatHistoryProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onChatDeleted: (chatId: string) => void;
  currentChatId?: string;
  onClose?: () => void;
}

export function MobileChatHistory({ 
  onSelectChat, 
  onNewChat, 
  onChatDeleted, 
  currentChatId,
  onClose 
}: MobileChatHistoryProps) {
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
    
    if (confirm('¿Eliminar esta conversación?')) {
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
    return preview.length > 40 ? preview.substring(0, 40) + '...' : preview;
  };

  const formatChatDate = (date: Date): string => {
    try {
      const formatted = formatDistanceToNow(new Date(date), { 
        addSuffix: true, 
        locale: es 
      });
      return formatted.replace('hace ', '');
    } catch {
      return 'Fecha inválida';
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                 <div className="flex items-center gap-2">
           <MessageSquare className="h-5 w-5 text-primary" />
           <h2 className="text-lg font-semibold text-foreground">Conversaciones</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            onClick={onNewChat}
            className="h-8 w-8 p-0 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="p-4 border-b border-border bg-muted/10">
                 <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
          
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-10 bg-background border-border "
          />
        </div>
      </div>

      {/* Search Results Header */}
      {isSearching && (
        <div className="px-4 py-2 bg-primary/10 border-b border-border">
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            {isLoadingSearch ? (
              'Buscando...'
            ) : (
              `${chatsToShow.length} resultado(s)`
            )}
          </div>
        </div>
      )}
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chatsToShow.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {isSearching ? (
              <div>
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-base">No se encontraron conversaciones</p>
                <p className="text-sm">Intenta con otros términos</p>
              </div>
            ) : (
              <div>
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                 <p className="text-base text-foreground">No hay conversaciones</p>
                 <p className="text-sm text-muted-foreground">Inicia tu primera conversación</p>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {chatsToShow.map((chat: Chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                  currentChatId === chat.id ? 'bg-primary/10 border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                                         <h3 className="font-medium truncate text-base text-foreground">{chat.title}</h3>
                     <p className="text-sm text-muted-foreground truncate mt-1">
                      {getLastMessagePreview(chat)}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                             <span className="flex items-center gap-1 text-muted-foreground">
                         <Clock className="h-3 w-3" />
                         {formatChatDate(chat.updatedAt)}
                       </span>
                       <span className="flex items-center gap-1 text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        {chat.messages.length}
                      </span>
                    </div>
                  </div>
                  
                  {/* Unread indicator */}
                  {'unreadCount' in chat && (chat as unknown as { unreadCount?: number }).unreadCount! > 0 && (
                                         <div className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                      {(chat as unknown as { unreadCount?: number }).unreadCount}
                    </div>
                  )}
                  
                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      {!isSearching && historyData && (
                 <div className="p-4 text-center text-sm text-muted-foreground bg-muted/20 border-t border-border">
          {historyData.total} conversación(es) total
        </div>
      )}
    </div>
  );
}
