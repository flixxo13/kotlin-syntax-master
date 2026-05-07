import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, MessageSquare } from 'lucide-react';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  initialNote: string;
  exerciseId: string;
}

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, initialNote, exerciseId }) => {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    if (isOpen) {
      setNote(initialNote);
    }
  }, [isOpen, initialNote]);

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-surface border border-surface-2 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-surface-2 flex items-center justify-between bg-surface-2/30">
              <div className="flex items-center gap-2 text-primary">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-bold">Aufgaben-Feedback</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-widest text-text-secondary">
                  Notizen & Optimierungsvorschläge (ID: {exerciseId})
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Hinterlasse hier Infos zum Format, zur Schwierigkeit oder Optimierungsideen..."
                  className="w-full h-48 bg-background border border-surface-2 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                  autoFocus
                />
              </div>
              
              <p className="text-[10px] text-text-secondary leading-relaxed italic">
                Diese Informationen werden lokal gespeichert und können im Import-Bereich gesammelt ausgelesen werden.
              </p>
            </div>

            <div className="p-4 bg-surface-2/30 border-t border-surface-2 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-bold text-text-secondary hover:bg-surface-2 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                Speichern
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
