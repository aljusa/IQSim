import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { 
  Activity, 
  Layers, 
  Cpu, 
  Settings, 
  Database, 
  ChevronRight,
  Info
} from 'lucide-react';
import DivCarousel from '../assets/DivCarousel';

// --- Interfaces & Types ---

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  section: string;
}

// --- Mock Data for Visualizations ---

const steadyData = [
  { time: 0, flow: 100, temp: 250 },
  { time: 10, flow: 100, temp: 250 },
  { time: 20, flow: 100, temp: 250 },
  { time: 30, flow: 100, temp: 250 },
  { time: 40, flow: 100, temp: 250 },
];

const dynamicData = [
  { time: 0, flow: 100, temp: 250 },
  { time: 5, flow: 110, temp: 255 },
  { time: 10, flow: 125, temp: 265 },
  { time: 15, flow: 115, temp: 260 },
  { time: 20, flow: 105, temp: 252 },
  { time: 25, flow: 100, temp: 250 },
];

// --- Sub-components: Diagrams ---

const ClassificationDiagram = () => (
  <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full p-4 bg-slate-50 rounded-xl border border-slate-200">
    <div className="grid place-items-center bg-blue-100 border-2 border-blue-400 rounded-lg p-4 text-center">
      <span className="font-bold text-blue-800">Estacionaria</span>
      <p className="text-xs text-blue-600">Variables constantes</p>
    </div>
    <div className="grid place-items-center bg-indigo-100 border-2 border-indigo-400 rounded-lg p-4 text-center">
      <span className="font-bold text-indigo-800">No Estacionaria</span>
      <p className="text-xs text-indigo-600">Variables dependientes del tiempo</p>
    </div>
    <div className="grid place-items-center bg-emerald-100 border-2 border-emerald-400 rounded-lg p-4 text-center">
      <span className="font-bold text-emerald-800">Modular</span>
      <p className="text-xs text-emerald-600">Bloques independientes</p>
    </div>
    <div className="grid place-items-center bg-orange-100 border-2 border-orange-400 rounded-lg p-4 text-center">
      <span className="font-bold text-orange-800">Basada en Ecuaciones</span>
      <p className="text-xs text-orange-600">Sistema global simultáneo</p>
    </div>
  </div>
);

const ModularSequentialDiagram = () => (
  <div className="grid place-items-center h-full">
    <svg viewBox="0 0 400 150" className="w-full max-w-lg">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
        </marker>
      </defs>
      {/* Blocks */}
      <rect x="20" y="50" width="80" height="50" rx="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
      <text x="60" y="80" textAnchor="middle" className="text-xs font-bold fill-slate-700">Mezclador</text>
      
      <line x1="100" y1="75" x2="140" y2="75" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
      
      <rect x="150" y="50" width="80" height="50" rx="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
      <text x="190" y="80" textAnchor="middle" className="text-xs font-bold fill-slate-700">Reactor</text>
      
      <line x1="230" y1="75" x2="270" y2="75" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
      
      <rect x="280" y="50" width="80" height="50" rx="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
      <text x="320" y="80" textAnchor="middle" className="text-xs font-bold fill-slate-700">Separador</text>
      
      <path d="M320,100 L320,130 L60,130 L60,100" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow)" />
      <text x="190" y="125" textAnchor="middle" className="text-[10px] fill-slate-400 italic">Iteración (Reciclo)</text>
    </svg>
  </div>
);

const EquationBasedDiagram = () => (
  <div className="grid place-items-center h-full p-8 bg-slate-900 rounded-xl overflow-hidden relative">
    <div className="absolute inset-0 opacity-20 grid grid-cols-6 gap-1">
      {Array.from({ length: 36 }).map((_, i) => (
        <div key={i} className="border border-blue-500 h-10 w-full"></div>
      ))}
    </div>
    <div className="relative z-10 text-blue-400 font-mono space-y-2 text-sm md:text-base">
      <p>{"f₁(x₁, x₂, ..., xₙ) = 0"}</p>
      <p>{"f₂(x₁, x₂, ..., xₙ) = 0"}</p>
      <p className="text-center">⋮</p>
      <p>{"fₙ(x₁, x₂, ..., xₙ) = 0"}</p>
      <div className="mt-4 p-4 border-2 border-blue-400 bg-blue-900/40 rounded text-center">
        <span className="text-white font-bold tracking-widest">MATRIZ JACOBIANA J[X]</span>
      </div>
    </div>
  </div>
);

