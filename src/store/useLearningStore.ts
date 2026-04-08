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
  Exercise,
  ExerciseDifficulty,
} from '../types';

// ─── PROGRESS PER EXERCISE ────────────────────────────────────────────────────
export interface ExerciseProgress {
  exerciseId:    string;
  conceptId:     string;
  completed:     boolean;
  bestHintLevel: HintLevel;
  attempts:      number;
  lastAttemptAt: string;
  xpEarned:      number;
  difficulty?:   ExerciseDifficulty;   // NEW: user-rated difficulty
  lastPracticed?: string;              // NEW: ISO-string of last solve
}

interface LearningState {
  // --- Persistent Progress ---
  progress:             Record<string, ExerciseProgress>;
  conceptMastery:       Record<string, number>;
  customTasks:          Exercise[];
  streak:               number;
  streakFreezeAvailable: boolean;
  totalXP:              number;
  totalExercises:       number;
  achievements:         Achievement[];
  lastSessionAt:        string | null;
  exerciseNotes:        Record<string, string>;

  // --- Active Session ---
  activeTopicId:    string | null;
  activeConceptId:  string | null;
  activeExerciseId: string | null;
  sessionMode:      SessionMode;
  sessionLength:    SessionLength;
  sessionQueue:     QueueItem[];
  currentHintLevel: HintLevel;

  // --- In-memory only ---
  _sessionStart:     number | null;
  _sessionExercises: Array<{ exerciseId: string; hintLevel: HintLevel; correct: boolean }>;

  // --- UI Prefs ---
  editorHeight: number;

  // --- Actions ---
  addCustomTasks:    (tasks: Exercise[]) => void;
  removeCustomTask:  (id: string) => void;
  clearCustomTasks:  () => void;

  completeExercise: (exerciseId: string, conceptId: string, hintLevel: HintLevel) => void;
  rateDifficulty:   (exerciseId: string, level: ExerciseDifficulty) => void;  // NEW
  getRandomCustomTask: () => Exercise | null;                                   // NEW

  requestHint:      () => void;
  revealSolution:   () => void;
  setSessionLength: (length: SessionLength) => void;
  setEditorHeight:  (height: number) => void;
  resetHint:        () => void;
  startSession:     (topicId: string, conceptId: string, mode: SessionMode) => void;
  endSession:       () => SessionResult;
  updateStreak:     () => void;
  saveExerciseNote: (exerciseId: string, note: string) => void;
  getExerciseProgress: (exerciseId: string) => ExerciseProgress | null;
  getConceptMastery:   (conceptId: string) => number;
}

