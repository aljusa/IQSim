import React, { useState, useEffect,  } from 'react';
import { 
   
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine, 
  ResponsiveContainer,
  
  Area,
  ComposedChart,
  Bar
} from 'recharts';
import { 
  Box, 
  Activity, 
  Code, 
  FileText, 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  TrendingDown, 
  ShoppingCart,
  Layout
} from 'lucide-react';

// --- Types & Interfaces ---

type TabId = 'concept' | 'exercise' | 'procedure' | 'code' | 'simulation';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

interface SimulationParams {
  initialInventory: number;
  minDemand: number;
  maxDemand: number;
  reorderPoint: number;
  reorderQty: number;
  days: number;
}

interface DayResult {
  day: number;
  initial: number;
  demand: number;
  final: number;
  shortage: boolean;
  reorder: boolean;
}

// --- Logic: Simulation Engine ---

const runSimulation = (params: SimulationParams): DayResult[] => {
  const results: DayResult[] = [];
  let currentInventory = params.initialInventory;

  for (let day = 1; day <= params.days; day++) {
    const demand = Math.floor(Math.random() * (params.maxDemand - params.minDemand + 1)) + params.minDemand;
    const initialForDay = currentInventory;
    let shortage = false;
    let reorder = false;

    // Subtract demand
    if (demand > currentInventory) {
      shortage = true;
      currentInventory = 0; // Assuming lost sales model for simplicity as per description
    } else {
      currentInventory -= demand;
    }

    // Reorder logic
    if (currentInventory <= params.reorderPoint) {
      currentInventory += params.reorderQty;
      reorder = true;
    }

    results.push({
      day,
      initial: initialForDay,
      demand,
      final: currentInventory,
      shortage,
      reorder
    });
  }

  return results;
};

// --- Components ---

