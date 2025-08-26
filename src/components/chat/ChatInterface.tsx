'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Video,
  Download,
  X
} from 'lucide-react';
import { Message, Chat } from '@/types';
import { FileAttachmentList } from './FileAttachment';
import { useSendMessage } from '@/hooks/useChat';
// import { useFileUpload } from '@/hooks/useFileUpload';

interface ChatInterfaceProps {
  chat: Chat;
  onMessageSent?: (message: Message) => void;
}

interface AttachedFile {
  file: File;
  preview?: string;
  type: 'image' | 'video' | 'document';
}

export function ChatInterface({ chat, onMessageSent }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const sendMessageMutation = useSendMessage();
  // const { uploadFile, isUploading } = useFileUpload();
  const isUploading = false;

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const fileType = getFileType(file);
      const attachedFile: AttachedFile = {
        file,
        type: fileType
      };

      // Crear preview para imágenes
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          attachedFile.preview = e.target?.result as string;
          setAttachedFiles(prev => [...prev, attachedFile]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachedFiles(prev => [...prev, attachedFile]);
      }
    });

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileType = (file: File): 'image' | 'video' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      // Enviar mensaje (sin archivos por ahora)
      await sendMessageMutation.mutateAsync({
        chatId: chat.id,
        content: inputMessage,
        files: []
      });

      // Limpiar formulario
      setInputMessage('');
      setAttachedFiles([]);
      
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    
    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[80%] rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          {/* Contenido del mensaje */}
          {message.content && (
            <p className="whitespace-pre-wrap mb-2">{message.content}</p>
          )}
          
          {/* Archivos adjuntos */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2">
              <FileAttachmentList files={message.attachments} />
            </div>
          )}
          
          {/* Timestamp */}
          <p className="text-xs opacity-70 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {chat.title}
          <div className="h-2 w-2 bg-green-500 rounded-full ml-auto"></div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chat.messages && chat.messages.length > 0 ? (
            chat.messages.map(renderMessage)
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay mensajes en esta conversación</p>
                <p className="text-sm">Envía un mensaje para comenzar</p>
              </div>
            </div>
          )}
          
          {/* Indicador de carga */}
          {sendMessageMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Archivos adjuntos */}
        {attachedFiles.length > 0 && (
          <div className="border-t p-4">
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((attachedFile, index) => (
                <div key={index} className="relative bg-muted rounded-lg p-2 flex items-center gap-2">
                  {attachedFile.type === 'image' && attachedFile.preview ? (
                    <img 
                      src={attachedFile.preview} 
                      alt={attachedFile.file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    renderFileIcon(attachedFile.file.type)
                  )}
                  <span className="text-sm truncate max-w-[100px]">{attachedFile.file.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAttachedFile(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Área de entrada */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={sendMessageMutation.isPending || isUploading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={sendMessageMutation.isPending}
              className="flex-1"
            />
            
            <Button 
              onClick={handleSendMessage} 
              disabled={(!inputMessage.trim() && attachedFiles.length === 0) || sendMessageMutation.isPending}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Presiona Enter para enviar • Adjunta imágenes, videos o documentos
          </p>
        </div>
      </CardContent>
    </Card>
  );
}