// ─── XP TABLE ─────────────────────────────────────────────────────────────────
const XP_TABLE: Record<string, number> = {
  '0': 10, '1': 7, '2': 4, '3': 2, 'revealed': 0,
};

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      // --- State ---
      progress:             {},
      conceptMastery:       {},
      customTasks:          [],
      streak:               0,
      streakFreezeAvailable: true,
      totalXP:              0,
      totalExercises:       0,
      achievements:         [],
      lastSessionAt:        null,
      exerciseNotes:        {},
      activeTopicId:        null,
      activeConceptId:      null,
      activeExerciseId:     null,
      sessionMode:          'builder',
      sessionLength:        'standard',
      sessionQueue:         [],
      currentHintLevel:     HintLevel.NONE,
      _sessionStart:        null,
      _sessionExercises:    [],
      editorHeight:         250,

      // ── Task Actions ────────────────────────────────────────────────────────
      addCustomTasks: (tasks) => set((state) => {
        const map = new Map(state.customTasks.map(t => [t.id, t]));
        tasks.forEach(t => map.set(t.id, t));
        return { customTasks: Array.from(map.values()) };
      }),
      removeCustomTask:  (id)  => set(s => ({ customTasks: s.customTasks.filter(t => t.id !== id) })),
      clearCustomTasks:  ()    => set({ customTasks: [] }),

      // ── NEW: Rate difficulty ────────────────────────────────────────────────
      rateDifficulty: (exerciseId, level) => set((state) => {
        const existing = state.progress[exerciseId];
        // Create minimal entry if not yet in progress (e.g. rated before completeExercise)
        const base = existing ?? {
          exerciseId, conceptId: '', completed: true,
          bestHintLevel: HintLevel.NONE, attempts: 1,
          lastAttemptAt: new Date().toISOString(), xpEarned: 0,
        };
        return {
          progress: {
            ...state.progress,
            [exerciseId]: { ...base, difficulty: level, lastPracticed: new Date().toISOString() },
          },
        };
      }),

      // ── NEW: Get random custom task (weighted: unsolved + hard first) ───────
      getRandomCustomTask: () => {
        const { customTasks, progress } = get();
        if (!customTasks.length) return null;

        // Score: unsolved → 3, hard → 2, medium → 1, easy → 0
        const scored = customTasks.map(t => {
          const p = progress[t.id];
          if (!p?.completed) return { t, score: 3 };
          if (p.difficulty === 'hard')   return { t, score: 2 };
          if (p.difficulty === 'medium') return { t, score: 1 };
          return { t, score: 0 };
        });

        // Pick from highest scoring group
        const maxScore = Math.max(...scored.map(s => s.score));
        const pool = scored.filter(s => s.score === maxScore).map(s => s.t);
        return pool[Math.floor(Math.random() * pool.length)];
      },

      // ── Complete Exercise ────────────────────────────────────────────────────
      completeExercise: (exerciseId, conceptId, hintLevel) => {
        const xpEarned = XP_TABLE[String(hintLevel)] ?? 0;
        set((state) => {
          const existing = state.progress[exerciseId];
          const isFirst  = !existing?.completed;
          const prevBest = existing?.bestHintLevel ?? hintLevel;
          const hintNum  = typeof hintLevel === 'number' ? hintLevel : 999;
          const prevNum  = typeof prevBest  === 'number' ? prevBest  : 999;
          const bestHintLevel = hintNum < prevNum ? hintLevel : prevBest;

          const newProgress: ExerciseProgress = {
            exerciseId,
            conceptId,
            completed:     true,
            bestHintLevel,
            attempts:      (existing?.attempts ?? 0) + 1,
            lastAttemptAt: new Date().toISOString(),
            xpEarned:      Math.max(existing?.xpEarned ?? 0, xpEarned),
            difficulty:    existing?.difficulty,
            lastPracticed: new Date().toISOString(),
          };

          const allConceptProgress = Object.values({ ...state.progress, [exerciseId]: newProgress })
            .filter(p => p.conceptId === conceptId && p.completed);

          const avgHintScore = allConceptProgress.length === 0 ? 0 :
            allConceptProgress.reduce((sum, p) => {
              const hl = typeof p.bestHintLevel === 'number' ? p.bestHintLevel : 4;
              return sum + Math.max(0, 10 - hl * 2);
            }, 0) / allConceptProgress.length;

          const mastery = Math.min(100, Math.round(avgHintScore * 10));

          return {
            totalXP:        state.totalXP + (isFirst ? xpEarned : Math.floor(xpEarned * 0.3)),
            totalExercises: state.totalExercises + 1,
            progress:       { ...state.progress, [exerciseId]: newProgress },
            conceptMastery: { ...state.conceptMastery, [conceptId]: mastery },
            _sessionExercises: [...(state._sessionExercises ?? []), { exerciseId, hintLevel, correct: true }],
          };
        });
      },

      // ── Hint Actions ─────────────────────────────────────────────────────────
      requestHint: () => set((state) => {
        const next = typeof state.currentHintLevel === 'number'
          ? (state.currentHintLevel < 3 ? state.currentHintLevel + 1 : 3) : 3;
        return { currentHintLevel: next as HintLevel };
      }),
      revealSolution: () => set({ currentHintLevel: HintLevel.REVEALED }),
      resetHint:      () => set({ currentHintLevel: HintLevel.NONE }),

      // ── Session ──────────────────────────────────────────────────────────────
      startSession: (topicId, conceptId, mode) => set({
        activeTopicId: topicId, activeConceptId: conceptId,
        sessionMode: mode, currentHintLevel: HintLevel.NONE,
        _sessionStart: Date.now(), _sessionExercises: [],
      }),

      endSession: () => {
        const state = get();
        const ses   = state._sessionExercises ?? [];
        const dur   = state._sessionStart ? Math.floor((Date.now() - state._sessionStart) / 1000) : 0;
        const result: SessionResult = {
          exercisesTotal:   ses.length,
          exercisesCorrect: ses.filter(e => e.correct).length,
          hintsUsed:        ses.filter(e => typeof e.hintLevel === 'number' && e.hintLevel > 0).length,
          xpEarned:         ses.reduce((s, e) => s + (XP_TABLE[String(e.hintLevel)] ?? 0), 0),
          durationSeconds:  dur,
          completedAt:      new Date().toISOString(),
        };
        set({ lastSessionAt: result.completedAt, _sessionStart: null, _sessionExercises: [] });
        state.updateStreak();
        return result;
      },

      updateStreak: () => {
        const now  = new Date();
        const last = get().lastSessionAt ? new Date(get().lastSessionAt!) : null;
        if (!last) { set({ streak: 1 }); return; }
        const diff = Math.floor((now.getTime() - last.getTime()) / 86400000);
        if      (diff === 1) set(s => ({ streak: s.streak + 1 }));
        else if (diff  > 1) {
          if (get().streakFreezeAvailable) set({ streakFreezeAvailable: false });
          else set({ streak: 1 });
        }
      },

      setSessionLength: (length) => set({ sessionLength: length }),
      setEditorHeight:  (height) => set({ editorHeight: height }),

      saveExerciseNote: (exerciseId, note) => set(s => ({
        exerciseNotes: { ...s.exerciseNotes, [exerciseId]: note },
      })),

      getExerciseProgress: (exerciseId) => get().progress[exerciseId] ?? null,
      getConceptMastery:   (conceptId)  => get().conceptMastery[conceptId] ?? 0,
    }),
    {
      name: 'kotlin-master-v2',
      partialize: (s) => ({
        progress:             s.progress,
        conceptMastery:       s.conceptMastery,
        customTasks:          s.customTasks,
        streak:               s.streak,
        streakFreezeAvailable: s.streakFreezeAvailable,
        totalXP:              s.totalXP,
        totalExercises:       s.totalExercises,
        achievements:         s.achievements,
        lastSessionAt:        s.lastSessionAt,
        exerciseNotes:        s.exerciseNotes,
        editorHeight:         s.editorHeight,
        sessionLength:        s.sessionLength,
      }),
    }
  )
);
