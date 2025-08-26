'use client';

import { useEffect, useState } from 'react';
import { initializeMSW, initializeMockData } from '@/mocks';

interface MSWProviderProps {
  children: React.ReactNode;
}

export function MSWProvider({ children }: MSWProviderProps) {
  const [isMSWReady, setIsMSWReady] = useState(false);

  useEffect(() => {
    async function initMSW() {
      // Solo inicializar en desarrollo y si está habilitado
      if (
        process.env.NODE_ENV === 'development' && 
        process.env.NEXT_PUBLIC_MSW_ENABLED === 'true'
      ) {
        try {
          // Timeout de 5 segundos para MSW
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('MSW timeout')), 5000)
          );
          
          await Promise.race([
            initializeMSW(),
            timeoutPromise
          ]);
          
          initializeMockData();
          setIsMSWReady(true);
          console.log('✅ MSW inicializado correctamente');
        } catch (error) {
          console.warn('⚠️ MSW no se pudo inicializar, continuando sin mocks:', error);
          setIsMSWReady(true); // Continuar aunque falle MSW
        }
      } else {
        setIsMSWReady(true);
      }
    }

    initMSW();
  }, []);

  // No bloquear la UI mientras MSW se inicializa
  // if (
  //   process.env.NODE_ENV === 'development' && 
  //   process.env.NEXT_PUBLIC_MSW_ENABLED === 'true' && 
  //   !isMSWReady
  // ) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center space-y-4">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
  //         <p className="text-muted-foreground">Inicializando servicios de desarrollo...</p>
  //         <button 
  //           onClick={() => setIsMSWReady(true)}
  //           className="text-sm text-primary hover:underline"
  //         >
  //           Continuar sin servicios de desarrollo
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return <>{children}</>;
}