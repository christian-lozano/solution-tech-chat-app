import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Datos de ejemplo para el historial de chats
    const mockData = {
      chats: [
        {
          id: '1',
          title: 'Consulta sobre servicios',
          messages: [
            {
              id: 'm1',
              content: '¡Hola! ¿Qué servicios ofrece SOLUTION TECH?',
              sender: 'user',
              timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
            },
            {
              id: 'm2',
              content: 'Hola! SOLUTION TECH ofrece servicios de desarrollo web, aplicaciones móviles, consultoría tecnológica y soporte técnico.',
              sender: 'assistant',
              timestamp: new Date(Date.now() - 3500000),
            }
          ],
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(Date.now() - 3500000),
          unreadCount: 0,
        },
        {
          id: '2',
          title: 'Información de contacto',
          messages: [
            {
              id: 'm3',
              content: '¿Cómo puedo contactar con el equipo de ventas?',
              sender: 'user',
              timestamp: new Date(Date.now() - 7200000), // 2 horas atrás
            }
          ],
          createdAt: new Date(Date.now() - 7200000),
          updatedAt: new Date(Date.now() - 7200000),
          unreadCount: 1,
        }
      ],
      total: 2
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error en /api/chat/history:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}