const { setupServer } = require('msw/node');
const { http, HttpResponse } = require('msw');

// Configurar un servidor MSW simple para pruebas
const server = setupServer(
  http.get('/api/test', () => {
    return HttpResponse.json({ 
      message: 'MSW funcionando correctamente',
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  })
);

async function testMSW() {
  console.log('🔶 Iniciando prueba de MSW...');
  
  try {
    // Iniciar el servidor
    server.listen();
    console.log('✅ Servidor MSW iniciado');
    
    // Hacer una petición de prueba
    const response = await fetch('http://localhost/api/test');
    const data = await response.json();
    
    console.log('✅ Respuesta recibida:', data);
    console.log('🎉 MSW está funcionando correctamente!');
    
  } catch (error) {
    console.error('❌ Error en la prueba de MSW:', error.message);
  } finally {
    // Cerrar el servidor
    server.close();
    console.log('🔶 Servidor MSW cerrado');
  }
}

// Ejecutar la prueba
testMSW();