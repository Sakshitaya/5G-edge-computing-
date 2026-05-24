import { motion } from 'framer-motion';
import {
  Wifi,
  Cloud,
  Package,
} from 'lucide-react';

function StatItem({ icon: Icon, label, value, unit, color }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <Icon size={13} style={{ color }} />
      <div className="flex-1">
        <span
          className="text-[9px] uppercase tracking-wide block"
          style={{ color: '#94a3b8' }}
        >
          {label}
        </span>
      </div>
      <motion.span
        className="text-sm font-semibold tabular-nums"
        style={{ color }}
        key={typeof value === 'number' ? Math.floor(value) : value}
        initial={{ scale: 1.03 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.1 }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && <span className="text-[9px] ml-0.5 opacity-50">{unit}</span>}
      </motion.span>
    </div>
  );
}

export default function NetworkStats({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-1"
    >
      {/* Throughput */}
      <div className="flex gap-1.5">
        <div className="flex-1 rounded-md p-0.5" style={{ background: 'rgba(30,41,59,0.5)' }}>
          <StatItem
            icon={Wifi}
            label="Edge Throughput"
            value={stats.edgeThroughput}
            unit="Gbps"
            color="#4ade80"
          />
        </div>
        <div className="flex-1 rounded-md p-0.5" style={{ background: 'rgba(30,41,59,0.5)' }}>
          <StatItem
            icon={Cloud}
            label="Cloud Throughput"
            value={stats.cloudThroughput}
            unit="Gbps"
            color="#fb923c"
          />
        </div>
      </div>

      {/* Packets */}
      <div className="flex gap-1.5">
        <div className="flex-1 rounded-md p-0.5" style={{ background: 'rgba(30,41,59,0.5)' }}>
          <StatItem
            icon={Package}
            label="Edge Packets"
            value={stats.packetsProcessed.edge}
            color="#4ade80"
          />
        </div>
        <div className="flex-1 rounded-md p-0.5" style={{ background: 'rgba(30,41,59,0.5)' }}>
          <StatItem
            icon={Package}
            label="Cloud Packets"
            value={stats.packetsProcessed.cloud}
            color="#fb923c"
          />
        </div>
      </div>
    </motion.div>
  );
}
