import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import { 
  Settings, Database, Activity, Thermometer, FlaskConical, Layers, 
  Cpu, Code2, Share2, Info, ChevronRight, Binary
} from 'lucide-react';
import DivCarousel from '../assets/DivCarousel';

// --- Types & Interfaces ---

interface SectionData {
  id: string;
  title: string;
  description: React.ReactNode;
  type: 'static' | 'dynamic' | 'interactive';
  icon: React.ElementType;
}

// --- Mock Data for Dynamic Charts ---

const timeSeriesData = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  concentration: Math.exp(-0.1 * i) * 10,
  temperature: 300 + 50 * (1 - Math.exp(-0.2 * i)),
  yield: 100 * (1 - Math.exp(-0.15 * i))
}));

const transportData = Array.from({ length: 10 }, (_, i) => ({
  position: i,
  concentration: 10 * Math.pow(0.8, i),
  flux: 5 * Math.exp(-0.5 * i)
}));

const energyData = Array.from({ length: 15 }, (_, i) => ({
  step: i,
  tempProfile: 25 + (75 * Math.sin(i / 4)),
  energyLoss: 10 * Math.cos(i / 5) + 20
}));

// --- UI Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl ${className}`}>
    {children}
  </div>
);

const Header = () => (
  <header className="h-16 border-b border-slate-700 bg-slate-950 flex items-center justify-between px-8">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-600 rounded-lg">
        <Cpu className="text-white w-5 h-5" />
      </div>
      <h1 className="text-xl font-bold text-slate-100 tracking-tight uppercase">Simulación de procesos industriales con reacción química</h1>
    </div>
  </header>
);

// --- Diagram Components ---

const DiagramMateriaEnergia = () => (
  <div className="w-full h-full flex items-center justify-center p-8 bg-slate-950/50 rounded-lg">
    <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orientation="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
        </marker>
      </defs>
      {/* Nodes */}
      <rect x="150" y="20" width="100" height="40" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
      <text x="200" y="45" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">Masa</text>
      
      <rect x="50" y="120" width="100" height="40" rx="4" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
      <text x="100" y="145" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">Energía</text>
      
      <rect x="250" y="120" width="100" height="40" rx="4" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
      <text x="300" y="145" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">Cinética</text>
      
      <circle cx="200" cy="230" r="40" fill="#3b82f622" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
      <text x="200" y="225" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="bold">MODELO</text>
      <text x="200" y="240" textAnchor="middle" fill="#3b82f6" fontSize="9">COMPUTACIONAL</text>

      {/* Connections */}
      <path d="M200,60 L200,180" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M100,160 L180,210" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M300,160 L220,210" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
    </svg>
  </div>
);

const DiagramPythonSim = () => (
  <div className="grid grid-cols-3 gap-4 h-64 p-4">
    <div className="border border-slate-700 rounded p-3 bg-slate-900 flex flex-col items-center justify-center text-center">
      <Code2 className="text-yellow-500 mb-2" />
      <span className="text-xs font-mono text-slate-300">def model(y, t):<br/>return dy_dt</span>
    </div>
    <div className="flex items-center justify-center">
      <ChevronRight className="text-slate-600" />
    </div>
    <div className="border border-slate-700 rounded p-3 bg-slate-900 flex flex-col items-center justify-center text-center">
      <Activity className="text-blue-500 mb-2" />
      <span className="text-xs font-mono text-slate-300">odeint(model, y0, t)</span>
    </div>
  </div>
);

