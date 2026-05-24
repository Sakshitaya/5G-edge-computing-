import { useSimulation } from './hooks/useSimulation';
import ControlBar from './components/ControlBar';
import SimulationMap from './components/SimulationMap';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const {
    state,
    setMode,
    setSpeed,
    toggleRunning,
  } = useSimulation();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden" style={{ background: '#0f172a' }}>
      {/* Top Control Bar */}
      <ControlBar
        mode={state.mode}
        speed={state.speed}
        running={state.running}
        onModeChange={setMode}
        onSpeedChange={setSpeed}
        onToggleRunning={toggleRunning}
      />

      {/* Main Content */}
      <div className="flex flex-1 gap-2 px-3 pb-3 min-h-0">
        {/* Map Panel (60%) */}
        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            width: '60%',
            border: '1px solid rgba(148,163,184,0.1)',
          }}
        >
          <SimulationMap
            vehicles={state.vehicles}
            mode={state.mode}
          />
        </div>

        {/* Dashboard Panel (40%) */}
        <div
          className="flex flex-col min-h-0"
          style={{ width: '40%' }}
        >
          <Dashboard
            currentEdgeLatency={state.currentEdgeLatency}
            currentCloudLatency={state.currentCloudLatency}
            latencyHistory={state.latencyHistory}
            events={state.events}
            stats={state.stats}
            mode={state.mode}
            comparison={state.comparison}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
