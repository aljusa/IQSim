import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
   
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine
} from 'recharts';
import { 
  Activity, 
  Settings, 
  Target, 
  RefreshCw, 
  Maximize, 
   
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import DivCarousel from '../assets/DivCarousel';

// --- Interfaces & Types ---

interface LessonSection {
  id: string;
  title: string;
  shortTitle: string;
  description: React.ReactNode;
  component: React.ReactNode;
}

interface DiagramProps {
  isActive?: boolean;
}

// --- Componentes de UI Base (Grid System - No Flexbox) ---

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);



// --- 1. Diagrama Estático: Explicación Inicial ---

const InitialModelDiagram: React.FC = () => {
  return (
   <div className="w-full h-96 grid place-items-center bg-slate-50 p-4">
  <svg viewBox="0 0 420 320" className="w-full h-full max-w-xl">

    {/* Definición de flechas */}
    <defs>
      <marker
        id="arrow"
        markerWidth="10"
        markerHeight="10"
        refX="6"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
      </marker>
    </defs>

    {/* Conexiones */}
    <line x1="210" y1="160" x2="210" y2="60" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
    <line x1="210" y1="160" x2="210" y2="260" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
    <line x1="210" y1="160" x2="90" y2="160" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
    <line x1="210" y1="160" x2="330" y2="160" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />

    {/* Centro */}
    <circle cx="210" cy="160" r="48" fill="#2563eb" />
    <text x="210" y="155" textAnchor="middle" fill="white" className="text-sm font-bold">
      MODELO
    </text>
    <text x="210" y="172" textAnchor="middle" fill="white" className="text-[10px] opacity-90">
      Núcleo matemático
    </text>

    {/* Simulación */}
    <g>
      <circle cx="210" cy="60" r="46" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
      <text x="210" y="55" textAnchor="middle" className="text-xs font-semibold fill-slate-800">
        Simulación
      </text>
      <text x="210" y="70" textAnchor="middle" className="text-[10px] fill-slate-600">
        Predice el sistema
      </text>
    </g>

    {/* Control */}
    <g>
      <circle cx="330" cy="160" r="46" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
      <text x="330" y="155" textAnchor="middle" className="text-xs font-semibold fill-slate-800">
        Control
      </text>
      <text x="330" y="170" textAnchor="middle" className="text-[10px] fill-slate-600">
        Ajusta acciones
      </text>
    </g>

    {/* Optimización */}
    <g>
      <circle cx="210" cy="260" r="46" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
      <text x="210" y="255" textAnchor="middle" className="text-xs font-semibold fill-slate-800">
        Optimización
      </text>
      <text x="210" y="270" textAnchor="middle" className="text-[10px] fill-slate-600">
        Mejora resultados
      </text>
    </g>

    {/* Dimensiones */}
    <g>
      <circle cx="90" cy="160" r="46" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
      <text x="90" y="155" textAnchor="middle" className="text-xs font-semibold fill-slate-800">
        Dimensiones
      </text>
      <text x="90" y="170" textAnchor="middle" className="text-[10px] fill-slate-600">
        Variables y estados
      </text>
    </g>
  </svg>
</div>

  );
};

// --- 2. Diagrama Dinámico: Progresión Análisis -> Acción ---

