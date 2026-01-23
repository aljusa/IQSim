import React, { useState, useMemo, useRef } from 'react';
import { 
  BookOpen, 
  Activity, 
  Database, 
  Settings, 
  GitCommit, 
  ArrowRight,
  Layout,
  Brain,
  RotateCcw,
  Calculator,
  MousePointerClick,
  BrainCircuit,
  Trophy
} from 'lucide-react';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Scatter,
  ComposedChart
} from 'recharts';
import DivCarousel from '../assets/DivCarousel';

// --- Tipos e Interfaces ---

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

// --- Componentes UI Base (Grid Based) ---

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const GridContainer = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`grid ${className}`}>
    {children}
  </div>
);

// --- Diagramas Específicos ---

// 1. Diagrama Estático: Esquema General
const GeneralSchemeDiagram = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 rounded-lg">
      <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg grid place-items-center text-center gap-2">
        <Brain className="w-8 h-8 text-blue-600" />
        <h3 className="font-bold text-blue-900">Modelos Teóricos</h3>
        <p className="text-sm text-blue-700">Basados en leyes fundamentales y primeros principios.</p>
       
      </div>

      <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-lg grid place-items-center text-center gap-2 relative">
        <div className="absolute top-1/2 -left-3 hidden md:block text-slate-300">
          <ArrowRight />
        </div>
        <Settings className="w-8 h-8 text-purple-600" />
        <h3 className="font-bold text-purple-900">Semi-teóricos</h3>
        <p className="text-sm text-purple-700">Estructura teórica calibrada con datos experimentales.</p>
      
        <div className="absolute top-1/2 -right-3 hidden md:block text-slate-300">
          <ArrowRight />
        </div>
      </div>

      <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-lg grid place-items-center text-center gap-2">
        <Database className="w-8 h-8 text-emerald-600" />
        <h3 className="font-bold text-emerald-900">Modelos Empíricos</h3>
        <p className="text-sm text-emerald-700">Construidos exclusivamente a partir de observaciones.</p>
      
      </div>
    </div>
  );
};

