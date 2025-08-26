// MSW v2 server setup - Temporalmente deshabilitado para evitar problemas de build
// TODO: Revisar configuración de MSW con Turbopack

// import { setupServer } from 'msw/node';
// import { handlers } from './handlers';

// // Configurar el servidor MSW para Node.js (SSR, tests)
// export const server = setupServer(...handlers);

// Función para inicializar MSW en el servidor
export function initializeServerMSW() {
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MSW_ENABLED === 'true') {
    console.log('🔶 MSW Server temporalmente deshabilitado');
  }
}

// Función para detener MSW en el servidor
export function stopServerMSW() {
  console.log('🔶 MSW Server temporalmente deshabilitado');
}