// 1. Layout Component (Grid based)
const LessonLayout: React.FC<{
  children: React.ReactNode;
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}> = ({ children, activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { id: 'concept', label: 'Concepto', icon: <Box size={18} /> },
    { id: 'exercise', label: 'Enunciado', icon: <FileText size={18} /> },
    { id: 'procedure', label: 'Procedimiento', icon: <Activity size={18} /> },
    { id: 'code', label: 'Código Python', icon: <Code size={18} /> },
    { id: 'simulation', label: 'Simulación Interactiva', icon: <Play size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans grid grid-rows-[auto_auto_1fr]">
      {/* Header Area */}
      <header className="bg-slate-900 text-white p-4 grid grid-cols-[auto_1fr] items-center gap-4 border-b border-slate-700 shadow-md z-10">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Layout className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Simulación de Inventario</h1>
        </div>
      </header>

      {/* Navigation Tabs Area */}
      <nav className="grid grid-cols-5 bg-white border-b border-slate-200 px-4 pt-2 shadow-sm">
          {tabs.map((tab) => (
              <button
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2
                  ${activeTab === tab.id 
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
          ))}
      </nav>

      {/* Main Content Area */}
      <main className="p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

// 2. Card Component
const Card: React.FC<{ 
  title?: string; 
  className?: string;
  children: React.ReactNode 
}> = ({ title, className = '', children }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {title && (
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

// 3. Diagram Render Component (Interactive Simulation)
const DiagramRender: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    initialInventory: 50,
    minDemand: 3,
    maxDemand: 8,
    reorderPoint: 10,
    reorderQty: 40,
    days: 20 // Increased slightly for better visualization
  });

  const [data, setData] = useState<DayResult[]>([]);
  const [stats, setStats] = useState({ finalStock: 0, shortages: 0, orders: 0 });

  const run = () => {
    const results = runSimulation(params);
    setData(results);
    
    // Calculate aggregate stats
    const lastDay = results[results.length - 1];
    const shortages = results.filter(r => r.shortage).length;
    const orders = results.filter(r => r.reorder).length;
    
    setStats({
      finalStock: lastDay.final,
      shortages,
      orders
    });
  };

  // Run on mount and param change (debounced could be better, but simple is fine here)
  useEffect(() => {
    run();
  }, [params]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
      {/* Controls Panel */}
      <Card title="Configuración de la Simulación" className="h-fit">
        <div className="grid gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Inventario Inicial</label>
            <input 
              type="number" 
              value={params.initialInventory}
              onChange={(e) => setParams({...params, initialInventory: Number(e.target.value)})}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
             <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Demanda Min</label>
              <input 
                type="number" 
                value={params.minDemand}
                onChange={(e) => setParams({...params, minDemand: Number(e.target.value)})}
                className="w-full p-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Demanda Max</label>
              <input 
                type="number" 
                value={params.maxDemand}
                onChange={(e) => setParams({...params, maxDemand: Number(e.target.value)})}
                className="w-full p-2 border border-slate-300 rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Punto de Reorden</label>
            <input 
              type="number" 
              value={params.reorderPoint}
              onChange={(e) => setParams({...params, reorderPoint: Number(e.target.value)})}
              className="w-full p-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Cantidad Pedido</label>
            <input 
              type="number" 
              value={params.reorderQty}
              onChange={(e) => setParams({...params, reorderQty: Number(e.target.value)})}
              className="w-full p-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Días a Simular</label>
            <input 
              type="range" 
              min="5" max="50"
              value={params.days}
              onChange={(e) => setParams({...params, days: Number(e.target.value)})}
              className="w-full cursor-pointer accent-blue-600"
            />
            <div className="text-right text-xs text-slate-500">{params.days} días</div>
          </div>
          
          <button 
            onClick={run}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors mt-2"
          >
            <RefreshCw size={16} />
            Re-Simular
          </button>
        </div>
      </Card>

      {/* Visualization Panel */}
      <div className="grid grid-rows-[auto_1fr] gap-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
              <Box size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Inventario Final</p>
              <p className="text-2xl font-bold text-slate-800">{stats.finalStock}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-full">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Días con Faltantes</p>
              <p className="text-2xl font-bold text-slate-800">{stats.shortages}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <ShoppingCart size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pedidos Realizados</p>
              <p className="text-2xl font-bold text-slate-800">{stats.orders}</p>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <Card title="Evolución del Inventario" className="min-h-[400px]">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" label={{ value: 'Día', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Unidades', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              
              <ReferenceLine y={params.reorderPoint} label="Punto Reorden" stroke="#f43f5e" strokeDasharray="3 3" />
              
              <Area type="monotone" dataKey="final" name="Inventario" fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={2} />
              <Bar dataKey="demand" name="Demanda Diaria" barSize={10} fill="#94a3b8" />
              
              {/* Render dots for reorders */}
              <Line 
                type="monotone" 
                dataKey={(d) => d.reorder ? d.final : null} 
                stroke="none" 
                dot={{ stroke: '#10b981', strokeWidth: 2, r: 6, fill: '#ffffff' }} 
                name="Pedido Realizado"
                isAnimationActive={false}
              />
               <Line 
                type="monotone" 
                dataKey={(d) => d.shortage ? 0 : null} 
                stroke="none" 
                dot={{ stroke: '#ef4444', strokeWidth: 2, r: 6, fill: '#ef4444' }} 
                name="Stock Agotado"
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-slate-500 flex gap-6 justify-center">
            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Nivel Inventario</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-400 rounded-sm"></div> Demanda Diaria</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-emerald-500 rounded-full"></div> Pedido Realizado</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-full"></div> Faltante (Stock 0)</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- App Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('concept');

  return (
    <LessonLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'concept' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
          <Card title="¿Qué es la simulación de inventario?">
            <p className="text-slate-600 leading-relaxed mb-4">
              La simulación de inventarios es una técnica analítica utilizada para modelar cómo entran y salen productos de un almacén a lo largo del tiempo bajo condiciones de incertidumbre (como la demanda aleatoria).
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-blue-100 text-blue-600 rounded">
                  <TrendingDown size={16} />
                </div>
                <span className="text-slate-700"><strong>Evitar Faltantes:</strong> Previene la pérdida de ventas por falta de stock.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-rose-100 text-rose-600 rounded">
                  <AlertTriangle size={16} />
                </div>
                <span className="text-slate-700"><strong>Controlar Excesos:</strong> Minimiza los altos costos de almacenamiento.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-emerald-100 text-emerald-600 rounded">
                  <Activity size={16} />
                </div>
                <span className="text-slate-700"><strong>Optimizar Pedidos:</strong> Ayuda a definir cuándo y cuánto pedir.</span>
              </li>
            </ul>
          </Card>
          <Card title="Preguntas Clave">
            <div className="grid gap-4">
              {[
                "¿Cuándo se acaba el stock?",
                "¿Cada cuánto debo reordenar?",
                "¿Cuántas unidades debo pedir?",
                "¿Cuántas veces me quedo sin inventario?"
              ].map((q, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  <p className="font-medium text-slate-800">{q}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'exercise' && (
        <div className="grid gap-6 animate-in fade-in duration-500">
           <Card title="Enunciado del Ejercicio">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
               <div>
                  <p className="text-lg text-slate-700 mb-6">
                    Un almacén necesita evaluar su política de reabastecimiento. Se plantea simular <strong>10 días</strong> de operación bajo las siguientes reglas:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-bold text-blue-600 text-xl w-8 text-center">50</span>
                      <span className="text-slate-600">Unidades de <strong>Inventario Inicial</strong></span>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-bold text-blue-600 text-xl w-8 text-center">3-8</span>
                      <span className="text-slate-600">Demanda diaria aleatoria (unidades)</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-bold text-rose-500 text-xl w-8 text-center">10</span>
                      <span className="text-slate-600">Punto de reorden (Si Stock ≤ 10 → Pedir)</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-bold text-emerald-500 text-xl w-8 text-center">40</span>
                      <span className="text-slate-600">Cantidad a reponer por pedido</span>
                    </li>
                  </ul>
               </div>
               <div className="bg-slate-100 p-6 rounded-xl flex flex-col justify-center items-center text-center h-full border-2 border-dashed border-slate-300">
                 <h4 className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-4">Objetivo de la Simulación</h4>
                 <div className="space-y-2">
                   <div className="bg-white px-4 py-2 rounded shadow-sm text-slate-700">📊 Calcular Inventario Final</div>
                   <div className="bg-white px-4 py-2 rounded shadow-sm text-slate-700">❌ Contar Días con Faltantes</div>
                   <div className="bg-white px-4 py-2 rounded shadow-sm text-slate-700">📦 Total de Pedidos Realizados</div>
                 </div>
               </div>
             </div>
           </Card>
        </div>
      )}

      {activeTab === 'procedure' && (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500">
          <Card title="Lógica del Algoritmo">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { step: 1, title: "Inicio Día", desc: "Se inicia con el inventario del día anterior." },
                { step: 2, title: "Generar Demanda", desc: "Se calcula un número aleatorio entre 3 y 8." },
                { step: 3, title: "Verificar Stock", desc: "¿Hay suficiente? Si no, registrar faltante." },
                { step: 4, title: "Actualizar Stock", desc: "Restar demanda. Si stock ≤ 10, sumar +40." },
                { step: 5, title: "Fin Día", desc: "Registrar datos y pasar al siguiente día." }
              ].map((item) => (
                <div key={item.step} className="relative bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                    {item.step}
                  </div>
                  <h4 className="mt-2 font-bold text-slate-800 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card title="Pseudo-código Lógico">
               <pre className="font-mono text-sm text-slate-600 bg-slate-50 p-4 rounded-lg overflow-x-auto">
{`Para cada dia en 1..10:
  demanda = random(3, 8)
  
  SI demanda > inventario:
      faltantes++
      inventario = 0
  SINO:
      inventario = inventario - demanda
      
  SI inventario <= 10:
      inventario = inventario + 40
      pedidos++`}
               </pre>
             </Card>
             <Card title="Entidades">
               <div className="space-y-4">
                 <div>
                   <h5 className="font-semibold text-slate-700">Inventario (Stock)</h5>
                   <p className="text-sm text-slate-500">Recurso acumulable que disminuye con la demanda y aumenta con los pedidos.</p>
                 </div>
                 <div>
                   <h5 className="font-semibold text-slate-700">Demanda (Input Aleatorio)</h5>
                   <p className="text-sm text-slate-500">Variable estocástica que introduce incertidumbre al sistema.</p>
                 </div>
                 <div>
                   <h5 className="font-semibold text-slate-700">Política de Reorden (Regla de Decisión)</h5>
                   <p className="text-sm text-slate-500">El "cerebro" del sistema: define cuándo actuar para reponer el stock.</p>
                 </div>
               </div>
             </Card>
          </div>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="animate-in fade-in duration-500 h-full">
          <Card title="Implementación en Python" className="h-full">
            <div className="bg-[#1e1e1e] rounded-lg p-4 overflow-auto max-h-[600px] text-sm font-mono leading-relaxed">
              <code className="text-gray-300">
                <span className="text-purple-400">import</span> random<br/><br/>
                <span className="text-green-600"># ---------------------------------------</span><br/>
                <span className="text-green-600"># Función que genera la demanda diaria</span><br/>
                <span className="text-green-600"># ---------------------------------------</span><br/>
                <span className="text-blue-400">def</span> <span className="text-yellow-300">demanda_diaria</span>():<br/>
                &nbsp;&nbsp;<span className="text-orange-300">"""Devuelve la demanda de un día."""</span><br/>
                &nbsp;&nbsp;<span className="text-purple-400">return</span> random.randint(<span className="text-green-300">3</span>, <span className="text-green-300">8</span>)<br/><br/>

                <span className="text-blue-400">def</span> <span className="text-yellow-300">simular_inventario</span>(inv_inicial, p_reorden, cant_pedido, dias):<br/>
                &nbsp;&nbsp;inventario = inv_inicial<br/>
                &nbsp;&nbsp;dias_faltantes = <span className="text-green-300">0</span><br/>
                &nbsp;&nbsp;pedidos_realizados = <span className="text-green-300">0</span><br/><br/>
                
                &nbsp;&nbsp;<span className="text-purple-400">for</span> dia <span className="text-purple-400">in</span> <span className="text-blue-400">range</span>(<span className="text-green-300">1</span>, dias + <span className="text-green-300">1</span>):<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;demanda = demanda_diaria()<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">print</span>(<span className="text-orange-300">f"Día </span><span className="text-blue-300">{`{dia}`}</span><span className="text-orange-300">"</span>)<br/><br/>
                
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-600"># Verificamos si hay suficientes productos</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> demanda &gt; inventario:<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dias_faltantes += <span className="text-green-300">1</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inventario = <span className="text-green-300">0</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">print</span>(<span className="text-orange-300">"  ❌ Faltante de inventario"</span>)<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">else</span>:<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inventario -= demanda<br/><br/>

                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-600"># Reordenamos si llegamos al punto mínimo</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> inventario &lt;= p_reorden:<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inventario += cant_pedido<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pedidos_realizados += <span className="text-green-300">1</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">print</span>(<span className="text-orange-300">f"  📦 Pedido realizado (+</span><span className="text-blue-300">{`{cant_pedido}`}</span><span className="text-orange-300">)"</span>)<br/><br/>
                
                &nbsp;&nbsp;<span className="text-purple-400">return</span> inventario, dias_faltantes, pedidos_realizados
              </code>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'simulation' && (
        <div className="animate-in fade-in duration-500 h-full">
           <DiagramRender />
        </div>
      )}
    </LessonLayout>
  );
};

export default App;