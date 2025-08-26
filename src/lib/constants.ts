// Constantes de la aplicación
export const APP_CONFIG = {
  name: 'SOLUTION TECH',
  description: 'Chat Empresarial Inteligente',
  version: '1.0.0',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  mswEnabled: process.env.NEXT_PUBLIC_MSW_ENABLED === 'true',
} as const;
export const FILE_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10 MB
};
// Endpoints de API
export const API_ENDPOINTS = {
  chat: {
    send: '/api/chat/send',
    create: '/api/chat/create',
    get: (id: string) => `/api/chat/${id}`,
    delete: (id: string) => `/api/chat/${id}`,
    history: '/api/chat/history',
    search: '/api/chat/search',
  },
  files: {
    upload: '/api/files/upload',
    download: (id: string) => `/api/files/${id}`,
  },
} as const;

// Configuración de React Query
export const QUERY_KEYS = {
  chatHistory: ['chatHistory'] as const,
  chat: (id: string) => ['chat', id] as const,
  searchChats: (query: string) => ['searchChats', query] as const,
} as const;

export const QUERY_CONFIG = {
  staleTime: 1 * 60 * 1000, // 1 minuto
  cacheTime: 5 * 60 * 1000, // 5 minutos
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(500 * 2 ** attemptIndex, 5000),
} as const;

// Configuración de localStorage
export const STORAGE_KEYS = {
  chats: 'solution-tech-chat-chats',
  preferences: 'solution-tech-chat-preferences',
  lastChatId: 'solution-tech-chat-last-id',
} as const;

// Configuración de MSW
export const MSW_CONFIG = {
  delay: {
    min: 500,
    max: 2000,
  },
  errorRate: 0.1, // 10% de probabilidad de error
} as const;

// Mensajes de error
export const ERROR_MESSAGES = {
  network: 'Error de conexión. Por favor, inténtalo de nuevo.',
  fileSize: 'El archivo es demasiado grande. Máximo 10MB.',
  fileType: 'Tipo de archivo no soportado.',
  messageEmpty: 'El mensaje no puede estar vacío.',
  messageTooLong: 'El mensaje es demasiado largo.',
  chatNotFound: 'Conversación no encontrada.',
  generic: 'Ha ocurrido un error inesperado.',
} as const;

// Configuración de UI
export const UI_CONFIG = {
  debounceDelay: 150,
  animationDuration: 150,
  maxVisibleMessages: 100,
  chatTitleMaxLength: 50,
} as const;

// Temas
export const THEMES = {
  light: 'light',
  dark: 'dark',
} as const;

// Idiomas soportados
export const SUPPORTED_LANGUAGES = {
  es: 'Español',
  en: 'English',
} as const;

