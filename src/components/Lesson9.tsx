import React, { useState, } from 'react';
import { 
  Truck, 
  Clock, 
   
  Play, 
  RotateCcw, 
  Code as CodeIcon, 
  BookOpen, 
  Activity, 
  FileText 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// --- TIPOS Y INTERFACES ---

type TabID = 'concept' | 'exercise' | 'procedure' | 'code' | 'simulation';

interface TabConfig {
  id: TabID;
  label: string;
  icon: React.ReactNode;
}

interface SimulationResult {
  tripId: number;
  duration: number;
  cumulativeTime: number;
}

interface SimulationStats {
  totalTrips: number;
  totalTimeUsed: number;
  timeLeft: number;
  isFinished: boolean;
}

// --- COMPONENTES UI (CSS GRID BASED) ---

const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = "", title }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {title && (
      <div className="bg-slate-50 border-b border-slate-100 p-4">
        <h3 className="font-bold text-slate-700">{title}</h3>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

// --- COMPONENTE DE NAVEGACIÓN (TABS) ---

const TabNavigation: React.FC<{ activeTab: TabID; onTabChange: (id: TabID) => void }> = ({ activeTab, onTabChange }) => {
  const tabs: TabConfig[] = [
    { id: 'concept', label: 'Concepto', icon: <BookOpen size={18} /> },
    { id: 'exercise', label: 'Ejercicio', icon: <FileText size={18} /> },
    { id: 'procedure', label: 'Procedimiento', icon: <Activity size={18} /> },
    { id: 'code', label: 'Código Python', icon: <CodeIcon size={18} /> },
    { id: 'simulation', label: 'Simulador Interactivo', icon: <Play size={18} /> },
  ];

  return (
    <nav className="w-full bg-slate-800 text-white shadow-md">
      {/* Grid para la navegación: 5 columnas iguales */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-1 max-w-6xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-4 px-2 flex flex-col md:flex-row items-center justify-center gap-2 transition-colors duration-200
              hover:bg-slate-700 focus:outline-none
              ${activeTab === tab.id ? 'bg-slate-600 border-b-4 border-blue-400 font-semibold' : 'text-slate-400'}
            `}
          >
            {tab.icon}
            <span className="text-sm md:text-base">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// --- LOGICA DE SIMULACIÓN (PORT DE PYTHON A TS) ---

const useSimulation = () => {
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [stats, setStats] = useState<SimulationStats>({ 
    totalTrips: 0, 
    totalTimeUsed: 0, 
    timeLeft: 480,
    isFinished: false 
  });

  const runSimulation = () => {
    const WORK_DAY_MINUTES = 480;
    let timeUsed = 0;
    let tripCount = 0;
    const newResults: SimulationResult[] = [];

    // Lógica idéntica al Python: while True
    while (true) {
      // random.randint(30, 50)
      const duration = Math.floor(Math.random() * (50 - 30 + 1) + 30);

      if (timeUsed + duration > WORK_DAY_MINUTES) {
        break;
      }

      timeUsed += duration;
      tripCount += 1;

      newResults.push({
        tripId: tripCount,
        duration: duration,
        cumulativeTime: timeUsed
      });
    }

    setResults(newResults);
    setStats({
      totalTrips: tripCount,
      totalTimeUsed: timeUsed,
      timeLeft: WORK_DAY_MINUTES - timeUsed,
      isFinished: true
    });
  };

  const reset = () => {
    setResults([]);
    setStats({ totalTrips: 0, totalTimeUsed: 0, timeLeft: 480, isFinished: false });
  };

  return { results, stats, runSimulation, reset };
};

// --- PANELES DE CONTENIDO ---

const ConceptPanel: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="grid gap-6 content-start">
      <Card title="🧠 Explicación del Concepto">
        <p className="text-slate-600 mb-4 leading-relaxed">
          La <strong>simulación de procesos de transporte</strong> es una técnica analítica utilizada para modelar el movimiento de personas, materiales o productos sin necesidad de realizar pruebas físicas costosas.
        </p>
        <p className="text-slate-600 mb-4 leading-relaxed">
          Permite responder preguntas críticas de logística:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
          <li>¿Cuántos viajes se pueden hacer en un día?</li>
          <li>¿Cuánto tiempo se pierde o queda ocioso?</li>
          <li>¿Cómo afecta la variabilidad del tráfico?</li>
          <li>¿Cuál es la capacidad máxima de la flota?</li>
        </ul>
      </Card>
      
      <Card title="📊 ¿Qué simulamos realmente?">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Truck className="text-blue-600" />
            <div>
              <span className="font-bold text-slate-700">El Camión</span>
              <p className="text-sm text-slate-500">Representa el recurso de transporte limitado.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <Clock className="text-amber-600" />
            <div>
              <span className="font-bold text-slate-700">Tiempo Aleatorio</span>
              <p className="text-sm text-slate-500">Simula tráfico, semáforos y demoras variables.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <Activity className="text-emerald-600" />
            <div>
              <span className="font-bold text-slate-700">Ciclo (Iteración)</span>
              <p className="text-sm text-slate-500">Cada vuelta del bucle es un viaje completo.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <Card title="Visualización del Modelo" className="h-full">
      <div className="grid place-items-center h-full bg-slate-50 rounded-lg p-8 border border-slate-200 border-dashed">
         {/* Diagrama Estático Conceptual con SVG inline */}
         <svg width="100%" height="300" viewBox="0 0 400 300" className="w-full h-auto">
            {/* Almacén */}
            <rect x="20" y="100" width="80" height="80" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
            <text x="60" y="145" textAnchor="middle" className="text-xs fill-slate-700 font-bold">ALMACÉN</text>
            
            {/* Tienda */}
            <rect x="300" y="100" width="80" height="80" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
            <text x="340" y="145" textAnchor="middle" className="text-xs fill-slate-700 font-bold">TIENDA</text>

            {/* Rutas */}
            <path d="M 100 120 L 300 120" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10,5" markerEnd="url(#arrow)" />
            <path d="M 300 160 L 100 160" stroke="#f59e0b" strokeWidth="4" strokeDasharray="10,5" markerEnd="url(#arrow)" />

            {/* Etiquetas Rutas */}
            <text x="200" y="110" textAnchor="middle" className="text-xs fill-blue-600 font-bold">IDA (Entrega)</text>
            <text x="200" y="185" textAnchor="middle" className="text-xs fill-amber-600 font-bold">VUELTA (Retorno)</text>

            {/* Camión */}
            <g transform="translate(180, 130)">
              <rect x="0" y="0" width="40" height="20" rx="2" fill="#1e293b" />
              <circle cx="10" cy="20" r="4" fill="#000" />
              <circle cx="30" cy="20" r="4" fill="#000" />
            </g>

            {/* Definiciones */}
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
              </marker>
            </defs>
         </svg>
         <p className="text-center text-slate-500 mt-4 text-sm italic">
           El ciclo completo (Ida + Vuelta) toma entre 30 y 50 minutos.
         </p>
      </div>
    </Card>
  </div>
);

const ExercisePanel: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="md:col-span-2">
      <Card title="📝 Enunciado del Ejercicio">
        <div className="prose prose-slate max-w-none text-slate-600">
          <p className="text-lg">
            Una empresa de distribución tiene un camión que transporta productos desde un almacén a una tienda. Se requiere simular un día completo de operación para evaluar la eficiencia.
          </p>
          
          <h4 className="font-bold text-slate-800 mt-6 mb-2">Parámetros del Sistema:</h4>
          <ul className="grid grid-cols-1 gap-2">
            <li className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-2">
              <Clock className="text-blue-500" size={20} />
              <span><strong>Duración del viaje:</strong> Aleatorio entre 30 y 50 minutos (ida y vuelta incluidos).</span>
            </li>
            <li className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-2">
              <Activity className="text-blue-500" size={20} />
              <span><strong>Jornada laboral:</strong> 8 horas fijas (480 minutos).</span>
            </li>
            <li className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-2">
              <RotateCcw className="text-blue-500" size={20} />
              <span><strong>Condición de parada:</strong> El camión regresa al almacén tras cada entrega. Si no hay tiempo para otro viaje completo, la jornada termina.</span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
    
    <div className="md:col-span-1">
      <Card title="Objetivos de Salida" className="h-full bg-blue-50 border-blue-100">
        <p className="mb-4 text-slate-700">El algoritmo debe calcular:</p>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded shadow-sm border border-blue-100 text-center">
            <span className="block text-2xl font-bold text-blue-600">N</span>
            <span className="text-sm text-slate-500">Cantidad de viajes (Viajes realizados)</span>
          </div>
          <div className="p-4 bg-white rounded shadow-sm border border-blue-100 text-center">
            <span className="block text-2xl font-bold text-blue-600">T_total</span>
            <span className="text-sm text-slate-500">Tiempo total utilizado</span>
          </div>
          <div className="p-4 bg-white rounded shadow-sm border border-blue-100 text-center">
            <span className="block text-2xl font-bold text-blue-600">T_ocio</span>
            <span className="text-sm text-slate-500">Tiempo ocioso (sin usar)</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const ProcedurePanel: React.FC = () => (
  <Card title="🛠️ Algoritmo paso a paso">
    <div className="grid grid-cols-1 gap-4">
       {/* Steps Grid */}
       {[
         { step: 1, text: "Inicializar contadores: Tiempo usado = 0, Viajes = 0.", icon: <RotateCcw /> },
         { step: 2, text: "Generar un número aleatorio entre 30 y 50 (duración del próximo viaje).", icon: <Activity /> },
         { step: 3, text: "Verificar: ¿(Tiempo usado + Duración viaje) > 480 minutos?", icon: <Clock /> },
         { step: 4, text: "Si es VERDADERO: Detener el ciclo (Break). No hay tiempo para más.", icon: <Activity className="text-red-500" /> },
         { step: 5, text: "Si es FALSO: Sumar duración al tiempo usado. Incrementar contador de viajes. Repetir paso 2.", icon: <Truck className="text-green-500" /> },
         { step: 6, text: "Imprimir resultados finales.", icon: <FileText /> }
       ].map((item) => (
         <div key={item.step} className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {item.step}
            </div>
            <div className="text-slate-400">
              {item.icon}
            </div>
            <p className="font-medium text-slate-700">{item.text}</p>
         </div>
       ))}
    </div>
  </Card>
);

const CodePanel: React.FC = () => (
  <div className="grid grid-cols-1 h-full">
    <Card title="🧩 Implementación en Python" className="h-full">
      <pre className="bg-slate-900 text-slate-50 p-6 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed h-full">
{`import random

# ---------------------------------------
# Función que genera el tiempo de un viaje
# ---------------------------------------
def tiempo_viaje():
    """
    Devuelve un tiempo aleatorio (en minutos)
    que tarda un viaje de transporte.
    """
    return random.randint(30, 50)

# ---------------------------------------
# Función que simula el proceso de transporte
# ---------------------------------------
def simular_transporte(tiempo_disponible):
    """
    Simula los viajes realizados por un camión
    durante un tiempo determinado.
    """
    
    tiempo_utilizado = 0
    viajes_realizados = 0

    while True:
        duracion_viaje = tiempo_viaje()

        # Verificamos si hay tiempo suficiente para otro viaje
        if tiempo_utilizado + duracion_viaje > tiempo_disponible:
            break

        tiempo_utilizado += duracion_viaje
        viajes_realizados += 1

    return viajes_realizados, tiempo_utilizado

# ---------------------------------------
# Programa principal
# ---------------------------------------
def main():
    jornada_laboral = 480  # minutos en 8 horas

    viajes, tiempo_usado = simular_transporte(jornada_laboral)

    print("RESULTADOS DE LA SIMULACIÓN DE TRANSPORTE")
    print("-----------------------------------------")
    print(f"Viajes realizados: {viajes}")
    print(f"Tiempo total usado: {tiempo_usado} minutos")
    print(f"Tiempo sin usar: {jornada_laboral - tiempo_usado} minutos")

# Ejecutamos el programa
main()`}
      </pre>
    </Card>
  </div>
);

const SimulationPanel: React.FC = () => {
  const { results, stats, runSimulation, reset } = useSimulation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {/* Columna Izquierda: Controles y Resumen */}
      <div className="md:col-span-1 grid grid-rows-[auto_1fr] gap-6">
        <Card title="Panel de Control">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-500">
              Haz clic en "Ejecutar Simulación" para correr el algoritmo una vez. Observa cómo varían los resultados debido a la aleatoriedad.
            </p>
            <button 
              onClick={runSimulation}
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow transition-all active:scale-95"
            >
              <Play size={20} /> Ejecutar Simulación
            </button>
            <button 
              onClick={reset}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold rounded shadow-sm transition-all"
            >
              <RotateCcw size={20} /> Reiniciar
            </button>
          </div>
        </Card>

        {stats.isFinished && (
          <Card title="Resultados del Día" className="bg-slate-50 border-blue-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Viajes Completados</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-600">{stats.totalTrips}</span>
                  <span className="text-slate-500">viajes</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiempo Utilizado</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-emerald-600">{stats.totalTimeUsed}</span>
                  <span className="text-slate-500">min / 480</span>
                </div>
                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-emerald-600 h-2.5 rounded-full" 
                    style={{ width: `${(stats.totalTimeUsed / 480) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiempo Ocioso</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-amber-500">{stats.timeLeft}</span>
                  <span className="text-slate-500">minutos</span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Columna Derecha: Gráfica Interactiva */}
      <div className="md:col-span-2 h-full">
        <Card title="Visualización de Tiempos por Viaje" className="h-full flex flex-col">
          {stats.isFinished ? (
            <div className="flex-1 min-h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="tripId" 
                    label={{ value: 'Número de Viaje', position: 'insideBottom', offset: -10 }} 
                  />
                  <YAxis 
                    label={{ value: 'Duración (min)', angle: -90, position: 'insideLeft' }} 
                    domain={[0, 60]} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Bar 
                    dataKey="duration" 
                    name="Duración del Viaje" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                    animationDuration={1500}
                  />
                  <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="3 3" label="Máx (50m)" />
                  <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" label="Mín (30m)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
                <Activity size={64} className="mb-4 opacity-20" />
                <p>Ejecuta la simulación para ver los datos.</p>
             </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// --- LAYOUT PRINCIPAL (LessonLayout) ---

const LessonLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabID>('concept');

  // Renderizado condicional del contenido basado en Tabs
  const renderContent = () => {
    switch (activeTab) {
      case 'concept': return <ConceptPanel />;
      case 'exercise': return <ExercisePanel />;
      case 'procedure': return <ProcedurePanel />;
      case 'code': return <CodePanel />;
      case 'simulation': return <SimulationPanel />;
      default: return <ConceptPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 grid grid-rows-[auto_auto_1fr]">
      {/* 1. HEADER */}
      <header className="bg-slate-900 border-b border-slate-700 p-6 shadow-lg z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
            <Truck className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Simulación de Transporte</h1>
          </div>
        </div>
      </header>

      {/* 2. NAVIGATION (Tabs) */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. MAIN CONTENT (Grid Container) */}
      <main className="max-w-6xl mx-auto w-full p-6 animate-in fade-in duration-500">
        
        {/* Cabecera contextual de la sección actual */}
        <div className="mb-6 border-l-4 border-blue-500 pl-4 py-1">
          <h2 className="text-xl font-bold text-slate-800">
            {activeTab === 'concept' && "Fundamentos Teóricos"}
            {activeTab === 'exercise' && "Definición del Problema"}
            {activeTab === 'procedure' && "Lógica de Solución"}
            {activeTab === 'code' && "Implementación Técnica"}
            {activeTab === 'simulation' && "Laboratorio Virtual"}
          </h2>
          <p className="text-sm text-slate-500">
            {activeTab === 'concept' && "Entendiendo qué es y para qué sirve una simulación."}
            {activeTab === 'exercise' && "Variables y restricciones del escenario de transporte."}
            {activeTab === 'procedure' && "Pasos lógicos para construir el algoritmo."}
            {activeTab === 'code' && "Código fuente en Python listo para ejecutar."}
            {activeTab === 'simulation' && "Prueba el algoritmo interactivamente y analiza los datos generados."}
          </p>
        </div>

        {/* DIAGRAM RENDER AREA */}
        <div className="w-full">
           {renderContent()}
        </div>

      </main>
    </div>
  );
};

// --- APP ENTRY POINT ---

export default function App() {
  return <LessonLayout />;
}