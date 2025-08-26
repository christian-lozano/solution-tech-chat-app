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
        <Card className="h-full bg-background border-0 rounded-none md:rounded-lg md:border md:bg-card">
         <CardHeader className="p-4 md:p-6">
           <CardTitle className="text-base md:text-lg lg:text-xl">Historial de Chats</CardTitle>
         </CardHeader>
         <CardContent className="p-4 md:p-6">
           <div className="flex items-center justify-center h-32">
             <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary"></div>
           </div>
         </CardContent>
       </Card>
     );
   }

           return (
      <Card className="h-full flex flex-col bg-background border-0 rounded-none md:rounded-lg md:border md:bg-card">
       <CardHeader className="border-b p-4 md:p-6">
         <CardTitle className="flex items-center justify-between">
           <span className="flex items-center gap-2 text-base md:text-lg lg:text-xl">
             <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
             <span className="hidden sm:inline">Historial de Chats</span>
             <span className="sm:hidden">Chats</span>
           </span>
           <Button size="sm" onClick={onNewChat} className="h-8 w-8 md:h-9 md:w-9 p-0">
             <Plus className="h-4 w-4" />
           </Button>
         </CardTitle>
         
         {/* Buscador */}
         <div className="relative mt-3">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input
             placeholder="Buscar conversaciones..."
             value={searchQuery}
             onChange={(e) => handleSearch(e.target.value)}
             className="pl-10 h-9 md:h-10 text-sm"
           />
         </div>
       </CardHeader>
      
                           <CardContent className="flex-1 overflow-y-auto p-0 bg-background md:bg-card">
         {/* Estado de búsqueda */}
         {isSearching && (
           <div className="p-3 md:p-4 border-b bg-muted/50">
             <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
               <Search className="h-3 w-3 md:h-4 md:w-4" />
               {isLoadingSearch ? (
                 'Buscando...'
               ) : (
                 <span className="truncate">{chatsToShow.length} resultado(s) para "{searchQuery}"</span>
               )}
             </div>
           </div>
         )}
         
         {/* Lista de chats */}
         <div className="divide-y divide-border">
           {chatsToShow.length === 0 ? (
             <div className="p-4 md:p-8 text-center text-muted-foreground">
               {isSearching ? (
                 <div>
                   <Search className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 opacity-50" />
                   <p className="text-sm md:text-base">No se encontraron conversaciones</p>
                   <p className="text-xs md:text-sm">Intenta con otros términos</p>
                 </div>
               ) : (
                 <div>
                   <MessageSquare className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 opacity-50" />
                   <p className="text-sm md:text-base">No hay conversaciones aún</p>
                   <p className="text-xs md:text-sm">Inicia tu primera conversación</p>
                 </div>
               )}
             </div>
           ) : (
             chatsToShow.map((chat: Chat) => (
               <div
                 key={chat.id}
                 onClick={() => onSelectChat(chat.id)}
                 className={`group p-3 md:p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                   currentChatId === chat.id ? 'bg-muted border-r-2 border-primary' : ''
                 }`}
               >
                                 <div className="flex items-start justify-between gap-2">
                   <div className="flex-1 min-w-0">
                     <h3 className="font-medium truncate text-sm md:text-base">{chat.title}</h3>
                     <p className="text-xs md:text-sm text-muted-foreground truncate mt-1">
                       {getLastMessagePreview(chat)}
                     </p>
                     <div className="flex items-center gap-2 md:gap-4 mt-2 text-xs text-muted-foreground">
                       <span className="flex items-center gap-1">
                         <Clock className="h-3 w-3" />
                         <span className="hidden sm:inline">{formatChatDate(chat.updatedAt)}</span>
                         <span className="sm:hidden">{formatChatDate(chat.updatedAt).replace('hace ', '')}</span>
                       </span>
                       <span className="flex items-center gap-1">
                         <MessageSquare className="h-3 w-3" />
                         <span className="hidden sm:inline">{chat.messages.length} mensajes</span>
                         <span className="sm:hidden">{chat.messages.length}</span>
                       </span>
                     </div>
                   </div>
                   
                   {/* Indicador de mensajes no leídos */}
                   {'unreadCount' in chat && (chat as unknown as { unreadCount?: number }).unreadCount! > 0 && (
                     <div className="bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center flex-shrink-0">
                       {(chat as unknown as { unreadCount?: number }).unreadCount}
                     </div>
                   )}
                   
                   {/* Botón eliminar */}
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={(e) => handleDeleteChat(chat.id, e)}
                     className="h-7 w-7 md:h-8 md:w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground flex-shrink-0"
                   >
                     <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                   </Button>
                 </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
             {/* Footer con estadísticas */}
       {!isSearching && historyData && (
         <div className="border-t p-3 md:p-4 text-center text-xs md:text-sm text-muted-foreground bg-muted/30">
           {historyData.total} conversación(es) total
         </div>
       )}
    </Card>
  );
}