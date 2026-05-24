import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function CollisionAlert({ alert }) {
  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          className="collision-banner"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Shockwave rings */}
          <div className="shockwave-ring" />
          <div className="shockwave-ring" style={{ animationDelay: '0.2s' }} />
          <div className="shockwave-ring" style={{ animationDelay: '0.4s' }} />

          {/* Alert card */}
          <motion.div
            className="relative glass-card px-8 py-5"
            style={{
              background: 'rgba(255,45,85,0.15)',
              border: '2px solid rgba(255,45,85,0.5)',
              boxShadow: '0 0 40px rgba(255,45,85,0.3), 0 0 80px rgba(255,45,85,0.1)',
            }}
            animate={{
              boxShadow: [
                '0 0 40px rgba(255,45,85,0.3), 0 0 80px rgba(255,45,85,0.1)',
                '0 0 60px rgba(255,45,85,0.5), 0 0 100px rgba(255,45,85,0.2)',
                '0 0 40px rgba(255,45,85,0.3), 0 0 80px rgba(255,45,85,0.1)',
              ],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle
                size={24}
                className="text-[#ff2d55]"
                style={{ filter: 'drop-shadow(0 0 8px rgba(255,45,85,0.8))' }}
              />
              <span
                className="text-lg font-bold tracking-wider"
                style={{
                  fontFamily: 'var(--font-orbitron)',
                  color: '#ff2d55',
                  textShadow: '0 0 12px rgba(255,45,85,0.6)',
                }}
              >
                ⚠ COLLISION RISK
              </span>
            </div>
            <div className="space-y-1">
              <p
                className="text-sm"
                style={{ fontFamily: 'var(--font-mono)', color: '#ff9999' }}
              >
                {alert.car} — Cloud response delayed
              </p>
              <p
                className="text-xs"
                style={{ fontFamily: 'var(--font-mono)', color: '#ff6666' }}
              >
                Latency: <span className="font-bold text-[#ff2d55]">{alert.latency}ms</span> (threshold: 50ms)
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
