import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine, BarChart, Bar, AreaChart, Area } from 'recharts';
import { Activity, Thermometer, TrendingDown, BarChart2, Zap, Settings, Calculator } from 'lucide-react';

// --- Types & Interfaces ---

interface ExerciseData {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  objective: string;
  math: React.ReactNode;
  variables: string[];
}

// --- Components ---

const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = "", title }) => (
  <div className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {title && <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 font-semibold text-slate-700">{title}</div>}
    <div className="p-4 h-full">
      {children}
    </div>
  </div>
);

// --- Simulation Logic Helpers ---

const generateTankData = (Qin: number) => {
  const data = [];
  let h = 0; // Altura inicial
  const A = 2;
  const k = 0.6;
  const dt = 1; // paso de tiempo (min)
  
  for (let t = 0; t <= 30; t += dt) {
    data.push({ time: t, level: parseFloat(h.toFixed(2)) });
    // dh/dt = (Qin - k*sqrt(h)) / A
    const dh = (Qin - k * Math.sqrt(h)) / A;
    h = h + dh * dt;
    if (h < 0) h = 0;
  }
  return data;
};

const generateRegressionData = () => {
  // Datos experimentales dados
  const raw = [
    { T: 40, R: 55 }, { T: 50, R: 63 }, { T: 60, R: 72 }, 
    { T: 70, R: 78 }, { T: 80, R: 81 }
  ];
  
  // Generamos puntos para las curvas de tendencia (simuladas visualmente para el ejercicio)
  // Modelo Lineal aprox: R = 0.66T + 29
  // Modelo Cuadrático aprox: R = -0.015T^2 + 2.5T - 20 (ajuste visual para demo)
  const curves = [];
  for (let t = 35; t <= 85; t+=5) {
    curves.push({
      T: t,
      Linear: (0.66 * t + 29).toFixed(1),
      Quadratic: (-0.012 * t * t + 2.1 * t - 10).toFixed(1) // Ajuste simplificado
    });
  }
  return { raw, curves };
};

const generateCostData = () => {
  const data = [];
  let minCost = Infinity;
  let optT = 0;

  for (let T = 40; T <= 100; T += 2) {
    // C(T) = 0.02T^2 - 2T + 120
    const cost = 0.02 * Math.pow(T, 2) - 2 * T + 120;
    data.push({ T, cost: parseFloat(cost.toFixed(2)) });
    if (cost < minCost) {
      minCost = cost;
      optT = T;
    }
  }
  return { data, minCost, optT };
};

const generateMonteCarloData = () => {
  // Box-Muller para distribución normal
  const randomNormal = (mean: number, stdDev: number) => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  const values = [];
  for (let i = 0; i < 1000; i++) {
    values.push(randomNormal(10, 2));
  }

  // Crear histograma
  const bins: Record<string, number> = {};
  for(let i=4; i<=16; i++) bins[i] = 0;
  
  values.forEach(v => {
    const bin = Math.round(v);
    if (bins[bin] !== undefined) bins[bin]++;
  });

  return Object.keys(bins).map(k => ({ bin: k, count: bins[k] }));
};

const generateControlData = (Kp: number) => {
  const data = [];
  const setPoint = 1.5;
  let level = 0;
  // Simulación simplificada de proceso de primer orden
  for (let t = 0; t <= 50; t++) {
    const error = setPoint - level;
    const controlAction = Kp * error;
    // Dinámica del sistema: Nivel_nuevo = Nivel_viejo + (Entrada - Salida_natural) * inercia
    // Simplificado: cambio es proporcional a la acción de control
    level = level + (controlAction * 0.1); 
    data.push({ time: t, level: parseFloat(level.toFixed(2)), setPoint });
  }
  return data;
};

const generatePopulationData = () => {
  const data = [];
  let P = 100;
  const r = 0.05;
  for (let n = 0; n <= 50; n++) {
    data.push({ n, P: Math.round(P) });
    P = P + r * P;
  }
  return data;
};

// --- Main Application ---

export default function EngineeringSimulations() {
  const [activeTab, setActiveTab] = useState("ex1");
  const [ex1Qin, setEx1Qin] = useState(0.5); // Estado local para interactividad Ex 1
  const [ex6Kp, setEx6Kp] = useState(0.5);   // Estado local para interactividad Ex 6

  // Memoized Data Generation
  const tankData = useMemo(() => generateTankData(ex1Qin), [ex1Qin]);
  const regressionData = useMemo(() => generateRegressionData(), []);
  const costData = useMemo(() => generateCostData(), []);
  const monteCarloData = useMemo(() => generateMonteCarloData(), []);
  const controlData = useMemo(() => generateControlData(ex6Kp), [ex6Kp]);
  const popData = useMemo(() => generatePopulationData(), []);

  // Definición de Ejercicios
  const exercises: Record<string, ExerciseData> = {
    ex1: {
      id: "ex1",
      title: "1. Simulación Tanque",
      icon: Activity,
      objective: "Modelar nivel de tanque con EDO.",
      description: "Simulación del comportamiento de altura h(t) de un tanque con salida por gravedad y entrada constante. Se utiliza el método de Euler para resolver la ecuación diferencial.",
      math: <span className="font-mono text-sm">dh/dt = (Qin - k√h) / A</span>,
      variables: ["A = 2 m²", "k = 0.6", "Qin variable"]
    },
    ex2: {
      id: "ex2",
      title: "2. Regresión",
      icon: Thermometer,
      objective: "Comparar modelos Lineal vs Cuadrático.",
      description: "Ajuste de datos experimentales de Temperatura vs Rendimiento. Se visualizan los datos crudos contra las tendencias calculadas para determinar el mejor ajuste (R²).",
      math: <span className="font-mono text-sm">y = ax² + bx + c vs y = mx + b</span>,
      variables: ["T: 40-80°C", "Rendimiento: %"]
    },
    ex3: {
      id: "ex3",
      title: "3. Optimización",
      icon: TrendingDown,
      objective: "Minimizar costos con Solver.",
      description: "Búsqueda del mínimo global de una función de costo cuadrática convexa dentro de un rango operativo específico.",
      math: <span className="font-mono text-sm">C(T) = 0.02T² - 2T + 120</span>,
      variables: ["40 ≤ T ≤ 100", "Min Costo"]
    },
    ex4: {
      id: "ex4",
      title: "4. Monte Carlo",
      icon: BarChart2,
      objective: "Simular proceso probabilístico.",
      description: "Generación de 1000 eventos aleatorios basados en una distribución normal para analizar la frecuencia de tiempos de llegada.",
      math: <span className="font-mono text-sm">N(μ=10, σ=2)</span>,
      variables: ["n = 1000", "Prob(t < 8)"]
    },
    ex5: {
      id: "ex5",
      title: "5. Estado Estacionario",
      icon: Zap,
      objective: "Dinámico vs Estacionario.",
      description: "Análisis visual de cómo un sistema alcanza el equilibrio (estado estacionario) donde la entrada iguala a la salida.",
      math: <span className="font-mono text-sm">Entrada = Salida → dh/dt = 0</span>,
      variables: ["t_estabilización", "h_final"]
    },
    ex6: {
      id: "ex6",
      title: "6. Control P",
      icon: Settings,
      objective: "Simular controlador Proporcional.",
      description: "Implementación de un lazo cerrado de control. Se observa cómo la ganancia Kp afecta la velocidad de respuesta y el error en estado estacionario (offset).",
      math: <span className="font-mono text-sm">u(t) = Kp * e(t)</span>,
      variables: ["Set Point = 1.5m", "Kp variable"]
    },
    ex7: {
      id: "ex7",
      title: "7. Población (Calc)",
      icon: Calculator,
      objective: "Modelo discreto (Hoja de cálculo).",
      description: "Simulación de crecimiento poblacional exponencial utilizando una ecuación en diferencias finitas, típica de implementaciones en Excel/LibreOffice.",
      math: <span className="font-mono text-sm">P(n+1) = P(n) + rP(n)</span>,
      variables: ["P0 = 100", "r = 0.05"]
    }
  };

  const activeData = exercises[activeTab];

  // Render Logic Switch
  const renderDiagram = () => {
    switch (activeTab) {
      case "ex1":
        return (
          <div className="h-full flex flex-col gap-4">
             <div className="flex justify-end items-center gap-2 p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium text-blue-800">Caudal Qin: {ex1Qin}</span>
                <input 
                  type="range" min="0.3" max="1.0" step="0.1" 
                  value={ex1Qin} 
                  onChange={(e) => setEx1Qin(parseFloat(e.target.value))}
                  className="w-32 accent-blue-600"
                />
             </div>
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tankData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Tiempo (min)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Nivel (m)', angle: -90, position: 'insideLeft' }} domain={[0, 2]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="level" stroke="#2563eb" strokeWidth={2} name={`Nivel (Qin=${ex1Qin})`} dot={false} />
                <ReferenceLine y={Math.pow(ex1Qin/0.6, 2)} stroke="red" strokeDasharray="3 3" label="Estacionario Teórico" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case "ex2":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="T" name="Temp" unit="°C" domain={[30, 90]} />
              <YAxis type="number" dataKey="R" name="Rendimiento" unit="%" domain={[40, 90]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Datos Exp" data={regressionData.raw} fill="#dc2626" shape="circle" />
              <Scatter name="Tendencia Quad" data={regressionData.curves} line={{ stroke: '#2563eb', strokeWidth: 2 }} shape={() => null} />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case "ex3":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={costData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="T" label={{ value: 'Temp (°C)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Costo ($)', angle: -90, position: 'insideLeft' }} domain={[60, 140]} />
              <Tooltip />
              <Area type="monotone" dataKey="cost" stroke="#059669" fill="#d1fae5" name="Costo Operación" />
              <ReferenceLine x={costData.optT} stroke="red" label="Óptimo (50°C)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "ex4":
        return (
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monteCarloData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bin" label={{ value: 'Tiempo (min)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Frecuencia', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" name="Frecuencia" />
              <ReferenceLine x="8" stroke="red" label="Límite 8 min" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "ex5":
         // Reusing Tank Logic but focused on steady state concept
         return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tankData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" label={{ value: 'Tiempo', position: 'insideBottom' }} />
              <YAxis domain={[0, 1]} label={{ value: 'Nivel', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="level" stroke="#ea580c" strokeWidth={2} name="Dinámica Transitoria" dot={false} />
              <ReferenceLine y={0.69} stroke="green" strokeDasharray="5 5" label="Estado Estacionario" />
            </LineChart>
          </ResponsiveContainer>
        );
      case "ex6":
        return (
          <div className="h-full flex flex-col gap-4">
             <div className="flex justify-end items-center gap-2 p-2 bg-indigo-50 rounded">
                <span className="text-sm font-medium text-indigo-800">Ganancia Kp: {ex6Kp}</span>
                <input 
                  type="range" min="0.1" max="2.0" step="0.1" 
                  value={ex6Kp} 
                  onChange={(e) => setEx6Kp(parseFloat(e.target.value))}
                  className="w-32 accent-indigo-600"
                />
             </div>
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={controlData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 2]} />
                <Tooltip />
                <Legend />
                <Line type="stepAfter" dataKey="setPoint" stroke="#9ca3af" strokeDasharray="5 5" name="Set Point" dot={false} />
                <Line type="monotone" dataKey="level" stroke="#4f46e5" strokeWidth={2} name={`Respuesta (Kp=${ex6Kp})`} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case "ex7":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={popData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="n" label={{ value: 'Iteraciones', position: 'insideBottom' }} />
              <YAxis label={{ value: 'Población', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Area type="monotone" dataKey="P" stroke="#db2777" fill="#fce7f3" name="Crecimiento Exp" />
            </LineChart>
          </ResponsiveContainer>
        );
      default: return <div>Seleccione un ejercicio</div>;
    }
  };

  // --- Grid Layout ---
  // Using explicit CSS Grid as requested (no main flexbox)
  return (
    <div className="w-full h-screen bg-slate-100 text-slate-800 font-sans" style={{
      display: 'grid',
      gridTemplateRows: 'auto auto 1fr', // Header, Tabs, Content
      gap: '1rem',
      padding: '1rem'
    }}>
      
      {/* 1. Header Area */}
      <header className="bg-slate-900 text-white rounded-lg shadow-md p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Activity className="text-blue-400" />
            Laboratorio de Simulación e Ingeniería
          </h1>
          <p className="text-slate-400 text-sm mt-1">Modelado Dinámico, Optimización y Control</p>
        </div>
        <div className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
          v1.0 • React + TypeScript + Recharts
        </div>
      </header>

      {/* 2. Tabs Navigation Area */}
      <nav className="bg-white rounded-lg shadow-sm p-2 overflow-x-auto" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Object.keys(exercises).length}, minmax(140px, 1fr))`,
        gap: '0.5rem'
      }}>
        {Object.values(exercises).map((ex) => {
          const Icon = ex.icon;
          const isActive = activeTab === ex.id;
          return (
            <button
              key={ex.id}
              onClick={() => setActiveTab(ex.id)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-md transition-all duration-200 text-sm font-medium
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}
              `}
            >
              <Icon size={20} className="mb-1 opacity-80" />
              <span className="truncate w-full text-center">{ex.title}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. Main Content Grid */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr', // Left Panel (Info) | Right Panel (Viz)
        gap: '1rem',
        minHeight: 0 // Prevent overflow issues in grid
      }} className="hidden md:grid">
        
        {/* Left Panel: Description & Math */}
        <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: '1rem' }}>
          <Card title="Conceptos Clave" className="h-full">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{activeData.title}</h3>
                <p className="text-sm text-blue-600 font-medium mt-1">{activeData.objective}</p>
              </div>
              
              <div className="text-slate-600 text-sm leading-relaxed">
                {activeData.description}
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Modelo Matemático</p>
                <div className="text-center py-2 bg-white rounded shadow-sm border border-slate-100">
                  {activeData.math}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Variables del Sistema</p>
                <ul className="grid grid-cols-2 gap-2">
                  {activeData.variables.map((v, idx) => (
                    <li key={idx} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel: Visualization */}
        <Card title="Simulación Visual" className="h-full min-h-[400px]">
          {renderDiagram()}
        </Card>
      </main>

      {/* Mobile Fallback (Single Column) */}
      <main className="grid md:hidden grid-cols-1 gap-4">
        <Card title={activeData.title}>
            <p className="mb-4 text-sm text-slate-600">{activeData.description}</p>
            <div className="bg-slate-100 p-2 rounded text-center mb-4">{activeData.math}</div>
            <div className="h-[300px]">
              {renderDiagram()}
            </div>
        </Card>
      </main>

    </div>
  );
}