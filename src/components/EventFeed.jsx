import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function EventFeed({ events }) {
  const feedRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div ref={feedRef} className="event-feed space-y-1 pr-1">
      <AnimatePresence initial={false}>
        {events.map((evt) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, x: 15, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            className="flex items-start gap-2 px-2 py-1.5 rounded-md"
            style={{
              background:
                evt.type === 'edge'
                  ? 'rgba(34,197,94,0.04)'
                  : 'rgba(239,68,68,0.04)',
              borderLeft: `2px solid ${evt.type === 'edge' ? '#4ade80' : '#ef4444'}`,
            }}
          >
            {evt.type === 'edge' ? (
              <CheckCircle
                size={11}
                className="mt-0.5 shrink-0"
                style={{ color: '#4ade80' }}
              />
            ) : (
              <AlertTriangle
                size={11}
                className="mt-0.5 shrink-0"
                style={{ color: '#ef4444' }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                  style={{
                    background:
                      evt.type === 'edge'
                        ? 'rgba(34,197,94,0.1)'
                        : 'rgba(239,68,68,0.1)',
                    color: evt.type === 'edge' ? '#4ade80' : '#ef4444',
                  }}
                >
                  {evt.type === 'edge' ? 'EDGE' : 'CLOUD'}
                </span>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: '#e2e8f0' }}
                >
                  {evt.car}
                </span>
              </div>
              <p
                className="text-[10px] mt-0.5 leading-tight"
                style={{
                  color: evt.type === 'edge' ? '#86efac' : '#fca5a5',
                }}
              >
                {evt.message}
              </p>
            </div>
            <span
              className="text-[8px] shrink-0 mt-0.5"
              style={{ color: '#64748b' }}
            >
              {new Date(evt.timestamp).toLocaleTimeString('en-US', {
                hour12: false,
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      {events.length === 0 && (
        <div className="flex items-center justify-center h-14 opacity-30">
          <span className="text-[10px]" style={{ color: '#94a3b8' }}>
            Waiting for events...
          </span>
        </div>
      )}
    </div>
  );
}
