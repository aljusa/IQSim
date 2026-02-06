import React, { useState } from 'react';
import { Play, RotateCcw, Clock, Users, Coffee, BarChart2, FileCode, BookOpen, Activity, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,  } from 'recharts';

// --- TYPES & INTERFACES ---

type TabId = 'concepto' | 'enunciado' | 'procedimiento' | 'codigo' | 'simulacion';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

interface SimulationResult {
  clientId: number;
  arrivalTime: number; // Minuto en que llegó
  serviceStartTime: number; // Minuto en que inició atención
  serviceEndTime: number; // Minuto en que terminó
  waitTime: number; // Minutos esperando
  serviceTime: number; // Duración de la atención
}

interface SimulationSummary {
  totalClients: number;
  attendedClients: number;
  totalWaitTime: number;
  avgWaitTime: number;
  simulationLog: SimulationResult[];
}

// --- CONFIGURATION CONSTANTS ---
const SIMULATION_DURATION = 60; // 60 minutos
const ARRIVAL_MIN = 3;
const ARRIVAL_MAX = 7;
const SERVICE_MIN = 4;
const SERVICE_MAX = 6;

// --- UTILS ---
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// --- LOGIC HOOK ---
const useQueueSimulation = () => {
  const [summary, setSummary] = useState<SimulationSummary | null>(null);

  const runSimulation = () => {
    let clock = 0;
    let serverFreeAt = 0;
    
    let clientsArrived = 0;
    let clientsAttended = 0;
    let totalWaitTime = 0;
    
    const log: SimulationResult[] = [];

    // Bucle de simulación
    while (clock < SIMULATION_DURATION) {
      // Generar próxima llegada
      const timeToNextArrival = getRandomInt(ARRIVAL_MIN, ARRIVAL_MAX);
      clock += timeToNextArrival;

      if (clock > SIMULATION_DURATION) break;

      clientsArrived++;
      const currentClientArrival = clock;

      // Calcular espera
      let wait = 0;
      if (currentClientArrival < serverFreeAt) {
        wait = serverFreeAt - currentClientArrival;
      } else {
        wait = 0;
      }

      totalWaitTime += wait;

      // Calcular atención
      const startService = Math.max(currentClientArrival, serverFreeAt);
      const serviceDuration = getRandomInt(SERVICE_MIN, SERVICE_MAX);
      serverFreeAt = startService + serviceDuration;
      
      // Registrar si terminó dentro del tiempo o si contamos atendidos aunque termine después
      // El enunciado Python original cuenta como atendido en cuanto entra al servicio
      clientsAttended++;

      log.push({
        clientId: clientsArrived,
        arrivalTime: currentClientArrival,
        serviceStartTime: startService,
        serviceEndTime: serverFreeAt,
        waitTime: wait,
        serviceTime: serviceDuration
      });
    }

    setSummary({
      totalClients: clientsArrived,
      attendedClients: clientsAttended,
      totalWaitTime: totalWaitTime,
      avgWaitTime: clientsAttended > 0 ? parseFloat((totalWaitTime / clientsAttended).toFixed(2)) : 0,
      simulationLog: log
    });
  };

  const reset = () => setSummary(null);

  return { summary, runSimulation, reset };
};

// --- COMPONENTS ---

// 1. Layout Component (Grid Based)
const LessonLayout: React.FC<{
  children: React.ReactNode;
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}> = ({ children, activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { id: 'concepto', label: '1. Concepto', icon: <BookOpen size={18} /> },
    { id: 'enunciado', label: '2. Enunciado', icon: <FileCode size={18} /> },
    { id: 'procedimiento', label: '3. Procedimiento', icon: <Settings size={18} /> },
    { id: 'codigo', label: '4. Python', icon: <FileCode size={18} /> },
    { id: 'simulacion', label: '5. Simulador Interactivo', icon: <Activity size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid gap-6" style={{ gridTemplateRows: 'auto auto 1fr' }}>
        
        {/* Header Area */}
        <header className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid gap-2">
          <div className="grid grid-flow-col justify-start gap-3 items-center">
            <div className="p-3 bg-blue-600 rounded-lg text-white">
              <BarChart2 size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Simulación de Procesos de líneas de espera</h1>
            </div>
          </div>
        </header>

        {/* Navigation Tabs Area */}
        <nav className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 grid grid-cols-5">
            {tabs.map((tab) => (
                <button
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full grid grid-flow-col gap-2 items-center justify-center p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}</span>
                </button>
            ))}
        </nav>

        {/* Main Content Area */}
        <main className="grid" style={{ minHeight: '500px' }}>
          {children}
        </main>

      </div>
    </div>
  );
};

