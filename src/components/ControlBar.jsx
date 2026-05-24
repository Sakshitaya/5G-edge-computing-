import { Pause, Play, Server, Cloud } from 'lucide-react';

export default function ControlBar({
  mode,
  speed,
  running,
  onModeChange,
  onSpeedChange,
  onToggleRunning,
}) {
  return (
    <div
      className="flex items-center justify-between px-6 py-4 mx-3 mt-3 mb-2 rounded-xl"
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.12)',
      }}
    >
      {/* Left: Title */}
      <div className="flex items-center gap-4">
        <h1
          className="text-base font-semibold tracking-wide"
          style={{ color: '#e2e8f0' }}
        >
          5G Edge vs Cloud Simulator
        </h1>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: running ? '#22c55e' : '#94a3b8',
              boxShadow: running ? '0 0 8px rgba(34,197,94,0.5)' : 'none',
            }}
          />
          <span className="text-[11px] font-medium" style={{ color: '#94a3b8' }}>
            {running ? 'LIVE' : 'PAUSED'}
          </span>
        </div>
      </div>

      {/* Center: Edge / Cloud Segmented Toggle */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center rounded-lg overflow-hidden"
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
          }}
          id="mode-toggle"
        >
          <button
            onClick={() => onModeChange('edge')}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium transition-all duration-200"
            style={{
              background: mode === 'edge' ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
              color: mode === 'edge' ? '#4ade80' : '#94a3b8',
              borderRight: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <Server size={15} />
            Edge
          </button>
          <button
            onClick={() => onModeChange('cloud')}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium transition-all duration-200"
            style={{
              background: mode === 'cloud' ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
              color: mode === 'cloud' ? '#fb923c' : '#94a3b8',
            }}
          >
            <Cloud size={15} />
            Cloud
          </button>
        </div>

        {/* Play/Pause */}
        <button
          onClick={onToggleRunning}
          className="p-2 rounded-lg transition-all"
          style={{
            background: 'rgba(148, 163, 184, 0.08)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            color: '#94a3b8',
          }}
          id="play-pause-btn"
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>

      {/* Right: Speed */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-medium" style={{ color: '#94a3b8' }}>
          Speed
        </span>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-20"
          id="speed-slider"
        />
        <span
          className="text-sm font-semibold w-8 text-right"
          style={{ color: '#e2e8f0' }}
        >
          {speed.toFixed(1)}x
        </span>
      </div>
    </div>
  );
}
