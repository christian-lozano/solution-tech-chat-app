'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Wifi, WifiOff } from 'lucide-react';
import { getChatHistory } from '@/lib/api';

export function MSWStatus() {
  const [status, setStatus] = useState<'checking' | 'active' | 'inactive' | 'error'>('checking');
  const [testResult, setTestResult] = useState<string>('');

  const checkMSWStatus = async () => {
    setStatus('checking');
    setTestResult('');

    try {
      // Hacer una llamada de prueba a la API
      const result = await getChatHistory();
      
      if (result && typeof result === 'object') {
        setStatus('active');
        setTestResult(`MSW activo - ${result.chats?.length || 0} chats simulados`);
      } else {
        setStatus('inactive');
        setTestResult('API real detectada');
      }
    } catch (error) {
      setStatus('error');
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Desconocido'}`);
    }
  };

  useEffect(() => {
    checkMSWStatus();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive':
        return <WifiOff className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Verificando MSW...';
      case 'active':
        return 'MSW Activo';
      case 'inactive':
        return 'MSW Inactivo';
      case 'error':
        return 'Error en MSW';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-blue-600';
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
    }
  };

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg bg-card border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getStatusIcon()}
          <span className={getStatusColor()}>{getStatusText()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {testResult || 'Verificando estado de la API simulada...'}
          </p>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={checkMSWStatus}
              disabled={status === 'checking'}
            >
              {status === 'checking' ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Wifi className="h-3 w-3 mr-1" />
              )}
              Probar API
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              MSW Habilitado: {process.env.NEXT_PUBLIC_MSW_ENABLED}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Entorno: {process.env.NODE_ENV}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}