// 2. Card Component
const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden grid ${className}`} style={{ gridTemplateRows: 'auto 1fr' }}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
      <h3 className="font-semibold text-slate-800">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

// 3. Tab Content Components

const TabConcepto = () => (
  <div className="grid md:grid-cols-12 gap-6 h-full">
    <div className="md:col-span-5 grid gap-6 content-start">
      <Card title="¿Qué es la simulación de colas?">
        <p className="text-slate-600 leading-relaxed mb-4">
          La simulación de líneas de espera se utiliza para estudiar sistemas dinámicos donde elementos (personas, datos, autos) llegan, esperan si es necesario, y son atendidos por uno o más servidores.
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-sm text-slate-600">
            <div className="bg-blue-100 p-1 rounded text-blue-600 mt-1"><Users size={14}/></div>
            <span><strong>Entidad:</strong> Quien solicita el servicio (ej. Cliente).</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-600">
            <div className="bg-emerald-100 p-1 rounded text-emerald-600 mt-1"><Coffee size={14}/></div>
            <span><strong>Servidor:</strong> Quien presta el servicio (ej. Ventanilla).</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-600">
            <div className="bg-amber-100 p-1 rounded text-amber-600 mt-1"><Clock size={14}/></div>
            <span><strong>Cola:</strong> Tiempo o lugar donde la entidad espera.</span>
          </li>
        </ul>
      </Card>
      <Card title="Objetivos del análisis">
        <div className="grid gap-2 text-sm text-slate-600">
          <p>La simulación permite responder preguntas críticas:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>¿Es suficiente la capacidad actual?</li>
            <li>¿Cuánto tiempo pierde un cliente esperando?</li>
            <li>¿Cuál es el costo de oportunidad?</li>
          </ul>
        </div>
      </Card>
    </div>
    <div className="md:col-span-7 h-full">
      <Card title="Visualización del Concepto" className="h-full">
        <div className="h-full grid place-items-center bg-slate-50 rounded-lg border border-dashed border-slate-300 p-8">
          {/* Schematic Diagram using CSS Grid within the SVG/Div */}
          <div className="grid gap-4 text-center w-full max-w-md">
             <div className="grid grid-cols-3 gap-4 items-center">
                <div className="flex flex-col items-center p-4 bg-white rounded shadow-sm border border-slate-200">
                    <span className="text-2xl">👥</span>
                    <span className="text-xs font-bold text-slate-500 mt-2">LLEGADAS</span>
                    <span className="text-xs text-slate-400">Aleatorias</span>
                </div>
                <div className="h-1 bg-slate-300 w-full relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-slate-500 bg-slate-50 px-1">Cola</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded shadow-sm border border-blue-200">
                    <span className="text-2xl">🏦</span>
                    <span className="text-xs font-bold text-blue-600 mt-2">SERVICIO</span>
                    <span className="text-xs text-blue-400">Ventanilla Única</span>
                </div>
             </div>
             <div className="grid grid-cols-1 mt-4">
                 <div className="p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">
                    Salida: Clientes Atendidos ✅
                 </div>
             </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const TabEnunciado = () => (
  <div className="grid md:grid-cols-2 gap-6 h-full">
    <Card title="Parámetros del Ejercicio">
      <div className="space-y-6">
        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 grid place-items-center text-indigo-600 font-bold">1</div>
          <div>
            <h4 className="font-medium text-slate-900">Llegadas</h4>
            <p className="text-sm text-slate-600">Los clientes llegan cada <strong>3 a 7 minutos</strong>.</p>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Distribución Uniforme</span>
          </div>
        </div>
        
        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 grid place-items-center text-indigo-600 font-bold">2</div>
          <div>
            <h4 className="font-medium text-slate-900">Servicio</h4>
            <p className="text-sm text-slate-600">Atender tarda entre <strong>4 y 6 minutos</strong>.</p>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Un solo servidor</span>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 grid place-items-center text-indigo-600 font-bold">3</div>
          <div>
            <h4 className="font-medium text-slate-900">Duración</h4>
            <p className="text-sm text-slate-600">El sistema opera durante <strong>1 hora (60 minutos)</strong>.</p>
          </div>
        </div>
      </div>
    </Card>
    
    <Card title="Objetivos de Salida">
      <div className="h-full grid content-center gap-4">
        <p className="text-slate-600 text-center mb-4">Al finalizar la simulación debemos reportar:</p>
        <div className="grid grid-cols-1 gap-3">
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r text-sm text-blue-900">
            <strong>Variable 1:</strong> Total de clientes que llegaron.
          </div>
          <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r text-sm text-green-900">
            <strong>Variable 2:</strong> Total de clientes atendidos.
          </div>
          <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r text-sm text-amber-900">
            <strong>Variable 3:</strong> Tiempo total de espera acumulado (y promedio).
          </div>
        </div>
      </div>
    </Card>
  </div>
);

const TabProcedimiento = () => (
    <div className="h-full">
        <Card title="Diagrama de Flujo Lógico" className="h-full">
            <div className="grid md:grid-cols-2 gap-8 h-full items-start">
                <div className="space-y-4 text-sm text-slate-600">
                    <p>El algoritmo sigue un enfoque de "avance de reloj" basado en eventos:</p>
                    <ol className="list-decimal pl-5 space-y-3 marker:font-bold marker:text-slate-400">
                        <li>
                            <strong>Inicialización:</strong> Reloj en 0, contadores en 0.
                        </li>
                        <li>
                            <strong>Generación de Llegada:</strong> Se calcula cuándo llega el siguiente cliente <code>random(3, 7)</code> y se avanza el reloj.
                        </li>
                        <li>
                            <strong>Verificación de Tiempo:</strong> Si <code>reloj &gt; 60</code>, termina el bucle.
                        </li>
                        <li>
                            <strong>Cálculo de Espera:</strong> 
                            <ul className="list-disc pl-5 mt-1 text-slate-500">
                                <li>Si <code>reloj &lt; servidor_libre_en</code>: El cliente espera.</li>
                                <li>Si <code>reloj &ge; servidor_libre_en</code>: Pasa directo (espera = 0).</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Actualización del Servidor:</strong> Se define cuándo se liberará el servidor basado en la duración de la atención <code>random(4, 6)</code>.
                        </li>
                    </ol>
                </div>
                <div className="bg-slate-900 text-green-400 p-6 rounded-lg font-mono text-xs shadow-inner overflow-auto">
                    {`WHILE reloj < 60:
    tiempo_llegada = random(3, 7)
    reloj = reloj + tiempo_llegada
    
    IF reloj > 60: BREAK
    
    llegaron += 1
    
    IF reloj < libre_en:
       espera = libre_en - reloj
    ELSE:
       espera = 0
       
    inicio = MAX(reloj, libre_en)
    duracion = random(4, 6)
    libre_en = inicio + duracion
    
    atendidos += 1
    total_espera += espera`}
                </div>
            </div>
        </Card>
    </div>
);

const TabCodigo = () => (
    <div className="h-full grid grid-rows-[auto_1fr]">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-4 text-sm">
            <span className="font-bold">Nota:</span> A continuación se presenta el código Python original. La pestaña "Simulador Interactivo" ejecuta una versión portada a TypeScript de este mismo código.
        </div>
        <Card title="Código Fuente Python" className="h-full">
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-auto text-xs md:text-sm font-mono h-[500px]">
{`import random

