import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ExerciseDifficulty } from '../../types';

interface Props {
  isOpen: boolean;
  onRate: (level: ExerciseDifficulty) => void;
  onSkip: () => void;
}

const OPTIONS: Array<{ level: ExerciseDifficulty; emoji: string; label: string; color: string; bg: string }> = [
  { level: 'easy',   emoji: '🟢', label: 'Leicht', color: '#4ade80', bg: 'rgba(34,197,94,.15)'   },
  { level: 'medium', emoji: '🟡', label: 'Mittel', color: '#fbbf24', bg: 'rgba(251,191,36,.15)'  },
  { level: 'hard',   emoji: '🔴', label: 'Schwer', color: '#f87171', bg: 'rgba(248,113,113,.15)' },
];

function ModalContent({ onRate, onSkip }: Omit<Props, 'isOpen'>) {
  return (
    // Portal renders directly to body → bypasses any parent transform
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onSkip}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(4px)' }}
      />
      {/* Sheet */}
      <motion.div
        initial={{ y: 140, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        exit={{    y: 140, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        style={{
          position: 'relative', width: '100%', maxWidth: 430,
          background: '#111118', borderRadius: '20px 20px 0 0',
          border: '1px solid #2a2a42', borderBottom: 'none',
          padding: '20px 20px 44px',
          boxShadow: '0 -8px 40px rgba(0,0,0,.6)',
          fontFamily: "'Inter',system-ui,sans-serif",
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: '#2a2a42', margin: '0 auto 20px' }} />

        <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f0fb', marginBottom: 6 }}>
          ✅ Richtig! Wie schwer war die Aufgabe?
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 24, lineHeight: 1.5 }}>
          Hilft dir dabei, die richtigen Aufgaben zur richtigen Zeit zu üben.
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {OPTIONS.map(o => (
            <button
              key={o.level}
              onClick={() => onRate(o.level)}
              style={{
                flex: 1, height: 76, borderRadius: 14,
                background: o.bg, border: `1.5px solid ${o.color}55`,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 8, cursor: 'pointer', outline: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
              onPointerDown={e  => (e.currentTarget.style.transform = 'scale(.94)')}
              onPointerUp={e    => (e.currentTarget.style.transform = 'scale(1)')}
              onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <span style={{ fontSize: 26 }}>{o.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: o.color }}>{o.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onSkip}
          style={{ width: '100%', marginTop: 16, padding: '10px 0', background: 'none', border: 'none', color: '#374151', fontSize: 13, cursor: 'pointer' }}
        >
          Überspringen
        </button>
      </motion.div>
    </div>
  );
}

export function DifficultyModal({ isOpen, onRate, onSkip }: Props) {
  return createPortal(
    <AnimatePresence>
      {isOpen && <ModalContent onRate={onRate} onSkip={onSkip} />}
    </AnimatePresence>,
    document.body
  );
}
