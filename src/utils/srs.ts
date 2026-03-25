import type { HintLevel, QueueItem, Exercise } from '../types'

// Berechnet Priorität basierend auf Hint-Level
// 1 = sofort wiederholen, 5 = weit hinten
export function getPriorityFromHintLevel(hintLevel: HintLevel): number {
  switch (hintLevel) {
    case 0:         return 5  // Ohne Hint: weit hinten
    case 1:         return 4  // Hint 1: mittig-hinten
    case 2:         return 3  // Hint 2: mittig
    case 3:         return 2  // Hint 3: vorne
    case 'revealed': return 1  // Lösung gezeigt: sofort
    default:        return 3
  }
}

// XP basierend auf Hint-Level
export function getXPForHintLevel(hintLevel: HintLevel): number {
  switch (hintLevel) {
    case 0:         return 10
    case 1:         return 7
    case 2:         return 4
    case 3:         return 2
    case 'revealed': return 0
    default:        return 0
  }
}

// Erstellt einen neuen Queue-Eintrag
export function createQueueItem(
  exercise: Exercise,
  hintLevel: HintLevel
): QueueItem {
  return {
    exerciseId: exercise.id,
    conceptId: exercise.conceptId,
    priority: getPriorityFromHintLevel(hintLevel),
    addedAt: new Date().toISOString(),
    hintLevelUsed: hintLevel,
  }
}

// Sortiert Queue nach Priorität (1 zuerst)
export function sortQueue(queue: QueueItem[]): QueueItem[] {
  return [...queue].sort((a, b) => a.priority - b.priority)
}

// Zieht zufällig N Exercises aus einem Pool
export function pickRandomExercises(
  exercises: Exercise[],
  count: number
): Exercise[] {
  const shuffled = [...exercises].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

// Session-Länge → Anzahl Übungen
export function sessionLengthToCount(length: 'quick' | 'standard' | 'marathon'): number {
  switch (length) {
    case 'quick':    return 3
    case 'standard': return 5
    case 'marathon': return 8
  }
}
