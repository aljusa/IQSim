import React, { useState,  } from 'react';
import { Play, RotateCcw, Factory, Clock, Code, FileText, Activity, BarChart2, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Tipos e Interfaces ---

interface ProductionLog {
  id: number;
  duration: number;
  cumulativeTime: number;
}

interface SimulationStats {
  totalPieces: number;
  totalTime: number;
  timeLeft: number;
  timeDistribution: { duration: number; count: number }[];
  logs: ProductionLog[];
}

type TabId = 'concept' | 'exercise' | 'procedure' | 'code' | 'simulation';

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

// --- Componentes UI Reutilizables ---

const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = "", title }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${className}`}>
    {title && (
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          {title}
        </h3>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code }) => (
  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed text-slate-100 shadow-inner">
    <pre>{code}</pre>
  </div>
);

// --- Lógica de Negocio (Simulación) ---

const SIMULATION_CONSTANTS = {
  MIN_TIME: 8,
  MAX_TIME: 12,
  TOTAL_TIME: 480, // 8 horas * 60 min
};

const runSimulationLogic = (): SimulationStats => {
  let currentTime = 0;
  let pieces = 0;
  const logs: ProductionLog[] = [];
  const distributionMap = new Map<number, number>();
  
  // Inicializar mapa de distribución
  for (let i = SIMULATION_CONSTANTS.MIN_TIME; i <= SIMULATION_CONSTANTS.MAX_TIME; i++) {
    distributionMap.set(i, 0);
  }

  while (true) {
    const duration = Math.floor(Math.random() * (SIMULATION_CONSTANTS.MAX_TIME - SIMULATION_CONSTANTS.MIN_TIME + 1) + SIMULATION_CONSTANTS.MIN_TIME);
    
    if (currentTime + duration > SIMULATION_CONSTANTS.TOTAL_TIME) {
      break;
    }

    currentTime += duration;
    pieces++;
    distributionMap.set(duration, (distributionMap.get(duration) || 0) + 1);
    
    // Guardar solo los últimos 5 para mostrar en log visual simple si fuera necesario, 
    // pero guardamos todo para estadísticas
    logs.push({
      id: pieces,
      duration,
      cumulativeTime: currentTime
    });
  }

  const timeDistribution = Array.from(distributionMap.entries()).map(([duration, count]) => ({
    duration,
    count,
    label: `${duration} min`
  }));

  return {
    totalPieces: pieces,
    totalTime: currentTime,
    timeLeft: SIMULATION_CONSTANTS.TOTAL_TIME - currentTime,
    timeDistribution,
    logs
  };
};

// --- Componentes de Contenido por Pestaña ---

const ContentConcept: React.FC = () => (
  <div className="grid gap-6">
    <div className="grid md:grid-cols-2 gap-6">
      <Card title="¿Qué es la simulación?" className="h-full">
        <p className="text-slate-600 mb-4 leading-relaxed">
          La simulación de procesos productivos es una técnica computacional utilizada para representar el funcionamiento de una fábrica o taller a lo largo del tiempo, sin necesidad de operar físicamente la maquinaria.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Activity size={18} /> Objetivo Principal
          </h4>
          <p className="text-blue-700 text-sm">
            Crear un "gemelo digital" del proceso para experimentar sin riesgos y a bajo costo.
          </p>
        </div>
      </Card>
      
      <Card title="¿Qué permite analizar?" className="h-full">
        <ul className="space-y-3">
          {[
            "Capacidad productiva diaria (Output)",
            "Tiempos totales de operación",
            "Identificación de cuellos de botella",
            "Resiliencia ante fallos o máquinas lentas"
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-600">
              <div className="mt-1 min-w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </div>
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </div>
);

const ContentExercise: React.FC = () => (
  <div className="grid gap-6">
    <Card title="Enunciado del Ejercicio">
      <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
        <div className="space-y-6">
          <p className="text-lg text-slate-700 font-medium">
            Una fábrica produce piezas usando una sola máquina bajo las siguientes condiciones:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center gap-4">
              <Clock className="text-orange-500" size={32} />
              <div>
                <span className="block text-sm text-slate-500 font-semibold uppercase tracking-wider">Tiempo por Pieza</span>
                <span className="text-xl font-bold text-slate-800">8 - 12 minutos</span>
                <span className="block text-xs text-slate-400">(Aleatorio)</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center gap-4">
              <Factory className="text-indigo-500" size={32} />
              <div>
                <span className="block text-sm text-slate-500 font-semibold uppercase tracking-wider">Jornada Laboral</span>
                <span className="text-xl font-bold text-slate-800">8 horas</span>
                <span className="block text-xs text-slate-400">(480 minutos)</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-5 rounded-lg border-l-4 border-indigo-500">
            <h4 className="font-bold text-indigo-900 mb-2">Objetivo de la Simulación</h4>
            <p className="text-indigo-800">Determinar mediante un programa:</p>
            <ul className="list-disc list-inside text-indigo-700 mt-2 space-y-1">
              <li>Cuántas piezas se produjeron en total.</li>
              <li>Cuánto tiempo real estuvo la máquina funcionando.</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

const ContentProcedure: React.FC = () => (
  <div className="grid gap-6">
    <Card title="Algoritmo Paso a Paso">
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {[
          { 
            title: "Generación Aleatoria", 
            desc: "Crear una función que retorne un número entero entre 8 y 12 para simular la variabilidad de cada pieza.",
            icon: <Activity className="text-white" size={20} />,
            color: "bg-blue-500"
          },
          { 
            title: "Ciclo de Producción", 
            desc: "Iniciar un bucle que representa la jornada laboral. En cada iteración, se intenta producir una nueva pieza.",
            icon: <RotateCcw className="text-white" size={20} />,
            color: "bg-purple-500"
          },
          { 
            title: "Verificación de Tiempo", 
            desc: "Antes de contar la pieza, verificar si la suma del tiempo acumulado + el nuevo tiempo excede los 480 minutos.",
            icon: <Clock className="text-white" size={20} />,
            color: "bg-orange-500"
          },
          { 
            title: "Acumulación y Conteo", 
            desc: "Si hay tiempo, sumar la duración al total y aumentar el contador de piezas. Si no, detener el ciclo.",
            icon: <BarChart2 className="text-white" size={20} />,
            color: "bg-emerald-500"
          }
        ].map((step, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 bg-slate-800">
              {step.icon}
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-bold text-slate-900">{step.title}</div>
              </div>
              <div className="text-slate-600 text-sm">
                {step.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const ContentCode: React.FC = () => {
  const pythonCode = `import random

