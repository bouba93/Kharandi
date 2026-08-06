import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AbacusTab, AbacusProgress, AbacusLesson } from './abacus.types';
import { getAbacusProgress, getAbacusLessons } from '../../../services/abacus';
import { AbacusHeader } from './AbacusHeader';
import { AbacusHome } from './AbacusHome';
import { LearningMode } from './LearningMode';
import { PracticeMode } from './PracticeMode';
import { MentalMode } from './MentalMode';
import { ProgressView } from './ProgressView';

interface AbacusModuleProps {
  onBackToDashboard?: () => void;
  onOpenKaramo?: (context: string) => void;
}

export const AbacusModule: React.FC<AbacusModuleProps> = ({
  onBackToDashboard,
  onOpenKaramo
}) => {
  const [activeTab, setActiveTab] = useState<AbacusTab>('home');
  const [progress, setProgress] = useState<AbacusProgress>(() => getAbacusProgress());
  const [lessons, setLessons] = useState<AbacusLesson[]>(() => getAbacusLessons());

  const refreshProgress = () => {
    setProgress(getAbacusProgress());
  };

  useEffect(() => {
    refreshProgress();
  }, [activeTab]);

  return (
    <div className="w-full min-h-screen bg-[#FAFBFD] text-[#0F172A] font-body flex flex-col">
      {/* Module Header */}
      <AbacusHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        progress={progress}
        onBackToDashboard={onBackToDashboard}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && (
              <AbacusHome
                progress={progress}
                onSelectTab={setActiveTab}
                onOpenKaramo={onOpenKaramo}
              />
            )}

            {activeTab === 'learn' && (
              <LearningMode
                lessons={lessons}
                progress={progress}
                onRefreshProgress={refreshProgress}
                onOpenKaramo={onOpenKaramo}
              />
            )}

            {activeTab === 'practice' && (
              <PracticeMode
                progress={progress}
                onRefreshProgress={refreshProgress}
              />
            )}

            {activeTab === 'mental' && (
              <MentalMode
                progress={progress}
                onRefreshProgress={refreshProgress}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressView progress={progress} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AbacusModule;
