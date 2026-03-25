import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useLearningStore } from '../store/useLearningStore'
import { KotlinEditor } from '../components/editor/KotlinEditor'
import { TaskCard } from '../components/exercise/TaskCard'
import { HintPanel } from '../components/exercise/HintPanel'
import { ChipBar } from '../components/exercise/ChipBar'
import { SolutionView } from '../components/exercise/SolutionView'

export function ExerciseScreen({ onSessionEnd }: { onSessionEnd: (result: any) => void }) {
  const {
    activeSession, currentHintLevel, isAnswerCorrect,
    isSolutionRevealed, feedbackAnimation,
    requestHint, revealSolution, submitAnswer, nextExercise, endSession
  } = useLearningStore()

  const [code, setCode] = useState('')
  const [usedChips, setUsedChips] = useState<string[]>([])
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const exercise = activeSession?.queue[activeSession.currentIndex]
  const isLastExercise = activeSession
    ? activeSession.currentIndex >= activeSession.queue.length - 1
    : false
  const mode = activeSession?.mode ?? 'builder'

  // Keyboard Detection
  useEffect(() => {
    const handler = () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        const keyboardHeight = window.innerHeight - window.visualViewport.height
        setIsKeyboardOpen(keyboardHeight > 100)
      }
    }
    window.visualViewport?.addEventListener('resize', handler)
    return () => window.visualViewport?.removeEventListener('resize', handler)
  }, [])

  // Reset bei neuer Übung
  useEffect(() => {
    if (exercise) {
      setCode(exercise.initialCode ?? '')
      setUsedChips([])
      setHasSubmitted(false)
    }
  }, [exercise?.id])

  if (!exercise || !activeSession) return null

  const handleSubmit = () => {
    if (hasSubmitted && isAnswerCorrect) return
    const correct = submitAnswer(code)
    setHasSubmitted(true)
  }

  const handleChipSelect = (chip: string) => {
    setCode(prev => prev + chip)
    setUsedChips(prev => [...prev, chip])
  }

  const handleNext = () => {
    if (isLastExercise) {
      const result = endSession()
      onSessionEnd(result)
    } else {
      nextExercise()
    }
  }

  // Progress
  const totalExercises = activeSession.queue.length
  const currentIdx = activeSession.currentIndex
  const progressPct = Math.round((currentIdx / totalExercises) * 100)

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Top Bar */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2 border-b border-surface-2">
        <button
          onClick={() => {
            const result = endSession()
            onSessionEnd(result)
          }}
          className="text-[#555] active:text-white"
        >
          <X size={20} />
        </button>
        {/* Progress Bar */}
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-surface-3 overflow-hidden">
            <div
              className="h-full bg-kotlin rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-[#555] w-12 text-right">
            {currentIdx + 1} / {totalExercises}
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-3">
        {/* Aufgabe */}
        <TaskCard
          task={exercise.task}
          conceptTitle={exercise.conceptId}
          isKeyboardOpen={isKeyboardOpen}
        />

        {/* Editor (Builder Mode) */}
        {mode === 'builder' && !isSolutionRevealed && (
          <KotlinEditor
            value={code}
            onChange={setCode}
            feedbackState={feedbackAnimation}
            gaps={exercise.gaps}
            showResize
            showShortcuts
          />
        )}

        {/* Chips (Assignment Mode) */}
        {mode === 'assignment' && !isSolutionRevealed && (
          <>
            <KotlinEditor
              value={code}
              onChange={setCode}
              feedbackState={feedbackAnimation}
              gaps={exercise.gaps}
              showResize={false}
              showShortcuts={false}
            />
            <ChipBar
              options={[...exercise.gaps, ...exercise.distractors]}
              used={usedChips}
              onSelect={handleChipSelect}
            />
          </>
        )}

        {/* Lösung */}
        {isSolutionRevealed && (
          <SolutionView
            solution={exercise.solution}
            explanation={`Ziel: ${exercise.solution}`}
          />
        )}

        {/* Hints */}
        {!isSolutionRevealed && (
          <HintPanel
            hints={exercise.hints}
            currentLevel={currentHintLevel}
            onRequestHint={requestHint}
            onRevealSolution={revealSolution}
            isSolutionRevealed={isSolutionRevealed}
          />
        )}

        {/* Feedback */}
        {hasSubmitted && isAnswerCorrect === true && (
          <div className="bg-success/10 border border-success/30 rounded-xl p-3 animate-slide-up">
            <p className="text-success text-sm font-semibold">✅ Richtig!</p>
          </div>
        )}
        {hasSubmitted && isAnswerCorrect === false && !isSolutionRevealed && (
          <div className="bg-error/10 border border-error/30 rounded-xl p-3 animate-slide-up">
            <p className="text-error text-sm font-semibold">❌ Nicht ganz — probiere es nochmal oder nutze einen Hint.</p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="px-4 py-3 border-t border-surface-2 space-y-2">
        {/* Submit / Weiter */}
        {!hasSubmitted || isAnswerCorrect === false ? (
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-kotlin text-white font-bold text-base active:bg-kotlin-dark transition-colors"
          >
            Prüfen ✓
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-2xl bg-success text-white font-bold text-base active:opacity-80 transition-opacity animate-slide-up"
          >
            {isLastExercise ? 'Session abschließen 🎯' : 'Weiter →'}
          </button>
        )}
        {isSolutionRevealed && (
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-2xl bg-surface border border-surface-2 text-[#888] font-medium text-sm active:opacity-80"
          >
            {isLastExercise ? 'Session beenden' : 'Nächste Übung'}
          </button>
        )}
      </div>
    </div>
  )
}