# ---------------------------------------
# Función que genera el tiempo de producción
# ---------------------------------------
def tiempo_produccion_pieza():
    """
    Devuelve un tiempo aleatorio (en minutos)
    entre 8 y 12.
    """
    return random.randint(8, 12)

# ---------------------------------------
# Función principal de simulación
# ---------------------------------------
def simular_proceso_productivo(tiempo_total):
    tiempo_utilizado = 0
    numero_piezas = 0

    # Mientras aún haya tiempo
    while True:
        tiempo_pieza = tiempo_produccion_pieza()

        # Verificamos límite de tiempo
        if tiempo_utilizado + tiempo_pieza > tiempo_total:
            break

        tiempo_utilizado += tiempo_pieza
        numero_piezas += 1

    return numero_piezas, tiempo_utilizado

# ---------------------------------------
# Programa principal
# ---------------------------------------
def main():
    tiempo_jornada = 480  # 8 horas
    piezas, tiempo_usado = simular_proceso_productivo(tiempo_jornada)

    print(f"Piezas producidas: {piezas}")
    print(f"Tiempo total usado: {tiempo_usado} min")
    print(f"Tiempo sin usar: {tiempo_jornada - tiempo_usado} min")

main()`;

  return (
    <div className="grid gap-6">
      <Card title="Implementación en Python">
        <p className="mb-4 text-slate-600">
          El siguiente código implementa la lógica descrita. Es simple, modular y está comentado para facilitar su comprensión por no-programadores.
        </p>
        <CodeBlock code={pythonCode} />
      </Card>
    </div>
  );
};

const ContentSimulation: React.FC = () => {
  const [stats, setStats] = useState<SimulationStats | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    // Pequeño delay artificial para "sentir" el cálculo
    setTimeout(() => {
      const result = runSimulationLogic();
      setStats(result);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="grid gap-6 h-full" style={{ gridTemplateRows: 'auto 1fr' }}>
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Factory className="text-blue-400" />
              Panel de Control
            </h2>
            <p className="text-slate-400 text-sm">Ejecuta la simulación para ver un día de producción aleatorio.</p>
          </div>
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className={`px-6 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2 ${
              isSimulating 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95'
            }`}
          >
            {isSimulating ? <RotateCcw className="animate-spin" /> : <Play fill="currentColor" />}
            {isSimulating ? 'Calculando...' : 'Ejecutar Simulación'}
          </button>
        </div>
      </div>

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Resultados Numéricos */}
          <Card title="Resultados del Día" className="bg-gradient-to-br from-white to-slate-50">
             <div className="grid grid-cols-2 gap-4 h-full content-center">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="text-4xl font-black text-indigo-600 mb-1">{stats.totalPieces}</div>
                  <div className="text-xs uppercase tracking-wider font-bold text-slate-500">Piezas Producidas</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="text-4xl font-black text-emerald-600 mb-1">{stats.totalTime}<span className="text-lg text-slate-400 font-normal">m</span></div>
                  <div className="text-xs uppercase tracking-wider font-bold text-slate-500">Tiempo Utilizado</div>
                </div>
                <div className="col-span-2 bg-slate-100 p-4 rounded-xl flex items-center justify-between border border-slate-200">
                    <span className="text-slate-600 font-medium">Tiempo Libre (Ocioso):</span>
                    <span className="font-mono font-bold text-slate-800">{stats.timeLeft} minutos</span>
                </div>
             </div>
          </Card>

          {/* Gráfico de Distribución */}
          <Card title="Variabilidad del Proceso">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.timeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <RechartsTooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="count" name="Piezas" radius={[4, 4, 0, 0]}>
                    {stats.timeDistribution.map((index) => (
                      <Cell key={`cell-${index["count"]}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444'][index["count"] % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-slate-400 mt-2">
              Distribución de tiempos (8-12 min) en esta simulación específica.
            </p>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[300px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <div className="text-center max-w-md px-6">
            <Activity className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Esperando simulación</h3>
            <p className="text-slate-500 mt-2">Presiona el botón "Ejecutar Simulación" para generar un escenario aleatorio de 8 horas de producción.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Componente Principal (App) ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('concept');

  const tabs: TabConfig[] = [
    { id: 'concept', label: 'Concepto', icon: <Info size={18} /> },
    { id: 'exercise', label: 'Ejercicio', icon: <FileText size={18} /> },
    { id: 'procedure', label: 'Procedimiento', icon: <Activity size={18} /> },
    { id: 'code', label: 'Código Python', icon: <Code size={18} /> },
    { id: 'simulation', label: 'Simulador Interactivo', icon: <Play size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 p-4 md:p-8 flex justify-center items-start">
      {/* Layout Base - Grid Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid" style={{
        gridTemplateAreas: `
          "header"
          "nav"
          "content"
        `,
        gridTemplateRows: 'auto auto 1fr',
        minHeight: '85vh' // Altura mínima para asegurar presencia
      }}>
        
        {/* Area: Header */}
        <header className="bg-slate-900 text-white p-6 md:p-8" style={{ gridArea: 'header' }}>
        
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
            Simulación de Procesos Productivos
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Modelado computacional para análisis de eficiencia y tiempos en entornos de manufactura.
          </p>
        </header>

        {/* Area: Nav (Tabs) */}
        <nav className="bg-slate-50 border-b border-slate-200 px-6 pt-2 overflow-x-auto" style={{ gridArea: 'nav' }}>
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative
                  ${activeTab === tab.id 
                    ? 'text-blue-600' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-t-lg'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Area: Content */}
        <main className="p-6 md:p-8 bg-slate-50/50" style={{ gridArea: 'content' }}>
          <div className="h-full">
            {activeTab === 'concept' && <ContentConcept />}
            {activeTab === 'exercise' && <ContentExercise />}
            {activeTab === 'procedure' && <ContentProcedure />}
            {activeTab === 'code' && <ContentCode />}
            {activeTab === 'simulation' && <ContentSimulation />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;