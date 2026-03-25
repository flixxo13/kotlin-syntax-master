// ═══════════════════════════════════════════════════════════
//  Kotlin Syntax Master — TypeScript Interfaces
// ═══════════════════════════════════════════════════════════

// ─── Curriculum ─────────────────────────────────────────────

export interface Topic {
  id: string
  title: string
  description: string
  icon: string                        // Lucide icon name
  order: number
  concepts: Concept[]
}

export interface Concept {
  id: string
  topicId: string
  title: string
  syntaxRule: string
  explanation: string
  example: string
  exercises: Exercise[]
}

export interface Exercise {
  id: string
  conceptId: string
  mode: 'builder' | 'assignment' | 'both'
  task: string                        // Aufgabenstellung
  initialCode: string                 // Startpunkt für den Nutzer
  solution: string                    // Exakte Ziel-Syntax
  gaps: string[]                      // Keywords die gelernt werden
  distractors: string[]               // Ähnliche aber falsche Begriffe
  hints: {
    level1: string                    // Abstrakte Struktur
    level2: string                    // Keywords + Typen eingeblendet
    level3: string                    // Code mit Lücken
  }
}

// ─── Fortschritt & SRS ──────────────────────────────────────

export type HintLevel = 0 | 1 | 2 | 3 | 'revealed'

export interface ConceptProgress {
  conceptId: string
  attempts: number
  lastHintLevel: HintLevel
  lastAttemptAt: string               // ISO Date string
  masteryScore: number                // 0–100
}

export interface QueueItem {
  exerciseId: string
  conceptId: string
  priority: number                    // 1 (sofort) bis 5 (weit hinten)
  addedAt: string
  hintLevelUsed: HintLevel
}

// ─── Session ────────────────────────────────────────────────

export type SessionLength = 'quick' | 'standard' | 'marathon'
export type SessionMode   = 'builder' | 'assignment'

export interface SessionResult {
  exercisesTotal: number
  exercisesCorrect: number
  hintsUsed: number
  xpEarned: number
  durationSeconds: number
  completedAt: string
}

export interface ActiveSession {
  topicId: string
  conceptId: string
  mode: SessionMode
  length: SessionLength
  queue: Exercise[]
  currentIndex: number
  results: ExerciseResult[]
  startedAt: string
}

export interface ExerciseResult {
  exerciseId: string
  correct: boolean
  hintLevel: HintLevel
  xpEarned: number
}

// ─── Gamification ───────────────────────────────────────────

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  condition: (store: ProgressState) => boolean
}

export interface ProgressState {
  totalXP: number
  streak: number
  totalExercises: number
  progress: Record<string, ConceptProgress>
}

// ─── UI State ───────────────────────────────────────────────

export type AppScreen = 'home' | 'learn' | 'progress' | 'profile'
export type ExerciseScreen = 'intro' | 'exercise' | 'session-end'
