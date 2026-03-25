import { module1 } from './module1'
import { module2 } from './module2'
import { module3 } from './module3'
import { module4 } from './module4'
import { module5 } from './module5'
import { module6 } from './module6'
import { module7 } from './module7'

import type { Topic } from '../types'

export const allTopics: Topic[] = [
  module1,
  module2,
  module3,
  module4,
  module5,
  module6,
  module7,
]

// ── Hilfsfunktionen ──────────────────────────────────────────

export function getTopicById(id: string): Topic | undefined {
  return allTopics.find(t => t.id === id)
}

export function getConceptById(conceptId: string) {
  for (const topic of allTopics) {
    const concept = topic.concepts.find(c => c.id === conceptId)
    if (concept) return concept
  }
  return undefined
}

export function getExerciseById(exerciseId: string) {
  for (const topic of allTopics) {
    for (const concept of topic.concepts) {
      const exercise = concept.exercises.find(e => e.id === exerciseId)
      if (exercise) return exercise
    }
  }
  return undefined
}

// Fortschritt pro Modul berechnen (0–100)
export function getTopicProgress(
  topicId: string,
  progress: Record<string, { masteryScore: number }>
): number {
  const topic = getTopicById(topicId)
  if (!topic) return 0
  const concepts = topic.concepts
  if (concepts.length === 0) return 0
  const total = concepts.reduce((acc, c) => {
    return acc + (progress[c.id]?.masteryScore ?? 0)
  }, 0)
  return Math.round(total / concepts.length)
}

// Gesamt-Stats
export function getOverallStats(
  progress: Record<string, { masteryScore: number }>
): { totalConcepts: number; masteredConcepts: number; totalExercises: number } {
  let totalConcepts = 0
  let masteredConcepts = 0
  let totalExercises = 0
  for (const topic of allTopics) {
    for (const concept of topic.concepts) {
      totalConcepts++
      totalExercises += concept.exercises.length
      if ((progress[concept.id]?.masteryScore ?? 0) >= 80) {
        masteredConcepts++
      }
    }
  }
  return { totalConcepts, masteredConcepts, totalExercises }
}
