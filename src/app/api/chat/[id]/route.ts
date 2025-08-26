import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Simular datos de chat
    const mockChat = {
      id,
      title: `Chat ${id}`,
      messages: [
        {
          id: `msg_1_${id}`,
          content: '¡Hola! ¿En qué puedo ayudarte hoy?',
          sender: 'assistant',
          timestamp: new Date(Date.now() - 60000), // 1 minuto atrás
          files: [],
        },
        {
          id: `msg_2_${id}`,
          content: 'Hola, necesito información sobre los servicios de SOLUTION TECH',
          sender: 'user',
          timestamp: new Date(Date.now() - 30000), // 30 segundos atrás
          files: [],
        },
        {
          id: `msg_3_${id}`,
          content: 'Perfecto, SOLUTION TECH ofrece una amplia gama de servicios tecnológicos:\n\n• Desarrollo de aplicaciones web y móviles\n• Consultoría en transformación digital\n• Soporte técnico especializado\n• Integración de sistemas\n• Ciberseguridad\n\n¿Te interesa algún servicio en particular?',
          sender: 'assistant',
          timestamp: new Date(),
          files: [],
        }
      ],
      createdAt: new Date(Date.now() - 3600000), // 1 hora atrás
      updatedAt: new Date(),
    };

    return NextResponse.json({ chat: mockChat });
  } catch (error) {
    console.error('Error en /api/chat/[id]:', error);
    return NextResponse.json(
      { error: 'Error al obtener el chat' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Simular eliminación exitosa
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en DELETE /api/chat/[id]:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el chat' },
      { status: 500 }
    );
  }
}