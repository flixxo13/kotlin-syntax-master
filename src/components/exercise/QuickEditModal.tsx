import React, { useState } from "react";
import { Exercise } from "../../types";

interface QuickEditModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Exercise) => void;
  onDelete: (id: string) => void;
}

export function QuickEditModal({ exercise, isOpen, onClose, onSave, onDelete }: QuickEditModalProps) {
  const [task, setTask] = useState(exercise.task);
  const [initialCode, setInitialCode] = useState(exercise.initialCode);
  const [solution, setSolution] = useState(exercise.solution);
  const [h1, setH1] = useState(exercise.hints.level1);
  const [h2, setH2] = useState(exercise.hints.level2);
  const [h3, setH3] = useState(exercise.hints.level3);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      ...exercise,
      task,
      initialCode,
      solution,
      hints: {
        level1: h1,
        level2: h2,
        level3: h3,
      },
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#f1f0fb",
    padding: "8px 12px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    marginBottom: 12,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 450, maxHeight: "90vh", background: "#111118", border: "1px solid #2a2a42", borderRadius: 20, display: "flex", flexDirection: "column", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
        
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f0fb" }}>Aufgabe bearbeiten</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
          
          <label style={labelStyle}>Aufgabenstellung</label>
          <textarea 
            value={task} 
            onChange={e => setTask(e.target.value)} 
            style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} 
          />

          <label style={labelStyle}>Musterlösung</label>
          <textarea 
            value={solution} 
            onChange={e => setSolution(e.target.value)} 
            style={{ ...inputStyle, minHeight: 60, fontFamily: "monospace" }} 
          />

          <label style={labelStyle}>Startcode (optional)</label>
          <textarea 
            value={initialCode} 
            onChange={e => setInitialCode(e.target.value)} 
            style={{ ...inputStyle, minHeight: 40, fontFamily: "monospace" }} 
          />

          <div style={{ borderTop: "1px solid #1e1e2e", marginTop: 8, paddingTop: 16 }}>
            <label style={labelStyle}>Hint 1 (Stark verschleiert)</label>
            <input value={h1} onChange={e => setH1(e.target.value)} style={inputStyle} />
            
            <label style={labelStyle}>Hint 2 (Ankerpunkte)</label>
            <input value={h2} onChange={e => setH2(e.target.value)} style={inputStyle} />
            
            <label style={labelStyle}>Hint 3 (Kontext)</label>
            <input value={h3} onChange={e => setH3(e.target.value)} style={inputStyle} />
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: 20, borderTop: "1px solid #1e1e2e", display: "flex", gap: 10 }}>
          <button 
            onClick={() => { if(window.confirm("Aufgabe wirklich löschen?")) { onDelete(exercise.id); onClose(); } }}
            style={{ padding: "10px 16px", borderRadius: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Löschen
          </button>
          <div style={{ flex: 1 }} />
          <button 
            onClick={onClose}
            style={{ padding: "10px 16px", borderRadius: 12, background: "#1e1e2e", border: "1px solid #2a2a42", color: "#9ca3af", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Abbrechen
          </button>
          <button 
            onClick={handleSave}
            style={{ padding: "10px 20px", borderRadius: 12, background: "linear-gradient(135deg,#5b21b6,#7c3aed)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