// 2. Diagrama Dinámico: Eje Continuo
const ContinuumDiagram = () => {
  const [position, setPosition] = useState(50);

  const getLabel = (pos: number) => {
    if (pos < 30) return "Predominio Teórico";
    if (pos > 70) return "Predominio de Datos";
    return "Zona Híbrida (Semi-teórico)";
  };

  return (
    <div className="p-8 bg-slate-50 rounded-lg grid gap-6">
      
      <div className="relative h-12 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 rounded-full grid items-center px-2">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={position} 
          onChange={(e) => setPosition(parseInt(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20 top-0 left-0"
        />
        <div 
          className="absolute h-10 w-10 bg-white shadow-lg border-2 border-slate-600 rounded-full z-10 grid place-items-center transition-all duration-75 ease-out"
          style={{ left: `calc(${position}% - 20px)` }}
        >
          <Activity size={16} />
        </div>
        
        {/* Labels estáticos fondo */}
        <div className="grid grid-cols-2 w-full px-4 text-xs font-bold text-slate-500 uppercase tracking-widest pointer-events-none">
          <div className="text-left">Alta Teoría</div>
          <div className="text-right">Altos Datos</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded border border-slate-200 text-center shadow-sm">
        <span className="text-lg font-bold text-slate-800">{getLabel(position)}</span>
        <p className="text-sm text-slate-500 mt-1">
          {position < 30 && "Se basa en ecuaciones universales (ej. Leyes de Newton)."}
          {position > 70 && "Se basa en correlaciones estadísticas (ej. Machine Learning)."}
          {position >= 30 && position <= 70 && "Combina estructura física con parámetros ajustables."}
        </p>
      </div>
    </div>
  );
};

// 3. Diagrama Estático: Proceso Teórico
const TheoreticalProcessDiagram = () => {
  return (
    <div className="grid gap-4 p-6 bg-slate-50 rounded-lg place-items-center">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-center w-full max-w-4xl">
        
        {/* Step 1 */}
        <div className="bg-white p-4 rounded border-l-4 border-blue-500 shadow-sm">
          <div className="font-bold text-blue-800 mb-2">Leyes Fundamentales</div>
          <p className="text-xs text-slate-600">Principios universales (Conservación de masa, energía...)</p>
        </div>

        <ArrowRight className="text-slate-400 rotate-90 md:rotate-0 justify-self-center" />

        {/* Step 2 */}
        <div className="bg-white p-4 rounded border-l-4 border-blue-500 shadow-sm">
          <div className="font-bold text-blue-800 mb-2">Formulación Matemática</div>
          <p className="text-xs text-slate-600">Traducción a ecuaciones diferenciales o algebraicas.</p>
          <code className="block mt-2 text-xs bg-slate-100 p-1 rounded">f(x) = ma</code>
        </div>

        <ArrowRight className="text-slate-400 rotate-90 md:rotate-0 justify-self-center" />

        {/* Step 3 */}
        <div className="bg-white p-4 rounded border-l-4 border-blue-500 shadow-sm">
          <div className="font-bold text-blue-800 mb-2">Predicción del Sistema</div>
          <p className="text-xs text-slate-600">Comportamiento esperado sin necesidad de datos previos.</p>
        </div>

      </div>
    </div>
  );
};

// 4. Diagrama Dinámico: Calibración (Semi-teórico)
const CalibrationDiagram = () => {
  const [paramK, setParamK] = useState(1);
  
  // Datos simulados: Una curva teórica base y puntos experimentales fijos
  const data = useMemo(() => {
    const points = [];
    const noise = [0.568880652677539, 0.6829687788936665, 0.7073300529276143, 0.10442483494810784, 0.8672215275772582, 0.3355065068936913, 0.7685612808596767, 0.9742194899692279, 0.5320378195422377, 0.5914672493228109]
    for (let x = 0; x <= 10; x++) {
      // Modelo teórico: y = k * x^1.5 (ejemplo físico simple)
      const theoretical = paramK * Math.pow(x, 1.5);
      // Datos experimentales "reales" (digamos que la realidad es k=2.5)
      const experimental = 2.5 * Math.pow(x, 1.5) + (noise[x] * 5 - 2.5); // con un poco de ruido
      
      points.push({
        x,
        Teórico: theoretical,
        Experimental: x > 0 ? experimental : 0 // Solo mostramos experimental para x > 0
      });
    }
    return points;
  }, [paramK]);

  const errorScore = Math.abs(2.5 - paramK).toFixed(2);
  const isCalibrated = Math.abs(2.5 - paramK) < 0.2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 p-6 bg-slate-50 rounded-lg">
      <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
        <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Settings size={18} /> Panel de Calibración
        </h4>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Parámetro K (Ajuste Teórico) <p className='text-slate-400'>Ajusta el valor de k para calibrar el modelo</p>
          </label>
          <input 
            type="range" 
            min="0.5" 
            max="5" 
            step="0.1"
            value={paramK} 
            onChange={(e) => setParamK(parseFloat(e.target.value))}
            className="w-full accent-purple-600"
          />
          <div className="text-right font-mono text-purple-700 font-bold mt-1">k = {paramK}</div>
        </div>
        <div className={`p-3 rounded text-sm border ${isCalibrated ? 'bg-green-50 border-green-200 text-green-800' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
          
          <div className="font-bold">Desviación: {errorScore}</div>
          {isCalibrated ? "¡Modelo Calibrado!" : "Requiere ajuste..."}
        </div>
   
        
      </div>
  <div className="text-sm text-slate-600 font-medium ">
    Modelo Teórico: 
    y = <span className="text-purple-700 font-bold">{paramK}</span> · x<sup>1.5</sup>
  </div>
      <div className="h-[300px] bg-white p-4 rounded border border-slate-200">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="Teórico" stroke="#9333ea" strokeWidth={3} dot={false} />
            <Scatter name="Experimental" dataKey="Experimental" fill="#10b981" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 5. Diagrama Interactivo: Modelado Empírico
const EmpiricalDiagram = () => {
 
// --- TIPOS ---
type Point = { x: number; y: number };
type Step = 0 | 1 | 2;
type ModelType = 'linear' | 'quadratic';

interface RegressionResult {
  type: ModelType;
  equation: string;
  rSquared: number;
  predict: (x: number) => number;
  details: {
    linearR2: number;
    quadraticR2: number;
  };
}
  const [step, setStep] = useState<Step>(0);
  const [points, setPoints] = useState<Point[]>([]);
  const [regression, setRegression] = useState<RegressionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);

  const GRAPH_SIZE = 300;

  // --- LÓGICA MATEMÁTICA ---

  // Cálculo de R^2 (Coeficiente de determinación)
  const calculateRSquared = (points: Point[], predictFn: (x: number) => number) => {
    const n = points.length;
    if (n < 2) return 0;
    
    const meanY = points.reduce((sum, p) => sum + p.y, 0) / n;
    const ssTot = points.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0);
    const ssRes = points.reduce((sum, p) => sum + Math.pow(p.y - predictFn(p.x), 2), 0);
    
    return 1 - (ssRes / ssTot);
  };

  // Regresión Lineal: y = mx + b
  const solveLinear = (pts: Point[]) => {
    const n = pts.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    pts.forEach(p => {
      sumX += p.x; sumY += p.y; sumXY += p.x * p.y; sumXX += p.x * p.x;
    });
    
    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;
    
    return { 
      m, 
      b, 
      predict: (x: number) => m * x + b,
      equation: `y = ${m.toFixed(2)}x + ${b.toFixed(2)}`
    };
  };

  // Regresión Cuadrática: y = ax^2 + bx + c
  // Resuelve sistema 3x3 usando Cramer o eliminación simple
  const solveQuadratic = (pts: Point[]) => {
    const n = pts.length;
    let s_x = 0, s_x2 = 0, s_x3 = 0, s_x4 = 0, s_y = 0, s_xy = 0, s_x2y = 0;
    
    pts.forEach(p => {
      const x2 = p.x * p.x;
      s_x += p.x;
      s_x2 += x2;
      s_x3 += x2 * p.x;
      s_x4 += x2 * x2;
      s_y += p.y;
      s_xy += p.x * p.y;
      s_x2y += x2 * p.y;
    });

    // Matriz del sistema normal:
    // [ n      s_x    s_x2 ] [ c ]   [ s_y   ]
    // [ s_x    s_x2   s_x3 ] [ b ] = [ s_xy  ]
    // [ s_x2   s_x3   s_x4 ] [ a ]   [ s_x2y ]
    
    // Solución simplificada manual para 3x3
    const D = n * (s_x2 * s_x4 - s_x3 * s_x3) - s_x * (s_x * s_x4 - s_x3 * s_x2) + s_x2 * (s_x * s_x3 - s_x2 * s_x2);
    
    if (Math.abs(D) < 1e-9) return null; // Matriz singular (colinealidad perfecta o pocos puntos)

    
    // Matriz A:
    // [ s_x4  s_x3  s_x2 ] [ a ]   [ s_x2y ]
    // [ s_x3  s_x2  s_x1 ] [ b ] = [ s_xy  ]
    // [ s_x2  s_x1  n    ] [ c ]   [ s_y   ]

    const m11 = s_x4, m12 = s_x3, m13 = s_x2;
    const m21 = s_x3, m22 = s_x2, m23 = s_x;
    const m31 = s_x2, m32 = s_x,  m33 = n;
    
    const det = m11*(m22*m33 - m23*m32) - m12*(m21*m33 - m23*m31) + m13*(m21*m32 - m22*m31);
    
    if (Math.abs(det) < 1e-9) return null;

    const detA = s_x2y*(m22*m33 - m23*m32) - m12*(s_xy*m33 - s_y*m23) + m13*(s_xy*m32 - s_y*m22);
    const detB = m11*(s_xy*m33 - s_y*m23) - s_x2y*(m21*m33 - m23*m31) + m13*(m21*s_y - s_xy*m31);
    const detC = m11*(m22*s_y - s_xy*m32) - m12*(m21*s_y - s_xy*m31) + s_x2y*(m21*m32 - m22*m31);

    const resA = detA / det;
    const resB = detB / det;
    const resC = detC / det;

    const op = resB >= 0 ? '+' : '-';
    const op2 = resC >= 0 ? '+' : '-';

    return {
      predict: (x: number) => resA*x*x + resB*x + resC,
      equation: `y = ${resA.toFixed(3)}x² ${op} ${Math.abs(resB).toFixed(2)}x ${op2} ${Math.abs(resC).toFixed(2)}`
    };
  };

  // --- MANEJADORES ---

  const handleGraphClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (step !== 0) return;
    const rect = graphRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / GRAPH_SIZE) * 100;
    const y = 100 - (((e.clientY - rect.top) / GRAPH_SIZE) * 100);
    setPoints([...points, { x, y }]);
  };

  const calculateBestModel = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const linear = solveLinear(points);
      const linearR2 = calculateRSquared(points, linear.predict);
      
      let finalModel: RegressionResult;
      
      // Intentar cuadrática si hay suficientes puntos
      const quadratic = points.length >= 3 ? solveQuadratic(points) : null;
      let quadraticR2 = -1;

      if (quadratic) {
        quadraticR2 = calculateRSquared(points, quadratic.predict);
        
        // Criterio de selección: R^2 ajustado o simple
        // Usamos simple aquí. Si la cuadrática mejora el R2 por al menos un 2% (0.02), la preferimos.
        // (Penalización ligera por complejidad para evitar overfitting trivial)
        if (quadraticR2 > linearR2 + 0.02) {
           finalModel = {
             type: 'quadratic',
             equation: quadratic.equation,
             rSquared: quadraticR2,
             predict: quadratic.predict,
             details: { linearR2, quadraticR2 }
           };
        } else {
          finalModel = {
            type: 'linear',
            equation: linear.equation,
            rSquared: linearR2,
            predict: linear.predict,
            details: { linearR2, quadraticR2 }
          };
        }
      } else {
        // Fallback a lineal
        finalModel = {
          type: 'linear',
          equation: linear.equation,
          rSquared: linearR2,
          predict: linear.predict,
          details: { linearR2, quadraticR2: 0 }
        };
      }

      setRegression(finalModel);
      setStep(2);
      setIsCalculating(false);
    }, 1500);
  };

  const reset = () => {
    setPoints([]);
    setStep(0);
    setRegression(null);
  };

  // --- RENDERIZADO GRÁFICO ---

  const renderModelCurve = () => {
    if (!regression) return null;

    // Generar path SVG
    let d = "";
    for (let i = 0; i <= 100; i+=2) {
      const x = i;
      const y = regression.predict(x);
      
      // Convertir a coordenadas SVG
      const svgX = (x / 100) * GRAPH_SIZE;
      const svgY = GRAPH_SIZE - (y / 100 * GRAPH_SIZE); // Invertir Y

      if (i === 0) d += `M ${svgX} ${svgY}`;
      else d += ` L ${svgX} ${svgY}`;
    }

    return (
      <path 
        d={d}
        stroke={regression.type === 'linear' ? '#10b981' : '#8b5cf6'} 
        strokeWidth="3"
        fill="none"
        strokeDasharray={regression.type === 'linear' ? "5,5" : "0"}
        className="animate-pulse"
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Selección Empírica de Modelos</h1>
          <p className="text-slate-600">Recolecta datos, evalúa algoritmos y descubre el mejor modelo matemático.</p>
        </header>

        {/* Pasos */}
        <div className="flex justify-between items-center mb-8 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 transform -translate-y-1/2"></div>
          {[
            { icon: Database, label: "Datos" },
            { icon: BrainCircuit, label: "Evaluación" },
            { icon: Trophy, label: "Mejor Modelo" }
          ].map((s, idx) => (
            <div key={idx} className={`flex flex-col items-center bg-slate-50 px-4 transition-colors duration-500 ${step >= idx ? 'text-blue-600' : 'text-slate-400'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 ${step >= idx ? 'bg-blue-100 border-blue-600 shadow-md' : 'bg-white border-slate-300'}`}>
                <s.icon size={20} />
              </div>
              <span className="text-sm font-bold">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Gráfico */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-4 w-full flex justify-between items-center">
              <span>Espacio Experimental</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-mono">
                n = {points.length}
              </span>
            </h3>
            
            <div 
              ref={graphRef}
              className={`relative bg-slate-50 border-2 border-slate-200 rounded-lg overflow-hidden transition-all duration-300 ${step === 0 ? 'hover:border-blue-400 cursor-crosshair' : 'cursor-default'}`}
              style={{ width: GRAPH_SIZE, height: GRAPH_SIZE }}
              onClick={handleGraphClick}
            >
              <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none z-10">
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <line x1="0" y1={GRAPH_SIZE} x2={GRAPH_SIZE} y2={GRAPH_SIZE} stroke="#94a3b8" strokeWidth="4" />
                <line x1="0" y1="0" x2="0" y2={GRAPH_SIZE} stroke="#94a3b8" strokeWidth="4" />

                {step === 2 && renderModelCurve()}
              </svg>

              {points.map((p, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-blue-600 rounded-full shadow-sm transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{ 
                    left: `${(p.x / 100) * GRAPH_SIZE}px`, 
                    top: `${GRAPH_SIZE - (p.y / 100) * GRAPH_SIZE}px` 
                  }}
                />
              ))}

              {step === 0 && points.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
                  <div className="text-center bg-white/80 p-4 rounded-xl backdrop-blur-sm">
                    <MousePointerClick className="mx-auto mb-2 text-blue-500" size={32} />
                    <p className="text-sm font-medium text-slate-600">Haz clic en varios lugares<br/>para añadir datos</p>
                  </div>
                </div>
              )}
            </div>
            
             <div className="mt-4 flex justify-between w-full max-w-[300px] text-xs text-slate-400 font-mono">
                <span>0</span>
                <span>Eje X (Variable Independiente)</span>
                <span>100</span>
             </div>
          </div>

          {/* Panel Lógico */}
          <div className="flex flex-col justify-center">
            
            {step === 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500 animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-xl font-bold text-slate-800 mb-3">1. Recolección de Datos</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Para que el algoritmo decida si el fenómeno es lineal o curvo (cuadrático), necesita datos variados. 
                  <br/><br/>
                  Intenta dibujar una forma de <strong>"U"</strong> o una <strong>línea recta</strong> con tus clics para ver cómo reacciona.
                </p>
                
                <button 
                  onClick={() => setStep(1)}
                  disabled={points.length < 3}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:shadow-none"
                >
                  Analizar Datos <ArrowRight size={18} />
                </button>
                {points.length > 0 && points.length < 3 && (
                  <p className="text-xs text-center mt-2 text-amber-600 font-medium">
                    Necesitas al menos 3 puntos para evaluar curvatura.
                  </p>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-xl font-bold text-slate-800 mb-3">2. Evaluación de Modelos</h2>
                <p className="text-slate-600 mb-4">
                  El sistema ejecutará dos algoritmos simultáneamente y comparará su eficacia:
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-8 h-8 rounded bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">x¹</div>
                    <div>
                      <div className="font-semibold text-sm text-slate-700">Regresión Lineal</div>
                      <div className="text-xs text-slate-500">Busca tendencias simples y constantes.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-8 h-8 rounded bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">x²</div>
                    <div>
                      <div className="font-semibold text-sm text-slate-700">Regresión Cuadrática</div>
                      <div className="text-xs text-slate-500">Busca curvas, aceleración o puntos de retorno.</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={calculateBestModel}
                  disabled={isCalculating}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {isCalculating ? (
                    <span className="flex items-center gap-2">
                      <BrainCircuit className="animate-pulse" /> Evaluando ajuste (R²)...
                    </span>
                  ) : (
                    <>Ejecutar Evaluación Competitiva <Calculator size={18} /></>
                  )}
                </button>
              </div>
            )}

            {step === 2 && regression && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-emerald-500 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800">3. Modelo Ganador</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${regression.type === 'linear' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                    {regression.type === 'linear' ? 'Lineal' : 'Cuadrático'}
                  </span>
                </div>

                <div className="bg-slate-900 text-emerald-400 p-5 rounded-xl font-mono text-center text-lg mb-6 shadow-inner overflow-hidden">
                  {regression.equation}
                </div>

                {/* Tabla de Comparación */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Reporte de Ajuste (R²)</h4>
                  <div className="space-y-2">
                    {/* Barra Lineal */}
                    <div className="flex items-center text-sm">
                      <span className="w-20 font-medium text-slate-600">Lineal</span>
                      <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden mx-2">
                        <div 
                          className="h-full bg-green-500 transition-all duration-1000" 
                          style={{ width: `${Math.max(0, regression.details.linearR2 * 100)}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-mono">{regression.details.linearR2.toFixed(2)}</span>
                    </div>

                    {/* Barra Cuadrática */}
                    <div className="flex items-center text-sm">
                      <span className="w-20 font-medium text-slate-600">Cuadrático</span>
                      <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden mx-2">
                        <div 
                          className="h-full bg-purple-500 transition-all duration-1000" 
                          style={{ width: `${Math.max(0, regression.details.quadraticR2 * 100)}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-mono">{regression.details.quadraticR2.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 text-center italic">
                    El valor R² indica qué tan bien explica el modelo los datos (cercano a 1.00 es mejor).
                  </p>
                </div>

                <button 
                  onClick={reset}
                  className="w-full py-3 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  Nuevo Experimento <RotateCcw size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. Tabla Comparativa
const ComparisonTable = () => {
  const rows = [
    { type: "Teórico", base: "Leyes Físicas / Primeros Principios", data: "Validación posterior", pros: "Generalizable, explica causas", cons: "Difícil en sistemas complejos" },
    { type: "Semi-teórico", base: "Estructura física + Parámetros", data: "Calibración de parámetros", pros: "Equilibrio precisión/interpretabilidad", cons: "Requiere datos de buena calidad" },
    { type: "Empírico", base: "Correlaciones Matemáticas", data: "Esencia del modelo (Input principal)", pros: "Fácil construcción si hay datos", cons: "Caja negra, no explica 'por qué'" },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-700 uppercase bg-slate-100 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Tipo de Modelo</th>
            <th className="px-6 py-4">Base Teórica</th>
            <th className="px-6 py-4">Uso de Datos</th>
            <th className="px-6 py-4">Ventajas</th>
            <th className="px-6 py-4">Limitaciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.type} className={`border-b border-slate-100 last:border-none hover:bg-slate-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
              <td className="px-6 py-4 font-bold text-slate-800">{row.type}</td>
              <td className="px-6 py-4 text-slate-600">{row.base}</td>
              <td className="px-6 py-4 text-slate-600">{row.data}</td>
              <td className="px-6 py-4 text-green-700">{row.pros}</td>
              <td className="px-6 py-4 text-red-700">{row.cons}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Configuración de Pestañas ---

const TABS: TabConfig[] = [
  { 
    id: 'overview', 
    label: 'Visión General', 
    icon: <Layout size={18} />, 
    title: 'Introducción a la lección', 
    description: (
      <DivCarousel>
        <p>Los <strong>modelos matemáticos</strong> se clasifican según su <strong>fundamento teórico</strong> y su relación con los <strong>datos experimentales</strong>, con el fin de reconocer sus diferencias y <strong>seleccionar el modelo más adecuado</strong> según el problema a estudiar.</p>
        <p>Los<strong> modelos matemáticos</strong> permiten <strong>representar la realidad</strong> mediante <strong>ecuaciones</strong>, <strong>relaciones</strong> y <strong>estructuras formales</strong>. Sin embargo, no todos los modelos se construyen de la misma manera. </p><p>Algunos surgen directamente de <strong>leyes científicas</strong>, otros combinan<strong> teoría con datos experimentales</strong> y otros se basan únicamente en <strong>observaciones</strong>. <br />Esta diversidad hace necesaria una clasificación que ayude a comprender su alcance y sus límites.</p>
      </DivCarousel>
    )
  },
  { 
    id: 'continuum', 
    label: 'El Continuo', 
    icon: <Activity size={18} />,
    title: 'Criterio de clasificación de los modelos matemáticos',
    description: (
      <DivCarousel>
        <div><p>La <strong>clasificación</strong> de los modelos matemáticos se fundamenta en dos aspectos clave:</p>
<ul>
<li>El <strong>origen de las ecuaciones</strong> que describen el sistema.</li>
<li>El grado de <strong>dependencia de datos experimentales</strong> para construir o ajustar el modelo.</li>
</ul></div>

<p>Según estos <strong>criterios</strong>, los modelos pueden ubicarse en un continuo que va desde aquellos completamente fundamentados en la <strong>teoría</strong> hasta aquellos construidos únicamente a partir de <strong>datos</strong>.</p>
<div><p><strong>Aspectos clave del criterio:</strong></p>
<ul>
<li>Nivel de abstracción teórica.</li>
<li>Uso de leyes científicas previas.</li>
<li>Necesidad de calibración experimental.</li>
</ul></div>

</DivCarousel>
    )
  },
  { 
    id: 'theoretical', 
    label: 'Proceso Teórico', 
    icon: <BookOpen size={18} />,
    title: 'Modelos teóricos',
    description: (
<DivCarousel>
<p>Los <strong>modelos teóricos</strong> se desarrollan a partir de<strong> principios fundamentales</strong> y <strong>leyes científicas</strong> bien establecidas. <br /> Su formulación <strong>no depende</strong> inicialmente de <strong>datos</strong> <strong>experimentales</strong>, sino del razonamiento lógico y matemático.</p>
<p>Estos modelos buscan <strong>explicar el comportamiento del sistema desde sus bases conceptuales</strong>, lo que les otorga un alto valor explicativo.</p>
<div><p><strong>Características principales:</strong></p>
<ul>
<li>Se basan en <strong>leyes</strong> físicas, químicas o matemáticas.</li>
<li>Poseen una <strong>estructura matemática</strong> rigurosa.</li>
<li>Permiten <strong>deducir</strong> comportamientos y realizar <strong>predicciones</strong> bajo supuestos definidos.</li>
</ul></div>
<div><p><strong>Ventajas y limitaciones:</strong></p>
<ul>
<li>Facilitan una <strong>comprensión profunda</strong> del fenómeno.</li>
<li>Pueden perder validez si las suposiciones no representan adecuadamente la realidad.</li>
</ul></div>

</DivCarousel>
)
  },
  { 
    id: 'calibration', 
    label: 'Calibración', 
    icon: <Settings size={18} />,
    title: 'Modelos semi-teóricos',
    description: (
<DivCarousel>
<p>Los <strong>modelos semi-teóricos </strong>parten de una <strong>base teórica</strong>, pero incorporan <strong>parámetros</strong> que no se conocen con exactitud y que <strong>deben ajustarse</strong> usando datos reales. <br /> Este enfoque es común en áreas aplicadas donde la teoría por sí sola no es suficiente.</p>
<p>Estos modelos permiten <strong>representar sistemas complejos de forma más realista</strong> que los modelos puramente teóricos.</p>
<div><p><strong>Características principales:</strong></p>
<ul>
<li>Integran <strong>fundamentos teóricos</strong> con <strong>observaciones experimentales</strong>.</li>
<li><strong>Requieren</strong> procesos de <strong>calibración</strong>.</li>
<li>Son ampliamente utilizados en ingeniería y ciencias aplicadas.</li>
</ul></div>
<div><p><strong>Ventajas y limitaciones:</strong></p>
<ul>
<li>Ofrecen buen equilibrio entre <strong>precisión</strong> y <strong>comprensión</strong>.</li>
<li>Su confiabilidad depende de la<strong> calidad de los datos</strong> disponibles.</li>
</ul></div>

</DivCarousel>
)
  },
  { 
    id: 'empirical', 
    label: 'Empírico', 
    icon: <Database size={18} />,
    title: 'Modelos empíricos',
    description: (
<DivCarousel>
<p>Los <strong>modelos empíricos</strong> se construyen <strong>exclusivamente a partir de datos</strong> observados. </p>
<p>No buscan explicar el mecanismo interno del sistema, sino encontrar <strong>relaciones matemáticas</strong> que permitan <strong>describir</strong> o <strong>predecir</strong> su comportamiento dentro de un <strong>rango específico</strong>.</p>
<p>Son especialmente útiles cuando el <strong>fenómeno es complejo</strong> o <strong>poco comprendido</strong> desde el <strong>punto de vista teórico</strong>.</p>
<div><p><strong>Características principales:</strong></p>
<ul>
<li>Se basan en <strong>correlaciones estadísticas</strong>.</li>
<li><strong>No explican las causas</strong> del fenómeno.</li>
<li><strong>Dependen</strong> fuertemente del conjunto de <strong>datos utilizado</strong>.</li>
</ul></div>
<div><p><strong>Ventajas y limitaciones:</strong></p>
<ul>
<li>Permiten <strong>modelar fenómenos sin teoría</strong> previa.</li>
<li>Su capacidad predictiva es <strong>limitada fuera del rango de datos</strong> analizados.</li>
</ul></div>

</DivCarousel>
)
  },
  { 
    id: 'comparison', 
    label: 'Comparativa', 
    icon: <GitCommit size={18} />,
    title: 'Cierre de la lección',
    description: (<DivCarousel>
<p><strong>Clasificar los modelos matemáticos</strong> en teóricos, semi-teóricos y empíricos permite entender cómo se construyen, qué tipo de información utilizan y cuáles son sus alcances. </p><p><strong>Cada tipo responde a necesidades distintas</strong>: explicación profunda, equilibrio entre teoría y práctica, o predicción basada en datos. Reconocer estas diferencias es esencial para aplicar correctamente los modelos en la ciencia, la ingeniería y la tecnología.</p>
</DivCarousel>)
  },
];

// --- Componente Principal ---

const App = () => {
  const [activeTabId, setActiveTabId] = useState<string>(TABS[0].id);

  const activeTab = TABS.find(t => t.id === activeTabId) || TABS[0];

  const renderContent = () => {
    switch (activeTabId) {
      case 'overview': return <GeneralSchemeDiagram />;
      case 'continuum': return <ContinuumDiagram />;
      case 'theoretical': return <TheoreticalProcessDiagram />;
      case 'calibration': return <CalibrationDiagram />;
      case 'empirical': return <EmpiricalDiagram />;
      case 'comparison': return <ComparisonTable />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-4 md:p-8">
      
      {/* Layout Grid Principal */}
      <GridContainer className="grid-rows-[auto_auto_1fr] gap-6 max-w-6xl mx-auto h-full min-h-[800px]">
        
        {/* 1. Header Area */}
        <header className="grid grid-cols-[auto_1fr] items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Clasificación de los modelos matemáticos</h1>
           
          </div>
        </header>

        {/* 2. Tabs Navigation */}
        <nav className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <div className="grid grid-cols-6 gap-2 w-full">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex flex-col lg:flex-row items-center justify-center w-full gap-2 px-2 py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border-2 h-full
                  ${activeTabId === tab.id 
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' 
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {tab.icon}
                <span className="text-center">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* 3. Main Content Area */}
        <main className="grid grid-rows-[auto_1fr] gap-6">
          
          {/* Section Info Card */}
          <Card className="p-6 border-l-4 border-l-blue-600">
            <h2 className="text-xl font-bold text-slate-800 mb-2">{activeTab.title}</h2>
            {activeTab.description}
          </Card>

          {/* Diagram Render Wrapper */}
          <Card className="bg-white min-h-[400px] grid place-items-stretch">
            {renderContent()}
          </Card>
          
        </main>

      </GridContainer>
    </div>
  );
};

export default App;