const ToolExplorer = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    { name: "Python (NumPy/SciPy)", type: "Ecuaciones/Modular", color: "bg-blue-500" },
    { name: "Octave / MATLAB", type: "Ecuaciones", color: "bg-orange-500" },
    { name: "Aspen HYSYS", type: "Modular", color: "bg-indigo-500" },
    { name: "Julia", type: "Ecuaciones (Performance)", color: "bg-purple-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full p-4">
      <div className="grid grid-cols-1 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.name}
            onClick={() => setSelectedTool(tool.name)}
            className={`p-3 rounded-lg text-left transition-all border-2 ${
              selectedTool === tool.name 
              ? 'border-blue-600 bg-blue-50 translate-x-2' 
              : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${tool.color}`}></div>
              <span className="font-semibold text-slate-700">{tool.name}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 grid place-items-center p-6">
        {selectedTool ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <h4 className="text-lg font-bold text-slate-800 mb-2">{selectedTool}</h4>
            <p className="text-slate-600 text-sm">
              {tools.find(t => t.name === selectedTool)?.type === "Modular" 
                ? "Ideal para simulación comercial de procesos químicos industriales con librerías termodinámicas robustas."
                : "Excelente para resolver modelos matemáticos personalizados y sistemas de ecuaciones diferenciales complejos."}
            </p>
          </div>
        ) : (
          <p className="text-slate-400 italic">Selecciona una herramienta para ver detalles</p>
        )}
      </div>
    </div>
  );
};

// --- Main Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const LessonLayout = ({ activeTab, tabs, onTabChange }: { activeTab: string, tabs: TabConfig[], onTabChange: (id: string) => void }) => {
  const currentTab = useMemo(() => tabs.find(t => t.id === activeTab) || tabs[0], [activeTab, tabs]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[85vh]">
      {/* Navigation Sidebar/Tabs Area */}
      <nav className="md:col-span-12 grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border-b-4 ${
              activeTab === tab.id 
              ? 'bg-blue-600 text-white border-blue-800 shadow-md' 
              : 'bg-white text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] md:text-xs font-bold mt-1 uppercase tracking-tighter truncate w-full text-center">
              {tab.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="md:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Side */}
        <div className="grid grid-rows-[auto_1fr] gap-4">
          <header>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">{currentTab.title}</h2>
          </header>
          
          <Card className="p-6 bg-white flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-slate-600">
                <Info className="w-5 h-5 mt-1 flex-shrink-0 text-blue-500" />
                <p className="leading-relaxed text-lg">
                  {currentTab.description}
                </p>
              </div>
            </div>
            
                      </Card>
        </div>

        {/* Visualization Side */}
        <div className="grid grid-rows-[auto_1fr] gap-4">
          <Card className="p-4 bg-white min-h-[400px]">
            <DiagramRenderer type={activeTab} />
          </Card>
        </div>
      </main>
    </div>
  );
};