# ---------------------------------------
# Función que genera el tiempo entre llegadas
# ---------------------------------------
def tiempo_entre_llegadas():
    return random.randint(3, 7)

# ---------------------------------------
# Función que genera el tiempo de atención
# ---------------------------------------
def tiempo_atencion():
    return random.randint(4, 6)

# ---------------------------------------
# Función principal de simulación
# ---------------------------------------
def simular_linea_espera(tiempo_simulacion):
    reloj = 0
    servidor_libre_en = 0

    clientes_llegaron = 0
    clientes_atendidos = 0
    tiempo_total_espera = 0

    while reloj < tiempo_simulacion:
        # Llega un nuevo cliente
        reloj += tiempo_entre_llegadas()

        if reloj > tiempo_simulacion:
            break

        clientes_llegaron += 1

        # El cliente espera si el servidor está ocupado
        if reloj < servidor_libre_en:
            espera = servidor_libre_en - reloj
        else:
            espera = 0

        tiempo_total_espera += espera

        # El servidor atiende al cliente
        inicio_atencion = max(reloj, servidor_libre_en)
        servidor_libre_en = inicio_atencion + tiempo_atencion()

        clientes_atendidos += 1

    return clientes_llegaron, clientes_atendidos, tiempo_total_espera

# Ejecución
# main() ...`}
            </pre>
        </Card>
    </div>
);

