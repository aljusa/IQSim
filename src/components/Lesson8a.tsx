import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  Settings, Activity, Database, Layout, Play, Pause, RefreshCw, 
  ArrowRight, Box, Cpu, Clock, BarChart2, Layers
} from 'lucide-react';

// --- Types & Interfaces ---

interface TabData {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface DiagramProps {
  title: string;
  description: string;
}

// --- Shared Components ---

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const LessonLayout: React.FC<{ 
  tabs: TabData[]; 
  activeTab: string; 
  onTabChange: (id: string) => void;
  children: React.ReactNode;
}> = ({ tabs, activeTab, onTabChange, children }) => {
  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Header & Navigation */}
      <header className="grid grid-cols-[1fr_auto] items-center px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Cpu size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase">Simulación de Sistemas</h1>
        </div>
        
        <nav className="grid grid-flow-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab.id 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.title}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

// --- Diagram Components ---

/**
 * 2.4.1: Procesos Continuos vs Eventos Discretos
 */
const ContinuousVsDiscrete: React.FC<DiagramProps> = ({ title, description }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-rows-[auto_auto] gap-2 mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">{description}</p>
      </div>
      
      <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50/50">
        {/* Continuous Side */}
        <div className="grid grid-rows-[auto_1fr_auto] gap-4">
          <div className="text-center font-bold text-indigo-600 uppercase tracking-widest text-sm">Procesos Continuos</div>
          <div className="h-48 flex items-end justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={Array.from({length: 20}, (_, i) => ({x: i, y: Math.sin(i/3) * 10 + 20}))}>
                 <Line type="monotone" dataKey="y" stroke="#4f46e5" strokeWidth={3} dot={false} isAnimationActive={false} />
               </LineChart>
             </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-500 italic text-center">Estado cambia suavemente en todo instante t.</div>
        </div>

        {/* Discrete Side */}
        <div className="grid grid-rows-[auto_1fr_auto] gap-4">
          <div className="text-center font-bold text-emerald-600 uppercase tracking-widest text-sm">Eventos Discretos</div>
          <div className="h-48 flex items-end justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={Array.from({length: 20}, (_, i) => ({x: i, y: Math.floor(i/4) * 5 + (i % 5 === 0 ? 5 : 0)}))}>
                 <Line type="stepAfter" dataKey="y" stroke="#10b981" strokeWidth={3} dot={true} isAnimationActive={false} />
               </LineChart>
             </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-500 italic text-center">Estado cambia solo en puntos específicos del tiempo.</div>
        </div>
      </Card>
    </div>
  );
};

/**
 * 2.4.2: Funciones clave y Herramientas Libres
 */
