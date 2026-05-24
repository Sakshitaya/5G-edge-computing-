import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  TrendingUp,
  Server,
  Cloud,
  Zap,
  Timer,
  Activity,
  Shield,
} from 'lucide-react';

function ComparisonRow({ label, edgeValue, cloudValue, edgeUnit, cloudUnit, edgeColor, cloudColor, higherIsBetter = false }) {
  const eNum = parseFloat(edgeValue);
  const cNum = parseFloat(cloudValue);
  const edgeWins = higherIsBetter ? eNum >= cNum : eNum <= cNum;

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded-md" style={{ background: 'rgba(30,41,59,0.4)' }}>
      <span className="text-[10px] font-medium flex-1 min-w-0 truncate" style={{ color: '#94a3b8' }}>
        {label}
      </span>
      <div className="flex items-center gap-1">
        <span className="text-[11px] font-semibold tabular-nums" style={{ color: edgeWins ? '#4ade80' : edgeColor || '#e2e8f0' }}>
          {edgeValue}{edgeUnit && <span className="text-[9px] opacity-60 ml-0.5">{edgeUnit}</span>}
        </span>
        {edgeWins && <ArrowDown size={10} style={{ color: '#4ade80' }} />}
      </div>
      <span className="text-[9px]" style={{ color: '#475569' }}>vs</span>
      <div className="flex items-center gap-1">
        <span className="text-[11px] font-semibold tabular-nums" style={{ color: !edgeWins ? '#4ade80' : cloudColor || '#e2e8f0' }}>
          {cloudValue}{cloudUnit && <span className="text-[9px] opacity-60 ml-0.5">{cloudUnit || edgeUnit}</span>}
        </span>
        {!edgeWins && <ArrowDown size={10} style={{ color: '#4ade80' }} />}
      </div>
    </div>
  );
}

export default function EdgeCloudComparison({ comparison, stats }) {
  const speedup = comparison.avgCloudLatency / Math.max(comparison.avgEdgeLatency, 0.1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-1.5"
    >
      {/* Speedup badge */}
      <div
        className="flex items-center justify-between py-2 px-3 rounded-md"
        style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}
      >
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: '#4ade80' }} />
          <span className="text-[11px] font-medium" style={{ color: '#94a3b8' }}>
            Edge is faster by
          </span>
        </div>
        <span className="text-base font-bold tabular-nums" style={{ color: '#4ade80' }}>
          {Math.round(speedup)}x
        </span>
      </div>

      {/* Comparison rows */}
      <div className="space-y-1">
        <ComparisonRow
          label="Avg Latency"
          edgeValue={comparison.avgEdgeLatency}
          cloudValue={comparison.avgCloudLatency}
          edgeUnit="ms"
          edgeColor="#94a3b8"
          cloudColor="#fb923c"
        />
        <ComparisonRow
          label="Jitter (σ)"
          edgeValue={comparison.edgeJitter}
          cloudValue={comparison.cloudJitter}
          edgeUnit="ms"
          edgeColor="#94a3b8"
          cloudColor="#fb923c"
        />
        <ComparisonRow
          label="Throughput"
          edgeValue={stats.edgeThroughput}
          cloudValue={stats.cloudThroughput}
          edgeUnit="Gbps"
          edgeColor="#94a3b8"
          cloudColor="#fb923c"
          higherIsBetter={true}
        />
        <ComparisonRow
          label="Packet Loss"
          edgeValue={comparison.edgePacketLoss}
          cloudValue={comparison.cloudPacketLoss}
          edgeUnit="%"
          edgeColor="#94a3b8"
          cloudColor="#fb923c"
        />
        <ComparisonRow
          label="Uptime"
          edgeValue={comparison.edgeUptime}
          cloudValue={comparison.cloudUptime}
          edgeUnit="%"
          edgeColor="#94a3b8"
          cloudColor="#fb923c"
          higherIsBetter={true}
        />
      </div>

      {/* Safety comparison */}
      <div className="flex gap-1.5 mt-1">
        <div
          className="flex-1 flex items-center gap-1.5 py-1.5 px-2 rounded-md"
          style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}
        >
          <Shield size={12} style={{ color: '#4ade80' }} />
          <div>
            <div className="text-[8px] uppercase" style={{ color: '#94a3b8' }}>Prevented</div>
            <div className="text-sm font-bold tabular-nums" style={{ color: '#4ade80' }}>
              {stats.accidentsPrevented}
            </div>
          </div>
        </div>
        <div
          className="flex-1 flex items-center gap-1.5 py-1.5 px-2 rounded-md"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}
        >
          <Activity size={12} style={{ color: '#f87171' }} />
          <div>
            <div className="text-[8px] uppercase" style={{ color: '#94a3b8' }}>Cloud Delays</div>
            <div className="text-sm font-bold tabular-nums" style={{ color: '#f87171' }}>
              {stats.incidentsDueToDelay}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
