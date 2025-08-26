'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { getChatHistory, createChat, sendMessage } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  duration?: number;
}

export default function TestMSWPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Obtener historial de chats', status: 'pending', message: 'No ejecutado' },
    { name: 'Crear nuevo chat', status: 'pending', message: 'No ejecutado' },
    { name: 'Enviar mensaje', status: 'pending', message: 'No ejecutado' },
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, ...updates } : test
    ));
  };

  const runTest = async (index: number, testFn: () => Promise<void>) => {
    const startTime = Date.now();
    updateTest(index, { status: 'pending', message: 'Ejecutando...' });
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      updateTest(index, { 
        status: 'success', 
        message: 'Completado exitosamente',
        duration 
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      updateTest(index, { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Error desconocido',
        duration 
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    // Test 1: Obtener historial
    await runTest(0, async () => {
      const result = await getChatHistory();
      if (!result || typeof result !== 'object') {
        throw new Error('Respuesta inválida');
      }
    });

    // Test 2: Crear chat
    let chatId = '';
    await runTest(1, async () => {
      const result = await createChat({ 
        title: 'Chat de prueba MSW',
        firstMessage: 'Mensaje de prueba'
      });
      if (!result?.chat?.id) {
        throw new Error('No se pudo crear el chat');
      }
      chatId = result.chat.id;
    });

    // Test 3: Enviar mensaje
    await runTest(2, async () => {
      if (!chatId) {
        throw new Error('No hay chat disponible');
      }
      const result = await sendMessage({
        chatId,
        content: 'Mensaje de prueba para MSW',
        files: []
      });
      if (!result?.chat) {
        throw new Error('No se pudo enviar el mensaje');
      }
    });

    setIsRunning(false);
  };

  const resetTests = () => {
    setTests(prev => prev.map(test => ({
      ...test,
      status: 'pending' as const,
      message: 'No ejecutado',
      duration: undefined
    })));
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500">Éxito</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Pruebas de MSW</h1>
          <p className="text-muted-foreground mt-2">
            Verificación del funcionamiento de Mock Service Worker
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Estado de MSW
              <div className="flex gap-2">
                <Button 
                  onClick={resetTests} 
                  variant="outline" 
                  size="sm"
                  disabled={isRunning}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reiniciar
                </Button>
                <Button 
                  onClick={runAllTests} 
                  disabled={isRunning}
                  size="sm"
                >
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    'Ejecutar Pruebas'
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>MSW Habilitado:</span>
                <Badge variant={process.env.NEXT_PUBLIC_MSW_ENABLED === 'true' ? 'default' : 'secondary'}>
                  {process.env.NEXT_PUBLIC_MSW_ENABLED}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Entorno:</span>
                <Badge variant="outline">{process.env.NODE_ENV}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {tests.map((test, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <h3 className="font-medium">{test.name}</h3>
                      <p className="text-sm text-muted-foreground">{test.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {test.duration && (
                      <span className="text-xs text-muted-foreground">
                        {test.duration}ms
                      </span>
                    )}
                    {getStatusBadge(test.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>MSW (Mock Service Worker)</strong> intercepta las peticiones HTTP y devuelve respuestas simuladas.
            </p>
            <p>
              Si las pruebas fallan, verifica que MSW esté correctamente configurado y que el service worker esté activo.
            </p>
            <p>
              En producción, MSW se desactiva automáticamente y las peticiones van al servidor real.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}