'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Sparkles } from 'lucide-react';
import { useCreateChat } from '@/hooks/useChat';
import { SuggestedQuestions } from './SuggestedQuestions';
import { SYSTEM_MESSAGES } from '@/lib/constants';

interface NewChatProps {
  onChatCreated: (chatId: string) => void;
}

export function NewChat({ onChatCreated }: NewChatProps) {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const createChatMutation = useCreateChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const result = await createChatMutation.mutateAsync({
        title: message.length > 50 ? message.substring(0, 50) + '...' : message,
        firstMessage: message
      });
      
      onChatCreated(result.chat.id);
      setMessage('');
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  const handleQuestionSelect = (question: string) => {
    setMessage(question);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    setShowSuggestions(false);
  };

  return (
    <div className="h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 ">
      <div className="w-full max-w-6xl">
        {/* Layout responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Panel de preguntas sugeridas - oculto en móvil, visible en desktop */}
          <div className="hidden xl:block xl:col-span-1">
            <div className="sticky top-4">
              <SuggestedQuestions 
                onQuestionSelect={handleQuestionSelect}
                disabled={createChatMutation.isPending}
              />
            </div>
          </div>

          {/* Panel de nueva conversación */}
          <div className="xl:col-span-2">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  {SYSTEM_MESSAGES.welcome}
                </CardTitle>
                <p className="text-muted-foreground mt-2 text-sm">
                  {SYSTEM_MESSAGES.subtitle}
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      ¿En qué puedo ayudarte hoy?
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={handleInputFocus}
                      placeholder={SYSTEM_MESSAGES.placeholder}
                      disabled={createChatMutation.isPending}
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={!message.trim() || createChatMutation.isPending}
                    className="w-full"
                    size="lg"
                  >
                    {createChatMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {SYSTEM_MESSAGES.loading}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {SYSTEM_MESSAGES.send}
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    {SYSTEM_MESSAGES.keyboardHint}
                  </p>
                </div>

                {/* Preguntas sugeridas en móvil y tablet */}
                <div className="xl:hidden mt-6">
                  <div className="border-t pt-4">
                    <SuggestedQuestions 
                      onQuestionSelect={handleQuestionSelect}
                      disabled={createChatMutation.isPending}
                      compact={true}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}