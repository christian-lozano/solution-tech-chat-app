import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Página no encontrada</h2>
          <p className="text-muted-foreground">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
          <Button >
              🏠 Ir al inicio
          </Button>
            </Link>
            {/* <Link href="/">

                <Button variant="outline" onClick={() => window.history.back()}>
                  ← Volver atrás
                </Button>
             </Link> */}

        </div>
        
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            ¿Necesitas ayuda? Inicia una nueva conversación en el chat empresarial.
          </p>
        </div>
      </div>
    </div>
  );
}