"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MessageSquare, Plus } from "lucide-react";

interface SimpleChatHistoryProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onChatDeleted: (chatId: string) => void;
  currentChatId?: string;
}

export function SimpleChatHistory({
  onSelectChat,
  onNewChat,
  onChatDeleted,
  currentChatId,
}: SimpleChatHistoryProps) {
  const [chats, setChats] = useState([
    {
      id: "1",
      title: "Consulta sobre servicios",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Información de contacto",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // onChatDeleted no se usa en esta versión simple; se mantiene por compatibilidad

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Historial Simple
          </span>
          <Button size="sm" onClick={onNewChat}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="divide-y">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                console.log("Simple chat clicked:", chat.id);
                onSelectChat(chat.id);
              }}
              className={cn(
                "p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                currentChatId === chat.id && "bg-muted border-r-2 border-primary"
              )}
            >
              <h3 className="font-medium">{chat.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Chat de ejemplo
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
