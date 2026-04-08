import { motion, AnimatePresence } from 'motion/react';
import { ExerciseDifficulty } from '../../types';

interface Props {
  isOpen:    boolean;
  onRate:    (level: ExerciseDifficulty) => void;
  onSkip:    () => void;
}

const OPTIONS: Array<{ level: ExerciseDifficulty; emoji: string; label: string; color: string; bg: string }> = [
  { level: 'easy',   emoji: '🟢', label: 'Leicht',  color: '#4ade80', bg: 'rgba(34,197,94,.12)'  },
  { level: 'medium', emoji: '🟡', label: 'Mittel',  color: '#fbbf24', bg: 'rgba(251,191,36,.12)' },
  { level: 'hard',   emoji: '🔴', label: 'Schwer',  color: '#f87171', bg: 'rgba(248,113,113,.12)'},
];

export function DifficultyModal({ isOpen, onRate, onSkip }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)', zIndex: 800 }}
            onClick={onSkip}
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, zIndex: 801, background: '#111118', borderRadius: '20px 20px 0 0', border: '1px solid #2a2a42', borderBottom: 'none', padding: '20px 20px 40px', boxShadow: '0 -8px 32px rgba(0,0,0,.5)' }}
          >
            {/* Handle */}
            <div style={{ width: 36, height: 4, borderRadius: 2, background: '#2a2a42', margin: '0 auto 20px' }} />

            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f0fb', marginBottom: 4, fontFamily: 'Inter, sans-serif' }}>
              ✅ Richtig! Wie schwer war die Aufgabe?
            </div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 22, fontFamily: 'Inter, sans-serif' }}>
              Hilft dir dabei, die richtigen Aufgaben zur richtigen Zeit zu üben.
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {OPTIONS.map(o => (
                <button
                  key={o.level}
                  onClick={() => onRate(o.level)}
                  style={{ flex: 1, height: 72, borderRadius: 14, background: o.bg, border: `1.5px solid ${o.color}40`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', outline: 'none', transition: 'transform .12s', fontFamily: 'Inter, sans-serif' }}
                  onPointerDown={e => (e.currentTarget.style.transform = 'scale(.95)')}
                  onPointerUp={e   => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <span style={{ fontSize: 22 }}>{o.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: o.color }}>{o.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={onSkip}
              style={{ width: '100%', marginTop: 14, padding: '10px 0', background: 'none', border: 'none', color: '#374151', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              Überspringen
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
