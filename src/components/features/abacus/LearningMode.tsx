import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, ArrowLeft, Lightbulb, CheckCircle2, HelpCircle, Award, Target } from 'lucide-react';
import { AbacusLesson, AbacusProgress } from './abacus.types';
import { AbacusBoard } from './AbacusBoard';
import { completeAbacusLesson } from '../../../services/abacus';

interface LearningModeProps {
  lessons: AbacusLesson[];
  progress: AbacusProgress;
  onRefreshProgress: () => void;
  onOpenKaramo?: (context: string) => void;
}

export const LearningMode: React.FC<LearningModeProps> = ({
  lessons,
  progress,
  onRefreshProgress,
  onOpenKaramo
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [activeLessonId, setActiveLessonId] = useState<string>(lessons[0].id);

  const levelLessons = lessons.filter(l => l.level === selectedLevel);
  const currentLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];

  const [studentValue, setStudentValue] = useState<number>(0);
  const [checked, setChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const isCompleted = progress.completedLessons.includes(currentLesson.id);

  const handleVerify = () => {
    setChecked(true);
    if (studentValue === currentLesson.targetValue) {
      setIsCorrect(true);
      completeAbacusLesson(currentLesson.id);
      onRefreshProgress();
    } else {
      setIsCorrect(false);
    }
  };

  const handleNextLesson = () => {
    setChecked(false);
    setIsCorrect(false);
    setShowHint(false);
    setStudentValue(0);

    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < lessons.length - 1) {
      const nextL = lessons[currentIndex + 1];
      setSelectedLevel(nextL.level);
      setActiveLessonId(nextL.id);
    }
  };

  const handleSelectLesson = (lesson: AbacusLesson) => {
    setChecked(false);
    setIsCorrect(false);
    setShowHint(false);
    setStudentValue(0);
    setActiveLessonId(lesson.id);
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Level Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[1, 2, 3, 4, 5].map((lvl) => {
          const lvlTitle = [
            '1. Découverte',
            '2. Nombres 10-99',
            '3. Additions simples',
            '4. Passages & Retenues',
            '5. Soustractions'
          ][lvl - 1];

          const isSelected = selectedLevel === lvl;

          return (
            <button
              key={`lvl-${lvl}`}
              onClick={() => {
                setSelectedLevel(lvl);
                const firstL = lessons.find(l => l.level === lvl);
                if (firstL) handleSelectLesson(firstL);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black tracking-tight transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                isSelected
                  ? 'bg-[#18bfd6] text-white shadow-md shadow-[#18bfd6]/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              {lvlTitle}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Lessons List for selected level */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
            Leçons du Niveau {selectedLevel}
          </h3>

          <div className="space-y-2">
            {levelLessons.map((l, idx) => {
              const isCurrent = l.id === currentLesson.id;
              const isDone = progress.completedLessons.includes(l.id);

              return (
                <button
                  key={l.id}
                  onClick={() => handleSelectLesson(l)}
                  className={`w-full p-4 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                    isCurrent
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : isDone
                      ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950 hover:bg-emerald-100/60'
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isCurrent
                        ? 'bg-[#18bfd6] text-white'
                        : isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isDone ? <Check size={16} /> : idx + 1}
                    </div>
                    <div>
                      <h4 className={`text-xs font-black leading-tight ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                        {l.title}
                      </h4>
                      <p className={`text-[11px] font-medium mt-0.5 ${isCurrent ? 'text-slate-300' : 'text-slate-400'}`}>
                        {l.subtitle}
                      </p>
                    </div>
                  </div>

                  {isDone && !isCurrent && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                      Terminée
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Area: Interactive Lesson Content & Guided Abacus */}
        <div className="lg:col-span-8 bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-6">

          {/* Lesson Header */}
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#18bfd6] bg-[#18bfd6]/10 px-3 py-1 rounded-full border border-[#18bfd6]/20">
                Niveau {currentLesson.level} • Leçon {currentLesson.id}
              </span>

              {isCompleted && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <CheckCircle2 size={14} /> Leçon validée
                </span>
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {currentLesson.title}
            </h2>
            <p className="text-sm font-semibold text-slate-600">
              🎯 Objectif : {currentLesson.goal}
            </p>
          </div>

          {/* Short Explanation */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
            <p>{currentLesson.explanation}</p>
            {currentLesson.operationText && (
              <div className="mt-3 inline-block bg-white border border-slate-200 px-4 py-1.5 rounded-xl font-black text-[#18bfd6] text-base">
                Opération : {currentLesson.operationText}
              </div>
            )}
          </div>

          {/* Demonstration vs Practice Board */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Target size={16} className="text-[#fcb303]" />
                Manipule le boulier ci-dessous :
              </h3>

              {currentLesson.hint && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-xl transition-all cursor-pointer"
                >
                  <Lightbulb size={14} />
                  <span>{showHint ? 'Masquer indice' : 'Indice'}</span>
                </button>
              )}
            </div>

            {showHint && currentLesson.hint && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-800 text-xs font-semibold"
              >
                💡 Indice : {currentLesson.hint}
              </motion.div>
            )}

            {/* Interactive Abacus Board */}
            <AbacusBoard
              value={studentValue}
              onChange={(val) => {
                setStudentValue(val);
                if (checked) setChecked(false);
              }}
              columns={6}
            />

            {/* Action Buttons & Feedback */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-500">
                Valeur cible à former : <span className="text-slate-900 font-black text-base">{currentLesson.targetValue}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleVerify}
                  className="flex-1 sm:flex-none px-6 py-3 bg-[#18bfd6] hover:bg-[#15adc1] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md shadow-[#18bfd6]/20 transition-all cursor-pointer"
                >
                  Vérifier
                </button>

                {(isCorrect || isCompleted) && (
                  <button
                    onClick={handleNextLesson}
                    className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Leçon suivante</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Feedback Message */}
            <AnimatePresence>
              {checked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                        <span>Bravo ! Tu as parfaitement configuré le boulier ! (+20 pts)</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle size={18} className="text-rose-600 shrink-0" />
                        <span>Pas tout à fait. Valeur actuelle : {studentValue}. Cible attendue : {currentLesson.targetValue}. Réessaye !</span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
};
