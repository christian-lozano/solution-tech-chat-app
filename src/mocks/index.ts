// Exportar handlers
export { handlers, initializeMockData } from './handlers';

// Exportar configuración del navegador
export { worker, initializeMSW, stopMSW } from './browser';

// Exportar configuración del servidor
export { initializeServerMSW, stopServerMSW } from './server';