const TabSimulacion = () => {
  const { summary, runSimulation, reset } = useQueueSimulation();

  return (
    <div className="grid lg:grid-cols-12 gap-6 h-full">
      {/* Control Panel */}
      <div className="lg:col-span-4 grid gap-6 content-start">
        <Card title="Panel de Control">
          <div className="grid gap-4">
            <p className="text-sm text-slate-600">
              Presiona "Ejecutar" para correr una nueva iteración de 60 minutos con las variables aleatorias.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={runSimulation}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                <Play size={18} /> Ejecutar
              </button>
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                <RotateCcw size={18} /> Limpiar
              </button>
            </div>
            <div className="mt-2 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-500">
                <div>
                    <span className="block font-bold">Llegadas:</span> 3-7 min
                </div>
                <div>
                    <span className="block font-bold">Atención:</span> 4-6 min
                </div>
            </div>
          </div>
        </Card>

        {summary && (
          <Card title="Resultados Globales">
             <div className="grid gap-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-sm text-slate-600">Llegaron</span>
                    <span className="text-xl font-bold text-slate-900">{summary.totalClients}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100">
                    <span className="text-sm text-green-800">Atendidos</span>
                    <span className="text-xl font-bold text-green-700">{summary.attendedClients}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded border border-amber-100">
                    <span className="text-sm text-amber-800">Espera Total</span>
                    <span className="text-xl font-bold text-amber-700">{summary.totalWaitTime} min</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded border border-indigo-100">
                    <span className="text-sm text-indigo-800">Promedio Espera</span>
                    <span className="text-xl font-bold text-indigo-700">{summary.avgWaitTime} min</span>
                </div>
             </div>
          </Card>
        )}
      </div>

      {/* Visualization Panel */}
      <div className="lg:col-span-8 h-full">
        <Card title="Visualización de Datos" className="h-full min-h-[400px]">
          {!summary ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <BarChart2 size={48} className="mb-4 opacity-50" />
              <p>Ejecuta la simulación para ver los gráficos</p>
            </div>
          ) : (
            <div className="h-full grid grid-rows-[auto_1fr] gap-4">
               <div className="text-xs text-slate-500 text-center">
                  Gráfico de Tiempos por Cliente (Tiempo de Espera vs Tiempo de Servicio)
               </div>
               <div className="w-full h-[300px] md:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={summary.simulationLog}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="clientId" 
                        label={{ value: 'Cliente ID', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis 
                        label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} 
                      />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        cursor={{fill: '#f1f5f9'}}
                      />
                      <Legend />
                      <Bar dataKey="waitTime" name="Tiempo de Espera" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="serviceTime" name="Tiempo de Atención" stackId="a" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
               
               <div className="overflow-x-auto mt-4 border-t border-slate-100 pt-4">
                   <table className="w-full text-xs text-left">
                       <thead className="text-slate-500 font-medium bg-slate-50">
                           <tr>
                               <th className="p-2">ID</th>
                               <th className="p-2">Llegada (min)</th>
                               <th className="p-2">Inicia Atención</th>
                               <th className="p-2 text-amber-600">Espera</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                           {summary.simulationLog.map((row) => (
                               <tr key={row.clientId} className="hover:bg-slate-50">
                                   <td className="p-2 font-bold">{row.clientId}</td>
                                   <td className="p-2">{row.arrivalTime}</td>
                                   <td className="p-2">{row.serviceStartTime}</td>
                                   <td className={`p-2 font-bold ${row.waitTime > 0 ? 'text-amber-600' : 'text-slate-300'}`}>
                                       {row.waitTime} min
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('concepto');

  return (
    <LessonLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'concepto' && <TabConcepto />}
      {activeTab === 'enunciado' && <TabEnunciado />}
      {activeTab === 'procedimiento' && <TabProcedimiento />}
      {activeTab === 'codigo' && <TabCodigo />}
      {activeTab === 'simulacion' && <TabSimulacion />}
    </LessonLayout>
  );
};

export default App;