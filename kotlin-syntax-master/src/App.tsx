import { useEffect, useState } from 'react'
import { useLearningStore } from './store/useLearningStore'
import { allTopics } from './data/topics'
import { BottomNav } from './components/navigation/BottomNav'
import { HomeScreen } from './screens/HomeScreen'
import { LearnScreen } from './screens/LearnScreen'
import { ProgressScreen } from './screens/ProgressScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ExerciseScreen } from './screens/ExerciseScreen'
import { SessionEndScreen } from './screens/SessionEndScreen'
import type { SessionResult } from './types'

export default function App() {
  const { activeScreen, activeSession, setTopics } = useLearningStore()
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null)

  // Topics einmalig laden
  useEffect(() => {
    setTopics(allTopics)
  }, [])

  // Session End Handler
  const handleSessionEnd = (result: SessionResult) => {
    setSessionResult(result)
  }

  const handleContinue = () => {
    setSessionResult(null)
  }

  const handleRestart = () => {
    setSessionResult(null)
  }

  // ── Session End Screen ───────────────────────────────────
  if (sessionResult) {
    return (
      <div className="h-screen h-[100dvh] bg-black flex flex-col">
        <SessionEndScreen
          result={sessionResult}
          onContinue={handleContinue}
          onRestart={handleRestart}
        />
      </div>
    )
  }

  // ── Active Exercise ──────────────────────────────────────
  if (activeSession) {
    return (
      <div className="h-screen h-[100dvh] bg-black flex flex-col">
        <ExerciseScreen onSessionEnd={handleSessionEnd} />
      </div>
    )
  }

  // ── Main App Layout ──────────────────────────────────────
  return (
    <div className="h-screen h-[100dvh] bg-black flex flex-col overflow-hidden">
      {/* Screen Content */}
      <main className="flex-1 overflow-hidden">
        {activeScreen === 'home'     && <HomeScreen />}
        {activeScreen === 'learn'    && <LearnScreen />}
        {activeScreen === 'progress' && <ProgressScreen />}
        {activeScreen === 'profile'  && <ProfileScreen />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
