import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,  ResponsiveContainer, Cell } from 'recharts';
import { Factory, AlertTriangle, CheckCircle, Activity, Code, Play } from 'lucide-react';

// --- Tipos e Interfaces ---

type TabId = 'concepto' | 'ejercicio' | 'codigo' | 'simulacion';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

interface SimulationPiece {
  id: number;
  isDefective: boolean;
}

interface SimulationStats {
  total: number;
  good: number;
  defective: number;
  defectiveRate: number;
}

// --- Configuración y Constantes ---

const TABS: Tab[] = [
  { id: 'concepto', label: 'Concepto', icon: <Activity className="w-4 h-4" /> },
  { id: 'ejercicio', label: 'Enunciado', icon: <Factory className="w-4 h-4" /> },
  { id: 'codigo', label: 'Lógica Python', icon: <Code className="w-4 h-4" /> },
  { id: 'simulacion', label: 'Simulación Interactiva', icon: <Play className="w-4 h-4" /> },
];

// --- Componentes UI Base ---

const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = "", title }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {title && (
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
        <h3 className="font-semibold text-slate-700">{title}</h3>
      </div>
    )}
    <div className="p-4 h-full">
      {children}
    </div>
  </div>
);

const LessonLayout: React.FC<{
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  title: string;
  children: React.ReactNode;
}> = ({ activeTab, onTabChange, title, children }) => {
  return (
    <div className="h-screen w-full bg-slate-50 text-slate-800 font-sans grid grid-rows-[auto_1fr] overflow-hidden">
      {/* Header Area */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 grid grid-cols-[auto_1fr] gap-8 items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Factory className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="grid grid-flow-col auto-cols-max gap-2 justify-self-end">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                ${activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content Grid */}
      <main className="p-6 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

// --- Componentes de Contenido Específico ---

const ConceptView = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
    <div className="grid grid-rows-[auto_1fr] gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Entendiendo la variabilidad en la producción.</h2>
       
      </div>
      <Card>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg leading-relaxed">
            La simulación de procesos de calidad se utiliza para analizar matemáticamente la 
            <strong> variabilidad</strong> y los <strong>defectos</strong> en un entorno productivo controlado.
          </p>
          <ul className="grid gap-2 mt-4">
            <li className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
              <strong>¿Qué tan bueno es el proceso?</strong> Medición de eficiencia.
            </li>
            <li className="bg-indigo-50 p-3 rounded-md border-l-4 border-indigo-500">
              <strong>¿Cuántos productos salen defectuosos?</strong> Predicción de pérdidas.
            </li>
            <li className="bg-emerald-50 p-3 rounded-md border-l-4 border-emerald-500">
              <strong>¿Cumplimos el estándar?</strong> Validación de calidad.
            </li>
          </ul>
        </div>
      </Card>
    </div>
    <Card title="Representación Visual" className="bg-slate-100 flex items-center justify-center">
      <div className="text-center">
        <Activity className="w-24 h-24 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 italic">"En la vida real, no todos los productos salen perfectos,<br/>y la simulación ayuda a medir ese comportamiento."</p>
      </div>
    </Card>
  </div>
);

const ExerciseView = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
    <div className="lg:col-span-1 grid grid-rows-[auto_1fr] gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Enunciado del Ejercicio</h2>
        <p className="text-slate-600">Una fábrica produce 100 piezas en un día.
<br />
Cada pieza tiene una probabilidad del 10% de salir defectuosa.
<br />
Se desea simular el proceso de calidad para conocer:
<ul>
    <li>Cuántas piezas son buenas
</li>
    <li>Cuántas piezas son defectuosas
</li>
    <li>El porcentaje real de defectos</li>
    
</ul>


</p>
      </div>
      <Card className="bg-white">
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Producción Total</h4>
            <p className="text-3xl font-bold text-blue-600">100 <span className="text-lg font-normal text-slate-600">piezas/día</span></p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Probabilidad de Fallo</h4>
            <p className="text-3xl font-bold text-red-500">10% <span className="text-lg font-normal text-slate-600">defectuosas</span></p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-semibold mb-2">Objetivos:</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Contar piezas buenas.</li>
              <li>Contar piezas defectuosas.</li>
              <li>Calcular porcentaje real de defectos.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
    
    <div className="lg:col-span-2">
      <Card title="Contexto de Fábrica" className="h-full bg-gradient-to-br from-slate-50 to-slate-100 grid place-items-center">
        <div className="grid grid-cols-2 gap-8 p-8 max-w-md w-full">
           <div className="aspect-square bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
              <span className="font-medium text-slate-600">Pieza Buena</span>
              <span className="text-xs text-slate-400">90% Probabilidad</span>
           </div>
           <div className="aspect-square bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2">
              <AlertTriangle className="w-12 h-12 text-red-500" />
              <span className="font-medium text-slate-600">Defectuosa</span>
              <span className="text-xs text-slate-400">10% Probabilidad</span>
           </div>
        </div>
      </Card>
    </div>
  </div>
);

const CodeView = () => (
  <div className="grid grid-rows-[auto_1fr] gap-4 h-full overflow-hidden">
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Lógica de Programación</h2>
      <p className="text-slate-600">Implementación del algoritmo en Python.</p>
    </div>
    <Card className="bg-[#1e1e1e] text-blue-300 font-mono text-sm overflow-auto border-slate-800 shadow-xl">
      <pre className="p-4">
{`import random

# ---------------------------------------
# Función que determina si una pieza es defectuosa
# ---------------------------------------
def es_defectuosa(probabilidad_defecto):
    """
    Devuelve True si la pieza es defectuosa,
    False si la pieza es buena.
    """
    numero_aleatorio = random.random()  # número entre 0 y 1
    return numero_aleatorio < probabilidad_defecto

# ---------------------------------------
# Función que simula el proceso de calidad
# ---------------------------------------
def simular_control_calidad(total_piezas, probabilidad_defecto):
    """
    Simula el control de calidad de un lote de piezas.
    """
    piezas_buenas = 0
    piezas_defectuosas = 0

    for _ in range(total_piezas):
        if es_defectuosa(probabilidad_defecto):
            piezas_defectuosas += 1
        else:
            piezas_buenas += 1

    return piezas_buenas, piezas_defectuosas

# ---------------------------------------
# Programa principal
# ---------------------------------------
def main():
    total_piezas = 100
    probabilidad_defecto = 0.10  # 10%

    buenas, defectuosas = simular_control_calidad(
        total_piezas,
        probabilidad_defecto
    )
    
    print(f"Piezas buenas: {buenas}")
    print(f"Piezas defectuosas: {defectuosas}")
    print(f"Porcentaje: {(defectuosas / total_piezas) * 100:.2f}%")`}
      </pre>
    </Card>
  </div>
);

const SimulationView = () => {
  const [pieces, setPieces] = useState<SimulationPiece[]>([]);
  const [stats, setStats] = useState<SimulationStats | null>(null);

  const runSimulation = () => {
    const totalPiezas = 100;
    const probabilidadDefecto = 0.10;
    const newPieces: SimulationPiece[] = [];
    let buenas = 0;
    let defectuosas = 0;

    for (let i = 0; i < totalPiezas; i++) {
      // Math.random() es el equivalente a random.random() de Python
      const isDefective = Math.random() < probabilidadDefecto;
      
      if (isDefective) defectuosas++;
      else buenas++;

      newPieces.push({ id: i, isDefective });
    }

    setPieces(newPieces);
    setStats({
      total: totalPiezas,
      good: buenas,
      defective: defectuosas,
      defectiveRate: (defectuosas / totalPiezas) * 100
    });
  };

  const chartData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Buenas', value: stats.good, fill: '#10b981' }, // Emerald-500
      { name: 'Defectuosas', value: stats.defective, fill: '#ef4444' }, // Red-500
    ];
  }, [stats]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-y-auto">
      {/* Panel de Control y Estadísticas */}
      <section className="lg:col-span-4 grid grid-rows-[auto_auto_1fr] gap-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 mb-2">Simulador</h2>
           <p className="text-slate-600">Ejecuta el proceso para ver la variabilidad.</p>
        </div>

        <Card title="Panel de Control">
          <div className="flex flex-col gap-4">
            <button
              onClick={runSimulation}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Generar Lote (100 Piezas)
            </button>
            
            {stats && (
              <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-emerald-50 rounded border border-emerald-100">
                     <div className="text-sm text-emerald-700 font-medium">Buenas</div>
                     <div className="text-2xl font-bold text-emerald-800">{stats.good}</div>
                   </div>
                   <div className="p-3 bg-red-50 rounded border border-red-100">
                     <div className="text-sm text-red-700 font-medium">Defectuosas</div>
                     <div className="text-2xl font-bold text-red-800">{stats.defective}</div>
                   </div>
                </div>
                <div className="p-3 bg-slate-100 rounded border border-slate-200">
                     <div className="text-sm text-slate-600 font-medium">Tasa de Defectos Real</div>
                     <div className="text-2xl font-bold text-slate-800">{stats.defectiveRate.toFixed(1)}%</div>
                     <div className="text-xs text-slate-500 mt-1">Esperado: 10%</div>
                </div>
              </div>
            )}
            
            {!stats && (
              <div className="p-4 text-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                Presiona el botón para iniciar la simulación
              </div>
            )}
          </div>
        </Card>

        {stats && (
            <Card title="Gráfica de Resultados" className="min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        )}
      </section>

      {/* Visualización de la Matriz de Producción */}
      <section className="lg:col-span-8 h-full min-h-[400px]">
        <Card title="Visualización del Lote (100 Piezas)" className="h-full flex flex-col">
            <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100 p-4 overflow-y-auto">
                {pieces.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Factory className="w-16 h-16 mb-4 opacity-20" />
                        <p>La línea de producción está detenida.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-10 gap-2 auto-rows-min">
                        {pieces.map((piece) => (
                            <div 
                                key={piece.id}
                                className={`
                                    aspect-square rounded-md flex items-center justify-center text-xs font-bold text-white shadow-sm transition-all duration-500
                                    ${piece.isDefective ? 'bg-red-500 scale-90' : 'bg-emerald-400'}
                                    hover:scale-110 cursor-default
                                `}
                                title={`Pieza #${piece.id + 1}: ${piece.isDefective ? 'Defectuosa' : 'Buena'}`}
                            >
                                {piece.isDefective ? 'X' : ''}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-sm"></div>
                    <span>Pieza Correcta</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                    <span>Defecto Detectado</span>
                </div>
            </div>
        </Card>
      </section>
    </div>
  );
};

// --- Componente Principal ---

export default function QualitySimulationApp() {
  const [activeTab, setActiveTab] = useState<TabId>('concepto');

  const renderContent = () => {
    switch (activeTab) {
      case 'concepto': return <ConceptView />;
      case 'ejercicio': return <ExerciseView />;
      case 'codigo': return <CodeView />;
      case 'simulacion': return <SimulationView />;
      default: return <ConceptView />;
    }
  };

  return (
    <LessonLayout 
      title="Simulación de procesos de calidad" 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </LessonLayout>
  );
}