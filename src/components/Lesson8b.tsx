import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell, Legend
} from 'recharts';
import { 
  Truck, Users, Activity, Package, Monitor, Layers, 
  ArrowRight, Info, Settings, Play, Pause, RefreshCw 
} from 'lucide-react';

// --- Tipos e Interfaces ---
interface TabConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
}

// --- Datos de Ejemplo ---

const inventoryData = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  stock: i % 7 === 0 ? 100 : Math.max(0, 100 - (i % 7) * 15),
  demand: Math.floor(Math.random() * 20) + 5
}));

const variabilityData = Array.from({ length: 40 }, (_, i) => {
  const x = (i - 20) / 5;
  const y = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  return { x: i, y: y * 100, yLow: y * 60 };
});

const softwareData = [
  { process: "Manufactura", technique: "Eventos Discretos", tool: "JaamSim / SimPy" },
  { process: "Logística", technique: "Agentes", tool: "AnyLogic (Free Ed.) / NetLogo" },
  { process: "Finanzas", technique: "Monte Carlo", tool: "Python (NumPy) / Excel" },
  { process: "Sistemas Dinámicos", technique: "Ecuaciones Diferenciales", tool: "Vensim PLE / Insight Maker" }
];

// --- Componentes Base ---

const Card = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

// 2.4.6 Diagrama Dinámico: Transporte Industrial
const TransportDiagram = () => {
  const [position, setPosition] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden">
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      {/* Nodos de proceso */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center border-4 border-blue-900 shadow-lg shadow-blue-500/20">
        <Settings className="text-white w-6 h-6 animate-spin-slow" />
      </div>
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-emerald-900 shadow-lg shadow-emerald-500/20">
        <Package className="text-white w-6 h-6" />
      </div>

      {/* Ruta de transporte */}
      <div className="absolute top-1/2 left-20 right-20 h-2 bg-slate-700 -translate-y-1/2 rounded-full">
        <div 
          className="absolute top-1/2 -translate-y-1/2 h-6 w-10 bg-amber-400 rounded flex items-center justify-center shadow-lg"
          style={{ left: `${position}%` }}
        >
          <Truck className="w-6 h-6 text-amber-900" />
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-slate-400 text-xs font-mono uppercase tracking-tighter">
        TIEMPO DE TRASLADO: {(position * 0.5).toFixed(1)}s | ESTADO: EN MOVIMIENTO
      </div>
    </div>
  );
};

// 2.4.7 Diagrama Dinámico: Línea de Espera
const QueueDiagram = () => {
  const [queue, setQueue] = useState([1, 1, 1, 0, 0]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setQueue(prev => prev.map(() => Math.random() > 0.4 ? 1 : 0));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-64 flex flex-col items-center justify-center space-y-8">
      <div className="flex space-x-4">
        {queue.map((status, i) => (
          <div key={i} className={`w-12 h-16 rounded-md flex items-end justify-center p-2 border-2 transition-colors duration-500 ${status ? 'bg-indigo-100 border-indigo-300' : 'bg-slate-50 border-slate-200'}`}>
            {status ? <Users className="text-indigo-600 w-6 h-6" /> : null}
          </div>
        ))}
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-600 relative">
          <Activity className="text-emerald-400 w-8 h-8 animate-pulse" />
          <div className="absolute -top-2 -right-2 bg-emerald-500 text-[10px] text-white px-2 py-1 rounded-full font-bold">
            TRABAJANDO
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="text-center p-3 bg-slate-50 rounded border border-slate-100">
          <p className="text-xs text-slate-500 uppercase">Utilización</p>
          <p className="text-xl font-bold text-slate-800">84.2%</p>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded border border-slate-100">
          <p className="text-xs text-slate-500 uppercase">Tiempo espera</p>
          <p className="text-xl font-bold text-slate-800">12.5 min</p>
        </div>
      </div>
    </div>
  );
};

// 2.4.8 Diagrama Estático: Variabilidad
const VariabilityDiagram = () => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={variabilityData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis hide />
        <YAxis hide />
        <Tooltip />
        <Area type="monotone" dataKey="y" stroke="#6366f1" fill="#818cf8" fillOpacity={0.3} name="Rendimiento Teórico" />
        <Area type="monotone" dataKey="yLow" stroke="#f43f5e" fill="#fb7185" fillOpacity={0.2} name="Rendimiento Real" />
      </AreaChart>
    </ResponsiveContainer>
    <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded text-sm text-rose-700 flex items-start gap-2">
      <Info className="w-4 h-4 mt-0.5 shrink-0" />
      <p>La variabilidad estadística reduce la capacidad efectiva de los procesos industriales al alejar el rendimiento de su media ideal.</p>
    </div>
  </div>
);