const DiagramRenderer = ({ type }: { type: string }) => {
  switch (type) {
    case 'classification':
      return <ClassificationDiagram />;
    case 'steady':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={steadyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" label={{ value: 'Tiempo (t)', position: 'insideBottomRight', offset: -10 }} />
            <YAxis label={{ value: 'Magnitud', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
            <Line type="monotone" dataKey="flow" stroke="#2563eb" strokeWidth={3} dot={false} name="Flujo de Masa" />
            <Line type="monotone" dataKey="temp" stroke="#ea580c" strokeWidth={3} dot={false} name="Temperatura" />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'dynamic':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dynamicData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="flow" stroke="#2563eb" fillOpacity={1} fill="url(#colorFlow)" name="Perturbación de Flujo" />
            <Line type="monotone" dataKey="temp" stroke="#ea580c" strokeWidth={2} name="Respuesta Térmica" />
          </AreaChart>
        </ResponsiveContainer>
      );
    case 'modular':
      return <ModularSequentialDiagram />;
    case 'equations':
      return <EquationBasedDiagram />;
    case 'interactive':
      return <ToolExplorer />;
    default:
      return <div className="grid place-items-center h-full text-slate-400">Seleccione un panel</div>;
  }
};

// --- App Root ---

export default function App() {
  const [activeTab, setActiveTab] = useState('classification');

  const tabs: TabConfig[] = [
    { 
      id: 'classification', 
      label: 'Clasificación', 
      icon: <Layers size={20} />, 
      section: 'Sección 2.2.1',
      title: 'Jerarquía de Simulación',
      description:  (
      <DivCarousel>
        <p>
          No todos los procesos se comportan de la misma forma ni requieren el mismo tratamiento computacional. Algunos pueden analizarse suponiendo condiciones constantes, mientras que otros requieren estudiar su evolución temporal. De manera paralela, los modelos pueden resolverse siguiendo una secuencia lógica de unidades o como un sistema global de ecuaciones.
        </p>
        <div> <p>
          En esta lección se abordan:
        </p>
        <ul>
          <li>La clasificación de la simulación según el comportamiento temporal del proceso.</li>
          <li>Los principales enfoques computacionales para resolver los modelos.</li>
        </ul>
        <p>
          Este análisis permite comprender las ventajas, limitaciones y aplicaciones de cada alternativa.
        </p></div>
       
      </DivCarousel>
    )
    },
    { 
      id: 'steady', 
      label: 'Estacionario', 
      icon: <Activity size={20} />, 
      section: 'Sección 2.2.2',
      title: 'Estado Estacionario',
      description:  (
      <DivCarousel>
        <p>
          Un proceso estacionario es aquel en el que las variables de interés no cambian con el tiempo. El sistema opera en condiciones constantes y se encuentra en equilibrio. La simulación estacionaria se enfoca en describir ese estado final sin considerar cómo se llegó a él.
        </p>
        <div><p>
          Este tipo de simulación se utiliza principalmente para:
        </p>
        <ul>
          <li>Resolver balances de materia y energía en estado estable.</li>
          <li>Analizar el desempeño del proceso bajo condiciones fijas.</li>
          <li>Comparar diferentes escenarios operativos.</li>
        </ul>
        <p>
          Debido a su menor complejidad, la simulación estacionaria es ampliamente empleada en el diseño y análisis preliminar de procesos.
        </p></div>
        
      </DivCarousel>
    )
    },
    { 
      id: 'dynamic', 
      label: 'Dinámico', 
      icon: <Settings size={20} />, 
      section: 'Sección 2.2.3',
      title: 'Simulación Dinámica',
      description:  (
      <DivCarousel>
        <p>
          En los procesos no estacionarios o dinámicos, las variables cambian con el tiempo. Este comportamiento es típico durante arranques, paradas, perturbaciones externas o cambios en las condiciones de operación.
        </p>
        <ul> <p>
          La simulación no estacionaria se caracteriza por:
        </p>
        <ul>
          <li>Considerar explícitamente el tiempo como variable independiente.</li>
          <li>Formular ecuaciones diferenciales que describen la evolución del sistema.</li>
          <li>Analizar la respuesta dinámica del proceso ante cambios.</li>
        </ul>
        <p>
          Este tipo de simulación es fundamental para el estudio de control de procesos, estabilidad y seguridad operativa.
        </p></ul>
       
      </DivCarousel>
    )
    },
    { 
      id: 'modular', 
      label: 'Modular', 
      icon: <ChevronRight size={20} />, 
      section: 'Sección 2.2.4',
      title: 'Enfoque Modular Secuencial',
      description: (
      <DivCarousel>
        <p>
          El simulador modular secuencial representa el proceso como una cadena de módulos o unidades de operación conectadas entre sí. Cada unidad se resuelve de forma independiente siguiendo el orden del flujo del proceso.
        </p>
        <div><p>
          Sus características principales incluyen:
        </p>
        <ul>
          <li>Resolución paso a paso de cada módulo.</li>
          <li>Uso de resultados intermedios como entradas para las unidades siguientes.</li>
          <li>Estructura intuitiva y cercana al diagrama de flujo del proceso.</li>
        </ul>
        <p>
          Este enfoque es muy utilizado en simuladores comerciales, especialmente para procesos estacionarios, aunque requiere estrategias especiales cuando existen ciclos de recirculación.
        </p></div>
        
      </DivCarousel>
    )
    },
    { 
      id: 'equations', 
      label: 'Ecuaciones', 
      icon: <Cpu size={20} />, 
      section: 'Sección 2.2.5',
      title: 'Basado en Ecuaciones',
      description: (
      <DivCarousel>
        <p>
          El simulador basado en ecuaciones plantea el modelo del proceso como un conjunto global de ecuaciones algebraicas y/o diferenciales que se resuelven de manera simultánea.
        </p>
        <div> <p>
          Este enfoque se distingue por:
        </p>
        <ul>
          <li>No depender de un orden secuencial de cálculo.</li>
          <li>Tratar todas las variables como parte de un sistema integrado.</li>
          <li>Ofrecer mayor flexibilidad para procesos complejos y altamente acoplados.</li>
        </ul>
        <p>
          Aunque exige mayor esfuerzo computacional y conceptual, resulta especialmente adecuado para procesos dinámicos y sistemas con múltiples interacciones.
        </p></div>
       
      </DivCarousel>
    )
    },
    { 
      id: 'interactive', 
      label: 'Explorador', 
      icon: <Database size={20} />, 
      section: 'Sección 2.2.6',
      title: 'Relación y Herramientas',
      description: (
      <DivCarousel>
        <div><p>
          La implementación práctica de los tipos de simulación estudiados se apoya en herramientas computacionales de cálculo numérico y visualización. Lenguajes y entornos como Python u Octave permiten:
        </p>
        <ul>
          <li>Resolver sistemas de ecuaciones algebraicas y diferenciales.</li>
          <li>Implementar simulaciones estacionarias y dinámicas.</li>
          <li>Analizar y visualizar el comportamiento del proceso.</li>
        </ul>
        <p>
          Estas herramientas facilitan el prototipado de modelos y refuerzan la comprensión conceptual de los enfoques de simulación.
        </p></div>
        
      </DivCarousel>
    )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-4 md:p-8">
      {/* Main Grid Wrapper */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
        
        {/* Header Section */}
        <header className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-xl text-white">
              <Cpu size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800">Tipos de simulación y enfoques computacionales</h1>
            </div>
          </div>
        </header>

        {/* Lesson Content Wrapper */}
        <LessonLayout 
          activeTab={activeTab} 
          tabs={tabs} 
          onTabChange={setActiveTab} 
        />

      </div>
    </div>
  );
}