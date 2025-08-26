import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configurar el service worker para el navegador (solo en el cliente)
export const worker = typeof window !== 'undefined' ? setupWorker(...handlers) : null;

// Función para inicializar MSW en el navegador
export async function initializeMSW() {
  if (typeof window === 'undefined' || !worker) {
    return;
  }

  // Solo inicializar en desarrollo
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MSW_ENABLED === 'true') {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      });
      console.log('🔶 MSW iniciado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar MSW:', error);
    }
  }
}

// Función para detener MSW
export function stopMSW() {
  if (typeof window !== 'undefined' && worker) {
    worker.stop();
    console.log('🔶 MSW detenido');
  }
}