import React, { useState } from 'react';
import { 
  ArrowRight, 
  RotateCcw, 
  Calculator, 
  CheckCircle2, 
  BookOpen, 
  Layout, 
  Settings2, 
  AlertCircle,
  Play,
  ArrowLeft
} from 'lucide-react';

// --- Tipos e Interfaces ---
type Step = 'contexto' | 'datos' | 'balance' | 'simulacion' | 'resultados';

interface SimulationState {
  feed: number;
  productSplit: number; // 0 to 1
  recycleSplit: number; // Calculated
}

interface ExcelCell {
  id: string;
  label: string;
  value: string | number;
  formula: string;
  isUserEditable: boolean;
  userFormula?: string;
  correctFormulaPattern?: RegExp;
}

// --- Componente Principal ---
export default function App() {
  const [activeStep, setActiveStep] = useState<Step>('contexto');
  const [simState, setSimState] = useState<SimulationState>({
    feed: 100,
    productSplit: 0.7,
    recycleSplit: 0.3
  });

  // Estado para el simulador de Excel (Movido al nivel superior para evitar error de Hooks)
  const [showResults, setShowResults] = useState(false);
  const [excelFeedback, setExcelFeedback] = useState<string>("");
  const [userFormulas, setUserFormulas] = useState({
    B5: "",
    B6: "",
    B7: ""
  });

  // Cálculos reales para mostrar resultados
  const totalMixer = simState.feed / (1 - simState.recycleSplit);
  const productFlow = totalMixer * simState.productSplit;
  const recycleFlow = totalMixer * simState.recycleSplit;

  // --- Navegación ---
  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: 'contexto', label: '1. Contexto', icon: <BookOpen size={18} /> },
    { id: 'datos', label: '2. Datos', icon: <Settings2 size={18} /> },
    { id: 'balance', label: '3. Balance', icon: <Layout size={18} /> },
    { id: 'simulacion', label: '4. Excel Sim', icon: <Calculator size={18} /> },
    { id: 'resultados', label: '5. Análisis', icon: <CheckCircle2 size={18} /> },
  ];

  const handleNext = () => {
    const currentIndex = steps.findIndex(s => s.id === activeStep);
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    const currentIndex = steps.findIndex(s => s.id === activeStep);
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1].id);
    }
  };

  // --- Renderizado de Pasos ---

  const renderContexto = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Objetivo del Ejercicio</h3>
        <p className="text-blue-800">
          Entender cómo funciona un proceso con <strong>recirculación</strong> y cómo modelarlo matemáticamente usando herramientas como Excel.
          El sistema opera en estado estacionario (lo que entra es igual a lo que sale del sistema global).
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
        <h4 className="text-lg font-semibold text-slate-700 mb-6">Diagrama de Flujo del Proceso</h4>
        
        {/* SVG Diagram */}
        <div className="relative w-full max-w-2xl h-64 select-none">
          <svg viewBox="0 0 600 250" className="w-full h-full">
            {/* Arrows Definitions */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
            </defs>

            {/* Feed Stream */}
            <path d="M 50 125 L 150 125" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <text x="50" y="110" className="text-sm fill-slate-600 font-bold">Alimentación (F)</text>

            {/* Mixer */}
            <rect x="150" y="90" width="70" height="70" rx="4" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
            <text x="185" y="130" textAnchor="middle" className="text-xs font-bold fill-sky-700">MEZCLADOR</text>

            {/* Stream Mixer -> Separator */}
            <path d="M 220 125 L 320 125" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <text x="270" y="110" textAnchor="middle" className="text-sm fill-slate-600">Total (M)</text>

            {/* Separator */}
            <rect x="320" y="90" width="70" height="70" rx="4" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
            <text x="355" y="130" textAnchor="middle" className="text-xs font-bold fill-green-700">SEPARADOR</text>

            {/* Product Stream */}
            <path d="M 390 125 L 500 125" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <text x="450" y="110" textAnchor="middle" className="text-sm fill-slate-600 font-bold">Producto (P)</text>

            {/* Recycle Stream Loop */}
            <path d="M 355 160 L 355 200 L 185 200 L 185 160" fill="none" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrowhead)" strokeDasharray="5,5" />
            <text x="270" y="220" textAnchor="middle" className="text-sm fill-amber-600 font-bold">Recirculación (R)</text>
          </svg>
        </div>
      </div>
    </div>
  );

  const renderDatos = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Settings2 className="text-blue-500" /> Variables de Entrada
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Alimentación Fresca (kg/h)</label>
              <input 
                type="number" 
                value={simState.feed}
                onChange={(e) => setSimState({...simState, feed: Number(e.target.value)})}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Fracción a Producto (0.0 - 1.0)</label>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max="1"
                value={simState.productSplit}
                onChange={(e) => {
                  const val = Math.min(1, Math.max(0, Number(e.target.value)));
                  setSimState({...simState, productSplit: val, recycleSplit: Number((1 - val).toFixed(2))});
                }}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Variables Calculadas (Automáticamente)</h3>
          <div className="space-y-4">
            <div className="bg-white p-3 rounded border border-slate-200">
              <span className="text-xs text-slate-500 uppercase font-bold">Fracción Reciclada</span>
              <div className="text-2xl font-mono text-amber-600 font-bold">
                {simState.recycleSplit.toFixed(2)}
              </div>
              <p className="text-xs text-slate-400 mt-1">1.0 - Fracción Producto</p>
            </div>
            <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100 flex gap-2">
              <AlertCircle size={16} className="shrink-0 mt-1" />
              <p>Nota: Aunque en este ejercicio los datos son fijos, puedes modificar la alimentación aquí para ver cómo afecta los resultados finales.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBalance = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-bold text-slate-800">Planteamiento de Ecuaciones</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4 border-b pb-2">1. Balance en el Mezclador</h4>
          <p className="text-slate-600 mb-4 text-sm">
            La masa se conserva. Lo que sale del mezclador (Corriente Total) es la suma de lo que entra.
          </p>
          <div className="bg-slate-100 p-4 rounded text-center font-mono text-lg text-blue-800">
            M = F + R
          </div>
          <div className="mt-2 text-xs text-slate-500 text-center">
            M: Total, F: Alimentación, R: Recirculación
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4 border-b pb-2">2. Especificaciones del Separador</h4>
          <p className="text-slate-600 mb-4 text-sm">
            El separador divide la corriente total (M) basándose en las fracciones definidas.
          </p>
          <div className="bg-slate-100 p-4 rounded text-center font-mono text-lg text-green-800 space-y-2">
            <div>P = {simState.productSplit} × M</div>
            <div>R = {simState.recycleSplit.toFixed(1)} × M</div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
        <h4 className="font-bold text-indigo-900 mb-2">El Problema de la Referencia Circular</h4>
        <p className="text-indigo-800 text-sm">
          Si observas bien, para calcular <strong>M</strong> necesitas <strong>R</strong>, pero para calcular <strong>R</strong> necesitas <strong>M</strong>.
          <br /><br />
          Esto crea un ciclo matemático: $M = F + (0.3 \times M)$.
          <br />
          Excel puede resolver esto algebraicamente o mediante iteración (calculando repetidamente hasta que el valor se estabilice).
        </p>
      </div>
    </div>
  );

  const renderSimulacion = () => {
    // La función `checkFormulas` verifica si las entradas del usuario son correctas
    const checkFormulas = () => {
      const b5Correct = userFormulas.B5.replace(/\s/g,'').toUpperCase() === "B1+B7" || userFormulas.B5.replace(/\s/g,'').toUpperCase() === "=B1+B7";
      const b6Correct = userFormulas.B6.replace(/\s/g,'').toUpperCase().includes("B5") && (userFormulas.B6.includes("0.7") || userFormulas.B6.includes("B2"));
      const b7Correct = userFormulas.B7.replace(/\s/g,'').toUpperCase().includes("B5") && (userFormulas.B7.includes("0.3") || userFormulas.B7.includes("B3"));

      if (b5Correct && b6Correct && b7Correct) {
        setExcelFeedback("¡Correcto! Has planteado bien el sistema. Excel detectará la referencia circular y calculará los valores.");
        setShowResults(true);
      } else {
        setExcelFeedback("Revisa tus fórmulas. Recuerda:\nTotal = Alimentación + Reciclaje.\nProducto = % * Total.\nReciclaje = % * Total.");
        setShowResults(false);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Simulador de Excel</h3>
          <button 
            onClick={() => {
              setUserFormulas({B5: "=B1+B7", B6: "=0.7*B5", B7: "=0.3*B5"});
              setShowResults(true);
              setExcelFeedback("Autocompletado para demostración.");
            }}
            className="text-xs text-blue-500 hover:underline"
          >
            Autocompletar (Demo)
          </button>
        </div>

        <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden font-mono text-sm">
          {/* Excel Header */}
          <div className="flex bg-slate-100 border-b border-slate-300 font-bold text-slate-600">
            <div className="w-12 py-2 text-center border-r border-slate-300"></div>
            <div className="flex-1 py-2 text-center border-r border-slate-300">A (Descripción)</div>
            <div className="w-48 py-2 text-center">B (Valor/Fórmula)</div>
          </div>

          {/* Rows */}
          {[
            { id: 1, label: "Alimentación Fresca", val: simState.feed, readOnly: true },
            { id: 2, label: "Fracción Producto", val: simState.productSplit, readOnly: true },
            { id: 3, label: "Fracción Reciclada", val: simState.recycleSplit.toFixed(2), readOnly: true },
            { id: 4, label: "", val: "", readOnly: true, empty: true },
            { id: 5, label: "Corriente Total (Mezclador)", key: "B5", placeholder: "=B1+B7" },
            { id: 6, label: "Producto Final", key: "B6", placeholder: "=0.7*B5" },
            { id: 7, label: "Recirculación", key: "B7", placeholder: "=0.3*B5" },
          ].map((row) => (
            <div key={row.id} className={`flex border-b border-slate-200 ${row.empty ? 'bg-slate-50 h-8' : ''}`}>
              <div className="w-12 py-2 text-center bg-slate-100 border-r border-slate-300 text-slate-500 font-bold flex items-center justify-center">
                {row.id}
              </div>
              <div className="flex-1 px-4 py-2 flex items-center border-r border-slate-300">
                {row.label}
              </div>
              <div className="w-48 p-1">
                {row.empty ? null : row.readOnly ? (
                   <div className="w-full h-full px-2 py-1 bg-slate-50 text-slate-700 text-right">
                     {row.val}
                   </div>
                ) : (
                  showResults ? (
                     <div className="w-full h-full px-2 py-1 bg-green-50 text-green-800 font-bold text-right animate-pulse">
                        {row.key === "B5" ? totalMixer.toFixed(2) : 
                         row.key === "B6" ? productFlow.toFixed(2) : 
                         recycleFlow.toFixed(2)}
                     </div>
                  ) : (
                    <input 
                      type="text"
                      className="w-full h-full px-2 py-1 border border-blue-200 focus:border-blue-500 rounded outline-none text-right placeholder-slate-300"
                      placeholder={row.placeholder}
                      value={userFormulas[row.key as keyof typeof userFormulas]}
                      onChange={(e) => setUserFormulas({...userFormulas, [row.key!]: e.target.value})}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600 whitespace-pre-line text-center md:text-left">
            {excelFeedback || "Ingresa las fórmulas en la columna B (ej. =B1+B7) y presiona Calcular."}
          </p>
          {!showResults && (
            <button 
              onClick={checkFormulas}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-bold shadow-sm transition-colors"
            >
              <Play size={16} fill="currentColor" /> Calcular
            </button>
          )}
          {showResults && (
             <button 
             onClick={() => setShowResults(false)}
             className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 text-sm"
           >
             Editar Fórmulas
           </button>
          )}
        </div>
      </div>
    );
  };

  const renderResultados = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <CheckCircle2 /> Resultados Finales
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500 mb-1">Total Mezclador (M)</div>
            <div className="text-2xl font-bold text-slate-800">{totalMixer.toFixed(2)}</div>
            <div className="text-xs text-slate-400">kg/h</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500 mb-1">Producto (P)</div>
            <div className="text-2xl font-bold text-green-600">{productFlow.toFixed(2)}</div>
            <div className="text-xs text-slate-400">kg/h</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500 mb-1">Recirculación (R)</div>
            <div className="text-2xl font-bold text-amber-600">{recycleFlow.toFixed(2)}</div>
            <div className="text-xs text-slate-400">kg/h</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-3">Análisis de Grados de Libertad</h3>
        <ul className="space-y-3 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs border border-slate-300 mt-0.5">Incógnitas (3)</span>
            <span>Son los caudales desconocidos: Total (M), Producto (P), Recirculación (R).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs border border-slate-300 mt-0.5">Ecuaciones (3)</span>
            <span>
              1. Balance en Mezclador (M = F + R)<br/>
              2. Ecuación Separador P (P = 0.7M)<br/>
              3. Ecuación Separador R (R = 0.3M)
            </span>
          </li>
          <li className="flex items-start gap-2 pt-2 border-t border-slate-100 font-bold text-blue-800">
            <span className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs border border-blue-300 mt-0.5">GL = 0</span>
            <span>El sistema está correctamente especificado y tiene solución única.</span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
        <strong>Conclusión:</strong> Observa que el producto final (P) es exactamente igual a la alimentación fresca (F) ({simState.feed} kg/h). Esto verifica que el balance global se cumple: <br/>
        <em>Todo lo que entra al sistema global debe salir como producto, ya que nada se acumula.</em>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <RotateCcw className="text-blue-400" /> 
              Balance de Masa: Recirculación
            </h1>
           
          </div>
       
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-white sticky top-0 z-10">
          {steps.map((step) => {
             const isActive = activeStep === step.id;
             return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap
                  ${isActive 
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {step.icon}
                {step.label}
              </button>
             );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeStep === 'contexto' && renderContexto()}
          {activeStep === 'datos' && renderDatos()}
          {activeStep === 'balance' && renderBalance()}
          {activeStep === 'simulacion' && renderSimulacion()}
          {activeStep === 'resultados' && renderResultados()}
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
          <button 
            onClick={handlePrev}
            disabled={activeStep === 'contexto'}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft size={16} /> Anterior
          </button>
          
          <div className="flex gap-1">
             {steps.map(s => (
               <div key={s.id} className={`h-1.5 w-1.5 rounded-full ${s.id === activeStep ? 'bg-blue-500' : 'bg-slate-300'}`} />
             ))}
          </div>

          <button 
            onClick={handleNext}
            disabled={activeStep === 'resultados'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Siguiente <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}