const ToolsEcosystem: React.FC<DiagramProps> = ({ title, description }) => {
  const tools = [
    { name: 'SimPy', type: 'Simulación', desc: 'Basado en procesos de Python', icon: <Settings className="text-blue-500" /> },
    { name: 'SciPy / NumPy', type: 'Estadística', desc: 'Computación científica avanzada', icon: <Database className="text-orange-500" /> },
    { name: 'Matplotlib / Plotly', type: 'Visualización', desc: 'Graficación interactiva de datos', icon: <BarChart2 className="text-purple-500" /> },
    { name: 'Pandas', type: 'Análisis', desc: 'Estructuras de datos de alto nivel', icon: <Layers className="text-emerald-500" /> },
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-rows-[auto_auto] gap-2 mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <Card key={tool.name} className="p-5 hover:border-indigo-400 transition-colors">
            <div className="grid grid-rows-[auto_auto_1fr] gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">{tool.type}</span>
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold">{tool.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{tool.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

/**
 * 2.4.3: Línea de Tiempo SimPy (Dinámico)
 */
const SimPyTimeline: React.FC<DiagramProps> = ({ title, description }) => {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime(prev => {
          if (prev >= 50) {
            setIsPlaying(false);
            return 50;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const timelineEvents = [
    { t: 5, label: 'Llegada 1', type: 'arrival' },
    { t: 8, label: 'Inicio Servicio 1', type: 'service' },
    { t: 15, label: 'Salida 1', type: 'exit' },
    { t: 20, label: 'Llegada 2', type: 'arrival' },
    { t: 22, label: 'Inicio Servicio 2', type: 'service' },
    { t: 30, label: 'Salida 2', type: 'exit' },
    { t: 35, label: 'Llegada 3', type: 'arrival' },
  ];

  const currentEvents = timelineEvents.filter(e => e.t <= time);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-rows-[auto_auto] gap-2 mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">{description}</p>
      </div>

      <Card className="p-8">
        <div className="grid grid-rows-[auto_1fr_auto] gap-8">
          <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button 
                onClick={() => {setTime(0); setIsPlaying(false)}}
                className="p-2 text-slate-500 hover:text-slate-700"
              >
                <RefreshCw size={20} />
              </button>
            </div>
            <div className="text-2xl font-mono font-bold text-indigo-600">t = {time.toFixed(1)}</div>
          </div>

          <div className="relative h-64 border-b-2 border-slate-300 dark:border-slate-700 flex items-center">
            {/* Timeline base */}
            <div className="absolute w-full h-0.5 bg-slate-200 dark:bg-slate-800 top-1/2" />
            
            {/* Markers */}
            {timelineEvents.map((ev, idx) => (
              <div 
                key={idx}
                className={`absolute transition-all duration-500 transform -translate-x-1/2
                  ${time >= ev.t ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                style={{ left: `${(ev.t / 50) * 100}%` }}
              >
                <div className="grid grid-rows-[auto_auto_auto] items-center justify-items-center gap-2">
                  <div className={`px-2 py-1 rounded text-[10px] font-bold text-white uppercase
                    ${ev.type === 'arrival' ? 'bg-blue-500' : ev.type === 'exit' ? 'bg-red-500' : 'bg-amber-500'}`}>
                    {ev.label}
                  </div>
                  <div className="w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 bg-indigo-600 shadow-md" />
                  <span className="text-xs font-mono">T:{ev.t}</span>
                </div>
              </div>
            ))}

            {/* Current pointer */}
            <div 
              className="absolute top-1/2 h-20 w-px bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)] z-10 -translate-y-1/2 transition-all duration-300"
              style={{ left: `${(time / 50) * 100}%` }}
            >
              <div className="absolute -top-1 w-2 h-2 bg-indigo-600 rounded-full -left-1" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-xs font-semibold uppercase tracking-wider">
            <div className="text-blue-500">Llegadas</div>
            <div className="text-amber-500">Servicio</div>
            <div className="text-red-500">Salidas</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

/**
 * 2.4.4: Ciclo de Datos y Decisiones
 */
const DataCycle: React.FC<DiagramProps> = ({ title, description }) => {
  const steps = [
    { title: 'Recolección', desc: 'Obtención de logs del sistema real.', icon: <Database /> },
    { title: 'Estadística', desc: 'Ajuste de distribuciones (Poisson, Normal).', icon: <BarChart2 /> },
    { title: 'Validación', desc: 'Comparación modelo vs realidad.', icon: <Activity /> },
    { title: 'Decisión', desc: 'Optimización basada en resultados.', icon: <Settings /> }
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-rows-[auto_auto] gap-2 mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <Card className="p-6 text-center flex flex-col items-center gap-3 hover:shadow-lg transition-shadow border-t-4 border-t-indigo-500">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-full">
                {step.icon}
              </div>
              <h4 className="font-bold text-lg">{step.title}</h4>
              <p className="text-sm text-slate-500">{step.desc}</p>
            </Card>
            {idx < steps.length - 1 && (
              <div className="hidden md:flex justify-center text-slate-300">
                <ArrowRight size={24} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/**
 * 2.4.5: Simulación Entorno Productivo (Dinámico)
 */
const ProductionFloor: React.FC<DiagramProps> = ({ title, description }) => {
  const [entities, setEntities] = useState<{id: number, pos: number, status: 'wait' | 'proc' | 'done'}[]>([]);
  const [processedCount, setProcessedCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEntities(prev => {
        // Update existing
        const next = prev.map(e => {
          if (e.pos < 30) return { ...e, pos: e.pos + 2, status: 'wait' as const };
          if (e.pos < 70) return { ...e, pos: e.pos + 1, status: 'proc' as const };
          return { ...e, pos: e.pos + 3, status: 'done' as const };
        }).filter(e => e.pos < 100);

        // Add new
        if (Math.random() > 0.7 && next.length < 8) {
          next.push({ id: Date.now(), pos: 0, status: 'wait' });
        }
        
        // Count finished
        const finished = prev.filter(e => e.pos >= 100).length;
        if (finished > 0) setProcessedCount(c => c + finished);

        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-rows-[auto_auto] gap-2 mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">{description}</p>
      </div>

      <Card className="p-8 bg-slate-900 text-white border-none shadow-2xl">
        <div className="grid grid-cols-[1fr_auto] gap-4 mb-8 items-center">
          <div className="flex gap-4">
             <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-400 block uppercase font-bold">En Proceso</span>
                <span className="text-xl font-mono text-blue-400">{entities.length}</span>
             </div>
             <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-400 block uppercase font-bold">Completados</span>
                <span className="text-xl font-mono text-emerald-400">{processedCount}</span>
             </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> SIMULACIÓN ACTIVA
          </div>
        </div>

        <div className="relative h-48 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700 flex items-center px-4">
          {/* Workstations labels */}
          <div className="absolute inset-0 grid grid-cols-3 pointer-events-none opacity-20 uppercase font-black text-4xl italic flex items-center text-center">
             <div className="flex items-center justify-center border-r border-slate-700">Cola</div>
             <div className="flex items-center justify-center border-r border-slate-700">Taller</div>
             <div className="flex items-center justify-center">Salida</div>
          </div>

          {/* Entities (Items moving) */}
          {entities.map(entity => (
            <div 
              key={entity.id}
              className={`absolute transition-all duration-100 transform -translate-y-1/2 top-1/2 p-2 rounded shadow-lg
                ${entity.status === 'wait' ? 'bg-blue-500' : entity.status === 'proc' ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`}
              style={{ left: `${entity.pos}%` }}
            >
              <Box size={24} className="text-white" />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
           <div className="text-sm border-l-2 border-blue-500 pl-4">
              <h5 className="font-bold text-blue-400 uppercase text-xs mb-1">Estación 1: Recepción</h5>
              <p className="text-slate-400 text-xs">Las piezas ingresan según una tasa de arribo exponencial.</p>
           </div>
           <div className="text-sm border-l-2 border-indigo-500 pl-4">
              <h5 className="font-bold text-indigo-400 uppercase text-xs mb-1">Estación 2: Manufactura</h5>
              <p className="text-slate-400 text-xs">Transformación de materia prima con tiempo de servicio variable.</p>
           </div>
           <div className="text-sm border-l-2 border-emerald-500 pl-4">
              <h5 className="font-bold text-emerald-400 uppercase text-xs mb-1">Estación 3: Logística</h5>
              <p className="text-slate-400 text-xs">Empaquetado y despacho hacia el almacén de producto terminado.</p>
           </div>
        </div>
      </Card>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState('modeling');

  const tabs: TabData[] = [
    { id: 'modeling', title: 'Modelado', icon: <Activity size={18} /> },
    { id: 'ecosystem', title: 'Ecosistema', icon: <Layers size={18} /> },
    { id: 'simpy', title: 'SimPy', icon: <Clock size={18} /> },
    { id: 'analysis', title: 'Análisis', icon: <BarChart2 size={18} /> },
    { id: 'production', title: 'Producción', icon: <Box size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'modeling':
        return (
          <ContinuousVsDiscrete 
            title="Modelado de Sistemas: Continuo vs Discreto"
            description="La elección entre un enfoque continuo o discreto define la granularidad temporal de nuestro modelo. Mientras que los sistemas continuos analizan flujos constantes, los discretos se centran en eventos puntuales que disparan cambios de estado."
          />
        );
      case 'ecosystem':
        return (
          <ToolsEcosystem 
            title="Ecosistema de Simulación Libre"
            description="Las herramientas de código abierto como Python ofrecen un robusto conjunto de bibliotecas que cubren desde el modelado matemático hasta la visualización avanzada de resultados estadísticos."
          />
        );
      case 'simpy':
        return (
          <SimPyTimeline 
            title="Mecánica de Eventos en SimPy"
            description="Observe cómo SimPy gestiona el 'reloj de simulación' saltando entre eventos discretos de llegada, servicio y salida, optimizando el tiempo de cómputo al ignorar los periodos de inactividad."
          />
        );
      case 'analysis':
        return (
          <DataCycle 
            title="Ciclo de Datos y Toma de Decisiones"
            description="La simulación no es un fin en sí misma, sino una herramienta para transformar datos crudos del sistema en inteligencia operativa y decisiones estratégicas validadas."
          />
        );
      case 'production':
        return (
          <ProductionFloor 
            title="Simulación de Planta Productiva"
            description="Representación dinámica de un flujo de manufactura. El monitoreo de colas y tiempos de proceso permite identificar cuellos de botella y mejorar el throughput del sistema."
          />
        );
      default:
        return null;
    }
  };

  return (
    <LessonLayout tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="grid grid-cols-1 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {renderContent()}
      </div>
    </LessonLayout>
  );
}