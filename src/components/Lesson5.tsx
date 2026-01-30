import React, { useState, useEffect } from 'react';
import { Layers, Activity, Split, Scale, RefreshCw, GitMerge, BookOpen, Info } from 'lucide-react';
import DivCarousel from '../assets/DivCarousel';

// --- TIPO DE DATOS Y DEFINICIONES ---

type SectionId = '2.1.1' | '2.1.2' | '2.1.3' | '2.1.4' | '2.1.5' | 'closure';

interface LessonSection {
  id: SectionId;
  title: string;
  shortTitle: string;
  description: React.ReactNode;
  icon: React.ElementType;
}

// Datos del contenido (Hardcoded para este propósito educativo)
const LESSON_DATA: LessonSection[] = [
  {
    id: '2.1.1',
    shortTitle: 'Relación General',
    title: 'Introducción al análisis y simulación de procesos',
    description: (
      <DivCarousel>
        <p>
          El <strong>análisis de procesos</strong> es una actividad <strong>previa</strong> y necesaria a la <strong>simulación</strong>.
          <br /> Consiste en examinar <strong>cómo está organizado un proceso</strong>, cuáles son sus <strong>elementos</strong>, qué <strong>relaciones</strong> existen entre ellos y qué <strong>información</strong> es indispensable para describirlo de forma coherente. 
          <br /> La <strong>simulación</strong>, por su parte, utiliza esta estructura para <strong>reproducir el comportamiento del proceso</strong> mediante modelos matemáticos y computacionales.
        </p>
        <div> <p>
         <strong> Antes de simular</strong>, es indispensable:
        </p>
        <ul>
          <li>Comprender el <strong>proceso</strong> como un todo.</li>
          <li>Identificar sus <strong>límites</strong> y <strong>componentes</strong>.</li>
          <li>Reconocer <strong>dependencias</strong> y <strong>restricciones</strong> internas.</li>
        </ul>
        <p>
          Este análisis preliminar reduce errores de modelado y asegura que la simulación represente fielmente la realidad del sistema estudiado.
        </p></div>
       
      </DivCarousel>
    ),
    icon: Layers,
  },
  {
    id: '2.1.2',
    shortTitle: 'Subsistemas',
    title: 'Sistemas y subsistemas',
    description: (
      <DivCarousel>
        <p>
          Un <strong>proceso</strong> puede entenderse como un <strong>sistema</strong>, es decir, un <strong>conjunto de elementos interrelacionados que interactúan</strong> para cumplir un <strong>objetivo común</strong>. 
          <br />Estos elementos incluyen <strong>equipos</strong>, <strong>corrientes</strong> de materia o energía, <strong>variables</strong> de operación y <strong>restricciones</strong> físicas o lógicas.
        </p>
        <p>
          Debido a la <strong>complejidad</strong> de muchos procesos, el sistema completo suele dividirse en <strong>subsistemas</strong>.
          <br /> Cada subsistema representa una <strong>parte funcional</strong> del proceso y se conecta con otros mediante <strong>entradas</strong> y <strong>salidas</strong> bien definidas.
        </p>
        <div> <p>
          Esta descomposición permite:
        </p>
        <ul>
          <li>Analizar partes del proceso de forma <strong>independiente</strong>.</li>
          <li>Reducir la <strong>complejidad</strong> conceptual.</li>
          <li>Definir con claridad los <strong>límites</strong> del modelo.</li>
        </ul></div>
       
      </DivCarousel>
    ),
    icon: Activity,
  },
  {
    id: '2.1.3',
    shortTitle: 'Bloques Funcionales',
    title: 'Descomposición de diagramas de flujo',
    description: (
      <DivCarousel>
        <p>
          El <strong>diagrama de flujo</strong> de procesos es una <strong>herramienta gráfica</strong> fundamental para el <strong>análisis estructural</strong>.
          <br /> En él se representan las etapas del proceso y las corrientes que las conectan. Sin embargo, para un análisis riguroso, el diagrama completo debe descomponerse en partes más simples.
        </p>
        <div> <p>
          La descomposición implica:
        </p>
        <ul>
          <li>Identificar las <strong>unidades</strong> de proceso principales.</li>
          <li>Reconocer corrientes de <strong>entrada</strong>, <strong>salida</strong> y <strong>recirculación</strong>.</li>
          <li>Agrupar <strong>etapas</strong> en secciones funcionales coherentes.</li>
        </ul></div>
       
        <p>
          Este enfoque facilita el análisis detallado de cada sección y permite comprender mejor las interacciones internas antes de formular un modelo de simulación.
        </p>
      </DivCarousel>
    ),
    icon: Split,
  },
  {
    id: '2.1.4',
    shortTitle: 'Grados de Libertad',
    title: 'Grados de libertad',
    description: (
      <DivCarousel>
        <p>
          Los grados de libertad de un proceso <strong>indican cuántas variables pueden especificarse de manera independiente</strong> sin violar las restricciones del sistema. <br /> Este análisis permite evaluar si el <strong>proceso está correctamente planteado</strong> desde el punto de vista matemático.
        </p>
        <div><p>
          El estudio de grados de libertad se basa en comparar:
        </p>
        <ul>
          <li>Número de <strong>variables desconocidas</strong>.</li>
          <li>Número de <strong>ecuaciones independientes</strong> disponibles.</li>
        </ul></div>
        <div> <p>
          Según el resultado, el proceso puede estar:
        </p>
        <ul>
          <li><strong>Correctamente</strong> especificado.</li>
          <li>Subespecificado (<strong>faltan datos</strong>).</li>
          <li>Sobreespecificado (<strong>información redundante</strong> o contradictoria).</li>
        </ul><p>
          Un análisis adecuado asegura que el modelo sea consistente y resoluble.
        </p></div>
       
        
      </DivCarousel>
    ),
    icon: Scale,
  },
  {
    id: '2.1.5',
    shortTitle: 'Recirculación',
    title: 'Localización de ciclos máximos',
    description: (
      <DivCarousel>
        <p>
          En muchos diagramas de flujo aparecen ciclos o lazos de <strong>recirculación</strong>, donde una corriente regresa a una etapa anterior del proceso.
          <br /> La localización de ciclos máximos consiste en<strong> identificar los lazos cerrados más grandes </strong> y relevantes dentro del diagrama.
        </p>
        <div>    <p>
          Estos ciclos son importantes porque:
        </p>
        <ul>
          <li>Condicionan el <strong>orden de cálculo</strong> del proceso.</li>
          <li>Influyen en la <strong>convergencia</strong> de los modelos de simulación.</li>
          <li>Requieren <strong>estrategias</strong> específicas para su <strong>resolución</strong>.</li>
        </ul>
        <p>
          Reconocerlos permite anticipar dificultades numéricas y estructurar correctamente el modelo.
        </p></div>
    
      </DivCarousel>
    ),
    icon: RefreshCw,
  },
  {
    id: 'closure',
    shortTitle: 'Integración',
    title: 'Cierre de la lección',
    description: (
      <DivCarousel>
        <p>
          El análisis estructural de procesos es la <strong>base de cualquier simulación confiable</strong>.
          <br /> Comprender un proceso como un sistema compuesto por subsistemas, descomponer adecuadamente sus diagramas de flujo, evaluar sus grados de libertad y localizar ciclos máximos permite construir modelos coherentes y robustos. 
          <br /> Estos fundamentos conceptuales son indispensables para avanzar hacia la simulación de procesos como herramienta de análisis y apoyo a la toma de decisiones.
        </p>
      </DivCarousel>
    ),
    icon: GitMerge,
  },
];

