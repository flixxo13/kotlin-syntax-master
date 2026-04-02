import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ConceptProgress,
  QueueItem,
  SessionLength,
  SessionMode,
  HintLevel,
  SessionResult,
  Achievement,
  Exercise
} from '../types';

// ─── PROGRESS PER EXERCISE ────────────────────────────────────────────────────
interface ExerciseProgress {
  exerciseId: string;
  conceptId: string;
  completed: boolean;
  bestHintLevel: HintLevel;       // lowest hint level used (best attempt)
  attempts: number;
  lastAttemptAt: string;
  xpEarned: number;
}

interface LearningState {
  // --- Persistent Progress ---
  progress: Record<string, ExerciseProgress>;  // keyed by exerciseId
  conceptMastery: Record<string, number>;      // conceptId → 0-100 mastery score
  customTasks: Exercise[];
  streak: number;
  streakFreezeAvailable: boolean;
  totalXP: number;
  totalExercises: number;
  achievements: Achievement[];
  lastSessionAt: string | null;
  exerciseNotes: Record<string, string>;

  // --- Active Session ---
  activeTopicId: string | null;
  activeConceptId: string | null;
  activeExerciseId: string | null;
  sessionMode: SessionMode;
  sessionLength: SessionLength;
  sessionQueue: QueueItem[];
  currentHintLevel: HintLevel;

  // --- Session tracking (in-memory, not persisted) ---
  _sessionStart: number | null;
  _sessionExercises: Array<{ exerciseId: string; hintLevel: HintLevel; correct: boolean }>;

  // --- UI Preferences ---
  editorHeight: number;

  // --- Actions ---
  addCustomTasks: (tasks: Exercise[]) => void;
  removeCustomTask: (id: string) => void;
  clearCustomTasks: () => void;

  completeExercise: (exerciseId: string, conceptId: string, hintLevel: HintLevel) => void;
  requestHint: () => void;
  revealSolution: () => void;
  setSessionLength: (length: SessionLength) => void;
  setEditorHeight: (height: number) => void;
  resetHint: () => void;
  startSession: (topicId: string, conceptId: string, mode: SessionMode) => void;
  endSession: () => SessionResult;
  updateStreak: () => void;
  saveExerciseNote: (exerciseId: string, note: string) => void;
  getExerciseProgress: (exerciseId: string) => ExerciseProgress | null;
  getConceptMastery: (conceptId: string) => number;
}