// Preguntas predeterminadas organizadas por categorías
export const SUGGESTED_QUESTIONS = {
  business: [
    {
      id: 'business-strategy',
      title: 'Estrategia Empresarial',
      questions: [
        '¿Cómo puedo desarrollar una estrategia de crecimiento para mi empresa?',
        '¿Cuáles son las mejores prácticas para la planificación estratégica?',
        '¿Cómo puedo identificar nuevas oportunidades de mercado?',
        '¿Qué herramientas de análisis estratégico recomiendas?',
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing y Ventas',
      questions: [
        '¿Cómo puedo mejorar mi estrategia de marketing digital?',
        '¿Cuáles son las tendencias actuales en marketing de contenidos?',
        '¿Cómo puedo aumentar las conversiones en mi sitio web?',
        '¿Qué estrategias de SEO son más efectivas en 2024?',
      ]
    },
    {
      id: 'operations',
      title: 'Operaciones y Productividad',
      questions: [
        '¿Cómo puedo optimizar los procesos internos de mi empresa?',
        '¿Qué herramientas de gestión de proyectos recomiendas?',
        '¿Cómo puedo mejorar la eficiencia del equipo?',
        '¿Cuáles son las mejores prácticas para la gestión de inventarios?',
      ]
    }
  ],
  technology: [
    {
      id: 'digital-transformation',
      title: 'Transformación Digital',
      questions: [
        '¿Por dónde empezar la transformación digital de mi empresa?',
        '¿Qué tecnologías emergentes debería considerar?',
        '¿Cómo puedo implementar la automatización en mi negocio?',
        '¿Cuáles son los beneficios de la nube para mi empresa?',
      ]
    },
    {
      id: 'cybersecurity',
      title: 'Ciberseguridad',
      questions: [
        '¿Cómo puedo proteger mi empresa de amenazas cibernéticas?',
        '¿Qué medidas de seguridad básicas debo implementar?',
        '¿Cómo puedo crear una política de seguridad efectiva?',
        '¿Qué hacer en caso de un ataque de ransomware?',
      ]
    }
  ],
  finance: [
    {
      id: 'financial-planning',
      title: 'Planificación Financiera',
      questions: [
        '¿Cómo puedo mejorar la gestión financiera de mi empresa?',
        '¿Qué indicadores financieros son más importantes?',
        '¿Cómo puedo optimizar el flujo de caja?',
        '¿Qué estrategias de financiamiento recomiendas?',
      ]
    },
    {
      id: 'investment',
      title: 'Inversión y Crecimiento',
      questions: [
        '¿En qué áreas debería invertir para el crecimiento?',
        '¿Cómo puedo evaluar la rentabilidad de un proyecto?',
        '¿Qué criterios usar para tomar decisiones de inversión?',
        '¿Cómo puedo atraer inversores para mi empresa?',
      ]
    }
  ],
  leadership: [
    {
      id: 'team-management',
      title: 'Gestión de Equipos',
      questions: [
        '¿Cómo puedo mejorar el liderazgo de mi equipo?',
        '¿Qué estrategias usar para motivar a los empleados?',
        '¿Cómo puedo resolver conflictos en el equipo?',
        '¿Qué hacer para retener talento en mi empresa?',
      ]
    },
    {
      id: 'communication',
      title: 'Comunicación Efectiva',
      questions: [
        '¿Cómo puedo mejorar la comunicación interna?',
        '¿Qué técnicas usar para presentaciones exitosas?',
        '¿Cómo puedo dar feedback constructivo?',
        '¿Qué hacer para mejorar las reuniones de equipo?',
      ]
    }
  ],
  innovation: [
    {
      id: 'product-development',
      title: 'Desarrollo de Productos',
      questions: [
        '¿Cómo puedo innovar en mis productos o servicios?',
        '¿Qué metodologías usar para el desarrollo de productos?',
        '¿Cómo puedo validar ideas antes de implementarlas?',
        '¿Qué hacer para diferenciarme de la competencia?',
      ]
    },
    {
      id: 'customer-experience',
      title: 'Experiencia del Cliente',
      questions: [
        '¿Cómo puedo mejorar la experiencia del cliente?',
        '¿Qué estrategias usar para aumentar la satisfacción?',
        '¿Cómo puedo medir la satisfacción del cliente?',
        '¿Qué hacer para fidelizar a mis clientes?',
      ]
    }
  ]
} as const;

// Mensajes del sistema
export const SYSTEM_MESSAGES = {
  welcome: 'Bienvenido a SOLUTION TECH',
  subtitle: 'Inicia una nueva conversación para obtener ayuda con tus consultas empresariales',
  placeholder: 'Escribe tu pregunta o consulta...',
  loading: 'Iniciando conversación...',
  send: 'Iniciar conversación',
  keyboardHint: 'Presiona Enter para enviar • Shift + Enter para nueva línea',
  loadingConversation: 'Cargando conversación...',
  loadingApp: 'Cargando aplicación...',
  conversationNotFound: 'Conversación no encontrada',
  conversationNotFoundDesc: 'La conversación que buscas no existe o ha sido eliminada.',
  newConversation: 'Nueva conversación',
  back: 'Volver',
} as const;

// Configuración de la aplicación
export const APP_SETTINGS = {
  maxMessageLength: 1000,
  maxTitleLength: 50,
  chatHistoryLimit: 100,
  autoSaveInterval: 30000, // 30 segundos
} as const;

// Tipos de archivos permitidos
export const ALLOWED_FILE_TYPES = {
  images: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  documents: ['.pdf', '.doc', '.docx', '.txt'],
  spreadsheets: ['.xls', '.xlsx', '.csv'],
  presentations: ['.ppt', '.pptx'],
} as const;

// Límites de archivos
export const FILE_LIMITS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
} as const;