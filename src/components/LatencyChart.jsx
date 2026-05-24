import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';

export default function LatencyChart({ data }) {
  const chartData = useMemo(() => {
    return data.map((d, i) => ({
      idx: i,
      time: new Date(d.time).toLocaleTimeString('en-US', {
        second: '2-digit',
        minute: '2-digit',
      }),
      edge: d.edge,
      cloud: d.cloud,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full opacity-30">
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
          Collecting data...
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="edgeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 6"
            stroke="rgba(148,163,184,0.06)"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 8, fill: '#64748b', fontFamily: 'Inter, system-ui, sans-serif' }}
            axisLine={{ stroke: 'rgba(148,163,184,0.08)' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 8, fill: '#64748b', fontFamily: 'Inter, system-ui, sans-serif' }}
            axisLine={{ stroke: 'rgba(148,163,184,0.08)' }}
            tickLine={false}
            domain={[0, 220]}
          />

          <Tooltip
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148,163,184,0.15)',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#e2e8f0',
            }}
            labelStyle={{ color: '#94a3b8', fontSize: '9px' }}
          />

          {/* Incident threshold line */}
          <ReferenceLine
            y={50}
            stroke="#ef4444"
            strokeDasharray="6 4"
            strokeWidth={1}
            opacity={0.4}
          />

          {/* Edge latency area */}
          <Area
            type="monotone"
            dataKey="edge"
            stroke="#4ade80"
            strokeWidth={1.5}
            fill="url(#edgeGrad)"
            dot={false}
            animationDuration={300}
            name="Edge"
          />

          {/* Cloud latency area */}
          <Area
            type="monotone"
            dataKey="cloud"
            stroke="#fb923c"
            strokeWidth={1.5}
            fill="url(#cloudGrad)"
            dot={false}
            animationDuration={300}
            name="Cloud"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