// ─── XP TABLE ────────────────────────────────────────────────────────────────
const XP_TABLE: Record<string, number> = {
  '0':        10,  // no hints
  '1':         7,  // hint 1
  '2':         4,  // hint 2
  '3':         2,  // hint 3
  'revealed':  0,  // solution shown
};

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      // --- State ---
      progress: {},
      conceptMastery: {},
      customTasks: [],
      streak: 0,
      streakFreezeAvailable: true,
      totalXP: 0,
      totalExercises: 0,
      achievements: [],
      lastSessionAt: null,
      exerciseNotes: {},

      activeTopicId: null,
      activeConceptId: null,
      activeExerciseId: null,
      sessionMode: 'builder',
      sessionLength: 'standard',
      sessionQueue: [],
      currentHintLevel: HintLevel.NONE,

      // In-memory only (not persisted, reset on store creation)
      _sessionStart: null,
      _sessionExercises: [],

      editorHeight: 250,

      // --- Task Actions ---
      addCustomTasks: (tasks) => set((state) => {
        const taskMap = new Map(state.customTasks.map(t => [t.id, t]));
        tasks.forEach(t => taskMap.set(t.id, t));
        return { customTasks: Array.from(taskMap.values()) };
      }),

      removeCustomTask: (id) => set((state) => ({
        customTasks: state.customTasks.filter(t => t.id !== id)
      })),

      clearCustomTasks: () => set({ customTasks: [] }),

      // --- Exercise Completion (FIXED — per exerciseId) ---
      completeExercise: (exerciseId, conceptId, hintLevel) => {
        const xpEarned = XP_TABLE[String(hintLevel)] ?? 0;

        set((state) => {
          const existing = state.progress[exerciseId];
          const isFirstCompletion = !existing?.completed;

          // Best hint level = lowest numeric value (NONE=0 is best)
          const prevBest = existing?.bestHintLevel ?? hintLevel;
          const hintNum   = typeof hintLevel === 'number' ? hintLevel : 999;
          const prevNum   = typeof prevBest  === 'number' ? prevBest  : 999;
          const bestHintLevel = hintNum < prevNum ? hintLevel : prevBest;

          const newProgress: ExerciseProgress = {
            exerciseId,
            conceptId,
            completed: true,
            bestHintLevel,
            attempts: (existing?.attempts ?? 0) + 1,
            lastAttemptAt: new Date().toISOString(),
            xpEarned: Math.max(existing?.xpEarned ?? 0, xpEarned),
          };

          // Recalculate concept mastery from all exercises in concept
          const allConceptProgress = Object.values({
            ...state.progress,
            [exerciseId]: newProgress,
          }).filter(p => p.conceptId === conceptId && p.completed);

          const avgHintScore = allConceptProgress.length === 0 ? 0 :
            allConceptProgress.reduce((sum, p) => {
              const hl = typeof p.bestHintLevel === 'number' ? p.bestHintLevel : 4;
              return sum + Math.max(0, 10 - hl * 2);
            }, 0) / allConceptProgress.length;

          const mastery = Math.min(100, Math.round(avgHintScore * 10));

          // Track for session end
          const sessionEntry = { exerciseId, hintLevel, correct: true };

          return {
            totalXP: state.totalXP + (isFirstCompletion ? xpEarned : Math.floor(xpEarned * 0.3)),
            totalExercises: state.totalExercises + 1,
            progress: {
              ...state.progress,
              [exerciseId]: newProgress,
            },
            conceptMastery: {
              ...state.conceptMastery,
              [conceptId]: mastery,
            },
            _sessionExercises: [...(state._sessionExercises ?? []), sessionEntry],
          };
        });
      },

      // --- Hint Actions ---
      requestHint: () => set((state) => {
        const next = typeof state.currentHintLevel === 'number'
          ? (state.currentHintLevel < 3 ? state.currentHintLevel + 1 : 3)
          : 3;
        return { currentHintLevel: next as HintLevel };
      }),

      revealSolution: () => set({ currentHintLevel: HintLevel.REVEALED }),

      resetHint: () => set({ currentHintLevel: HintLevel.NONE }),

      // --- Session ---
      startSession: (topicId, conceptId, mode) => set({
        activeTopicId: topicId,
        activeConceptId: conceptId,
        sessionMode: mode,
        currentHintLevel: HintLevel.NONE,
        _sessionStart: Date.now(),
        _sessionExercises: [],
      }),

      // FIXED — real session data instead of mock values
      endSession: () => {
        const state = get();
        const sessionExercises = state._sessionExercises ?? [];
        const durationSeconds = state._sessionStart
          ? Math.floor((Date.now() - state._sessionStart) / 1000)
          : 0;

        const exercisesTotal   = sessionExercises.length;
        const exercisesCorrect = sessionExercises.filter(e => e.correct).length;
        const hintsUsed        = sessionExercises.filter(
          e => typeof e.hintLevel === 'number' && e.hintLevel > 0
        ).length;
        const xpEarned         = sessionExercises.reduce(
          (sum, e) => sum + (XP_TABLE[String(e.hintLevel)] ?? 0), 0
        );

        const result: SessionResult = {
          exercisesTotal,
          exercisesCorrect,
          hintsUsed,
          xpEarned,
          durationSeconds,
          completedAt: new Date().toISOString(),
        };

        set({
          lastSessionAt: result.completedAt,
          _sessionStart: null,
          _sessionExercises: [],
        });

        state.updateStreak();
        return result;
      },

      updateStreak: () => {
        const now  = new Date();
        const last = get().lastSessionAt ? new Date(get().lastSessionAt!) : null;

        if (!last) { set({ streak: 1 }); return; }

        const diffDays = Math.floor(
          (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          set((state) => ({ streak: state.streak + 1 }));
        } else if (diffDays > 1) {
          if (get().streakFreezeAvailable) {
            set({ streakFreezeAvailable: false });
          } else {
            set({ streak: 1 });
          }
        }
        // diffDays === 0 → same day, streak unchanged
      },

      setSessionLength: (length) => set({ sessionLength: length }),
      setEditorHeight: (height) => set({ editorHeight: height }),

      saveExerciseNote: (exerciseId, note) => set((state) => ({
        exerciseNotes: { ...state.exerciseNotes, [exerciseId]: note }
      })),

      // --- Selectors ---
      getExerciseProgress: (exerciseId) => {
        return get().progress[exerciseId] ?? null;
      },

      getConceptMastery: (conceptId) => {
        return get().conceptMastery[conceptId] ?? 0;
      },
    }),
    {
      name: 'kotlin-master-v2',
      // Don't persist in-memory session state
      partialize: (state) => ({
        progress:              state.progress,
        conceptMastery:        state.conceptMastery,
        customTasks:           state.customTasks,
        streak:                state.streak,
        streakFreezeAvailable: state.streakFreezeAvailable,
        totalXP:               state.totalXP,
        totalExercises:        state.totalExercises,
        achievements:          state.achievements,
        lastSessionAt:         state.lastSessionAt,
        exerciseNotes:         state.exerciseNotes,
        editorHeight:          state.editorHeight,
        sessionLength:         state.sessionLength,
      }),
    }
  )
);
