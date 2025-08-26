const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Función para copiar el service worker de MSW
function initMSW() {
  try {
    console.log('🔶 Inicializando MSW...');
    
    // Verificar si el archivo ya existe
    const publicDir = path.join(process.cwd(), 'public');
    const swPath = path.join(publicDir, 'mockServiceWorker.js');
    
    if (fs.existsSync(swPath)) {
      console.log('✅ mockServiceWorker.js ya existe');
      return;
    }
    
    // Crear directorio public si no existe
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Ejecutar comando de MSW para copiar el service worker
    execSync('npx msw init public/ --save', { stdio: 'inherit' });
    
    console.log('✅ MSW inicializado correctamente');
  } catch (error) {
    console.error('❌ Error inicializando MSW:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  initMSW();
}

module.exports = { initMSW };