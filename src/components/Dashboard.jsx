import { motion } from 'framer-motion';
import { Gauge, BarChart3, ScrollText, Network, GitCompareArrows } from 'lucide-react';
import LatencyGauge from './LatencyGauge';
import LatencyChart from './LatencyChart';
import EventFeed from './EventFeed';
import NetworkStats from './NetworkStats';
import EdgeCloudComparison from './EdgeCloudComparison';

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-2 px-1">
      <Icon size={12} style={{ color: '#94a3b8' }} />
      <span
        className="text-[10px] font-semibold tracking-wide uppercase"
        style={{ color: '#94a3b8' }}
      >
        {title}
      </span>
      <div className="flex-1 h-px ml-2" style={{ background: 'rgba(148,163,184,0.12)' }} />
    </div>
  );
}

export default function Dashboard({
  currentEdgeLatency,
  currentCloudLatency,
  latencyHistory,
  events,
  stats,
  mode,
  comparison,
}) {
  return (
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
      className="flex flex-col gap-2 h-full p-2 overflow-y-auto"
    >
      {/* 1. Latency Gauges */}
      <div
        className="rounded-lg p-3"
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        <SectionHeader icon={Gauge} title="Live Latency" />
        <div className="flex items-center justify-around">
          <LatencyGauge
            label="EDGE"
            value={currentEdgeLatency}
            min={0}
            max={20}
            color="#4ade80"
            dangerThreshold={10}
          />
          <div className="w-px h-14" style={{ background: 'rgba(148,163,184,0.1)' }} />
          <LatencyGauge
            label="CLOUD"
            value={currentCloudLatency}
            min={0}
            max={250}
            color="#fb923c"
            dangerThreshold={100}
          />
        </div>

        {/* Quick comparison */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="text-center">
            <span className="text-[9px] block" style={{ color: '#94a3b8' }}>Edge</span>
            <span className="text-sm font-bold tabular-nums" style={{ color: '#4ade80' }}>
              {Math.round(currentEdgeLatency)}ms
            </span>
          </div>
          <span className="text-[10px]" style={{ color: '#475569' }}>vs</span>
          <div className="text-center">
            <span className="text-[9px] block" style={{ color: '#94a3b8' }}>Cloud</span>
            <span className="text-sm font-bold tabular-nums" style={{ color: '#fb923c' }}>
              {Math.round(currentCloudLatency)}ms
            </span>
          </div>
          <div
            className="px-2 py-0.5 rounded text-[10px] font-semibold"
            style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.15)',
              color: '#4ade80',
            }}
          >
            {Math.round(currentCloudLatency / Math.max(currentEdgeLatency, 1))}x faster
          </div>
        </div>
      </div>

      {/* 2. Real-Time Latency Chart */}
      <div
        className="rounded-lg p-3 flex-1 min-h-[170px]"
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        <SectionHeader icon={BarChart3} title="Latency Over Time" />
        <div className="h-[150px]">
          <LatencyChart data={latencyHistory} />
        </div>
        <div className="flex items-center justify-center gap-5 mt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded" style={{ background: '#4ade80' }} />
            <span className="text-[9px]" style={{ color: '#94a3b8' }}>Edge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded" style={{ background: '#fb923c' }} />
            <span className="text-[9px]" style={{ color: '#94a3b8' }}>Cloud</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded" style={{ background: '#ef4444', borderTop: '1px dashed #ef4444' }} />
            <span className="text-[9px]" style={{ color: '#94a3b8' }}>Threshold</span>
          </div>
        </div>
      </div>

      {/* 3. Vehicle Status Feed */}
      <div
        className="rounded-lg p-3"
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        <SectionHeader icon={ScrollText} title="Vehicle Events" />
        <EventFeed events={events} />
      </div>

      {/* 4. Network Stats */}
      <div
        className="rounded-lg p-3"
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        <SectionHeader icon={Network} title="Network Stats" />
        <NetworkStats stats={stats} />
      </div>

      {/* 5. Edge vs Cloud Comparison */}
      <div
        className="rounded-lg p-3"
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        <SectionHeader icon={GitCompareArrows} title="Edge vs Cloud" />
        <EdgeCloudComparison comparison={comparison} stats={stats} />
      </div>
    </motion.div>
  );
}
