import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HomeScreen } from './screens/HomeScreen';
import { ExerciseScreen } from './screens/ExerciseScreen';
import { ImportScreen } from './screens/ImportScreen';
import { BottomNav } from './components/navigation/BottomNav';
import { TOPICS } from './data/topics';
import { useLearningStore } from './store/useLearningStore';

const ProgressScreen = () => (
  <div className="p-6 flex flex-col gap-6">
    <h1 className="text-2xl font-bold tracking-tight">Dein Fortschritt</h1>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-surface p-4 rounded-xl border border-surface-2">
        <span className="text-[10px] uppercase font-mono text-text-secondary">Mastery</span>
        <div className="text-2xl font-bold">12%</div>
      </div>
      <div className="bg-surface p-4 rounded-xl border border-surface-2">
        <span className="text-[10px] uppercase font-mono text-text-secondary">Übungen</span>
        <div className="text-2xl font-bold">42</div>
      </div>
    </div>
  </div>
);

const ProfileScreen = () => (
  <div className="p-6 flex flex-col gap-6">
    <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
    <div className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-surface-2">
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold">F</div>
      <div className="flex flex-col">
        <span className="font-bold">Felix</span>
        <span className="text-xs text-text-secondary">Kotlin Syntax Master</span>
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeExercise, setActiveExercise] = useState<{ topicId: string; conceptId: string; exerciseId?: string } | null>(null);
  const { customTasks } = useLearningStore();

  const renderScreen = () => {
    if (activeExercise) {
      return (
        <ExerciseScreen 
          key={`${activeExercise.topicId}-${activeExercise.conceptId}-${activeExercise.exerciseId || 'default'}`}
          topicId={activeExercise.topicId} 
          conceptId={activeExercise.conceptId} 
          exerciseId={activeExercise.exerciseId}
          onBack={() => setActiveExercise(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            onStartTopic={(topicId) => {
              const topic = TOPICS.find(t => t.id === topicId);
              if (topic) {
                setActiveExercise({ topicId, conceptId: topic.concepts[0].id });
              }
            }} 
            onStartCustomTask={(taskId) => {
              const task = customTasks.find(t => t.id === taskId);
              if (task) {
                setActiveExercise({ topicId: 'custom', conceptId: task.conceptId, exerciseId: task.id });
              }
            }}
          />
        );
      case 'import':
        return <ImportScreen />;
      case 'progress':
        return <ProgressScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onStartTopic={() => {}} onStartCustomTask={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans selection:bg-primary/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeExercise ? 'exercise' : activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="pb-20"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {!activeExercise && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}
