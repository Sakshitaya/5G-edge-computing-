import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Arc gauge component — renders a semicircular gauge with animated needle
export default function LatencyGauge({ label, value, min, max, color, dangerThreshold }) {
  const canvasRef = useRef(null);
  const prevValueRef = useRef(value);

  const isDanger = value > dangerThreshold;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h - 10;
    const radius = Math.min(cx, cy) - 15;

    const startVal = prevValueRef.current;
    const endVal = value;
    const duration = 300;
    const startTime = Date.now();

    function draw(currentVal) {
      ctx.clearRect(0, 0, w, h);

      // Background arc
      ctx.beginPath();
      ctx.arc(cx, cy, radius, Math.PI, 0, false);
      ctx.strokeStyle = 'rgba(148,163,184,0.08)';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Color zones
      const segments = [
        { from: 0, to: 0.33, color: '#4ade80' },
        { from: 0.33, to: 0.66, color: '#facc15' },
        { from: 0.66, to: 1, color: '#ef4444' },
      ];

      segments.forEach((seg) => {
        ctx.beginPath();
        const startAngle = Math.PI + seg.from * Math.PI;
        const endAngle = Math.PI + seg.to * Math.PI;
        ctx.arc(cx, cy, radius, startAngle, endAngle, false);
        ctx.strokeStyle = seg.color + '15';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      // Active arc
      const progress = Math.max(0, Math.min(1, (currentVal - min) / (max - min)));
      ctx.beginPath();
      ctx.arc(cx, cy, radius, Math.PI, Math.PI + progress * Math.PI, false);
      ctx.strokeStyle = isDanger ? '#ef4444' : color;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.shadowColor = isDanger ? '#ef4444' : color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Needle
      const angle = Math.PI + progress * Math.PI;
      const needleLen = radius - 12;
      const nx = cx + Math.cos(angle) * needleLen;
      const ny = cy + Math.sin(angle) * needleLen;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#e2e8f0';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Needle center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = isDanger ? '#ef4444' : color;
      ctx.fill();

      // Tick marks
      for (let i = 0; i <= 10; i++) {
        const tickAngle = Math.PI + (i / 10) * Math.PI;
        const inner = radius - 18;
        const outer = radius - 13;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(tickAngle) * inner, cy + Math.sin(tickAngle) * inner);
        ctx.lineTo(cx + Math.cos(tickAngle) * outer, cy + Math.sin(tickAngle) * outer);
        ctx.strokeStyle = 'rgba(148,163,184,0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    function animate() {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const currentVal = startVal + (endVal - startVal) * eased;
      draw(currentVal);
      if (t < 1) {
        requestAnimationFrame(animate);
      }
    }

    animate();
    prevValueRef.current = value;
  }, [value, min, max, color, isDanger, dangerThreshold]);

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-medium tracking-wide mb-1" style={{ color: isDanger ? '#ef4444' : '#94a3b8' }}>
        {label}
      </span>
      <div className="gauge-container">
        <canvas
          ref={canvasRef}
          width={160}
          height={95}
          style={{ width: '140px', height: '85px' }}
        />
      </div>
      <motion.span
        className="text-lg font-bold tabular-nums mt-[-8px]"
        style={{ color: isDanger ? '#ef4444' : color }}
        key={Math.round(value)}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        {Math.round(value)}
        <span className="text-xs ml-1 opacity-50">ms</span>
      </motion.span>
    </div>
  );
}
