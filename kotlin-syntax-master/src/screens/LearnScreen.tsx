import { useState } from 'react'
import { ChevronRight, ArrowLeft, Zap, BookOpen, Flame } from 'lucide-react'
import { useLearningStore } from '../store/useLearningStore'
import { getTopicById, getTopicProgress } from '../data/topics'
import type { Concept, SessionLength, SessionMode } from '../types'

export function LearnScreen() {
  const { topics, selectedTopicId, setSelectedTopic, progress } = useLearningStore()

  // Wenn ein Topic ausgewählt ist: Konzept-Liste zeigen
  if (selectedTopicId) {
    const topic = getTopicById(selectedTopicId)
    if (topic) return <ConceptList topic={topic} onBack={() => setSelectedTopic(null)} />
  }

  // Sonst: Modul-Übersicht
  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar px-4 pt-4 pb-4">
      <h2 className="text-lg font-bold text-white mb-4">Module</h2>
      <div className="space-y-3">
        {topics.map(topic => {
          const prog = getTopicProgress(topic.id, progress)
          return (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className="w-full flex items-center gap-3 bg-surface rounded-2xl p-4
                         border border-surface-2 active:border-kotlin text-left transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-kotlin/20 flex items-center justify-center text-lg flex-shrink-0">
                {getModuleEmoji(topic.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{topic.title}</span>
                  <span className="text-xs text-kotlin">{prog}%</span>
                </div>
                <p className="text-xs text-[#555] truncate mt-0.5">{topic.description}</p>
                <div className="mt-2 h-1 rounded-full bg-surface-3 overflow-hidden">
                  <div className="h-full bg-kotlin rounded-full transition-all" style={{ width: `${prog}%` }} />
                </div>
              </div>
              <ChevronRight size={16} className="text-[#444] flex-shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Konzept-Liste ─────────────────────────────────────────────
function ConceptList({ topic, onBack }: { topic: any, onBack: () => void }) {
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null)
  const { progress } = useLearningStore()

  if (selectedConcept) {
    return <SessionSetup concept={selectedConcept} onBack={() => setSelectedConcept(null)} />
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-surface-2">
        <button onClick={onBack} className="text-[#666] active:text-white">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-base font-bold text-white">{topic.title}</h2>
          <p className="text-xs text-[#555]">{topic.concepts.length} Konzepte</p>
        </div>
      </div>

      {/* Konzepte */}
      <div className="flex-1 px-4 pt-3 pb-4 space-y-2">
        {topic.concepts.map((concept: Concept, idx: number) => {
          const prog = progress[concept.id]
          const mastery = prog?.masteryScore ?? 0
          return (
            <button
              key={concept.id}
              onClick={() => setSelectedConcept(concept)}
              className="w-full flex items-center gap-3 bg-surface rounded-xl p-3
                         border border-surface-2 active:border-kotlin text-left transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-surface-2 flex items-center justify-center
                              text-xs font-bold text-kotlin flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white truncate">{concept.title}</span>
                  <span className="text-[10px] text-[#555] flex-shrink-0">
                    {concept.exercises.length} Übungen
                  </span>
                </div>
                {mastery > 0 && (
                  <div className="mt-1.5 h-1 rounded-full bg-surface-3 overflow-hidden">
                    <div className="h-full bg-kotlin/60 rounded-full" style={{ width: `${mastery}%` }} />
                  </div>
                )}
              </div>
              <ChevronRight size={14} className="text-[#444] flex-shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Session Setup (Quick / Standard / Marathon) ────────────────
function SessionSetup({ concept, onBack }: { concept: Concept, onBack: () => void }) {
  const { startSession, setActiveScreen, setSelectedConcept } = useLearningStore()
  const [selectedLength, setSelectedLength] = useState<SessionLength>('standard')
  const [selectedMode, setSelectedMode] = useState<SessionMode>('builder')

  const lengths: { id: SessionLength; label: string; icon: any; count: number; time: string }[] = [
    { id: 'quick',    label: 'Quick',    icon: Zap,      count: 3, time: '~5 Min'  },
    { id: 'standard', label: 'Standard', icon: BookOpen, count: 5, time: '~10 Min' },
    { id: 'marathon', label: 'Marathon', icon: Flame,    count: 8, time: '~15 Min' },
  ]

  const handleStart = () => {
    startSession(concept, selectedMode, selectedLength)
    setActiveScreen('learn')  // ExerciseScreen wird in App.tsx gerendert wenn activeSession vorhanden
  }

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-[#666] active:text-white">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-base font-bold text-white">{concept.title}</h2>
          <p className="text-xs text-[#555]">{concept.exercises.length} Übungen verfügbar</p>
        </div>
      </div>

      {/* Konzept-Info */}
      <div className="bg-surface rounded-2xl border border-surface-2 p-4 mb-6">
        <p className="text-xs text-kotlin font-semibold uppercase tracking-wider mb-2">Syntax-Regel</p>
        <code className="text-sm font-mono text-[#ddd]">{concept.syntaxRule}</code>
        <p className="text-xs text-[#777] mt-3 leading-relaxed">{concept.explanation}</p>
      </div>

      {/* Modus */}
      <p className="text-xs text-[#555] uppercase tracking-wider mb-2">Übungsmodus</p>
      <div className="flex gap-2 mb-6">
        {[
          { id: 'builder' as SessionMode,    label: '✏️ Syntax-Builder' },
          { id: 'assignment' as SessionMode, label: '🧩 Zuordnung' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedMode(m.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
              ${selectedMode === m.id
                ? 'bg-kotlin/20 border-kotlin text-kotlin'
                : 'bg-surface border-surface-2 text-[#666]'}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Session-Länge */}
      <p className="text-xs text-[#555] uppercase tracking-wider mb-2">Session-Länge</p>
      <div className="space-y-2 mb-8">
        {lengths.map(({ id, label, icon: Icon, count, time }) => (
          <button
            key={id}
            onClick={() => setSelectedLength(id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all
              ${selectedLength === id
                ? 'bg-kotlin/10 border-kotlin'
                : 'bg-surface border-surface-2'}`}
          >
            <Icon size={18} className={selectedLength === id ? 'text-kotlin' : 'text-[#555]'} />
            <span className={`flex-1 text-sm font-medium text-left
              ${selectedLength === id ? 'text-white' : 'text-[#777]'}`}>
              {label}
            </span>
            <span className="text-xs text-[#555]">{count} Übungen · {time}</span>
          </button>
        ))}
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="w-full py-4 rounded-2xl bg-kotlin text-white font-bold text-base
                   active:bg-kotlin-dark transition-colors"
      >
        Session starten 🚀
      </button>
    </div>
  )
}

function getModuleEmoji(icon: string): string {
  const map: Record<string, string> = {
    Rocket: '🚀', Variable: '📦', Database: '🔢',
    GitBranch: '🔀', Wrench: '🔧', Shield: '🛡️', Layers: '📚'
  }
  return map[icon] ?? '📄'
}