// --- COMPONENTES UI BASE ---

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

// --- COMPONENTES DE DIAGRAMAS (VISUALIZACIÓN) ---

// 2.1.1 Relación General
const DiagramRelacion: React.FC = () => (
  <svg viewBox="0 0 800 400" className="w-full h-full bg-slate-50 rounded-lg">
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
      </marker>
    </defs>
    
    {/* Proceso Real */}
    <g transform="translate(100, 150)">
      <rect x="0" y="0" width="160" height="100" rx="8" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
      <text x="80" y="45" textAnchor="middle" className="font-bold fill-slate-700 text-lg">Proceso Real</text>
      <text x="80" y="70" textAnchor="middle" className="text-xs fill-slate-500">(Planta Física)</text>
    </g>

    {/* Flecha 1 */}
    <line x1="260" y1="200" x2="340" y2="200" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />

    {/* Análisis */}
    <g transform="translate(350, 150)">
      <circle cx="50" cy="50" r="60" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
      <text x="50" y="55" textAnchor="middle" className="font-bold fill-slate-700 text-lg">Análisis</text>
    </g>

    {/* Flecha 2 */}
    <line x1="460" y1="200" x2="540" y2="200" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />

    {/* Modelo */}
    <g transform="translate(540, 150)">
      <rect x="0" y="0" width="160" height="100" rx="8" fill="#fff7ed" stroke="#f97316" strokeWidth="2" />
      <text x="80" y="45" textAnchor="middle" className="font-bold fill-slate-700 text-lg">Modelo</text>
      <text x="80" y="70" textAnchor="middle" className="text-xs fill-slate-500">(Simulación)</text>
    </g>
  </svg>
);

