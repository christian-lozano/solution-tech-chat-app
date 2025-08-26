'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, RefreshCw } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ClearStoragePage() {
  const [isCleared, setIsCleared] = useState(false);
  const [storageInfo, setStorageInfo] = useState<string>('');

  useEffect(() => {
    // Mostrar información del localStorage
    const keys = Object.keys(localStorage);
    setStorageInfo(`Claves en localStorage: ${keys.length}\n${keys.join(', ')}`);
  }, []);

  const clearStorage = () => {
    try {
      localStorage.clear();
      setIsCleared(true);
      setStorageInfo('localStorage limpiado completamente');
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  };

  const reloadPage = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Limpiar Almacenamiento Local
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Información actual:</h3>
              <pre className="text-sm whitespace-pre-wrap">{storageInfo}</pre>
            </div>
            
            {!isCleared ? (
              <Button onClick={clearStorage} variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar localStorage
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  ✅ localStorage limpiado exitosamente
                </div>
                <Button onClick={reloadPage} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Volver al inicio
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}