import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Topic, Concept, Exercise, HintLevel,
  SessionMode, SessionLength, SessionResult,
  ActiveSession, ExerciseResult, ConceptProgress, QueueItem
} from '../types'
import { calculateXP } from '../utils/xp'
import { getPriorityFromHintLevel, pickRandomExercises, sessionLengthToCount } from '../utils/srs'
import { updateStreak, learnedToday } from '../utils/streak'

// ─── Store Interface ─────────────────────────────────────────

interface LearningStore {
  // ── Curriculum (wird beim App-Start geladen) ──────────────
  topics: Topic[]
  setTopics: (topics: Topic[]) => void

  // ── Fortschritt ───────────────────────────────────────────
  progress: Record<string, ConceptProgress>
  streak: number
  streakFreezeAvailable: boolean
  totalXP: number
  totalExercises: number
  lastSessionAt: string | null
  lastStreakRefreshAt: string | null

  // ── Aktive Session ────────────────────────────────────────
  activeSession: ActiveSession | null
  currentHintLevel: HintLevel
  isAnswerCorrect: boolean | null
  isSolutionRevealed: boolean
  feedbackAnimation: 'none' | 'correct' | 'wrong'

  // ── SRS Queue ─────────────────────────────────────────────
  reviewQueue: QueueItem[]

  // ── UI Preferences (persistent) ──────────────────────────
  editorHeight: number
  activeScreen: 'home' | 'learn' | 'progress' | 'profile'
  selectedTopicId: string | null
  selectedConceptId: string | null

  // ── V2 Slots ──────────────────────────────────────────────
  userId?: string
  aiApiKey?: string

  // ── Actions ───────────────────────────────────────────────

  // Navigation
  setActiveScreen: (screen: 'home' | 'learn' | 'progress' | 'profile') => void
  setSelectedTopic: (topicId: string | null) => void
  setSelectedConcept: (conceptId: string | null) => void

  // Session
  startSession: (
    concept: Concept,
    mode: SessionMode,
    length: SessionLength
  ) => void
  requestHint: () => void
  revealSolution: () => void
  submitAnswer: (userCode: string) => boolean
  nextExercise: () => void
  endSession: () => SessionResult

  // Editor
  setEditorHeight: (height: number) => void

  // Fortschritt
  resetProgress: () => void
}