// 2.1.2 Subsistemas
const DiagramSubsistemas: React.FC = () => (
  <svg viewBox="0 0 800 400" className="w-full h-full bg-slate-50 rounded-lg">
    {/* Contenedor Global */}
    <rect x="50" y="50" width="700" height="300" rx="15" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
    <text x="80" y="80" className="font-bold fill-slate-400 text-sm uppercase">Sistema Global</text>

    {/* Conexiones */}
    <path d="M 230 200 L 300 200" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrowhead)" />
    <path d="M 500 200 L 570 200" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrowhead)" />
    <path d="M 400 250 L 400 280 L 620 280 L 620 250" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />

    {/* Subsistema A */}
    <g transform="translate(80, 150)">
      <rect width="150" height="100" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
      <text x="75" y="55" textAnchor="middle" className="font-semibold fill-blue-900">Subsistema A</text>
    </g>

    {/* Subsistema B */}
    <g transform="translate(300, 150)">
      <rect width="200" height="100" rx="4" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
      <text x="100" y="55" textAnchor="middle" className="font-semibold fill-emerald-900">Subsistema B</text>
    </g>

    {/* Subsistema C */}
    <g transform="translate(570, 150)">
      <rect width="150" height="100" rx="4" fill="#fae8ff" stroke="#d946ef" strokeWidth="2" />
      <text x="75" y="55" textAnchor="middle" className="font-semibold fill-fuchsia-900">Subsistema C</text>
    </g>
  </svg>
);

// 2.1.3 Dinámico (Decomposition)
const DiagramDescomposicion: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setExpanded(prev => !prev), 3000);
    return () => clearInterval(timer);
  }, []);

  const gap = expanded ? 80 : 10;
  
  return (
    <svg viewBox="0 0 800 400" className="w-full h-full bg-slate-50 rounded-lg transition-all duration-1000">
      <text x="400" y="50" textAnchor="middle" className="font-bold fill-slate-500">
        {expanded ? "Análisis por Bloques Aislados" : "Diagrama de Flujo Integrado"}
      </text>

      <g style={{ transition: 'transform 1s ease-in-out', transform: `translate(${-gap}px, 0)` }}>
        <rect x="250" y="150" width="100" height="100" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
        <text x="300" y="205" textAnchor="middle" className="font-bold fill-slate-700">1</text>
      </g>

      <g style={{ transition: 'transform 1s ease-in-out', transform: `translate(${gap}px, 0)` }}>
        <rect x="350" y="150" width="100" height="100" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
        <text x="400" y="205" textAnchor="middle" className="font-bold fill-slate-700">2</text>
      </g>

      {/* Línea de conexión que se rompe o estira */}
      <line 
        x1={350 - gap} 
        y1="200" 
        x2={350 + gap} 
        y2="200" 
        stroke={expanded ? "#ef4444" : "#475569"} 
        strokeWidth="3" 
        strokeDasharray={expanded ? "5,5" : "0"}
      />
      
      {expanded && (
         <text x="400" y="190" textAnchor="middle" className="text-xs fill-red-500 font-bold animate-pulse">CORTE</text>
      )}
    </svg>
  );
};

