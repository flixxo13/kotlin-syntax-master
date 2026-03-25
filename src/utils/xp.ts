import type { HintLevel } from '../types'

export function calculateXP(hintLevel: HintLevel): number {
  const map: Record<string, number> = {
    '0': 10, '1': 7, '2': 4, '3': 2, 'revealed': 0
  }
  return map[String(hintLevel)] ?? 0
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`
  return String(xp)
}
