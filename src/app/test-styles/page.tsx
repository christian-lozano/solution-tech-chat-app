export default function TestStyles() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-primary">Test de Estilos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Card 1</h2>
            <p className="text-muted-foreground">Este es un texto de prueba</p>
          </div>
          
          <div className="bg-secondary text-secondary-foreground rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Card 2</h2>
            <p>Texto en card secundaria</p>
          </div>
          
          <div className="bg-accent text-accent-foreground rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Card 3</h2>
            <p>Texto en card accent</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
            Botón Primario
          </button>
          
          <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90 ml-4">
            Botón Destructivo
          </button>
          
          <div className="border border-input rounded-md p-4 bg-background">
            <input 
              type="text" 
              placeholder="Input de prueba"
              className="w-full bg-transparent border-none outline-none"
            />
          </div>
        </div>
        
        <div className="text-sm space-y-2">
          <p className="text-foreground">Texto normal</p>
          <p className="text-muted-foreground">Texto muted</p>
          <p className="text-primary">Texto primario</p>
          <p className="text-destructive">Texto destructivo</p>
        </div>
      </div>
    </div>
  );
}