// 2.1.4 Balanza (Grados de Libertad)
const DiagramGradosLibertad: React.FC = () => (
  <svg viewBox="0 0 800 400" className="w-full h-full bg-slate-50 rounded-lg">
    {/* Base Balanza */}
    <path d="M 350 350 L 450 350 L 400 250 Z" fill="#64748b" />
    <rect x="200" y="250" width="400" height="10" rx="5" fill="#475569" />

    {/* Lado Variables (Pesado) */}
    <g transform="translate(200, 180)">
      <rect width="80" height="70" fill="#3b82f6" opacity="0.8" />
      <text x="40" y="40" textAnchor="middle" className="fill-white font-bold text-xl">Nv</text>
      <text x="40" y="60" textAnchor="middle" className="fill-white text-xs">Variables</text>
    </g>

    {/* Lado Ecuaciones (Contrapeso) */}
    <g transform="translate(520, 180)">
      <rect width="80" height="70" fill="#10b981" opacity="0.8" />
      <text x="40" y="40" textAnchor="middle" className="fill-white font-bold text-xl">Ne</text>
      <text x="40" y="60" textAnchor="middle" className="fill-white text-xs">Ecuaciones</text>
    </g>

    {/* Fórmula Central */}
    <text x="400" y="100" textAnchor="middle" className="font-mono text-2xl font-bold fill-slate-800">
      Nf = Nv - Ne
    </text>
    <text x="400" y="130" textAnchor="middle" className="text-sm fill-slate-500">
      (Si Nf = 0, el problema está bien especificado)
    </text>
  </svg>
);

// 2.1.5 Recirculación (Dinámico)
const DiagramRecirculacion: React.FC = () => (
  <svg viewBox="0 0 800 400" className="w-full h-full bg-slate-50 rounded-lg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#93c5fd', stopOpacity: 1 }} />
      </linearGradient>
    </defs>

    {/* Bloques */}
    <rect x="150" y="150" width="100" height="100" rx="8" fill="white" stroke="#334155" strokeWidth="2" />
    <text x="200" y="205" textAnchor="middle" className="font-bold fill-slate-700">Reactor</text>

    <rect x="550" y="150" width="100" height="100" rx="8" fill="white" stroke="#334155" strokeWidth="2" />
    <text x="600" y="205" textAnchor="middle" className="font-bold fill-slate-700">Separador</text>

    {/* Flujo Directo */}
    <path d="M 250 180 L 550 180" stroke="#94a3b8" strokeWidth="4" />
    <circle cx="250" cy="180" r="4" fill="#3b82f6">
      <animate attributeName="cx" from="250" to="550" dur="2s" repeatCount="indefinite" />
    </circle>

    {/* Flujo Recirculación (Curvo) */}
    <path id="recyclePath" d="M 600 250 C 600 350, 200 350, 200 250" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="10,10" />
    
    {/* Partícula Recirculación */}
    <circle r="6" fill="#ef4444">
      <animateMotion dur="3s" repeatCount="indefinite">
        <mpath href="#recyclePath" />
      </animateMotion>
    </circle>

    <text x="400" y="340" textAnchor="middle" className="font-bold fill-amber-600">Lazo de Recirculación</text>
  </svg>
);

