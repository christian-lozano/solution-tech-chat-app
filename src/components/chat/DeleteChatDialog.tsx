'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteChat } from '@/hooks/useDeleteChat';

interface DeleteChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatId: string;
  chatTitle: string;
  onDeleted?: (deletedChatId: string) => void;
}

export function DeleteChatDialog({
  open,
  onOpenChange,
  chatId,
  chatTitle,
  onDeleted,
}: DeleteChatDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const { deleteChat, isDeleting } = useDeleteChat({
    onSuccess: (deletedChatId) => {
      onOpenChange(false);
      onDeleted?.(deletedChatId);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleConfirm = async () => {
    try {
      setError(null);
      await deleteChat(chatId);
    } catch {
      // El error se maneja en el hook
    }
  };

  const handleCancel = () => {
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🗑️ Eliminar conversación
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar la conversación &quot;{chatTitle}&quot;?
            <br />
            <strong>Esta acción no se puede deshacer.</strong>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <p className="text-sm text-destructive">
              ⚠️ {error}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook para usar el diálogo de eliminación
export function useDeleteChatDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const openDialog = (chatId: string, chatTitle: string) => {
    setChatToDelete({ id: chatId, title: chatTitle });
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setChatToDelete(null);
  };

  return {
    isOpen,
    chatToDelete,
    openDialog,
    closeDialog,
  };
}