// 2.4.9 Diagrama Dinámico: Inventarios
const InventoryDiagram = () => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={inventoryData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="time" label={{ value: 'Tiempo', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Unidades', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend verticalAlign="top" height={36}/>
        <Line type="stepAfter" dataKey="stock" stroke="#0ea5e9" strokeWidth={3} dot={false} name="Stock Disponible" />
        <Line type="monotone" dataKey="demand" stroke="#94a3b8" strokeDasharray="5 5" dot={false} name="Consumo Esperado" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Software Interactivo
const SoftwareModule = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {softwareData.map((item, i) => (
      <div key={i} className="p-4 border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-default group bg-white">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{item.technique}</span>
          <Monitor className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
        </div>
        <h4 className="font-bold text-slate-800">{item.process}</h4>
        <p className="text-sm text-slate-500 mt-1">Herramienta: <span className="text-slate-700 font-medium">{item.tool}</span></p>
      </div>
    ))}
  </div>
);

// Cierre: Diagrama Integrador
const IntegratedDiagram = () => (
  <div className="p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
    <div className="grid grid-cols-3 gap-8 items-center relative">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center">
        <Settings className="w-8 h-8 text-blue-500 mx-auto mb-2" />
        <span className="text-xs font-bold uppercase text-slate-400">Entrada</span>
        <p className="font-semibold text-slate-700">Flujos de Proceso</p>
      </div>
      
      <div className="flex flex-col items-center">
        <ArrowRight className="text-slate-300 w-8 h-8 mb-2" />
        <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-xl text-center transform scale-110">
          <Activity className="w-8 h-8 mx-auto mb-2" />
          <p className="font-bold">SIMULACIÓN</p>
          <span className="text-[10px] opacity-80 uppercase">Modelo Digital</span>
        </div>
        <ArrowRight className="text-slate-300 w-8 h-8 mt-2" />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center">
        <Layers className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        <span className="text-xs font-bold uppercase text-slate-400">Salida</span>
        <p className="font-semibold text-slate-700">Optimización</p>
      </div>
    </div>
  </div>
);

// --- Componente Principal ---

export default function App() {
  const [activeTab, setActiveTab] = useState('transporte');

  const tabs: TabConfig[] = [
    { id: 'transporte', title: 'Transporte', icon: <Truck size={18} /> },
    { id: 'colas', title: 'Filas', icon: <Users size={18} /> },
    { id: 'variabilidad', title: 'Variabilidad', icon: <Activity size={18} /> },
    { id: 'inventario', title: 'Inventarios', icon: <Package size={18} /> },
    { id: 'software', title: 'Software', icon: <Monitor size={18} /> },
    { id: 'cierre', title: 'Integración', icon: <Layers size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'transporte':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">2.4.6 Sistemas de Transporte</h2>
              <p className="text-slate-600 mt-2">Simulación de movimientos logísticos internos para identificar cuellos de botella en el traslado de materiales.</p>
            </div>
            <Card title="Simulador de Transporte Activo">
              <TransportDiagram />
            </Card>
          </div>
        );
      case 'colas':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">2.4.7 Teoría de Colas</h2>
              <p className="text-slate-600 mt-2">Estudio de los tiempos de espera y la capacidad de servicio de los servidores industriales.</p>
            </div>
            <Card title="Dinámica de Línea de Espera">
              <QueueDiagram />
            </Card>
          </div>
        );
      case 'variabilidad':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">2.4.8 Impacto de la Incertidumbre</h2>
              <p className="text-slate-600 mt-2">Análisis estadístico de cómo la variabilidad degrada el desempeño de los sistemas de producción.</p>
            </div>
            <Card title="Capacidad vs Variabilidad">
              <VariabilityDiagram />
            </Card>
          </div>
        );
      case 'inventario':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">2.4.9 Control de Inventarios</h2>
              <p className="text-slate-600 mt-2">Visualización de los niveles de stock y la reposición basada en modelos de simulación continua.</p>
            </div>
            <Card title="Gráfica de Reposición">
              <InventoryDiagram />
            </Card>
          </div>
        );
      case 'software':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Software para Simulación</h2>
              <p className="text-slate-600 mt-2">Selección de herramientas tecnológicas según el tipo de proceso industrial a modelar.</p>
            </div>
            <SoftwareModule />
          </div>
        );
      case 'cierre':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Cierre e Integración</h2>
              <p className="text-slate-600 mt-2">La simulación industrial como base para la toma de decisiones informada y la mejora continua.</p>
            </div>
            <IntegratedDiagram />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      {/* Layout Principal con CSS Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        
        {/* Header - Span 12 */}
        <header className="col-span-12 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Módulo: <span className="text-indigo-600">Simulación Industrial</span>
            </h1>
            <p className="text-slate-500 font-medium">Visualización de Procesos y Optimización Operativa</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs font-bold text-slate-600 uppercase">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Sesión Educativa Interactiva
          </div>
        </header>

        {/* Sistema de Pestañas - Span 12 */}
        <nav className="col-span-12 flex flex-wrap gap-2 bg-slate-200/50 p-1.5 rounded-xl border border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-md' 
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.title}</span>
            </button>
          ))}
        </nav>

        {/* Área de Contenido - Span 12 */}
        <main className="col-span-12 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </main>

        {/* Footer - Span 12 */}
        <footer className="col-span-12 mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-[10px] uppercase tracking-widest font-bold gap-4">
          <div>© 2025 DiagramtoReact | Hub de Ingeniería</div>
          <div className="flex gap-6">
            <span className="hover:text-indigo-500 cursor-help transition-colors">Guía Técnica</span>
            <span className="hover:text-indigo-500 cursor-help transition-colors">Recursos Open Source</span>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}