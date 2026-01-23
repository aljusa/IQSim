import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Database, 
  Code, 
  TrendingUp, 
  Layout, 
  Settings, 
  Play, 
  CheckCircle, 
  Box, 
  ArrowRight,
  Monitor
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid,  ResponsiveContainer, ReferenceDot } from 'recharts';
import DivCarousel from '../assets/DivCarousel';

// --- Tipos e Interfaces ---

interface SectionData {
  id: string;
  title: string;
  navLabel: string;
  content: React.ReactNode;
  diagramTitle: string;
  diagramDesc: string;
  DiagramComponent: React.FC;
}

// --- Componentes de UI Generales ---

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);



// --- Diagramas Específicos ---

// 1. Diagrama Estático: Relación Modelo-Simulador-Sistema
const SystemRelationshipDiagram: React.FC = () => {
  return (
    <div className="h-full w-full grid place-items-center p-4 bg-slate-50">
      <div className="grid grid-cols-2 gap-8 w-full max-w-md relative">
        {/* Flechas de conexión (SVG Overlay) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>
          {/* Real System <-> Model */}
          <path d="M 100 80 Q 200 20 300 80" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
          <path d="M 300 90 Q 200 150 100 90" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
          
          {/* Model -> Simulator */}
          <path d="M 350 120 L 350 200" fill="none" stroke="#6366f1" strokeWidth="3" markerEnd="url(#arrowhead)" />
          
          {/* Simulator -> Real System Analysis */}
          <path d="M 300 240 L 120 120" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" markerEnd="url(#arrowhead)" />
        </svg>

        {/* Nodos */}
        <div className="z-10 bg-white p-4 rounded-lg shadow-md border-t-4 border-slate-500 text-center grid place-items-center">
          <Box className="w-8 h-8 text-slate-500 mb-2" />
          <p className="font-bold text-slate-700">Sistema Real</p>
          <p className="text-xs text-slate-500">Fenómeno Físico</p>
        </div>

        <div className="z-10 bg-white p-4 rounded-lg shadow-md border-t-4 border-indigo-500 text-center grid place-items-center">
          <Database className="w-8 h-8 text-indigo-500 mb-2" />
          <p className="font-bold text-indigo-700">Modelo Matemático</p>
          <p className="text-xs text-slate-500">Ecuaciones</p>
        </div>

        <div className="col-span-2 mt-12 grid place-items-center">
           <div className="z-10 bg-white p-4 w-48 rounded-lg shadow-md border-t-4 border-emerald-500 text-center grid place-items-center">
            <Monitor className="w-8 h-8 text-emerald-500 mb-2" />
            <p className="font-bold text-emerald-700">Simulador</p>
            <p className="text-xs text-slate-500">Resolución Numérica</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Diagrama Dinámico: Simuladores de procesos (Construcción)
const SimulatorIntegrationDiagram: React.FC = () => {
  const [step, setStep] = useState(0);

  const parts = [
    { id: 1, name: "Modelo Matemático", icon: <Database size={20} />, color: "bg-blue-100 border-blue-300 text-blue-700" },
    { id: 2, name: "Algoritmo Numérico", icon: <Settings size={20} />, color: "bg-purple-100 border-purple-300 text-purple-700" },
    { id: 3, name: "Entorno Computacional", icon: <Layout size={20} />, color: "bg-orange-100 border-orange-300 text-orange-700" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < 3 ? prev + 1 : 0));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full w-full grid place-items-center p-6 bg-slate-50">
      <div className="grid gap-4 w-full max-w-sm">
        <div className="text-center mb-4 text-slate-500 font-medium text-sm">
            Ciclo de Integración: {step === 0 ? "Iniciando..." : step === 3 ? "Completo" : "Cargando módulo..."}
        </div>
        
        {parts.map((part, index) => (
          <div 
            key={part.id}
            className={`
              p-4 rounded-lg border-2 shadow-sm transition-all duration-500 grid grid-cols-[auto_1fr] gap-4 items-center
              ${index < step ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'}
              ${part.color}
            `}
          >
            <div className="bg-white p-2 rounded-full shadow-sm">{part.icon}</div>
            <div>
              <h4 className="font-bold">{part.name}</h4>
              <p className="text-xs opacity-80">Módulo {index + 1} integrado</p>
            </div>
          </div>
        ))}

        <div className={`mt-4 p-3 text-center bg-gray-800 text-white rounded-lg transition-opacity duration-500 ${step === 3 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="flex items-center justify-center gap-2">
                <CheckCircle size={16} /> Simulador Operativo
            </span>
        </div>
      </div>
    </div>
  );
};

// 3. Diagrama Dinámico: Codificación (Flujo)
const SoftwareFlowDiagram: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'coding' | 'compiling' | 'visualizing'>('idle');

  const handleRun = () => {
    if (status !== 'idle') return;
    setStatus('coding');
    setTimeout(() => setStatus('compiling'), 1500);
    setTimeout(() => setStatus('visualizing'), 3500);
    setTimeout(() => setStatus('idle'), 6000);
  };

  return (
    <div className="h-full w-full grid place-items-center p-6 bg-slate-50">
      <div className="grid grid-cols-3 gap-2 w-full items-center">
        
        {/* Step 1: Source Code */}
        <div className={`p-4 rounded-lg border-2 transition-colors duration-300 text-center ${status === 'coding' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
          <Code className={`mx-auto mb-2 ${status === 'coding' ? 'text-blue-600' : 'text-slate-400'}`} />
          <div className="text-xs font-bold text-slate-700">Código Fuente</div>
          <div className="text-[10px] text-slate-500 mt-2 font-mono bg-slate-100 p-1 rounded">
             {status === 'coding' ? 'Typing...' : 'main.cpp'}
          </div>
        </div>

        {/* Arrow 1 */}
        <div className="grid place-items-center">
          <ArrowRight className={`transition-all duration-300 ${status === 'coding' || status === 'compiling' ? 'text-blue-500 scale-125' : 'text-slate-200'}`} />
        </div>

        {/* Step 2: Implementation */}
        <div className={`p-4 rounded-lg border-2 transition-colors duration-300 text-center ${status === 'compiling' ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'}`}>
          <Cpu className={`mx-auto mb-2 ${status === 'compiling' ? 'text-purple-600' : 'text-slate-400'}`} />
          <div className="text-xs font-bold text-slate-700">Compilación</div>
           <div className="h-2 w-full bg-slate-200 rounded mt-2 overflow-hidden">
              <div className={`h-full bg-purple-500 transition-all duration-[2000ms] ${status === 'compiling' ? 'w-full' : 'w-0'}`}></div>
           </div>
        </div>

        {/* Connector - this breaks grid to next row in mobile but here handled for desktop logic mostly */}
         <div className="col-span-3 grid place-items-center py-4">
             <ArrowRight className={`rotate-90 md:rotate-90 transition-all duration-300 ${status === 'visualizing' ? 'text-green-500 scale-125' : 'text-slate-200'}`} />
         </div>

        {/* Step 3: Graphics (Centered below) */}
        <div className={`col-start-2 col-end-3 p-4 rounded-lg border-2 transition-colors duration-300 text-center ${status === 'visualizing' ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-white'}`}>
          <TrendingUp className={`mx-auto mb-2 ${status === 'visualizing' ? 'text-green-600' : 'text-slate-400'}`} />
          <div className="text-xs font-bold text-slate-700">Resultados</div>
          {status === 'visualizing' && <div className="text-[10px] text-green-600 mt-1 animate-pulse">Renderizado Completado</div>}
        </div>

      </div>

      <button 
        onClick={handleRun}
        disabled={status !== 'idle'}
        className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-full flex items-center gap-2 hover:bg-slate-700 disabled:opacity-50 transition-colors"
      >
        <Play size={16} /> {status === 'idle' ? 'Ejecutar Flujo' : 'Procesando...'}
      </button>
    </div>
  );
};

// 4. Diagrama Estático: Optimización Numérica (Recharts)
const OptimizationFlowDiagram: React.FC = () => {
  // Datos simulando una función convexa (ej. parabólica)
  const data = Array.from({ length: 21 }, (_, i) => {
    const x = i - 10;
    return { x: i, y: x * x + 10, label: x };
  });

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-slate-50">
       <div className="w-full h-64 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
         <ResponsiveContainer width="100%" height="100%">
           <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
             <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
             <XAxis dataKey="x" hide />
             <YAxis hide />
            
             <Line type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={3} dot={false} />
             {/* Punto Óptimo */}
             <ReferenceDot x={10} y={10} r={6} fill="#ef4444" stroke="none" />
           </LineChart>
         </ResponsiveContainer>
       </div>
       
       <div className="grid grid-cols-3 gap-2 mt-6 w-full text-center text-xs">
          <div className="p-2 bg-blue-50 border border-blue-200 rounded">
            <span className="block font-bold text-blue-800">Variables</span>
            Entradas (x)
          </div>
          <div className="grid place-items-center">
             <ArrowRight size={16} className="text-slate-400" />
          </div>
          <div className="p-2 bg-blue-50 border border-blue-200 rounded">
            <span className="block font-bold text-blue-800">Función Objetivo</span>
            Minimizar Costo (y)
          </div>
       </div>
       
       <div className="mt-2 text-red-500 font-bold text-sm flex items-center gap-2">
         <div className="w-3 h-3 bg-red-500 rounded-full"></div> Solución Óptima Global
       </div>
    </div>
  );
};

// --- Datos del Contenido ---

const sections: SectionData[] = [
  {
    id: 'intro',
    title: 'Fundamentos de la Simulación',
    navLabel: 'Introducción',
    content: (
<DivCarousel>
<p>En esta lección se muestra qué son los <strong>simuladores de procesos</strong>, para qué se <strong>utilizan</strong> y <strong>cómo se clasifican</strong>, de modo que puedas reconocer qué tipo de simulador es más adecuado según el modelo matemático y el objetivo del análisis.</p>
<p>Los simuladores de procesos son <strong>herramientas computacionales que permiten implementar modelos matemáticos</strong> y experimentar con ellos en un entorno virtual. </p>
<p>Gracias a estos simuladores, es posible <strong>analizar</strong>, <strong>diseñar</strong>, <strong>optimizar</strong> y <strong>controlar</strong> sistemas reales sin necesidad de intervenir directamente en ellos, lo que reduce riesgos, costos y tiempos. <br />Su elección depende del <strong>tipo de proceso</strong>, del <strong>nivel de detalle</strong> requerido y del <strong>propósito del estudio</strong>.</p>
</DivCarousel>
),
    diagramTitle: 'Ciclo de Modelado',
    diagramDesc: 'Relación entre el mundo real y el entorno virtual de simulación.',
    DiagramComponent: SystemRelationshipDiagram
  },
  {
    id: 'sec1.4',
    title: 'Simuladores de Procesos',
    navLabel: 'Simuladores',
    content: (
<DivCarousel>
  <div><p>Los simuladores de procesos integran tres elementos fundamentales:</p>
<ul>
<li><strong>Modelos</strong> matemáticos.</li>
<li><strong>Métodos</strong> numéricos.</li>
<li><strong>Entornos</strong> computacionales interactivos.</li>
</ul></div>

<p>Esta combinación permite reproducir el comportamiento de sistemas reales con <strong>distintos niveles de complejidad</strong>, desde cálculos numéricos simples hasta procesos industriales altamente detallados.</p>
</DivCarousel>
),
    diagramTitle: 'Integración de Componentes',
    diagramDesc: 'Visualización de la carga progresiva de los módulos del simulador.',
    DiagramComponent: SimulatorIntegrationDiagram
  },
  {
    id: 'sec1.4.1',
    title: 'Codificación de Software',
    navLabel: 'Codificación',
    content: (
<DivCarousel>
<p>La codificación directa consiste en <strong>implementar el modelo matemático mediante lenguajes de programación</strong> o entornos de cálculo científico. </p>

<p> Este enfoque ofrece <strong>máxima flexibilidad</strong>, ya que el usuario define explícitamente las ecuaciones y los métodos numéricos.</p>
<div><p><strong>Características principales:</strong></p>
<ul>
<li>Alta flexibilidad y <strong>personalización</strong>.</li>
<li><strong>Control total</strong> sobre ecuaciones y algoritmos.</li>
<li><strong>Requiere conocimientos</strong> de programación y modelación.</li>
</ul></div>
<div><p><strong>Aplicación general:</strong></p>
<ul>
<li><strong>Simulación</strong> de procesos físicos y matemáticos.</li>
<li>Desarrollo de<strong> modelos a medida</strong>.</li>
<li>Análisis numérico y <strong>visualización de resultados</strong>.</li>
</ul></div>

</DivCarousel>
),
    diagramTitle: 'Flujo de Desarrollo',
    diagramDesc: 'Ejecute la simulación para ver el tránsito de datos.',
    DiagramComponent: SoftwareFlowDiagram
  },
  {
    id: 'sec1.4.2',
    title: 'Simulador de Optimización',
    navLabel: 'Optimización',
    content: (
<DivCarousel>
<p>El Solver integrado en Excel, desarrollado por Microsoft, permite resolver <strong>problemas de maximización o minimización</strong> utilizando métodos de optimización numérica, sin necesidad de programación avanzada.</p>
<div><p><strong>Características principales:</strong></p>
<ul>
<li>Métodos de optimización incorporados.</li>
<li>Interfaz accesible.</li>
<li>Adecuado para problemas pequeños y medianos.</li>
</ul></div>
<div><p><strong>Aplicación general:</strong></p>
<ul>
<li>Optimización de recursos.</li>
<li>Análisis de decisiones.</li>
<li>Planeación y asignación óptima.</li>
</ul></div>

</DivCarousel>
),
    diagramTitle: 'Búsqueda del Óptimo',
    diagramDesc: 'Representación gráfica de una función objetivo convexa y su mínimo.',
    DiagramComponent: OptimizationFlowDiagram
  }
];

// --- Layout Principal (Grid System) ---

const LessonLayout: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState(sections[0].id);
  const activeSection = sections.find(s => s.id === activeTabId) || sections[0];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans grid grid-rows-[auto_auto_1fr] h-screen overflow-hidden">
      
      {/* 1. Header Area */}
      <header className="bg-slate-900 text-white p-4 grid grid-cols-[auto_1fr] gap-4 items-center shadow-md z-10">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Database size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Simulación y Optimización de Procesos</h1>
          <p className="text-xs text-slate-400 font-mono">Módulo Educativo 1.4</p>
        </div>
      </header>

      {/* 2. Navigation Tabs (Scrollable on mobile) */}
      <nav className="bg-white border-b border-slate-200 px-4 pt-4 overflow-x-auto">
        <div className="grid grid-flow-col auto-cols-max gap-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTabId(section.id)}
              className={`
                pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${activeTabId === section.id 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              {section.navLabel}
            </button>
          ))}
        </div>
      </nav>

      {/* 3. Main Content Area (CSS Grid Layout - No Flexbox) */}
      <main className="p-4 md:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min lg:auto-rows-auto">
          
          {/* Left Panel: Content Text */}
          <div className="lg:col-span-5 grid content-start gap-4">
            <Card className="p-6 h-full border-l-4 border-l-blue-500">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">{activeSection.title}</h2>
              <div className="prose prose-slate max-w-none">
                {activeSection.content}
              </div>
            </Card>
          </div>

          {/* Right Panel: Diagram Render */}
          <div className="lg:col-span-7 grid grid-rows-[auto_1fr] gap-4 h-full min-h-[400px]">
            {/* Diagram Info Header */}
            <div className="bg-slate-800 text-white rounded-lg p-4 shadow-sm grid grid-cols-[1fr_auto] gap-4 items-center">
               <div>
                  <h3 className="font-bold text-lg">{activeSection.diagramTitle}</h3>
                  <p className="text-xs text-slate-400">{activeSection.diagramDesc}</p>
               </div>
               <Layout className="text-slate-400 opacity-50" />
            </div>

            {/* Diagram Canvas */}
            <Card className="h-full relative grid place-items-center bg-slate-50 shadow-inner">
               <div className="w-full h-full absolute inset-0 overflow-hidden">
                 <activeSection.DiagramComponent />
               </div>
            </Card>
          </div>

        </div>
      </main>

    </div>
  );
};

export default LessonLayout;