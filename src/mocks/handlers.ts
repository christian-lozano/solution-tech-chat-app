import { http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import { Message, Chat, AttachedFile } from '@/types';
import { generateChatTitle } from '@/utils';

// Simulación de base de datos en memoria
const mockChats: Chat[] = [];
let mockMessages: Message[] = [];

// Función para generar respuestas automáticas del sistema
function generateSystemResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  console.log('🔍 Analizando mensaje:', userMessage);
  console.log('🔍 Mensaje en minúsculas:', message);
  
  // Respuestas específicas para las preguntas simplificadas
  if (message.includes('misión') || message.includes('solution tech')) {
    console.log('✅ Detectada pregunta de misión');
    return `**Nuestra Misión en SOLUTION TECH:**

Transformar ideas innovadoras en soluciones tecnológicas de alta calidad que impulsen el crecimiento y éxito de nuestros clientes.

**¿Qué hacemos?**
- Desarrollo de software personalizado
- Consultoría en transformación digital
- Implementación de tecnologías emergentes
- Optimización de procesos empresariales

**Nuestros valores:**
- Innovación constante
- Excelencia técnica
- Compromiso con el cliente
- Trabajo en equipo

¿Te gustaría conocer más sobre nuestros servicios específicos?`;
  }
  
  if (message.includes('marketing') || message.includes('estrategia')) {
    console.log('✅ Detectada pregunta de marketing digital');
    return `**Estrategia de Marketing Digital - SOLUTION TECH:**

**Canales principales que recomendamos:**
1. **SEO y Contenido**: Posicionamiento orgánico con contenido de valor
2. **Redes Sociales**: LinkedIn para B2B, Instagram para engagement
3. **Email Marketing**: Automatización personalizada
4. **Publicidad PPC**: Google Ads y Meta Ads dirigidos

**Herramientas que utilizamos:**
- Google Analytics 4 para análisis
- HubSpot para automatización
- Canva para diseño creativo
- Buffer para programación de contenido

**Resultados típicos:**
- 40% aumento en leads cualificados
- 60% mejora en engagement
- 25% reducción en costos de adquisición

¿Qué canal te interesa implementar primero?`;
  }
  
  if (message.includes('tecnología') || message.includes('tecnologías') || message.includes('recomiendan') || message.includes('empresa')) {
    console.log('✅ Detectada pregunta de tecnologías');
    return `**Tecnologías Recomendadas por SOLUTION TECH:**

**Frontend:**
- React/Next.js para aplicaciones web
- React Native para apps móviles
- TypeScript para código robusto

**Backend:**
- Node.js para APIs rápidas
- Python para IA/ML
- PostgreSQL para bases de datos

**Cloud & DevOps:**
- AWS/Azure para infraestructura
- Docker para containerización
- Kubernetes para orquestación

**Herramientas de Productividad:**
- Slack para comunicación
- Jira para gestión de proyectos
- Notion para documentación

¿En qué área tecnológica necesitas más apoyo?`;
  }
  
  if (message.includes('equipo') || message.includes('gestión') || message.includes('optimizar')) {
    console.log('✅ Detectada pregunta de gestión de equipos');
    return `**Gestión de Equipos - SOLUTION TECH:**

**Prácticas que implementamos:**
1. **Metodología Ágil**: Scrum y Kanban
2. **Comunicación transparente**: Daily standups
3. **Desarrollo continuo**: Capacitación regular
4. **Feedback constructivo**: Reuniones 1:1

**Herramientas de gestión:**
- Jira para seguimiento de proyectos
- Slack para comunicación en tiempo real
- Notion para documentación compartida
- Zoom para reuniones remotas

**Beneficios:**
- 30% aumento en productividad
- 50% reducción en tiempo de entrega
- Mayor satisfacción del equipo

¿Qué aspecto de la gestión de equipos te gustaría mejorar?`;
  }
  
  if (message.includes('ciberseguridad') || message.includes('seguridad') || message.includes('prácticas')) {
    console.log('✅ Detectada pregunta de ciberseguridad');
    return `**Mejores Prácticas de Ciberseguridad - SOLUTION TECH:**

**Medidas básicas que implementamos:**
1. **Autenticación multifactor (MFA)**
2. **Encriptación de datos en tránsito y reposo**
3. **Backups automáticos y seguros**
4. **Monitoreo continuo de amenazas**

**Herramientas de seguridad:**
- Firewalls de nueva generación
- Antivirus empresarial
- VPN para acceso remoto
- Gestión de contraseñas segura

**Capacitación del equipo:**
- Simulacros de phishing
- Políticas de seguridad claras
- Actualizaciones regulares de software

¿Qué área de ciberseguridad te preocupa más?`;
  }
  
  if (message.includes('transformación') || message.includes('implementar')) {
    console.log('✅ Detectada pregunta de transformación digital');
    return `**Transformación Digital - SOLUTION TECH:**

**Nuestro proceso en 4 fases:**

**Fase 1: Evaluación (2-4 semanas)**
- Auditoría de sistemas actuales
- Identificación de oportunidades
- Definición de roadmap

**Fase 2: Planificación (4-6 semanas)**
- Diseño de arquitectura
- Selección de tecnologías
- Plan de implementación

**Fase 3: Implementación (8-12 semanas)**
- Desarrollo iterativo
- Pruebas continuas
- Capacitación del equipo

**Fase 4: Optimización (continua)**
- Monitoreo de KPIs
- Mejoras continuas
- Escalabilidad

**Resultados típicos:**
- 40% reducción en costos operativos
- 60% mejora en eficiencia
- 80% satisfacción del usuario

¿En qué fase se encuentra tu empresa actualmente?`;
  }
  
  // Respuestas generales para otras preguntas
  console.log('❌ No se detectó ninguna pregunta específica, usando respuesta general');
  const generalResponses = [
    `Gracias por tu consulta. En SOLUTION TECH tenemos más de 5 años de experiencia ayudando empresas a crecer con tecnología. ¿Podrías contarme más sobre tu situación específica?`,
    `Excelente pregunta. Nuestro equipo de expertos puede ayudarte con esa consulta. ¿Te gustaría que programemos una sesión de asesoría personalizada?`,
    `Interesante perspectiva. En SOLUTION TECH creemos en soluciones personalizadas. ¿Qué desafíos específicos estás enfrentando?`,
    `Sobre tu consulta: tenemos casos de éxito similares. ¿Te gustaría que te comparta algunos ejemplos relevantes?`,
  ];
  
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

// Función para simular delay de red
function getRandomDelay(): number {
  return Math.floor(Math.random() * 1000) + 500; // 500-1500ms
}

export const handlers = [
  // Enviar mensaje
  http.post('/api/chat/send', async ({ request }) => {
    const body = await request.json() as { chatId: string; content: string; attachments?: Array<{ name: string; type: string; size: number }> };
    
    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
    
    // Crear mensaje del usuario
    const userMessage: Message = {
      id: uuidv4(),
      content: body.content,
      sender: 'user',
      timestamp: new Date(),
      attachments: body.attachments?.map((att) => ({
        id: uuidv4(),
        name: att.name,
        type: att.type,
        size: att.size,
        url: `/uploads/${att.name}`,
        thumbnailUrl: att.type.startsWith('image/') ? `/thumbnails/${att.name}` : undefined,
      })),
    };

    // Crear respuesta del sistema
    const systemMessage: Message = {
      id: uuidv4(),
      content: generateSystemResponse(body.content),
      sender: 'system',
      timestamp: new Date(Date.now() + 1000), // 1 segundo después
    };

    // Buscar o crear chat
    let chat = mockChats.find(c => c.id === body.chatId);
    if (!chat) {
      chat = {
        id: body.chatId,
        title: generateChatTitle(body.content),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockChats.push(chat);
    }

    // Añadir mensajes al chat
    chat.messages.push(userMessage, systemMessage);
    chat.updatedAt = new Date();
    mockMessages.push(userMessage, systemMessage);

    return HttpResponse.json({
      userMessage,
      systemMessage,
      chat,
    });
  }),

  // Crear nuevo chat
  http.post('/api/chat/create', async ({ request }) => {
    const body = await request.json() as { title?: string; firstMessage?: string };
    
    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

    const chat: Chat = {
      id: uuidv4(),
      title: body.title || 'Nueva conversación',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Si hay un primer mensaje, agregarlo al chat
    if (body.firstMessage) {
      const userMessage: Message = {
        id: uuidv4(),
        content: body.firstMessage,
        sender: 'user',
        timestamp: new Date(),
      };

      const systemMessage: Message = {
        id: uuidv4(),
        content: generateSystemResponse(body.firstMessage),
        sender: 'system',
        timestamp: new Date(Date.now() + 1000),
      };

      chat.messages.push(userMessage, systemMessage);
      chat.updatedAt = new Date();
      mockMessages.push(userMessage, systemMessage);
    }

    mockChats.push(chat);

    return HttpResponse.json({ chat });
  }),

  // Obtener chat específico
  http.get('/api/chat/:id', async ({ params }) => {
    const { id } = params;
    
    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

    const chat = mockChats.find(c => c.id === id);
    
    if (!chat) {
      return HttpResponse.json(
        { error: 'Chat no encontrado' },
        { status: 404 }
      );
    }

    return HttpResponse.json({ chat });
  }),

  // Obtener historial de chats
  http.get('/api/chat/history', async () => {
    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

    // Ordenar chats por fecha de actualización (más recientes primero)
    const sortedChats = [...mockChats].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );

    return HttpResponse.json({
      chats: sortedChats,
      total: sortedChats.length,
    });
  }),

  // Buscar en chats
  http.get('/api/chat/search', async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

    if (!query.trim()) {
      return HttpResponse.json({ results: [] });
    }

    const results = mockChats
      .map(chat => {
        const matches = chat.messages
          .filter(message => 
            message.content.toLowerCase().includes(query.toLowerCase())
          )
          .map(message => ({
            messageId: message.id,
            content: message.content,
            snippet: message.content.slice(0, 150) + (message.content.length > 150 ? '...' : ''),
          }));

        return matches.length > 0 ? { chat, matches } : null;
      })
      .filter(Boolean)
      .slice(0, limit);

    return HttpResponse.json({ results });
  }),

  // Eliminar chat
  http.delete('/api/chat/:id', async ({ params }) => {
    const { id } = params;
    
    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

    const chatIndex = mockChats.findIndex(c => c.id === id);
    
    if (chatIndex === -1) {
      return HttpResponse.json(
        { error: 'Chat no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar mensajes del chat
    const chat = mockChats[chatIndex];
    mockMessages = mockMessages.filter(
      message => !chat.messages.some(chatMessage => chatMessage.id === message.id)
    );

    // Eliminar chat
    mockChats.splice(chatIndex, 1);

    return HttpResponse.json({ success: true });
  }),

  // Subir archivo
  http.post('/api/files/upload', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const chatId = formData.get('chatId') as string;
    
    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

    if (!file) {
      return HttpResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      );
    }

    const attachedFile: AttachedFile = {
      id: uuidv4(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: `/uploads/${file.name}`,
      thumbnailUrl: file.type.startsWith('image/') ? `/thumbnails/${file.name}` : undefined,
    };

    return HttpResponse.json({ file: attachedFile });
  }),

  // Descargar archivo
  http.get('/api/files/:id', async ({ params }) => {
    const { id } = params;
    
    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

    // Simular descarga de archivo
    return HttpResponse.json({
      id,
      downloadUrl: `/downloads/${id}`,
      expiresAt: new Date(Date.now() + 3600000), // 1 hora
    });
  }),
];

// Función para inicializar datos de prueba
export function initializeMockData() {
  // Crear algunos chats de ejemplo con las preguntas simplificadas
  const exampleChats: Chat[] = [
    {
      id: uuidv4(),
      title: '¿Cuál es la misión de SOLUTION TECH?',
      messages: [
        {
          id: uuidv4(),
          content: '¿Cuál es la misión de SOLUTION TECH?',
          sender: 'user',
          timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
        },
        {
          id: uuidv4(),
          content: generateSystemResponse('¿Cuál es la misión de SOLUTION TECH?'),
          sender: 'system',
          timestamp: new Date(Date.now() - 3590000),
        },
      ],
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3590000),
    },
    {
      id: uuidv4(),
      title: '¿Cómo puedo mejorar mi estrategia de marketing digital?',
      messages: [
        {
          id: uuidv4(),
          content: '¿Cómo puedo mejorar mi estrategia de marketing digital?',
          sender: 'user',
          timestamp: new Date(Date.now() - 7200000), // 2 horas atrás
        },
        {
          id: uuidv4(),
          content: generateSystemResponse('¿Cómo puedo mejorar mi estrategia de marketing digital?'),
          sender: 'system',
          timestamp: new Date(Date.now() - 7190000),
        },
      ],
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 7190000),
    },
    {
      id: uuidv4(),
      title: '¿Qué tecnologías recomiendan para mi empresa?',
      messages: [
        {
          id: uuidv4(),
          content: '¿Qué tecnologías recomiendan para mi empresa?',
          sender: 'user',
          timestamp: new Date(Date.now() - 10800000), // 3 horas atrás
        },
        {
          id: uuidv4(),
          content: generateSystemResponse('¿Qué tecnologías recomiendan para mi empresa?'),
          sender: 'system',
          timestamp: new Date(Date.now() - 10790000),
        },
      ],
      createdAt: new Date(Date.now() - 10800000),
      updatedAt: new Date(Date.now() - 10790000),
    },
  ];

  mockChats.push(...exampleChats);
  exampleChats.forEach(chat => {
    mockMessages.push(...chat.messages);
  });
}