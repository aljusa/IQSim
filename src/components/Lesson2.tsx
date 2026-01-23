import React, { useState } from 'react';
import { 
   
   
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  
  
   Area, ComposedChart, ReferenceLine
} from 'recharts';
import { 
  Layers, 
  Maximize, 
  Clock, 
  Activity, 
  Box, 
  Grid3X3, 
  BarChart2,
  Info,
  Pause,
  Play,
  RotateCcw,
  
} from 'lucide-react';
import DivCarousel from '../assets/DivCarousel';

// --- Tipos e Interfaces ---

interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  category: 'Estático' | 'Dinámico' | 'Interactivo';
  contentId: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

// --- Componentes de UI Base ---

const Card: React.FC<CardProps> = ({ children, className = "", }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-slate-200 ${className}`}>
 
    <div className="p-4 ">
      {children}
    </div>
  </div>
);

// --- Componentes de Visualización Específicos ---

// 1. Diagrama de Cuatro Bloques (Estático)
const FourBlocksDiagram = () => (
  <div className="grid grid-cols-2 gap-4  w-full p-4">
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 grid place-content-center text-center">
      <Activity className="mx-auto text-blue-500 mb-2" size={32} />
      <span className="font-bold text-blue-700">Incertidumbre</span>
      <p className="text-xs text-blue-600 mt-1">Determinístico vs Probabilístico</p>
    </div>
    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 grid place-content-center text-center">
      <Maximize className="mx-auto text-emerald-500 mb-2" size={32} />
      <span className="font-bold text-emerald-700">Variables</span>
      <p className="text-xs text-emerald-600 mt-1">Lineal vs No Lineal</p>
    </div>
    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 grid place-content-center text-center">
      <Clock className="mx-auto text-amber-500 mb-2" size={32} />
      <span className="font-bold text-amber-700">Tiempo</span>
      <p className="text-xs text-amber-600 mt-1">Estático vs Dinámico</p>
    </div>
    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 grid place-content-center text-center">
      <Box className="mx-auto text-purple-500 mb-2" size={32} />
      <span className="font-bold text-purple-700">Espacio</span>
      <p className="text-xs text-purple-600 mt-1">Agregado vs Distribuido</p>
    </div>
  </div>
);

// 2. Diagrama por Capas (Dinámico)
const LayeredDiagram = () => {
  const [layers, setLayers] = useState<number>(1);
  
  const layerData = [
    { id: 1, name: "Modelo Base", color: "bg-slate-300" },
    { id: 2, name: "+ Azar (Incertidumbre)", color: "bg-blue-300" },
    { id: 3, name: "+ No Linealidad", color: "bg-emerald-300" },
    { id: 4, name: "+ Tiempo y Espacio", color: "bg-purple-300" },
  ];

  return (
    <div className=" grid grid-rows-[auto_1fr] gap-4">
      <div className="grid grid-cols-4 gap-2">
         {layerData.map((l) => (
           <button 
            key={l.id}
            onClick={() => setLayers(l.id)}
            className={`p-2 text-xs rounded border ${layers >= l.id ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-500 border-slate-200'}`}
           >
             Nivel {l.id}
           </button>
         ))}
      </div>
      <div className="relative border-2 border-dashed border-slate-200 rounded-lg grid place-items-center bg-slate-50">
        <div className="grid gap-2 w-64 transition-all duration-500">
          {layerData.slice(0, layers).reverse().map((layer) => (
            <div 
              key={layer.id} 
              className={`${layer.color} h-16 rounded-lg shadow-md grid place-items-center text-slate-800 font-bold transform transition-all duration-500 translate-y-0 opacity-100`}
            >
              {layer.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Determinístico vs Probabilístico (Estático)
const DetVsProbDiagram = () => {
  const data = Array.from({ length: 41 }, (_, i) => {
  const x = i - 20;

  // Distribución normal aproximada
  const probabilistico =
    (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x) * 100;

  return {
    x,
    probabilistico
  };
});

const valorDeterministico = 0;

 return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="x"
          label={{ value: "Resultado posible", position: "insideBottom", offset: -10 }}
        />
        <YAxis
          label={{ value: "Probabilidad", angle: -90, position: "insideLeft" }}
        />

      

        <Legend />

        {/* Modelo probabilístico */}
        <Area
          type="monotone"
          dataKey="probabilistico"
          name="Modelo probabilístico (distribución)"
          fill="#8b5cf6"
          stroke="#7c3aed"
          opacity={0.6}
        />

        {/* Modelo determinístico */}
        <ReferenceLine
          x={valorDeterministico}
          stroke="#3b82f6"
          strokeWidth={3}
          label={{
            value: "Modelo determinístico\n(valor único)",
            position: "top",
            fill: "#3b82f6"
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

};

// 4. Lineal vs No Lineal (Dinámico)
const LinVsNonLinDiagram = () => {
  const data = Array.from({ length: 21 }, (_, i) => {
    const x = i / 2;
    return {
      x,
      lineal: x * 10,
      nolineal: Math.pow(x, 2.5) // Exponencial
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" type="number" label={{ value: 'Variable Entrada', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Respuesta', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="lineal" name="Lineal (Proporcional)" stroke="#10b981" strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="nolineal" name="No Lineal (Complejo)" stroke="#ef4444" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

// 5. Diagrama Temporal (Dinámico)
const TemporalDiagram = () => {
  const data = Array.from({ length: 24 }, (_, i) => ({
    time: i,
    estatico: 50,
    dinamico: 50 + 30 * Math.sin(i / 2) + (i * 1.5) // Sinusoidal + Tendencia
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" label={{ value: 'Tiempo (t)', position: 'insideBottom', offset: -5 }} />
        <YAxis domain={[0, 120]} />
        <Tooltip />
        <Legend />
        <Line type="step" dataKey="estatico" name="Constante (Estático)" stroke="#64748b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
        <Line type="monotone" dataKey="dinamico" name="Evolutivo (Dinámico)" stroke="#f59e0b" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

// 6. Diagrama Espacial (Interactivo)
const SpatialDiagram = () => {
    const [time, setTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Efecto para animación simple
    React.useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setTime(t => (t < 50 ? t + 1 : 0));
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

// Interpolación de color de Azul (20°C) a Rojo (100°C)
const getHeatColor = (temp: number) => {
  const clampedTemp = Math.max(20, Math.min(100, temp));
  const ratio = (clampedTemp - 20) / 80;
  const r = Math.round(20 + 235 * ratio);
  const g = Math.round(100 - 80 * ratio);
  const b = Math.round(200 - 180 * ratio);
  return `rgb(${r}, ${g}, ${b})`;
};
    const generateData = () => {
  const data = [];
  const T_env = 20;
  const T_init = 100;
  const k = 0.1; // Coeficiente globalizado
  
  for (let t = 0; t <= 50; t++) {
    // Cálculo Globalizado (Newton)
    const lumpedTemp = T_env + (T_init - T_env) * Math.exp(-k * t);
    
    // Cálculo Distribuido (Difusión 1D simplificada)
    const source = 100;
    // x=5 (Medio) - Retraso y atenuación
    const distMid = 20 + (source - 20) * (1 - Math.exp(-0.08 * Math.max(0, t - 2))); 
    // x=10 (Final) - Mayor retraso
    const distEnd = 20 + (source - 20) * (1 - Math.exp(-0.04 * Math.max(0, t - 6))); 

    data.push({ 
      time: t, 
      lumped: parseFloat(lumpedTemp.toFixed(1)),
      distSource: 100,
      distMid: parseFloat(distMid.toFixed(1)),
      distEnd: parseFloat(distEnd.toFixed(1)) 
    });
  }
  return data;
};

    const SIMULATION_DATA = generateData();

    const currentData = SIMULATION_DATA[time];

   type Props = { x: number; y: number; color: string };
const ReferenceLineDot = (_props: Props) => null;
    return (
        <div className="grid grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. CONTROLES COMPARTIDOS (Top Row) */}
            <div className="col-span-12">
                <Card className="bg-slate-900 border-slate-800 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors shadow-lg shadow-indigo-900/50"
                            >
                                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1"/>}
                            </button>
                            <button 
                                onClick={() => { setIsPlaying(false); setTime(0); }}
                                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors text-slate-300"
                            >
                                <RotateCcw size={20} />
                            </button>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Tiempo (t)</span>
                                <span className="text-2xl font-mono font-bold text-indigo-300">{time.toFixed(1)}s</span>
                            </div>
                        </div>
                        
                        <div className="flex-1 w-full px-4">
                            <input 
                                type="range" 
                                min="0" 
                                max="50" 
                                value={time} 
                                onChange={(e) => { setIsPlaying(false); setTime(Number(e.target.value)); }}
                                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        <div className="hidden md:block text-right">
                           <div className="text-xs text-slate-400">Estado Ambiental</div>
                           <div className="font-bold text-slate-200">20°C (Constante)</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 2. MODELO GLOBALIZADO (Left Column) */}
            <div className="col-span-4 lg:col-span-6 flex flex-col ">
                <Card                     
                    className=" border-t-4 border-t-orange-500"
                >
                    <div className="grid gap-2  grid-rows-[auto_1fr]">
                      <div className='bg-slate-50 rounded-lg border-slate-100 '><h2 className='text-center'>Modelo globalizado</h2></div>
                        {/* Visualización Física */}
                        <div className="bg-slate-50 rounded-lg p-4 flex flex-col items-center justify-center border border-slate-100">
                          
                            <div 
                                className="w-32 h-32 rounded-xl shadow-md flex items-center justify-center transition-colors duration-200 relative"
                                style={{ backgroundColor: getHeatColor(currentData.lumped) }}
                            >
                                <span className="font-bold text-white text-xl drop-shadow-md">
                                    {currentData.lumped}°C
                                </span>
                                {/* Indicadores de que todo es igual */}
                                <div className="absolute top-2 left-2 w-2 h-2 bg-white/50 rounded-full"></div>
                                <div className="absolute bottom-2 right-2 w-2 h-2 bg-white/50 rounded-full"></div>
                            </div>
                            <p className="mt-4 text-xs text-center text-slate-500">
                                Todo el bloque tiene la misma temperatura T(t).
                                <br/>Resistencia interna R ≈ 0.
                            </p>
                        </div>

                        {/* Gráfico */}
                        <div className="h-48 w-full bg-white">
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={SIMULATION_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis domain={[0, 100]} fontSize={10} width={30} stroke="#94a3b8"/>
                                    <Tooltip labelStyle={{color: '#334155'}} itemStyle={{color: '#f97316'}} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="lumped" 
                                        stroke="#f97316" 
                                        strokeWidth={3} 
                                        dot={false} 
                                        animationDuration={0}
                                    />
                                    {/* Cursor de tiempo */}
                                    <Line dataKey={() => null} activeDot={{ r: 0 }} /> 
                                    {SIMULATION_DATA.filter(d => d.time === time).map(pt => (
                                        <ReferenceLineDot key="ref" x={pt.time} y={pt.lumped} color="#f97316" />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 3. MODELO DISTRIBUIDO (Right Column) */}
            <div className="col-span-8 lg:col-span-6 flex flex-col ">
                <Card 
                     
                    className=" border-t-4 border-t-blue-500"
                >
                    <div className="grid gap-2  grid-rows-[auto_1fr]">
                      <div className='bg-slate-50 rounded-lg border-slate-100 '><h2 className='text-center'>Modelo distribuido</h2></div>
                        {/* Visualización Física */}
                        <div className="bg-slate-50 rounded-lg p-6 flex flex-col items-center justify-center border border-slate-100">
                            <div className="w-full h-32 flex flex-col justify-center relative">
                                {/* La Barra con Gradiente */}
                                <div className="h-12 w-full rounded-lg shadow-inner flex overflow-hidden border border-slate-300">
                                     {/* Renderizamos segmentos para simular gradiente continuo */}
                                     {Array.from({ length: 20 }).map((_, idx) => {
                                         const posPercent = idx / 19; // 0 to 1
                                         // Interpolación lineal simple entre source, mid, end
                                         let localTemp;
                                         if (posPercent <= 0.5) {
                                            localTemp = 100 + (currentData.distMid - 100) * (posPercent / 0.5);
                                         } else {
                                            localTemp = currentData.distMid + (currentData.distEnd - currentData.distMid) * ((posPercent - 0.5) / 0.5);
                                         }
                                         
                                         return (
                                             <div 
                                                key={idx} 
                                                className="flex-1" 
                                                style={{ backgroundColor: getHeatColor(localTemp) }}
                                                title={`x=${posPercent.toFixed(1)}L: ${localTemp.toFixed(1)}°C`}
                                             />
                                         );
                                     })}
                                </div>
                                {/* Etiquetas de posición */}
                                <div className="flex justify-between w-full mt-2 text-[10px] font-mono text-slate-400 uppercase">
                                    <div className="text-center">
                                        <span className="block text-slate-800 font-bold">100°C</span>
                                        x=0
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-orange-600 font-bold">{currentData.distMid}°C</span>
                                        x=L/2
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-blue-600 font-bold">{currentData.distEnd}°C</span>
                                        x=L
                                    </div>
                                </div>
                            </div>
                             <p className="mt-4 text-xs text-center text-slate-500">
                                Existe un <strong>gradiente</strong>. La temperatura depende de la posición 'x'.
                            </p>
                        </div>

                        {/* Gráfico */}
                        <div className="h-48 w-full bg-white">
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={SIMULATION_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis domain={[0, 100]} fontSize={10} width={30} stroke="#94a3b8" />
                                 <Tooltip
  labelStyle={{ color: '#334155' }}
  formatter={(value, name) => [
    `${value ?? ''}°C`,
    name === 'distMid'
      ? 'Centro (x=L/2)'
      : name === 'distEnd'
      ? 'Final (x=L)'
      : 'Fuente',
  ]}
/>
                                    <Legend iconType="plainline" wrapperStyle={{fontSize: '10px', paddingTop: '5px'}}/>
                                    <Line type="monotone" dataKey="distSource" name="x=0" stroke="#ef4444" strokeWidth={1} dot={false} strokeDasharray="3 3"/>
                                    <Line type="monotone" dataKey="distMid" name="x=L/2" stroke="#f59e0b" strokeWidth={2} dot={false} animationDuration={0}/>
                                    <Line type="monotone" dataKey="distEnd" name="x=L" stroke="#3b82f6" strokeWidth={2} dot={false} animationDuration={0}/>
                                    
                                    {/* Puntos de referencia actuales */}
                                    {SIMULATION_DATA.filter(d => d.time === time).map(pt => (
                                        <React.Fragment key="dots">
                                            <ReferenceLineDot x={pt.time} y={pt.distMid} color="#f59e0b" />
                                            <ReferenceLineDot x={pt.time} y={pt.distEnd} color="#3b82f6" />
                                        </React.Fragment>
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>
            </div>
            
            <div className="col-span-12">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 flex gap-3 items-center">
                    <Info className="flex-shrink-0" size={20}/>
                    <p>
                        <strong>Observa la diferencia clave:</strong> Al inicio (t=0), el modelo globalizado cambia su temperatura inmediatamente en todo el volumen. 
                        En el modelo distribuido, el calor tarda tiempo en viajar desde la fuente (x=0) hasta el final (x=L).
                    </p>
                </div>
            </div>

        </div>);
};

// 7. Diagrama Integrador (Resumen)
const IntegratorDiagram = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4  ">
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
        <h4 className="font-bold text-blue-800">1. Azar</h4>
        <p className="text-sm text-blue-700">¿El resultado es predecible (Determinístico) o incierto (Estocástico)?</p>
      </div>
      <div className="p-3 bg-emerald-50 rounded border-l-4 border-emerald-500">
        <h4 className="font-bold text-emerald-800">2. Complejidad</h4>
        <p className="text-sm text-emerald-700">¿La relación es proporcional (Lineal) o compleja (No Lineal)?</p>
      </div>
    </div>
    <div className="space-y-4">
      <div className="p-3 bg-amber-50 rounded border-l-4 border-amber-500">
        <h4 className="font-bold text-amber-800">3. Tiempo</h4>
        <p className="text-sm text-amber-700">¿El sistema cambia (Dinámico) o permanece igual (Estático)?</p>
      </div>
      <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-500">
        <h4 className="font-bold text-purple-800">4. Espacio</h4>
        <p className="text-sm text-purple-700">¿Es un punto promedio (Agregado) o importa la ubicación (Distribuido)?</p>
      </div>
    </div>
  </div>
);


// --- Componente Layout Principal ---

const LessonLayout = ({ 
  tabs, 
  activeTabId, 
  onTabChange 
}: { 
  tabs: TabData[], 
  activeTabId: string, 
  onTabChange: (id: string) => void 
}) => {
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const renderContent = () => {
    switch (activeTabId) {
      case 'four-blocks': return <FourBlocksDiagram />;
      case 'layers': return <LayeredDiagram />;
      case 'det-vs-prob': return <DetVsProbDiagram />;
      case 'lin-vs-nonlin': return <LinVsNonLinDiagram />;
      case 'temporal': return <TemporalDiagram />;
      case 'spatial': return <SpatialDiagram />;
      case 'integrator': return <IntegratorDiagram />;
      default: return <div className="p-4">Seleccione una pestaña</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 p-4 md:p-8">
      {/* Grid Container Principal */}
      <div className="grid grid-cols-1 gap-6 max-w-7xl mx-auto h-[90vh]">
        
        {/* Header Area */}
        <header className="grid grid-cols-[auto_1fr] items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Grid3X3 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Modelos matemáticos basados en la naturaleza de las ecuaciones</h1>
          </div>
        </header>

        {/* Navigation Tabs Area (Grid-based nav) */}
        <nav className="grid grid-cols-7 gap-2 bg-slate-200 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-md text-xs font-medium transition-all
                ${activeTabId === tab.id 
                  ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-600 hover:bg-slate-300/50 hover:text-slate-800'}
              `}
            >
              <div className="mb-1">{tab.icon}</div>
              <span className="text-center leading-tight truncate w-full">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content Area (Split into Info and Visualization via Grid) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          
          {/* Panel Izquierdo: Descripción (4 columnas) */}
          <div className="lg:col-span-4 flex flex-col gap-4 ">
            <Card className="">
               <div className="space-y-4">
                 <div>
                   <h2 className="text-2xl font-bold text-indigo-900 mb-2">{activeTab.title}</h2>
          
                     {activeTab.description}
                 
                 </div>

               </div>
            </Card>
          </div>

          {/* Panel Derecho: Renderizado del Diagrama (8 columnas) */}
          <div className="lg:col-span-8 min-h-[400px]">
            <Card className=" bg-white relative">
                {renderContent()}
            </Card>
          </div>

        </main>

      </div>
    </div>
  );
};

// --- Componente Raíz ---

export default function App() {
  const [activeTabId, setActiveTabId] = useState<string>('four-blocks');

  const tabs: TabData[] = [
    {
      id: 'four-blocks',
      label: 'Intro',
      icon: <Grid3X3 size={16} />,
      title: 'Introducción a la lección',
      category: 'Estático',
      description: (
<DivCarousel>
<p>La <strong>forma</strong> y <strong>estructura</strong> de las ecuaciones matemáticas influyen en el comportamiento de los modelos, permitiéndote identificar distintos <strong>tipos de modelos</strong> según la <strong>incertidumbre</strong>, la <strong>relación entre variables</strong>, el <strong>tiempo</strong> y el <strong>espacio</strong>.</p>
<p>Además del origen <strong>teórico</strong> o <strong>empírico</strong>, los modelos matemáticos también se clasifican según la <strong>naturaleza de las ecuaciones</strong> que los componen. </p><p>Este enfoque se centra en cómo el modelo representa la <strong>causalidad</strong>, el <strong>azar</strong>, la <strong>evolución temporal</strong> y la <strong>distribución espacial</strong> del fenómeno. <br /> Comprender esta clasificación ayuda a anticipar la complejidad del modelo y los métodos necesarios para analizarlo.</p>
</DivCarousel>
),
      contentId: 'four-blocks'
    },
    {
      id: 'layers',
      label: 'Capas',
      icon: <Layers size={16} />,
      title: 'Modelos basados en la naturaleza de las ecuaciones',
      category: 'Dinámico',
      description: (
<DivCarousel>
<p>Esta clasificación se enfoca en la <strong>estructura matemática</strong> interna del modelo, es decir, en cómo se <strong>relacionan las variables</strong> y cómo se incorporan elementos clave como el <strong>tiempo</strong>, la <strong>incertidumbre</strong> y el <strong>espacio</strong>. </p><p> Estos aspectos <strong>determinan</strong> no solo el comportamiento del modelo, sino también la <strong>dificultad de su análisis y resolución</strong>.</p>
<div><p><strong>Aspectos que considera esta clasificación:</strong></p>
<ul>
<li>Presencia o ausencia de <strong>incertidumbre</strong>.</li>
<li>Tipo de relación entre <strong>variables</strong>.</li>
<li>Dependencia <strong>temporal</strong>.</li>
<li>Representación <strong>espacial</strong> del sistema.</li>
</ul></div>

</DivCarousel>
),
      contentId: 'layers'
    },
    {
      id: 'det-vs-prob',
      label: 'Det. vs Prob.',
      icon: <BarChart2 size={16} />,
      title: 'Modelos determinísticos y probabilísticos',
      category: 'Estático',
      description: <DivCarousel>
<p>Este primer criterio <strong>distingue los modelos según si consideran o no el azar </strong>en sus resultados.</p>
<div><strong>Modelos determinísticos</strong>
<p>Un conjunto dado de condiciones iniciales conduce siempre al mismo resultado. <strong>No existe incertidumbre explícita</strong> en el modelo.</p></div>
<div><p><strong>Características principales de modelos determinísticos:</strong></p>
<ul>
<li><strong>Relaciones causa–efecto </strong>bien definidas.</li>
<li>Resultados <strong>únicos</strong> y <strong>reproducibles</strong>.</li>
<li>Uso común en <strong>sistemas idealizados</strong> o altamente controlados.</li>
</ul></div>
<div><strong>Modelos probabilísticos</strong>
<p>Incorporan la <strong>incertidumbre</strong> mediante <strong>variables aleatorias</strong> y <strong>distribuciones de probabilidad</strong>, lo que permite describir fenómenos aleatorios o complejos.</p></div>
<div><p><strong>Características principales de modelos probabilísticos:</strong></p>
<ul>
<li>Resultados expresados como <strong>probabilidades</strong>.</li>
<li>Representación de <strong>variabilidad</strong> y riesgo.</li>
<li>Uso frecuente en <strong>estadística</strong>, <strong>finanzas</strong> y <strong>ciencias sociales</strong>.</li>
</ul></div>

</DivCarousel>,
      contentId: 'det-vs-prob'
    },
    {
      id: 'lin-vs-nonlin',
      label: 'Linealidad',
      icon: <Activity size={16} />,
      title: 'Modelos lineales y no lineales',
      category: 'Dinámico',
      description: (
<DivCarousel>
<p>Este criterio <strong>se basa en cómo aparecen las variables</strong> dentro de las ecuaciones del modelo.</p>
<div><strong>Modelos lineales</strong>
<p>Las variables aparecen elevadas a la <strong>primera potencia</strong> y no se multiplican entre sí.</p></div>
<div><p><strong>Características principales de los modelos lineales:</strong></p>
<ul>
<li>Estructura <strong>matemática simple</strong>.</li>
<li><strong>Soluciones analíticas</strong> frecuentes.</li>
<li>Útiles como <strong>primera aproximación</strong> a fenómenos reales.</li>
</ul></div>
<div><strong>Modelos no lineales</strong>
<p>Incluyen <strong>productos entre variables</strong>, <strong>potencias mayores</strong> que uno o <strong>funciones no lineales</strong>.</p></div>
<div><p><strong>Características principales de modelos no lineales:</strong></p>
<ul>
<li>Representan <strong>comportamientos complejos</strong>.</li>
<li>Pueden presentar <strong>múltiples soluciones</strong> o caos.</li>
<li>Requieren <strong>métodos numéricos</strong> para su análisis.</li>
</ul></div>

</DivCarousel>
),
      contentId: 'lin-vs-nonlin'
    },
    {
      id: 'temporal',
      label: 'Temporal',
      icon: <Clock size={16} />,
      title: 'Modelos de estado estacionario y no estacionario',
      category: 'Dinámico',
      description: (
<DivCarousel>
<p>Este criterio <strong>distingue</strong> los modelos según <strong>si las variables dependen o no del tiempo.</strong></p>
<div><strong>Modelos de estado estacionario</strong>
<p>Describen sistemas que <strong>no cambian con el tiempo</strong> o que se analizan en equilibrio.</p></div>
<div><p><strong>Características principales:</strong></p>
<ul>
<li><strong>Variables constantes</strong> en el tiempo.</li>
<li><strong>Simplificación</strong> del análisis.</li>
<li>Adecuados cuando los <strong>cambios temporales son despreciables</strong>.</li>
</ul></div>
<div><strong>Modelos no estacionarios</strong>
<p>Consideran explícitamente la <strong>evolución temporal del sistema.</strong></p></div>
<div><p><strong>Características principales:</strong></p>
<ul>
<li>Incluyen <strong>derivadas respecto al tiempo</strong>.</li>
<li>Representan <strong>procesos dinámicos</strong>.</li>
<li>Esenciales para estudiar <strong>transitorios</strong> y <strong>predicciones futuras</strong>.</li>
</ul></div>


</DivCarousel>
),
      contentId: 'temporal'
    },
    {
      id: 'spatial',
      label: 'Espacial',
      icon: <Box size={16} />,
      title: 'Modelos de parámetros globalizados y distribuidos',
      category: 'Interactivo',
      description: (
<DivCarousel>
<p>Este criterio se relaciona con si el <strong>modelo considera o no variaciones espaciales</strong>.</p>
<div><strong>Modelos de parámetros globalizados</strong>
<p>También llamados modelos concentrados, suponen que las <strong>variables son uniformes</strong> en todo el sistema.</p></div>
<div>
<p><strong>Características principales:</strong></p>
<ul>
<li>No consideran <strong>variaciones espaciales</strong>.</li>
<li><strong>Menor complejidad</strong> matemática.</li>
<li>Adecuados para sistemas pequeños o bien mezclados.</li>
</ul></div>
<div>
<strong>Modelos de parámetros distribuidos</strong>
<p>Estos modelos permiten que las <strong>variables varíen tanto en el espacio como en el tiempo</strong>.</p></div>
<div>
<p><strong>Características principales:</strong></p>
<ul>
<li>Uso de <strong>ecuaciones diferenciales parciales</strong>.</li>
<li>Representación de <strong>gradientes espaciales</strong>.</li>
<li><strong>Mayor realismo y complejidad computacional</strong>.</li>
</ul></div>

</DivCarousel>
),
      contentId: 'spatial'
    },
    {
      id: 'integrator',
      label: 'Resumen',
      icon: <Maximize size={16} />,
      title: 'Cierre de la leccion',
      category: 'Estático',
      description: (<DivCarousel>
<p><strong>Clasificar los modelos matemáticos</strong> según la naturaleza de sus ecuaciones permite comprender cómo se representa la <strong>incertidumbre</strong>, la <strong>complejidad</strong>, el <strong>tiempo</strong> y el <strong>espacio</strong> en un sistema.  </p><p>Cada criterio aporta una perspectiva distinta que <strong>orienta la elección del modelo</strong>, los <strong>métodos de solución</strong> y la<strong> interpretación de resultados</strong>. </p><p> <strong>Dominar estas clasificaciones es esencial para aplicar modelos matemáticos</strong> de forma crítica y efectiva en distintos campos del conocimiento.</p>
</DivCarousel>),
      contentId: 'integrator'
    }
  ];

  return (
    <LessonLayout 
      tabs={tabs} 
      activeTabId={activeTabId} 
      onTabChange={setActiveTabId} 
    />
  );
}