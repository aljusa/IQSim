import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  FlaskConical, 
  Settings, 
  BarChart3, 
  Layers, 
  ArrowRight, 
  RefreshCw,
  Thermometer,
  Box,
  Timer
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
 
} from 'recharts';

// --- Interfaces & Types ---

interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  content: React.ReactNode; // Explicación teórica
  diagramComponent: React.ReactNode; // Componente visual
}

// --- Componentes UI Base ---

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

// --- Componentes de Diagramas Específicos ---

// 1.4.3 - Simulador Físico (Animación CSS Grid/SVG)
const PhysicalProcessDiagram = () => {
  return (
    <div className="w-full h-64 bg-slate-50 relative overflow-hidden rounded-lg border border-slate-200 p-4">
      {/* Representación de Estaciones y Cola */}
      <div className="grid grid-cols-4 gap-4 h-full items-center relative z-10">
        
        {/* Entrada */}
        <div className="flex flex-col items-center justify-center p-2 border-2 border-dashed border-slate-300 rounded-lg h-32">
          <span className="text-xs font-bold text-slate-500 mb-2">ENTRADA</span>
          <Box className="text-blue-500 animate-bounce" />
        </div>

        {/* Cola / Espera */}
        <div className="flex flex-col items-center justify-center p-2 bg-yellow-50 border border-yellow-200 rounded-lg h-32 relative">
          <span className="text-xs font-bold text-yellow-600 mb-2">COLA DE ESPERA</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-blue-400 rounded-full opacity-50"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full opacity-75"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          </div>
          <Timer className="w-4 h-4 text-yellow-500 absolute bottom-2 right-2" />
        </div>

        {/* Procesamiento */}
        <div className="flex flex-col items-center justify-center p-2 bg-green-50 border border-green-200 rounded-lg h-32">
          <span className="text-xs font-bold text-green-600 mb-2">ESTACIÓN PROCESO</span>
          <Settings className="text-green-600 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        {/* Salida */}
        <div className="flex flex-col items-center justify-center p-2 border-2 border-solid border-slate-300 bg-slate-100 rounded-lg h-32">
          <span className="text-xs font-bold text-slate-500 mb-2">SALIDA</span>
          <Box className="text-blue-600" />
        </div>
      </div>

      {/* Flujo Visual (Flechas de fondo) */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex justify-around z-0 opacity-20">
        <ArrowRight className="text-slate-900 w-12 h-12" />
        <ArrowRight className="text-slate-900 w-12 h-12" />
        <ArrowRight className="text-slate-900 w-12 h-12" />
      </div>
    </div>
  );
};

// 1.4.4 - Simulador Químico (Estático SVG)
const ChemicalProcessDiagram = () => {
  return (
    <div className="w-full h-64 bg-white flex items-center justify-center p-4">
      <svg viewBox="0 0 400 200" className="w-full h-full max-w-lg">
        {/* Reactor Tank */}
        <path d="M150,40 L250,40 L250,160 Q200,180 150,160 Z" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="3" />
        
        {/* Reactants In */}
        <path d="M80,60 L145,60" stroke="#ef4444" strokeWidth="4" markerEnd="url(#arrowhead-red)" />
        <text x="50" y="65" fontSize="12" fill="#ef4444" fontWeight="bold">Reactivo A</text>
        
        <path d="M80,100 L145,100" stroke="#3b82f6" strokeWidth="4" markerEnd="url(#arrowhead-blue)" />
        <text x="50" y="105" fontSize="12" fill="#3b82f6" fontWeight="bold">Reactivo B</text>

        {/* Products Out */}
        <path d="M255,140 L320,140" stroke="#8b5cf6" strokeWidth="4" markerEnd="url(#arrowhead-purple)" />
        <text x="330" y="145" fontSize="12" fill="#8b5cf6" fontWeight="bold">Producto C</text>

        {/* Heat/Energy */}
        <path d="M160,170 L240,170" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" />
        <text x="175" y="185" fontSize="10" fill="#f59e0b">Intercambio de Calor (Q)</text>

        {/* Mixer */}
        <line x1="200" y1="20" x2="200" y2="140" stroke="#334155" strokeWidth="2" />
        <rect x="170" y="130" width="60" height="10" fill="#334155" />

        {/* Defs for markers */}
        <defs>
          <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
          </marker>
          <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
          <marker id="arrowhead-purple" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

// 1.4.5 - Control Dinámico (Retroalimentación)
const ControlLoopDiagram = () => {
  return (
    <div className="w-full h-64 bg-slate-50 flex items-center justify-center p-4">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center w-full max-w-2xl">
        
        {/* Set Point */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500">Set Point (SP)</span>
          <ArrowRight className="text-slate-400" />
        </div>

        {/* Lazo */}
        <div className="relative w-full h-40 border-2 border-slate-300 rounded-xl p-4 bg-white grid grid-cols-2 gap-4">
            {/* Controller */}
            <div className="bg-blue-100 border border-blue-300 rounded p-2 flex flex-col items-center justify-center text-center">
                <Settings className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-xs font-bold text-blue-800">Controlador</span>
            </div>
            
            {/* Actuator/System */}
            <div className="bg-emerald-100 border border-emerald-300 rounded p-2 flex flex-col items-center justify-center text-center">
                <Activity className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-xs font-bold text-emerald-800">Proceso (Planta)</span>
            </div>

            {/* Feedback Path (Bottom) */}
            <div className="col-span-2 flex items-center justify-center relative mt-2">
                <div className="absolute w-full h-[1px] bg-slate-300 top-1/2 -z-10"></div>
                <div className="bg-purple-100 border border-purple-300 rounded px-4 py-2 flex items-center gap-2 z-10">
                    <Thermometer className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-purple-800">Sensor / Transmisor</span>
                </div>
            </div>
            
            {/* Arrows SVG Overlay could be complex, using grid placement implies flow for this demo */}
        </div>

        {/* Output */}
         <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500">Variable (PV)</span>
          <ArrowRight className="text-slate-400" />
        </div>
      </div>
    </div>
  );
};

// 1.4.6 - Simulador Estadístico (Interactivo)
const StatisticalDiagram = () => {
  const [data, setData] = useState<{name: string, valor: number}[]>([]);

  const generateData = () => {
    const newData = Array.from({ length: 10 }, (_, i) => ({
      name: `Exp ${i + 1}`,
      valor: Math.floor(Math.random() * 50) + 50 // Random value 50-100
    }));
    setData(newData);
  };

  useEffect(() => {
    generateData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4">
        <div className="flex justify-between items-center bg-slate-100 p-2 rounded-lg">
            <span className="text-sm font-semibold text-slate-700">Análisis de Datos Experimentales</span>
            <button 
                onClick={generateData}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            >
                <RefreshCw size={14} /> Generar Nuevos Datos
            </button>
        </div>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={10} />
                    <YAxis domain={[0, 120]} fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="valor" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Rendimiento %" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

// Comparativo Final (Grid)
const ComparisonDiagram = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full overflow-y-auto">
    {[
      { title: "Sin Reacción", desc: "Balance de materia, colas, flujo físico.", icon: <Box size={20} className="text-blue-500"/>, color: "bg-blue-50 border-blue-200" },
      { title: "Con Reacción", desc: "Cinética química, termodinámica, energía.", icon: <FlaskConical size={20} className="text-red-500"/>, color: "bg-red-50 border-red-200" },
      { title: "Control", desc: "Estabilidad, respuesta en frecuencia, lazos.", icon: <Settings size={20} className="text-green-500"/>, color: "bg-green-50 border-green-200" },
      { title: "Estadístico", desc: "Incertidumbre, variabilidad, predicción.", icon: <BarChart3 size={20} className="text-purple-500"/>, color: "bg-purple-50 border-purple-200" },
    ].map((item, idx) => (
      <div key={idx} className={`p-4 rounded-lg border ${item.color} flex flex-col gap-2`}>
        <div className="flex items-center gap-2 font-bold text-slate-700">
          {item.icon} {item.title}
        </div>
        <p className="text-sm text-slate-600">{item.desc}</p>
      </div>
    ))}
  </div>
);

// --- Componente Layout Principal ---

const LessonLayout: React.FC<{ 
  tabs: TabData[], 
  activeTabId: string, 
  onTabChange: (id: string) => void 
}> = ({ tabs, activeTabId, onTabChange }) => {
  
  const activeData = tabs.find(t => t.id === activeTabId) || tabs[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans grid grid-rows-[auto_1fr] overflow-hidden">
      
      {/* 1. Header Grid Area */}
      <header className="bg-white border-b border-slate-200 shadow-sm z-20 grid grid-cols-[auto_1fr] items-center px-6 h-16">
        <div className="flex items-center gap-3 pr-8 border-r border-slate-100">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Layers className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg text-slate-800 tracking-tight">DiagramtoReact</h1>
        </div>
        
        {/* Navegación por Pestañas */}
        <nav className="flex items-center space-x-1 px-6 overflow-x-auto no-scrollbar h-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-2
                ${activeTabId === tab.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* 2. Main Content Grid Area */}
      <main className="p-6 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 h-full max-w-7xl mx-auto w-full">
        
        {/* Panel Izquierdo: Contenido Teórico (Texto) */}
        <section className="lg:col-span-4 h-full overflow-y-auto pr-2 custom-scrollbar">
          <Card className="h-full border-l-4 border-l-indigo-500">
            <div className="p-6">
            
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{activeData.title}</h2>
              <div className="prose prose-slate prose-sm text-slate-600 leading-relaxed">
                {activeData.content}
              </div>
            </div>
          </Card>
        </section>

        {/* Panel Derecho: Diagrama y Visualización */}
        <section className="lg:col-span-8 h-full flex flex-col gap-4 overflow-hidden">
          
          {/* Header del Diagrama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="p-4 bg-white md:col-span-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-1">Visualización del Modelo</h3>
                <p className="text-slate-700 font-medium">{activeData.description}</p>
             </Card>
          </div>

          {/* Render del Diagrama */}
          <Card className="flex-1 bg-white p-6 relative flex flex-col items-center justify-center min-h-[300px]">
            <div className="absolute top-4 right-4 px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-500 border border-slate-200">
              Live Preview
            </div>
            <div className="w-full max-w-3xl">
              {activeData.diagramComponent}
            </div>
          </Card>

        </section>

      </main>
    </div>
  );
};

// --- Datos y Lógica Principal ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('sec-1.4.3');

  const tabs: TabData[] = [
    {
      id: 'sec-1.4.3',
      label: '1.4.3 Físico',
      icon: <Box size={16} />,
      title: 'Simulador de procesos sin transformación química',
      description: 'Diagrama dinámico: Flujo de entidades a través de estaciones con tiempos de espera.',
      content: (
        <>
          <p className="mb-4">
            Este tipo de simulador se enfoca en el <strong>balance de materia y energía</strong> sin considerar reacciones químicas. 
            Es fundamental para optimizar la logística, el transporte de fluidos y el manejo de sólidos.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Enfoque:</strong> Logística, cuellos de botella y tiempos de ciclo.</li>
            <li><strong>Variables:</strong> Caudal, presión, temperatura (sin reacción), nivel de inventario.</li>
            <li><strong>Ejemplo:</strong> Una línea de embotellado o un sistema de bombeo de agua.</li>
          </ul>
          <p>
            En la visualización, observa cómo las entidades (cajas/fluidos) pasan por una cola antes de ser procesadas, ilustrando la importancia de la gestión de tiempos.
          </p>
        </>
      ),
      diagramComponent: <PhysicalProcessDiagram />
    },
    {
      id: 'sec-1.4.4',
      label: '1.4.4 Químico',
      icon: <FlaskConical size={16} />,
      title: 'Simulador de procesos con transformación química',
      description: 'Diagrama estático: Visualización de reactor, corrientes de entrada/salida y energía.',
      content: (
        <>
          <p className="mb-4">
            Aquí la complejidad aumenta al introducir la <strong>cinética química</strong> y la termodinámica de reacciones. 
            El simulador debe resolver balances de masa por componente y balances de energía simultáneos.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Equipos Clave:</strong> Reactores (CSTR, PFR, Batch).</li>
            <li><strong>Desafíos:</strong> Conversión, selectividad y seguridad térmica (exotermicidad).</li>
            <li><strong>Objetivo:</strong> Maximizar la producción del Producto C minimizando subproductos.</li>
          </ul>
          <p>
            El diagrama muestra un reactor de tanque agitado (CSTR) donde los reactivos A y B se transforman, liberando o absorbiendo calor (Q).
          </p>
        </>
      ),
      diagramComponent: <ChemicalProcessDiagram />
    },
    {
      id: 'sec-1.4.5',
      label: '1.4.5 Control',
      icon: <Settings size={16} />,
      title: 'Simulador para control dinámico',
      description: 'Diagrama de retroalimentación: Lazo cerrado entre sistema, sensor y controlador.',
      content: (
        <>
          <p className="mb-4">
            Estos simuladores no solo ven el estado estacionario, sino cómo cambia el proceso en el <strong>tiempo</strong> ante perturbaciones.
            Son vitales para diseñar estrategias de automatización.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Elemento Sensor:</strong> Mide la variable de proceso (ej. Temperatura).</li>
            <li><strong>Controlador:</strong> Compara con el Set Point y decide la acción (PID).</li>
            <li><strong>Actuador:</strong> Ejecuta la acción (ej. abrir una válvula).</li>
          </ul>
          <p>
            El diagrama de bloques ilustra el ciclo de retroalimentación negativo esencial para mantener la estabilidad del sistema.
          </p>
        </>
      ),
      diagramComponent: <ControlLoopDiagram />
    },
    {
      id: 'sec-1.4.6',
      label: '1.4.6 Estadístico',
      icon: <BarChart3 size={16} />,
      title: 'Simulador estadístico',
      description: 'Diagrama interactivo: Análisis de datos experimentales y variabilidad.',
      content: (
        <>
          <p className="mb-4">
            No todos los procesos son deterministas. El simulador estadístico (o Monte Carlo) introduce la <strong>probabilidad y la incertidumbre</strong> en el análisis.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Uso:</strong> Análisis de riesgo, control de calidad y diseño de experimentos (DOE).</li>
            <li><strong>Input:</strong> Datos históricos o distribuciones de probabilidad.</li>
            <li><strong>Output:</strong> Histogramas de frecuencia, intervalos de confianza.</li>
          </ul>
          <p>
            Interactúa con el gráfico para simular nuevos lotes de datos experimentales y observar cómo varía el rendimiento del proceso.
          </p>
        </>
      ),
      diagramComponent: <StatisticalDiagram />
    },
    {
      id: 'resumen',
      label: 'Comparativa',
      icon: <Layers size={16} />,
      title: 'Resumen y Comparación de Simuladores',
      description: 'Diagrama comparativo: Matriz de propósitos y aplicaciones.',
      content: (
        <>
          <p className="mb-4">
            La elección del simulador depende de la etapa del proyecto y la naturaleza del problema a resolver.
            Un ingeniero químico debe ser capaz de transitar entre estas herramientas.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm">
            <strong>Conclusión Clave:</strong> Mientras que los simuladores físicos y químicos ayudan en el <em>diseño</em>, 
            los de control aseguran la <em>operabilidad</em> y los estadísticos garantizan la <em>calidad</em>.
          </div>
        </>
      ),
      diagramComponent: <ComparisonDiagram />
    }
  ];

  return (
    <LessonLayout 
      tabs={tabs} 
      activeTabId={activeTab} 
      onTabChange={setActiveTab} 
    />
  );
};

export default App;