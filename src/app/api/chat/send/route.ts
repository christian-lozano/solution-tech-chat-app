import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, content, files } = body;
    
    // Simular respuesta del asistente
    const userMessage = {
      id: `msg_${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date(),
      files: files || [],
    };

    const assistantMessage = {
      id: `msg_${Date.now() + 1}`,
      content: generateAssistantResponse(content),
      sender: 'assistant',
      timestamp: new Date(Date.now() + 1000),
      files: [],
    };

    // Simular el chat actualizado
    const chat = {
      id: chatId,
      title: content.length > 50 ? content.substring(0, 50) + '...' : content,
      messages: [userMessage, assistantMessage],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      chat
    });
  } catch (error) {
    console.error('Error en /api/chat/send:', error);
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
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