const DiagramIntegrador = () => {
  const [active, setActive] = useState(0);
  const elements = [
    { name: 'Balance Materia', model: 'Ecuaciones Diferenciales', tool: 'Python/NumPy' },
    { name: 'Balance Energía', model: 'Leyes Termodinámicas', tool: 'SciPy/Octave' },
    { name: 'Cinética Quím.', model: 'Modelos de Reacción', tool: 'Matplotlib' }
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {elements.map((el, i) => (
          <button 
            key={i}
            onClick={() => setActive(i)}
            className={`p-4 rounded-lg border transition-all ${active === i ? 'bg-blue-600 border-blue-400' : 'bg-slate-800 border-slate-700 opacity-60'}`}
          >
            <h4 className="text-sm font-bold text-white uppercase">{el.name}</h4>
          </button>
        ))}
      </div>
      <div className="bg-slate-950 p-6 rounded-xl border border-blue-500/30">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Modelo Matemático</span>
            <p className="text-xl text-blue-400 font-serif mt-2 italic">{elements[active].model}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Herramienta Computacional</span>
            <p className="text-xl text-emerald-400 font-mono mt-2">{elements[active].tool}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

const sections: SectionData[] = [
  { id: '2.3.1', title: ' Introducción a la simulación de procesos con reacción química', description: (
      <DivCarousel>
        <p>
          Los procesos industriales con reacción química suelen involucrar múltiples fenómenos acoplados: flujos de materia, intercambio de energía y transformaciones químicas. Para simularlos adecuadamente, es necesario integrar modelos matemáticos con métodos numéricos eficientes y entornos computacionales adecuados.
        </p>
        <div> <p>
          El uso de software libre permite:
        </p>
        <ul>
          <li>Desarrollar modelos transparentes y reproducibles.</li>
          <li>Analizar procesos estacionarios y dinámicos.</li>
          <li>Explorar escenarios operativos complejos sin depender de plataformas propietarias.</li>
        </ul></div>
       
      </DivCarousel>
    ), type: 'static', icon: FlaskConical },
  { id: '2.3.2', title: 'Introducción a Python para simulación de procesos', description:(
      <DivCarousel>
        <p>
          Python es un lenguaje de programación de alto nivel ampliamente utilizado en ingeniería por su sintaxis clara y su ecosistema científico. En simulación de procesos, Python actúa como un puente directo entre los modelos matemáticos y su implementación computacional.
        </p>
        <div><p>
          Sus ventajas principales son:
        </p>
        <ul>
          <li>Facilidad para traducir ecuaciones a código.</li>
          <li>Amplia disponibilidad de bibliotecas científicas.</li>
          <li>Integración sencilla con herramientas de visualización.</li>
        </ul>
        <p>
          Python se emplea como plataforma central para construir y ejecutar simulaciones de procesos industriales.
        </p></div>
        
      </DivCarousel>
    ), type: 'static', icon: Code2 },
  { id: '2.3.3', title: 'NumPy y SciPy: cálculo numérico', description:  (
      <DivCarousel>
        <p>
          NumPy y SciPy constituyen la base del cálculo numérico en Python. NumPy permite manejar arreglos multidimensionales y realizar operaciones vectorizadas, fundamentales para balances de materia y energía.
        </p>
        <div>  <p>
          SciPy amplía estas capacidades al incluir algoritmos para:
        </p>
        <ul>
          <li>Resolver sistemas de ecuaciones algebraicas.</li>
          <li>Integrar ecuaciones diferenciales.</li>
          <li>Aplicar métodos numéricos avanzados.</li>
        </ul>
        <p>
          Estas bibliotecas hacen posible simular procesos estacionarios y dinámicos de manera eficiente.
        </p></div>
      
      </DivCarousel>
    ), type: 'static', icon: Binary },
  { id: '2.3.4', title: 'Matplotlib: visualización de resultados', description:  (
      <DivCarousel>
        <p>
          La simulación no se limita al cálculo; la interpretación de resultados es esencial. Matplotlib permite representar gráficamente el comportamiento de las variables del proceso.
        </p>
        <div> <p>
          Con esta herramienta es posible:
        </p>
        <ul>
          <li>Visualizar perfiles de concentración y temperatura.</li>
          <li>Analizar la evolución temporal de un sistema.</li>
          <li>Comparar distintos escenarios operativos.</li>
        </ul>
        <p>
          La visualización apoya la comprensión del comportamiento del proceso y facilita la toma de decisiones.
        </p></div>
       
      </DivCarousel>
    ), type: 'dynamic', icon: Activity },
  { id: '2.3.5', title: 'Introducción a Octave como alternativa libre', description:  (
      <DivCarousel>
        <p>
          GNU Octave es un entorno de cálculo numérico de software libre con un enfoque matricial similar al de Matlab. Su estructura lo hace especialmente adecuado para el análisis y simulación de procesos.
        </p>
        <div> <p>
          Octave se utiliza para:
        </p>
        <ul>
          <li>Resolver balances de materia y energía.</li>
          <li>Implementar modelos matemáticos de procesos.</li>
          <li>Prototipar simulaciones de forma rápida.</li>
        </ul>
        <p>
          Su similitud con Matlab facilita el aprendizaje y la migración entre plataformas.
        </p></div>
       
      </DivCarousel>
    ), type: 'static', icon: Layers },
  { id: '2.3.6', title: 'Simulación de operaciones de transferencia de materia', description: (
      <DivCarousel>
        <p>
          Las operaciones de transferencia de materia, como absorción o destilación, se describen mediante balances de materia acoplados con relaciones de equilibrio y cinéticas de transferencia.
        </p>
        <div>  <p>
          La simulación de estas operaciones permite:
        </p>
        <ul>
          <li>Evaluar la eficiencia de separación.</li>
          <li>Analizar el efecto de parámetros operativos.</li>
          <li>Predecir composiciones de salida.</li>
        </ul>
        <p>
          Los métodos numéricos facilitan la resolución de los modelos no lineales asociados a estos procesos.
        </p></div>
      
      </DivCarousel>
    ), type: 'dynamic', icon: Share2 },
  { id: '2.3.7', title: 'Simulación de operaciones de transferencia de energía', description: (
      <DivCarousel>
        <p>
          La transferencia de energía es esencial en intercambiadores de calor, reactores y sistemas térmicos. Su modelado se basa en balances de energía y ecuaciones de transferencia de calor.
        </p>
        <div><p>
          La simulación permite:
        </p>
        <ul>
          <li>Estimar perfiles de temperatura.</li>
          <li>Evaluar requerimientos energéticos.</li>
          <li>Analizar la influencia térmica sobre las reacciones químicas.</li>
        </ul>
        <p>
          Integrar estos efectos es clave para modelos industriales realistas.
        </p></div>
        
      </DivCarousel>
    ), type: 'dynamic', icon: Thermometer },
  { id: '2.3.8', title: 'Simulación de reactores químico', description:  (
      <DivCarousel>
        <p>
          La simulación de reactores químicos combina balances de materia y energía con expresiones cinéticas que describen la velocidad de reacción. Dependiendo del tipo de reactor, los modelos pueden ser algebraicos o diferenciales.
        </p>
        <div> <p>
          La simulación permite:
        </p>
        <ul>
          <li>Predecir conversiones y rendimientos.</li>
          <li>Analizar el efecto de condiciones de operación.</li>
          <li>Estudiar el comportamiento dinámico del reactor.</li>
        </ul>
        <p>
          Estas simulaciones son fundamentales para el diseño y optimización de procesos reactivos.
        </p></div>
       
      </DivCarousel>
    ), type: 'dynamic', icon: Settings },
  { id: 'close', title: 'Resumen Integrador', description:  (
      <DivCarousel>
        <p>
          En esta lección se integraron los fundamentos de simulación con herramientas computacionales de software libre para el análisis de procesos industriales con transferencia y reacción química. Se introdujeron Python y Octave como plataformas de simulación, junto con bibliotecas numéricas y de visualización, y se abordó el modelado de operaciones de transferencia y reactores químicos. Estos conceptos sientan las bases para desarrollar simulaciones industriales realistas y analizarlas de forma computacional.
        </p>
      </DivCarousel>
    ), type: 'interactive', icon: Info },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(sections[0].id);

  const activeSection = useMemo(() => 
    sections.find(s => s.id === activeTab) || sections[0]
  , [activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* GRID LAYOUT PRINCIPAL */}
      <div className="grid grid-rows-[auto_1fr] h-screen">
        <Header />
        
        <main className="grid grid-cols-[300px_1fr] overflow-hidden">
          {/* Sidebar de navegación - Reemplazando pestañas por un panel lateral técnico */}
          <aside className="border-r border-slate-800 bg-slate-900/50 overflow-y-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 transition-all border-l-2 ${
                  activeTab === section.id 
                  ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                  : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <section.icon size={18} strokeWidth={activeTab === section.id ? 2.5 : 2} />
                <div className="text-left">
                  <div className="text-sm font-semibold truncate w-40">{section.title}</div>
                </div>
              </button>
            ))}
          </aside>

          {/* Área de Contenido */}
          <section className="p-10 overflow-y-auto grid grid-rows-[auto_auto_1fr] gap-6 max-w-6xl mx-auto w-full">
            <div>
              <h2 className="text-4xl font-black text-white mt-4 tracking-tight">
                {activeSection.title}
              </h2>
            </div>

            <Card className="bg-slate-900/30 border-slate-800 p-6">
              <div className="flex gap-4 items-start">
                <div className="mt-1 p-2 rounded-lg bg-slate-800">
                  <Info className="text-slate-400 w-5 h-5" />
                </div>
                {activeSection.description}
                
              </div>
            </Card>

            {/* RENDER DEL DIAGRAMA */}
            <Card className="flex flex-col border-slate-700 bg-slate-900 shadow-inner">
             
              
              <div className="flex-1 min-h-[450px] p-8 flex items-center justify-center">
                {activeTab === '2.3.1' && <DiagramMateriaEnergia />}
                {activeTab === '2.3.2' && <DiagramPythonSim />}
                {activeTab === '2.3.3' && (
                   <div className="grid grid-cols-4 gap-4 w-full max-w-2xl font-mono text-center">
                      {Array.from({length: 12}).map((_, i) => (
                        <div key={i} className="p-4 bg-slate-800 border border-slate-700 text-blue-400 text-xs rounded">
                          x[{i}] = {Math.random().toFixed(4)}
                        </div>
                      ))}
                   </div>
                )}
                {activeTab === '2.3.4' && (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                      <Legend />
                      <Line type="monotone" dataKey="concentration" stroke="#3b82f6" strokeWidth={3} dot={false} name="Conc. Reactor" />
                      <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={3} dot={false} name="T (K)" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                {activeTab === '2.3.5' && (
                   <div className="bg-slate-950 p-8 rounded border-2 border-slate-700 font-mono text-emerald-500 leading-tight">
                      [ A ] * [ x ] = [ b ] <br/>
                      -------------------<br/>
                      {">> "} A = inv(M) * K;<br/>
                      {">> "} eig(A) <br/>
                      ans = -0.4500 + 0.1200i
                   </div>
                )}
                {activeTab === '2.3.6' && (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={transportData}>
                      <defs>
                        <linearGradient id="colorConc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="position" stroke="#94a3b8" label={{ value: 'Posición Axial (z)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Area type="monotone" dataKey="concentration" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorConc)" name="Perfil Conc." />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                {activeTab === '2.3.7' && (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="step" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Bar dataKey="tempProfile" fill="#f97316" name="Carga Térmica" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {activeTab === '2.3.8' && (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Line type="stepAfter" dataKey="yield" stroke="#10b981" strokeWidth={4} name="Rendimiento %" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                {activeTab === 'close' && <DiagramIntegrador />}
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}