const ProgressionDiagram: React.FC = () => {

  const LEVELS = [
  {
    title: 'Descripción',
    subtitle: '¿Qué está pasando?',
    level: 1,
    styles: 'border-slate-300 bg-white text-slate-700',
  },
  {
    title: 'Predicción',
    subtitle: '¿Qué podría pasar?',
    level: 2,
    styles: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  {
    title: 'Prescripción',
    subtitle: '¿Qué debería hacerse?',
    level: 3,
    styles: 'border-blue-400 bg-blue-100 text-blue-800',
  },
  {
    title: 'Automatización',
    subtitle: 'El sistema actúa solo',
    level: 4,
    styles: 'border-blue-600 bg-blue-200 text-blue-900 font-bold shadow-md',
  },
]

  return (
    <div className="w-full p-8 bg-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

        {LEVELS.map((item, idx) => (
          <div key={item.level} className="relative flex items-center">
            <div
              className={`
                w-full p-5 rounded-xl border-2 text-center
                transition-all duration-500 hover:scale-[1.02]
                ${item.styles}
              `}
            >
              <span className="block text-xs uppercase tracking-wide opacity-70 mb-1">
                Nivel {item.level}
              </span>

              <h3 className="text-sm font-semibold mb-1">
                {item.title}
              </h3>

              <p className="text-xs opacity-80">
                {item.subtitle}
              </p>
            </div>

            {idx < LEVELS.length - 1 && (
              <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 text-slate-400">
                <ArrowRight size={22} />
              </div>
            )}
          </div>
        ))}

      </div>

      {/* Clasificación */}
      <div className="grid grid-cols-2 gap-8 mt-10 text-center text-sm">
        <div className="border-t border-slate-300 pt-3 text-slate-500">
          Análisis Pasivo
        </div>
        <div className="border-t border-blue-600 pt-3 font-semibold text-blue-700">
          Intervención Activa
        </div>
      </div>
    </div>
  );
};

// --- 3. Diagrama Dinámico: Flujo de Simulación ---

const SimulationFlowDiagram: React.FC<DiagramProps> = () => {
const [active, setActive] = useState('input');

return (
  <div className="w-full bg-slate-50 rounded-xl p-6 grid items-center justify-items-center border border-slate-200">

    {/* Flujo principal */}
    <div className="grid grid-flow-col gap-6 items-center">

      {/* Entradas */}
      <button
        onClick={() => setActive('input')}
        className={`
          px-5 py-4 rounded-lg border text-sm font-medium cursor-pointer
          transition-all duration-300
          ${active === 'input'
            ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-md scale-105'
            : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-100'}
        `}
      >
        Entradas (u)
      </button>

      <ArrowRight size={22} className="text-slate-300" />

      {/* Modelo */}
      <button
        onClick={() => setActive('model')}
        className={`
          px-6 py-5 rounded-full border-2 font-mono text-sm cursor-pointer
          transition-all duration-300
          ${active === 'model'
            ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-lg scale-105'
            : 'bg-white border-blue-300 text-blue-400 hover:bg-blue-50'}
        `}
      >
        f(x, u, t)
      </button>

      <ArrowRight size={22} className="text-slate-300" />

      {/* Salidas */}
      <button
        onClick={() => setActive('output')}
        className={`
          px-5 py-4 rounded-lg border text-sm font-medium cursor-pointer
          transition-all duration-300
          ${active === 'output'
            ? 'bg-green-100 border-green-500 text-green-800 shadow-md scale-105'
            : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-100'}
        `}
      >
        Salidas (y)
      </button>

    </div>

    {/* Texto explicativo */}
    <div className="mt-6 text-slate-600 text-sm text-center max-w-md min-h-[3rem]">

      {active === null && (
        "Haz clic en cualquier bloque para entender su rol dentro del sistema."
      )}

      {active === 'input' && (
        "Las entradas representan las variables externas o de control que alimentan al sistema."
      )}

      {active === 'model' && (
        "El modelo matemático describe cómo evolucionan los estados internos en función del tiempo y las entradas."
      )}

      {active === 'output' && (
        "Las salidas son las magnitudes observables que permiten evaluar el comportamiento del sistema."
      )}

    </div>

  </div>
);
};

// --- 4. Diagrama Interactivo: Dimensionamiento ---

const SizingInteractiveDiagram: React.FC = () => {
  const [capacity, setCapacity] = useState(50);
  const requirement = 80;
  const isPassed = capacity >= requirement;

  const data = [
    { name: 'Requerido', value: requirement, fill: '#94a3b8' },
    { name: 'Diseño Actual', value: capacity, fill: isPassed ? '#22c55e' : '#ef4444' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="space-y-6">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <Settings className="w-5 h-5" /> Parámetros de Diseño
        </h3>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Capacidad del Tanque (L)</label>
          <input 
            type="range" 
            min="0" 
            max="150" 
            value={capacity} 
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="text-right font-mono text-blue-600 font-bold">{capacity} L</div>
        </div>
        
        <div className={`p-4 rounded-lg border-l-4 ${isPassed ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <div className="flex items-center gap-2 font-bold mb-1">
            {isPassed ? <CheckCircle2 className="text-green-600 w-5 h-5"/> : <AlertCircle className="text-red-600 w-5 h-5"/>}
            <span className={isPassed ? 'text-green-800' : 'text-red-800'}>
              {isPassed ? 'Requisito Cumplido' : 'Diseño Insuficiente'}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            El sistema debe soportar al menos {requirement} L.
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 150]} />
            <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
            <Tooltip />
            <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- 5. Diagrama Dinámico: Optimización ---

const OptimizationDiagram: React.FC<DiagramProps> = ({ isActive }) => {
  const [iteration, setIteration] = useState(0);
  
  // Simulated optimization data curve
  const data = Array.from({ length: 20 }, (_, i) => ({
    x: i,
    cost: 100 * Math.exp(-0.2 * i) + 20 + Math.random() * 5
  }));

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setIteration((prev) => (prev < 19 ? prev + 1 : 0));
    }, 500);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
      <div className="md:col-span-4 space-y-4">
        <div className={`p-3 rounded transition-colors ${iteration % 3 === 0 ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-slate-50'}`}>
          <h4 className="font-bold text-sm">1. Prueba</h4>
          <p className="text-xs text-slate-500">Generar nueva solución candidata.</p>
        </div>
        <div className={`p-3 rounded transition-colors ${iteration % 3 === 1 ? 'bg-yellow-100 border-l-4 border-yellow-500' : 'bg-slate-50'}`}>
          <h4 className="font-bold text-sm">2. Evaluación</h4>
          <p className="text-xs text-slate-500">Calcular costo o función objetivo.</p>
        </div>
        <div className={`p-3 rounded transition-colors ${iteration % 3 === 2 ? 'bg-green-100 border-l-4 border-green-500' : 'bg-slate-50'}`}>
          <h4 className="font-bold text-sm">3. Mejora</h4>
          <p className="text-xs text-slate-500">Ajustar parámetros hacia el mínimo.</p>
        </div>
        <div className="mt-4 pt-4 border-t">
          <span className="text-xs font-mono uppercase text-slate-400">Iteración actual</span>
          <div className="text-2xl font-bold text-slate-800">#{iteration}</div>
        </div>
      </div>
      
      <div className="md:col-span-8 h-64 bg-white border rounded-lg p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" label={{ value: 'Iteraciones', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Costo ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="cost" 
              stroke="#2563eb" 
              strokeWidth={2} 
              dot={{ r: 4 }}
              isAnimationActive={false} 
            />
            <ReferenceLine x={iteration} stroke="red" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- 6. Diagrama Dinámico: Control (Feedback Loop) ---

const ControlLoopDiagram: React.FC<DiagramProps> = ({ isActive }) => {
  return (
    <div className="w-full h-80 bg-slate-50 relative overflow-hidden grid place-items-center">
      <svg viewBox="0 0 600 300" className="w-full h-full">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        {/* Bloques */}
        <rect x="250" y="50" width="100" height="60" rx="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
        <text x="300" y="85" textAnchor="middle" className="text-sm font-bold fill-blue-900">PLANTA</text>

        <rect x="250" y="200" width="100" height="60" rx="4" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2" />
        <text x="300" y="235" textAnchor="middle" className="text-sm font-bold fill-yellow-900">SENSOR</text>

        <rect x="50" y="50" width="100" height="60" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
        <text x="100" y="85" textAnchor="middle" className="text-sm font-bold fill-green-900">CONTROLADOR</text>

        {/* Sumador */}
        <circle cx="100" cy="230" r="15" fill="white" stroke="#64748b" strokeWidth="2" />
        <text x="100" y="235" textAnchor="middle" className="text-lg font-bold fill-slate-600">∑</text>

        {/* Líneas de Flujo */}
        {/* Controlador -> Planta */}
        <line x1="150" y1="80" x2="240" y2="80" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <text x="200" y="70" textAnchor="middle" className="text-xs fill-slate-500">Acción (u)</text>

        {/* Planta -> Salida & Sensor */}
        <line x1="350" y1="80" x2="450" y2="80" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <text x="400" y="70" textAnchor="middle" className="text-xs fill-slate-500">Salida (y)</text>
        <path d="M 400 80 L 400 230 L 360 230" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />

        {/* Sensor -> Sumador */}
        <line x1="250" y1="230" x2="125" y2="230" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <text x="187" y="220" textAnchor="middle" className="text-xs fill-slate-500">Medición</text>
        
        {/* Sumador -> Controlador */}
        <path d="M 100 215 L 100 120" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <text x="110" y="170" textAnchor="start" className="text-xs fill-red-500 font-bold">Error (e)</text>

        {/* Setpoint */}
        <line x1="40" y1="230" x2="80" y2="230" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <text x="40" y="220" textAnchor="start" className="text-xs fill-slate-500">Ref (r)</text>

        {/* Animación de Señal (solo decorativa si activo) */}
        {isActive && (
           <circle r="4" fill="#ef4444">
             <animateMotion 
               dur="4s" 
               repeatCount="indefinite"
               path="M 100 215 L 100 80 L 250 80 M 350 80 L 400 80 L 400 230 L 250 230 M 250 230 L 115 230"
             />
           </circle>
        )}
      </svg>
    </div>
  );
};

// --- 7. Diagrama Estático Comparativo: Resumen ---

const SummaryView: React.FC = () => {
  const summaryData = [
    { type: 'Simulación', goal: 'Entender/Predecir', time: 'Futuro', interaction: 'Baja' },
    { type: 'Dimensionamiento', goal: 'Validar Requisitos', time: 'Diseño', interaction: 'Media' },
    { type: 'Optimización', goal: 'Mejorar Rendimiento', time: 'Iterativo', interaction: 'Alta' },
    { type: 'Control', goal: 'Mantener Estabilidad', time: 'Tiempo Real', interaction: 'Autónoma' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-5 bg-slate-100 p-3 rounded-t-lg font-bold text-slate-700 text-sm">
        <div className="col-span-2">Tipo</div>
        <div>Objetivo</div>
        <div>Tiempo</div>
        <div>Interacción</div>
      </div>
      {summaryData.map((item, idx) => (
        <div key={idx} className="grid grid-cols-5 p-3 border-b border-slate-100 text-sm hover:bg-slate-50 transition-colors items-center">
          <div className="col-span-2 font-semibold text-blue-600 flex items-center gap-2">
            {idx === 0 && <Activity size={16}/>}
            {idx === 1 && <Maximize size={16}/>}
            {idx === 2 && <Target size={16}/>}
            {idx === 3 && <RefreshCw size={16}/>}
            {item.type}
          </div>
          <div className="text-slate-600">{item.goal}</div>
          <div className="text-slate-500 bg-slate-100 rounded px-2 py-1 text-xs w-fit">{item.time}</div>
          <div className="text-slate-600">{item.interaction}</div>
        </div>
      ))}
    </div>
  );
};

// --- Datos de la Lección ---

const LESSON_CONTENT: LessonSection[] = [
  {
    id: 'intro',
    title: 'Introducción a la lección',
    shortTitle: 'Inicio',
    description: (
<DivCarousel>
<p>En esta lección se muestra cómo <strong>la simulación se utiliza</strong> como una herramienta clave para <strong>analizar modelos matemáticos</strong> y apoyar la <strong>toma de decisiones</strong> técnicas y científicas, distinguiendo sus principales tipos según la finalidad del análisis.</p>
<p>Una vez que un modelo matemático ha sido formulado, <strong>no basta con conocer sus ecuaciones</strong>: es necesario explorar su comportamiento bajo <strong>diferentes condiciones</strong>. </p>
<p> La <strong>simulación</strong> permite realizar <strong>experimentos virtuales</strong> sobre el modelo, evitando riesgos, reduciendo costos y ahorrando tiempo. </p>
<p> Dependiendo de lo que se desee lograr <strong>—comprender</strong>, <strong>diseñar</strong>, <strong>mejorar</strong> o <strong>regular</strong> un sistema— la simulación adopta distintos enfoques.</p>
</DivCarousel>
),
    component: <InitialModelDiagram />
  },
  {
    id: 'types',
    title: 'Tipos de Simulaciones',
    shortTitle: 'Tipos',
    description: (
<DivCarousel>
<p>Se diferencian principalmente por la <strong>intención del análisis</strong>. En algunos casos se desea observar el comportamiento del sistema, en otros <strong>diseñarlo</strong>, <strong>mejorarlo</strong> o <strong>regularlo</strong>.
  </p>
  <p> Esta <strong>clasificación</strong> es especialmente relevante en ingeniería y ciencias aplicadas, donde los modelos sirven como <strong>apoyo directo a la planificación</strong> y a la toma de decisiones.</p>
<div><p><strong>Aspectos que definen el tipo de simulación:</strong></p>
<ul>
<li>Objetivo del análisis.</li>
<li>Tipo de resultados esperados.</li>
<li>Nivel de intervención sobre el modelo.</li>
</ul></div>

</DivCarousel>
),
    component: <ProgressionDiagram />
  },
  {
    id: 'simulation',
    title: 'Simulación',
    shortTitle: 'Simulación',
    description: (
<DivCarousel>
<p>La <strong>simulación</strong>, en su forma más general, consiste en r<strong>eproducir el comportamiento de un sistema</strong> utilizando su modelo matemático y un conjunto específico de valores de entrada. 
  <br />
  El <strong>objetivo</strong> no es cambiar el sistema, sino<strong> entender cómo responde ante distintas condiciones</strong>.</p>
  <div><p><strong>Características principales:</strong></p>
<ul>
<li>No modifica la estructura del modelo.</li>
<li>Permite analizar escenarios hipotéticos.</li>
<li>Se centra en la comprensión del funcionamiento del sistema.</li>
</ul></div>
<div><p><strong>Uso típico:</strong></p>
<ul>
<li>Evaluación del desempeño.</li>
<li>Análisis de sensibilidad.</li>
<li>Estudio de escenarios futuros.</li>
</ul></div>

</DivCarousel>
),
    component: <SimulationFlowDiagram  />
  },
  {
    id: 'sizing',
    title: 'Dimensionamiento',
    shortTitle: 'Dimensionamiento',
    description: (
<DivCarousel>
<p>El <strong>dimensionamiento</strong> emplea el modelo matemático para <strong>determinar valores adecuados de parámetros</strong> como tamaños, capacidades o cantidades.
<br /> A través de simulaciones repetidas, se busca que el<strong> sistema funcione correctamente bajo ciertas condiciones</strong> deseadas.</p>
<div><p><strong>Características principales:</strong></p>
<ul>
<li>Define parámetros óptimos de diseño.</li>
<li>Parte de requisitos de operación.</li>
<li>Usa simulaciones iterativas.</li>
</ul></div>
<div><p><strong>Uso típico:</strong></p>
<ul>
<li>Diseño de sistemas y componentes.</li>
<li>Planeación de recursos.</li>
<li>Evaluación de capacidad y rendimiento.</li>
</ul></div>

</DivCarousel>
),
    component: <SizingInteractiveDiagram />
  },
  {
    id: 'optimization',
    title: 'Optimización',
    shortTitle: 'Optimización',
    description: (
<DivCarousel>
<p>La <strong>optimización</strong> busca la <strong>mejor alternativa entre muchas posibles</strong>, según un criterio definido, como minimizar costos o maximizar eficiencia. 
<br />El modelo matemático se simula múltiples veces mientras se ajustan variables para mejorar el valor de una función objetivo.</p>
<div><p><strong>Características principales:</strong></p>
<ul>
<li>Incluye una función objetivo.</li>
<li>Considera restricciones del sistema.</li>
<li>Puede requerir métodos matemáticos avanzados.</li>
</ul></div>
<div><p><strong>Uso típico:</strong></p>
<ul>
<li>Minimización de costos.</li>
<li>Maximización de beneficios o eficiencia.</li>
<li>Mejora del desempeño global del sistema.</li>
</ul></div>

</DivCarousel>
),
    component: <OptimizationDiagram isActive={true} />
  },
  {
    id: 'control',
    title: 'Control Automático',
    shortTitle: 'Control',
    description: (
<DivCarousel>
<p>La simulación para control se centra en <strong>regular sistemas que cambian en el tiempo</strong>, aplicando acciones correctivas basadas en retroalimentación. 
  <br />El objetivo es <strong>mantener el sistema cerca de un comportamiento deseado</strong>, incluso ante perturbaciones.</p>
  <div><p><strong>Características principales:</strong></p>
<ul>
<li>Analiza sistemas dinámicos.</li>
<li>Considera entradas de control y perturbaciones.</li>
<li>Evalúa estabilidad y respuesta del sistema.</li>
</ul></div>
<div><p><strong>Uso típico:</strong></p>
<ul>
<li>Diseño de sistemas de control automático.</li>
<li>Regulación de procesos industriales.</li>
<li>Mantenimiento de condiciones deseadas.</li>
</ul></div>

</DivCarousel>
),
    component: <ControlLoopDiagram isActive={true} />
  },
  {
    id: 'summary',
    title: 'Cierre de la lección',
    shortTitle: 'Cierre',
    description: (
<DivCarousel>
<p>Los <strong>modelos matemáticos</strong> alcanzan su verdadero potencial cuando se utilizan mediante <strong>simulación</strong>.
  </p>
  <p> La simulación básica permite comprender el sistema; el dimensionamiento ayuda a diseñarlo; la optimización busca mejorarlo; y el control permite regular su comportamiento en el tiempo. </p>
  <p>Elegir correctamente el tipo de simulación es fundamental para obtener resultados útiles y aplicables en la toma de decisiones científicas y técnicas.</p>
</DivCarousel>
),
    component: <SummaryView />
  }
];

// --- Componente Principal (Layout) ---

const App: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>(LESSON_CONTENT[0].id);

  const activeSection = LESSON_CONTENT.find(s => s.id === activeTabId) || LESSON_CONTENT[0];

  return (
    // Layout Principal: CSS Grid (No Flexbox)
    // grid-rows: Header (auto) -> Content (1fr)
    <div className="bg-slate-100 p-4 md:p-8 font-sans text-slate-800 grid grid-rows-[auto_1fr] gap-6 max-w-7xl mx-auto">
      
      {/* Header Area */}
      <header className="grid gap-2">
        <div className="grid grid-flow-col justify-between items-center bg-white p-4 rounded-xl shadow-sm border-b border-slate-200">
          <div className="grid grid-flow-col gap-3 items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg grid place-items-center text-white">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Tipos de simulaciones en modelos matemáticos</h1>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-mono">
              v1.0.0
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Grid Flow) */}
        <nav className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 overflow-x-auto">
          <div className="grid grid-flow-col auto-cols-max gap-1 min-w-max">
            {LESSON_CONTENT.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTabId(section.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full text-center
                  ${activeTabId === section.id 
                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                `}
              >
                {section.shortTitle}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content Area (Grid 12 cols) */}
      <main className="grid grid-cols-1  gap-2 items-start">
        {/* Text Panel (Left/Top) */}
          <Card className="p-6 border-t-4 border-t-blue-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{activeSection.title}</h2>
              {activeSection.description}
          </Card>
                 {activeSection.component}
      </main>
    </div>
  );
};

export default App;