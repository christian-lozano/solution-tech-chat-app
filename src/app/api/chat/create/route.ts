import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, firstMessage } = body;
    
    const chatId = `chat_${Date.now()}`;
    
    // Crear mensajes iniciales si hay un primer mensaje
    const messages = [];
    if (firstMessage) {
      const userMessage = {
        id: `msg_${Date.now()}`,
        content: firstMessage,
        sender: 'user',
        timestamp: new Date(),
        files: [],
      };
      
      const assistantMessage = {
        id: `msg_${Date.now() + 1}`,
        content: generateAssistantResponse(firstMessage),
        sender: 'assistant',
        timestamp: new Date(Date.now() + 1000),
        files: [],
      };
      
      messages.push(userMessage, assistantMessage);
    }
    
    // Crear un nuevo chat
    const newChat = {
      id: chatId,
      title: title || 'Nueva conversación',
      messages,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({ 
      chat: newChat,
      chatId: chatId
    });
  } catch (error) {
    console.error('Error en /api/chat/create:', error);
    return NextResponse.json(
      { error: 'Error al crear el chat' },
      { status: 500 }
    );
  }
}

function generateAssistantResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('saludos')) {
    return '¡Hola! Soy el asistente virtual de SOLUTION TECH. ¿En qué puedo ayudarte hoy?';
  }
  
  if (lowerMessage.includes('servicios') || lowerMessage.includes('qué hacen') || lowerMessage.includes('ofrecen')) {
    return 'SOLUTION TECH ofrece una amplia gama de servicios tecnológicos:\n\n• Desarrollo de aplicaciones web y móviles\n• Consultoría en transformación digital\n• Soporte técnico especializado\n• Integración de sistemas\n• Ciberseguridad\n\n¿Te interesa algún servicio en particular?';
  }
  
  if (lowerMessage.includes('contacto') || lowerMessage.includes('teléfono') || lowerMessage.includes('email')) {
    return 'Puedes contactarnos a través de:\n\n📧 Email: info@solutiontech.com\n📞 Teléfono: +1 (555) 123-4567\n🌐 Web: www.solutiontech.com\n📍 Dirección: Av. Tecnología 123, Ciudad Tech\n\n¿Necesitas información específica sobre algún departamento?';
  }
  
  if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cotización')) {
    return 'Los precios varían según el proyecto y sus requerimientos específicos. Para obtener una cotización personalizada:\n\n1. Describe tu proyecto\n2. Especifica tus necesidades\n3. Indica tu presupuesto aproximado\n\nNuestro equipo comercial te contactará en menos de 24 horas. ¿Te gustaría agendar una consulta gratuita?';
  }
  
  if (lowerMessage.includes('gracias') || lowerMessage.includes('thank')) {
    return '¡De nada! Es un placer ayudarte. Si tienes más preguntas sobre SOLUTION TECH, no dudes en consultarme. ¡Que tengas un excelente día! 😊';
  }
  
  // Respuesta por defecto
  return 'Gracias por tu consulta. Como asistente de SOLUTION TECH, estoy aquí para ayudarte con información sobre nuestros servicios, contacto, precios y más.\n\n¿Podrías ser más específico sobre lo que necesitas? Así podré brindarte la información más relevante.';
}