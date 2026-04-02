// ─── KOTLIN MASTER – Shared Types ─────────────────────────────────────────────

export enum HintLevel {
  NONE     = 0,
  ONE      = 1,
  TWO      = 2,
  THREE    = 3,
  REVEALED = 'revealed',
}

export type SessionMode   = 'builder' | 'assignment' | 'mixed';
export type SessionLength = 'quick' | 'standard' | 'deep';

// ─── EXERCISE ─────────────────────────────────────────────────────────────────
export interface Exercise {
  id:          string;
  conceptId:   string;
  mode:        'builder' | 'assignment';
  task:        string;
  initialCode: string;
  solution:    string;
  hints: {
    level1: string;
    level2: string;
    level3: string;
  };
  assignmentData?: {
    zielCode:            string;
    bausteineRichtig:    string[];
    bausteineDistraktor: string[];
    map:                 Record<string, string>;
  };
}

// ─── CONCEPT & TOPIC ──────────────────────────────────────────────────────────
export interface Concept {
  id:          string;
  topicId:     string;
  title:       string;
  syntaxRule:  string;
  explanation: string;
  example:     string;
  exercises:   Exercise[];
}

export interface Topic {
  id:          string;
  title:       string;
  description: string;
  icon:        string;
  order:       number;
  concepts:    Concept[];
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
export interface ConceptProgress {
  conceptId:      string;
  attempts:       number;
  lastHintLevel:  HintLevel;
  lastAttemptAt:  string;
  masteryScore:   number;
}

// ─── SESSION ──────────────────────────────────────────────────────────────────
export interface QueueItem {
  exerciseId: string;
  conceptId:  string;
  topicId:    string;
}

export interface SessionResult {
  exercisesTotal:   number;
  exercisesCorrect: number;
  hintsUsed:        number;
  xpEarned:         number;
  durationSeconds:  number;
  completedAt:      string;
}

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
export interface Achievement {
  id:          string;
  title:       string;
  description: string;
  unlockedAt:  string;
  icon:        string;
}
