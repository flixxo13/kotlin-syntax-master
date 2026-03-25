// Prüft ob heute bereits gelernt wurde
export function learnedToday(lastSessionAt: string | null): boolean {
  if (!lastSessionAt) return false
  const last = new Date(lastSessionAt)
  const today = new Date()
  return (
    last.getFullYear() === today.getFullYear() &&
    last.getMonth() === today.getMonth() &&
    last.getDate() === today.getDate()
  )
}

// Prüft ob gestern gelernt wurde (Streak bleibt)
export function learnedYesterday(lastSessionAt: string | null): boolean {
  if (!lastSessionAt) return false
  const last = new Date(lastSessionAt)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    last.getFullYear() === yesterday.getFullYear() &&
    last.getMonth() === yesterday.getMonth() &&
    last.getDate() === yesterday.getDate()
  )
}

// Berechnet neuen Streak nach einer Session
export function updateStreak(
  currentStreak: number,
  lastSessionAt: string | null,
  freezeAvailable: boolean
): { streak: number; freezeAvailable: boolean } {
  if (learnedToday(lastSessionAt)) {
    return { streak: currentStreak, freezeAvailable }
  }
  if (learnedYesterday(lastSessionAt)) {
    return { streak: currentStreak + 1, freezeAvailable }
  }
  // Mehr als 1 Tag ausgelassen
  if (freezeAvailable) {
    return { streak: currentStreak, freezeAvailable: false }
  }
  return { streak: 1, freezeAvailable: false }
}

// Neuer Streak-Freeze jeden Montag
export function refreshStreakFreeze(lastRefreshAt: string | null): boolean {
  if (!lastRefreshAt) return true
  const last = new Date(lastRefreshAt)
  const now = new Date()
  // Neue Woche = neuer Freeze
  const weekDiff = Math.floor(
    (now.getTime() - last.getTime()) / (7 * 24 * 60 * 60 * 1000)
  )
  return weekDiff >= 1
}
