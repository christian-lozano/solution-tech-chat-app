# 🛠️ Guía de Desarrollo - SOLUTION TECH

## 📋 Índice

- [🚀 Configuración del Entorno](#-configuración-del-entorno)
- [📝 Convenciones de Código](#-convenciones-de-código)
- [🎨 Patrones de Componentes](#-patrones-de-componentes)
- [🎣 Hooks Personalizados](#-hooks-personalizados)
- [🔧 Configuración de Herramientas](#-configuración-de-herramientas)
- [🧪 Testing](#-testing)
- [🐛 Debugging](#-debugging)
- [📦 Build y Deploy](#-build-y-deploy)
- [🤝 Workflow de Git](#-workflow-de-git)

## 🚀 Configuración del Entorno

### 📋 Prerrequisitos

```bash
# Versiones requeridas
Node.js >= 18.0.0
pnpm >= 8.0.0 (recomendado)
Git >= 2.30.0
```

### 🔧 Configuración Inicial

1. **Clonar y configurar**
   ```bash
   git clone <repository-url>
   cd solution-tech-chat-app
   pnpm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```

3. **Configurar pre-commit hooks**
   ```bash
   pnpm husky:install
   ```

4. **Inicializar MSW**
   ```bash
   pnpm msw:init
   ```

### 🛠️ Scripts de Desarrollo

```bash
# Desarrollo
pnpm dev              # Servidor de desarrollo
pnpm build            # Build de producción
pnpm start            # Servidor de producción
pnpm lint             # Linting
pnpm lint:fix         # Linting con auto-fix
pnpm type-check       # Verificación de tipos

# Testing
pnpm test             # Tests unitarios
pnpm test:watch       # Tests en modo watch
pnpm test:coverage    # Tests con cobertura
pnpm test:e2e         # Tests end-to-end

# Utilidades
pnpm msw:init         # Inicializar MSW
pnpm msw:test         # Probar MSW
pnpm clear-storage    # Limpiar localStorage
pnpm format           # Formatear código
```

## 📝 Convenciones de Código

### 🏷️ Nomenclatura

#### 📁 Archivos y Carpetas
```typescript
// Componentes: PascalCase
ChatInterface.tsx
MessageList.tsx
NewChat.tsx

// Hooks: camelCase
useChat.ts
useLocalStorage.ts
useErrorHandler.ts

// Utilidades: camelCase
api.ts
utils.ts
validation.ts

// Tipos: PascalCase
types.ts
interfaces.ts
```

#### 🔤 Variables y Funciones
```typescript
// Variables: camelCase
const userName = 'John';
const isAuthenticated = true;
const chatMessages = [];

// Funciones: camelCase
function sendMessage() {}
function handleUserInput() {}
function validateForm() {}

// Constantes: UPPER_SNAKE_CASE
const API_ENDPOINTS = {};
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const DEFAULT_TIMEOUT = 5000;

// Tipos e interfaces: PascalCase
interface ChatMessage {}
type MessageStatus = 'sent' | 'delivered' | 'read';
```

### 📐 Estructura de Archivos

#### 🎯 Orden de Imports
```typescript
// 1. Imports de React y librerías externas
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Imports de componentes UI
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 3. Imports de componentes locales
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

// 4. Imports de hooks personalizados
import { useChat } from '@/hooks/useChat';

// 5. Imports de utilidades y tipos
import { formatMessage } from '@/utils/text';
import type { Message } from '@/types/chat';

// 6. Imports de constantes
import { API_ENDPOINTS } from '@/lib/constants';
```

#### 📋 Estructura de Componentes
```typescript
// 1. Imports
import React from 'react';

// 2. Tipos e interfaces
interface ComponentProps {
  // Props del componente
}

// 3. Constantes
const CONSTANTS = {
  // Constantes específicas del componente
};

// 4. Componente principal
export function Component({ prop1, prop2 }: ComponentProps) {
  // 5. Hooks
  const [state, setState] = useState();
  
  // 6. Handlers
  const handleClick = () => {
    // Lógica del handler
  };
  
  // 7. Effects
  useEffect(() => {
    // Lógica del effect
  }, []);
  
  // 8. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 9. Hooks personalizados (si los hay)
function useCustomHook() {
  // Lógica del hook
}
```

### 🎨 Estilos y CSS

#### 🎯 Clases de Tailwind
```typescript
// Orden recomendado de clases
className="
  // Layout
  flex items-center justify-between
  
  // Spacing
  p-4 m-2 gap-2
  
  // Sizing
  w-full h-10 min-h-[100px]
  
  // Typography
  text-sm font-medium text-gray-900
  
  // Colors
  bg-white border border-gray-200
  
  // Effects
  shadow-sm hover:shadow-md
  
  // Transitions
  transition-all duration-200
  
  // Responsive
  md:flex-row lg:text-lg
  
  // States
  disabled:opacity-50 focus:ring-2
"
```

#### 🎨 Componentes de UI
```typescript
// Usar componentes de ShadCN/UI cuando sea posible
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Para estilos personalizados, usar cn() utility
import { cn } from '@/lib/utils';

const customClass = cn(
  'base-classes',
  'conditional-classes',
  className // Props de className
);
```

## 🎨 Patrones de Componentes

### 🏗️ Componente Presentacional
```typescript
interface MessageProps {
  message: Message;
  onDelete?: (id: string) => void;
  className?: string;
}

export function Message({ message, onDelete, className }: MessageProps) {
  return (
    <div className={cn('message-container', className)}>
      <p className="message-content">{message.content}</p>
      {onDelete && (
        <button 
          onClick={() => onDelete(message.id)}
          className="delete-button"
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
```

### 🎭 Componente Contenedor
```typescript
interface ChatContainerProps {
  chatId: string;
}

export function ChatContainer({ chatId }: ChatContainerProps) {
  const { messages, isLoading, sendMessage } = useChat(chatId);
  const { handleDelete } = useDeleteMessage();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="chat-container">
      <MessageList 
        messages={messages}
        onDelete={handleDelete}
      />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
```

### 🎯 Componente con Render Props
```typescript
interface DataRendererProps<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  children: (data: T) => React.ReactNode;
  fallback?: React.ReactNode;
}

export function DataRenderer<T>({ 
  data, 
  isLoading, 
  error, 
  children, 
  fallback 
}: DataRendererProps<T>) {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return fallback || <EmptyState />;
  
  return <>{children(data)}</>;
}
```

## 🎣 Hooks Personalizados

### 📋 Estructura de Hooks
```typescript
// 1. Imports
import { useState, useEffect, useCallback } from 'react';

// 2. Tipos
interface UseHookReturn {
  data: any;
  isLoading: boolean;
  error: Error | null;
  actions: {
    // Acciones del hook
  };
}

// 3. Hook principal
export function useCustomHook(params: any): UseHookReturn {
  // 4. Estado local
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 5. Funciones auxiliares
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await api.fetchData(params);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  // 6. Effects
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 7. Return
  return {
    data,
    isLoading,
    error,
    actions: {
      refetch: fetchData,
      // Otras acciones
    }
  };
}
```

### 🎯 Ejemplos de Hooks

#### Hook para Chat
```typescript
export function useChat(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    try {
      const newMessage = await api.sendMessage(chatId, content);
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await api.deleteMessage(chatId, messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }, [chatId]);

  return {
    messages,
    isLoading,
    sendMessage,
    deleteMessage
  };
}
```

#### Hook para Local Storage
```typescript
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}
```

## 🔧 Configuración de Herramientas

### 📝 ESLint
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-console": "warn"
  }
}
```

### 🎨 Prettier
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### 🔍 TypeScript
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 🧪 Testing

### 📋 Configuración de Tests
```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
};
```

### 🎯 Tests de Componentes
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageInput } from './MessageInput';

describe('MessageInput', () => {
  it('should send message when form is submitted', async () => {
    const mockOnSend = jest.fn();
    render(<MessageInput onSend={mockOnSend} />);

    const input = screen.getByPlaceholderText('Type a message');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    expect(mockOnSend).toHaveBeenCalledWith('Hello');
  });

  it('should not send empty messages', () => {
    const mockOnSend = jest.fn();
    render(<MessageInput onSend={mockOnSend} />);

    const sendButton = screen.getByText('Send');
    fireEvent.click(sendButton);

    expect(mockOnSend).not.toHaveBeenCalled();
  });
});
```

### 🎣 Tests de Hooks
```typescript
import { renderHook, act } from '@testing-library/react';
import { useChat } from './useChat';

describe('useChat', () => {
  it('should send message successfully', async () => {
    const { result } = renderHook(() => useChat('chat-1'));

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Hello');
  });
});
```

## 🐛 Debugging

### 🔍 Herramientas de Debugging

1. **React DevTools**
   ```bash
   # Instalar extensión del navegador
   # Chrome: React Developer Tools
   # Firefox: React Developer Tools
   ```

2. **Redux DevTools** (si usas Redux)
   ```bash
   # Instalar extensión del navegador
   # Chrome: Redux DevTools
   ```

3. **Network Tab**
   ```javascript
   // Monitorear llamadas a API
   console.log('API Call:', { url, method, data });
   ```

### 📝 Logging
```typescript
// Logger personalizado
const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  }
};

// Uso
logger.info('User logged in', { userId: 123 });
logger.error('Failed to send message', error);
```

### 🐛 Debugging de Errores
```typescript
// Error Boundary personalizado
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Enviar a servicio de monitoreo
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

## 📦 Build y Deploy

### 🏗️ Build de Producción
```bash
# Build optimizado
pnpm build

# Analizar bundle
pnpm analyze

# Build con diferentes configuraciones
NODE_ENV=production pnpm build
```

### 🐳 Docker
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Dependencias
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Producción
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production

CMD ["node", "server.js"]
```

### 🚀 Deploy en Vercel
```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "env": {
    "NEXT_PUBLIC_APP_NAME": "SOLUTION TECH"
  }
}
```

## 🤝 Workflow de Git

### 🌿 Estrategia de Ramas
```bash
# Rama principal
main          # Código de producción
develop       # Código de desarrollo

# Ramas de feature
feature/chat-interface
feature/file-upload
feature/user-authentication

# Ramas de hotfix
hotfix/critical-bug
hotfix/security-patch

# Ramas de release
release/v1.2.0
release/v1.3.0
```

### 📝 Convenciones de Commits
```bash
# Formato: <tipo>(<alcance>): <descripción>

# Tipos
feat:     Nueva funcionalidad
fix:      Corrección de bug
docs:     Documentación
style:    Formato de código
refactor: Refactorización
test:     Tests
chore:    Tareas de mantenimiento

# Ejemplos
feat(chat): add message deletion functionality
fix(ui): resolve button alignment issue
docs(readme): update installation instructions
style(components): format code with prettier
refactor(hooks): simplify useChat hook
test(components): add MessageInput tests
chore(deps): update dependencies
```

### 🔄 Pull Request Workflow
```bash
# 1. Crear rama de feature
git checkout -b feature/new-feature

# 2. Hacer cambios y commits
git add .
git commit -m "feat: add new feature"

# 3. Push a rama remota
git push origin feature/new-feature

# 4. Crear Pull Request
# - Título descriptivo
# - Descripción detallada
# - Checklist de cambios
# - Screenshots si aplica

# 5. Code Review
# - Revisar código
# - Aprobar cambios
# - Solicitar modificaciones si es necesario

# 6. Merge
# - Squash commits
# - Delete branch
```

### 📋 Checklist de PR
- [ ] Código sigue las convenciones del proyecto
- [ ] Tests pasan correctamente
- [ ] Documentación actualizada
- [ ] No hay errores de linting
- [ ] Funcionalidad probada manualmente
- [ ] Responsive design verificado
- [ ] Accesibilidad verificada
- [ ] Performance impact evaluado

---

## 📚 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query)
- [Testing Library Documentation](https://testing-library.com/)