// ─── Store Implementation ────────────────────────────────────

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      // ── Initialwerte ──────────────────────────────────────
      topics: [],
      progress: {},
      streak: 0,
      streakFreezeAvailable: true,
      totalXP: 0,
      totalExercises: 0,
      lastSessionAt: null,
      lastStreakRefreshAt: null,
      activeSession: null,
      currentHintLevel: 0,
      isAnswerCorrect: null,
      isSolutionRevealed: false,
      feedbackAnimation: 'none',
      reviewQueue: [],
      editorHeight: 180,
      activeScreen: 'home',
      selectedTopicId: null,
      selectedConceptId: null,

      // ── Curriculum laden ──────────────────────────────────
      setTopics: (topics) => set({ topics }),

      // ── Navigation ────────────────────────────────────────
      setActiveScreen: (screen) => set({ activeScreen: screen }),
      setSelectedTopic: (topicId) => set({ selectedTopicId: topicId }),
      setSelectedConcept: (conceptId) => set({ selectedConceptId: conceptId }),

      // ── Session starten ───────────────────────────────────
      startSession: (concept, mode, length) => {
        const count = sessionLengthToCount(length)
        const exercises = pickRandomExercises(concept.exercises, count)

        const session: ActiveSession = {
          topicId: concept.topicId,
          conceptId: concept.id,
          mode,
          length,
          queue: exercises,
          currentIndex: 0,
          results: [],
          startedAt: new Date().toISOString(),
        }
        set({
          activeSession: session,
          currentHintLevel: 0,
          isAnswerCorrect: null,
          isSolutionRevealed: false,
          feedbackAnimation: 'none',
        })
      },

      // ── Hint anfordern ────────────────────────────────────
      requestHint: () => {
        const { currentHintLevel } = get()
        if (typeof currentHintLevel === 'number' && currentHintLevel < 3) {
          set({ currentHintLevel: (currentHintLevel + 1) as HintLevel })
        }
      },

      // ── Lösung anzeigen ───────────────────────────────────
      revealSolution: () => {
        set({ isSolutionRevealed: true, currentHintLevel: 'revealed' })
      },

      // ── Antwort prüfen ────────────────────────────────────
      submitAnswer: (userCode: string) => {
        const { activeSession, currentHintLevel } = get()
        if (!activeSession) return false

        const currentExercise = activeSession.queue[activeSession.currentIndex]
        if (!currentExercise) return false

        // Normalisiere beide Strings für Vergleich
        const normalize = (code: string) =>
          code.replace(/\s+/g, ' ').trim().toLowerCase()

        const isCorrect = normalize(userCode) === normalize(currentExercise.solution)

        const xp = isCorrect ? calculateXP(currentHintLevel) : 0

        const result: ExerciseResult = {
          exerciseId: currentExercise.id,
          correct: isCorrect,
          hintLevel: currentHintLevel,
          xpEarned: xp,
        }

        const updatedResults = [...activeSession.results, result]
        const updatedSession = { ...activeSession, results: updatedResults }

        // SRS Queue Update
        const newQueueItem: QueueItem = {
          exerciseId: currentExercise.id,
          conceptId: currentExercise.conceptId,
          priority: getPriorityFromHintLevel(isCorrect ? currentHintLevel : 'revealed'),
          addedAt: new Date().toISOString(),
          hintLevelUsed: isCorrect ? currentHintLevel : 'revealed',
        }

        set({
          activeSession: updatedSession,
          isAnswerCorrect: isCorrect,
          feedbackAnimation: isCorrect ? 'correct' : 'wrong',
        })

        if (!isCorrect) {
          set(state => ({
            reviewQueue: [...state.reviewQueue, newQueueItem]
          }))
        }

        // Animation nach kurzer Zeit zurücksetzen
        setTimeout(() => set({ feedbackAnimation: 'none' }), 600)

        return isCorrect
      },

      // ── Nächste Übung ─────────────────────────────────────
      nextExercise: () => {
        const { activeSession } = get()
        if (!activeSession) return

        const nextIndex = activeSession.currentIndex + 1
        set({
          activeSession: { ...activeSession, currentIndex: nextIndex },
          currentHintLevel: 0,
          isAnswerCorrect: null,
          isSolutionRevealed: false,
          feedbackAnimation: 'none',
        })
      },

      // ── Session beenden ───────────────────────────────────
      endSession: () => {
        const { activeSession, streak, streakFreezeAvailable, lastSessionAt, totalXP, totalExercises } = get()
        if (!activeSession) {
          return {
            exercisesTotal: 0, exercisesCorrect: 0,
            hintsUsed: 0, xpEarned: 0, durationSeconds: 0,
            completedAt: new Date().toISOString()
          }
        }

        const results = activeSession.results
        const exercisesCorrect = results.filter(r => r.correct).length
        const hintsUsed = results.reduce((acc, r) =>
          acc + (typeof r.hintLevel === 'number' ? r.hintLevel : 0), 0)
        const xpEarned = results.reduce((acc, r) => acc + r.xpEarned, 0)
        const durationSeconds = Math.round(
          (Date.now() - new Date(activeSession.startedAt).getTime()) / 1000
        )

        // Streak updaten
        const { streak: newStreak, freezeAvailable: newFreeze } = updateStreak(
          streak, lastSessionAt, streakFreezeAvailable
        )

        // Fortschritt updaten
        const newProgress = { ...get().progress }
        results.forEach(r => {
          const existing = newProgress[r.exerciseId]
          newProgress[activeSession.conceptId] = {
            conceptId: activeSession.conceptId,
            attempts: (existing?.attempts ?? 0) + 1,
            lastHintLevel: r.hintLevel,
            lastAttemptAt: new Date().toISOString(),
            masteryScore: r.correct
              ? Math.min(100, (existing?.masteryScore ?? 0) + 20)
              : Math.max(0, (existing?.masteryScore ?? 0) - 5),
          }
        })

        const sessionResult: SessionResult = {
          exercisesTotal: results.length,
          exercisesCorrect,
          hintsUsed,
          xpEarned,
          durationSeconds,
          completedAt: new Date().toISOString(),
        }

        set({
          activeSession: null,
          streak: newStreak,
          streakFreezeAvailable: newFreeze,
          totalXP: totalXP + xpEarned,
          totalExercises: totalExercises + results.length,
          lastSessionAt: new Date().toISOString(),
          progress: newProgress,
          currentHintLevel: 0,
          isAnswerCorrect: null,
          isSolutionRevealed: false,
        })

        return sessionResult
      },

      // ── Editor Resize ─────────────────────────────────────
      setEditorHeight: (height) => set({ editorHeight: height }),

      // ── Reset ─────────────────────────────────────────────
      resetProgress: () => set({
        progress: {}, streak: 0, totalXP: 0,
        totalExercises: 0, lastSessionAt: null,
        reviewQueue: [], activeSession: null,
      }),
    }),

    {
      name: 'kotlin-master-v1',
      // Nur diese Keys persistieren:
      partialize: (state) => ({
        progress: state.progress,
        streak: state.streak,
        streakFreezeAvailable: state.streakFreezeAvailable,
        totalXP: state.totalXP,
        totalExercises: state.totalExercises,
        lastSessionAt: state.lastSessionAt,
        lastStreakRefreshAt: state.lastStreakRefreshAt,
        reviewQueue: state.reviewQueue,
        editorHeight: state.editorHeight,
      }),
    }
  )
)