// Closure
const DiagramIntegrador: React.FC = () => (
  <svg viewBox="0 0 800 400" className="w-full h-full bg-slate-50 rounded-lg">
    <line x1="100" y1="200" x2="700" y2="200" stroke="#e2e8f0" strokeWidth="4" />
    
    <g transform="translate(150, 200)">
      <circle r="40" fill="#3b82f6" />
      <text x="0" y="5" textAnchor="middle" fill="white" className="text-xs font-bold">Subsistemas</text>
    </g>

    <g transform="translate(316, 200)">
      <circle r="40" fill="#10b981" />
      <text x="0" y="5" textAnchor="middle" fill="white" className="text-xs font-bold">Variables</text>
    </g>

    <g transform="translate(482, 200)">
      <circle r="40" fill="#f59e0b" />
      <text x="0" y="5" textAnchor="middle" fill="white" className="text-xs font-bold">Reciclo</text>
    </g>

    <g transform="translate(650, 200)">
      <circle r="50" fill="#6366f1" />
      <text x="0" y="0" textAnchor="middle" fill="white" className="text-sm font-bold">MODELO</text>
      <text x="0" y="15" textAnchor="middle" fill="white" className="text-xs">ROBUSTO</text>
    </g>

    <text x="400" y="100" textAnchor="middle" className="text-2xl font-bold fill-slate-700">Análisis Estructural Completo</text>
  </svg>
);

// --- COMPONENTE PRINCIPAL (LAYOUT & LOGIC) ---

export default function StructuralAnalysisApp() {
  const [activeTabId, setActiveTabId] = useState<SectionId>('2.1.1');

  const activeSection = LESSON_DATA.find(s => s.id === activeTabId) || LESSON_DATA[0];

  const renderDiagram = () => {
    switch (activeTabId) {
      case '2.1.1': return <DiagramRelacion />;
      case '2.1.2': return <DiagramSubsistemas />;
      case '2.1.3': return <DiagramDescomposicion />;
      case '2.1.4': return <DiagramGradosLibertad />;
      case '2.1.5': return <DiagramRecirculacion />;
      case 'closure': return <DiagramIntegrador />;
      default: return <div className="p-10 text-center text-slate-400">Diagrama no encontrado</div>;
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-slate-100 font-sans text-slate-800">
      {/* LAYOUT GRID:
         - Grid puro, sin flexbox en el contenedor principal.
         - 3 Filas: Header, Tabs, Content
      */}
      <div className="w-full">
        
        {/* ROW 1: HEADER */}
        <header className="bg-slate-900 text-white p-4 border-b border-slate-700 grid grid-cols-[auto_1fr] items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Fundamentos del análisis y simulación de procesos</h1>
          </div>
        </header>

        {/* ROW 2: TABS NAVIGATION */}
        <nav className="w-full grid grid-flow-col auto-cols-fr overflow-x-auto bg-white border-b border-slate-200 p-1">
          {/* Grid para las pestañas. `grid-flow-col` asegura que se alineen horizontalmente */}
            {LESSON_DATA.map((section) => {
              const isActive = activeTabId === section.id;
              const Icon = section.icon;
              return (
                  <button
                    onClick={() => setActiveTabId(section.id)}
                    className={`
                      px-4 py-3 rounded-md text-sm font-medium transition-all duration-200
                      flex items-center gap-2 border
                      ${isActive 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                        : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{section.shortTitle}</span>
                  </button>
              );
            })}
        </nav>

        {/* ROW 3: MAIN CONTENT AREA */}
        <main className="p-6 ">
          <div className="h-full w-full grid grid-cols-1 gap-6">
            
            {/* COLUMN LEFT: INFO PANEL (4/12 width on large screens) */}
            <div className="lg:col-span-4 h-full overflow-y-auto pr-2">
              <Card className="h-full flex flex-col">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                    {activeSection.title}
                  </h2>
                </div>
                
                <div className="p-6 flex-grow">
                  <div className="flex items-start gap-3 mb-6">
                    <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {activeSection.description}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* COLUMN RIGHT: DIAGRAM RENDER (8/12 width on large screens) */}
            <div className="h-full">
              <Card className="h-full bg-slate-50 border-slate-200">
                     {renderDiagram()}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}