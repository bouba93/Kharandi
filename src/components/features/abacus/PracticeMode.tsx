import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, RotateCcw, Clock, Zap, ArrowRight, CheckCircle2, AlertCircle, Award, Flame, HelpCircle } from 'lucide-react';
import { DifficultyLevel, AbacusProgress } from './abacus.types';
import { generatePracticeProblem, GeneratedProblem } from './abacus.engine';
import { AbacusBoard } from './AbacusBoard';
import { saveAbacusAttempt } from '../../../services/abacus';

interface PracticeModeProps {
  progress: AbacusProgress;
  onRefreshProgress: () => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  progress,
  onRefreshProgress
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [problem, setProblem] = useState<GeneratedProblem>(() => generatePracticeProblem('beginner'));

  const [studentValue, setStudentValue] = useState<number>(0);
  const [manualInput, setManualInput] = useState<string>('');

  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const [checked, setChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [pointsAwarded, setPointsAwarded] = useState<number>(0);
  const [bonusDetails, setBonusDetails] = useState<string[]>([]);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const handleDifficultyChange = (newDiff: DifficultyLevel) => {
    setDifficulty(newDiff);
    loadNextProblem(newDiff);
  };

  const loadNextProblem = (diff: DifficultyLevel = difficulty) => {
    const newProb = generatePracticeProblem(diff);
    setProblem(newProb);
    setStudentValue(0);
    setManualInput('');
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setChecked(false);
    setIsCorrect(false);
    setPointsAwarded(0);
    setBonusDetails([]);
  };

  const handleVerify = () => {
    if (checked) return;
    setIsTimerRunning(false);
    setChecked(true);

    const userAns = manualInput.trim() !== '' ? parseInt(manualInput, 10) : studentValue;
    const correct = userAns === problem.expectedResult;

    setIsCorrect(correct);

    if (correct) {
      let earned = 10;
      const details: string[] = ['+10 pts : Bonne réponse'];

      if (timerSeconds < 10) {
        earned += 5;
        details.push('+5 pts : Bonus de rapidité (< 10s)');
      }

      if ((progress.currentStreak + 1) % 5 === 0) {
        earned += 20;
        details.push('+20 pts : Série de 5 bonnes réponses !');
      }

      setPointsAwarded(earned);
      setBonusDetails(details);

      saveAbacusAttempt({
        type: 'practice',
        correct: true,
        timeSeconds: timerSeconds,
        pointsEarned: earned
      });
    } else {
      saveAbacusAttempt({
        type: 'practice',
        correct: false,
        timeSeconds: timerSeconds,
        pointsEarned: 0
      });
    }

    onRefreshProgress();
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Difficulty Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-[#fcb303]" />
          <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Niveau d'Entraînement :
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map(d => {
            const labels: Record<DifficultyLevel, string> = {
              beginner: 'Débutant (0-20)',
              intermediate: 'Intermédiaire (999)',
              advanced: 'Avancé (Grands nombres)'
            };
            const isSelected = difficulty === d;

            return (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#fcb303] text-slate-900 shadow-md shadow-[#fcb303]/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {labels[d]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Practice Problem Area */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-6">

        {/* Problem Display & Timer Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-3xl text-white shadow-md">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#18bfd6] bg-[#18bfd6]/10 px-2.5 py-1 rounded-md border border-[#18bfd6]/20">
              Opération à résoudre
            </span>
            <div className="text-3xl sm:text-5xl font-black text-white mt-2 tracking-tight">
              {problem.expressionText} = ?
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
            <Clock size={18} className="text-[#fcb303]" />
            <span className="text-xl font-black text-white font-mono">
              {timerSeconds}s
            </span>
          </div>
        </div>

        {/* Interactive Abacus Board */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-500">
              Forme ta réponse sur le boulier OU saisis-la directement :
            </span>

            {/* Direct Number Input Fallback */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Clavier :</span>
              <input
                type="number"
                value={manualInput}
                onChange={(e) => {
                  setManualInput(e.target.value);
                  const num = parseInt(e.target.value, 10);
                  if (!isNaN(num)) setStudentValue(num);
                }}
                placeholder="Ex: 15"
                className="w-24 px-3 py-1.5 text-xs font-black bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#18bfd6]"
              />
            </div>
          </div>

          <AbacusBoard
            value={studentValue}
            onChange={(val) => {
              setStudentValue(val);
              setManualInput(val.toString());
              if (checked) setChecked(false);
            }}
            columns={6}
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-between gap-4 border-t border-slate-100">
          <button
            onClick={() => {
              setStudentValue(0);
              setManualInput('');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Effacer</span>
          </button>

          <div className="flex items-center gap-3">
            {!checked ? (
              <button
                onClick={handleVerify}
                className="px-8 py-3.5 bg-[#fcb303] hover:bg-amber-400 text-slate-900 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#fcb303]/25 transition-all cursor-pointer"
              >
                Vérifier ma réponse
              </button>
            ) : (
              <button
                onClick={() => loadNextProblem()}
                className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Exercice suivant</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Result & Explanation Feedback */}
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-6 rounded-3xl border space-y-3 ${
                isCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle size={24} className="text-rose-600 shrink-0" />
                  )}
                  <h4 className="text-base font-black">
                    {isCorrect ? 'Excellente réponse !' : 'Incorrect'}
                  </h4>
                </div>

                {isCorrect && (
                  <span className="text-sm font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-xl">
                    +{pointsAwarded} points !
                  </span>
                )}
              </div>

              {isCorrect && bonusDetails.length > 0 && (
                <div className="space-y-1 pl-8">
                  {bonusDetails.map((b, i) => (
                    <p key={i} className="text-xs font-bold text-emerald-700">
                      • {b}
                    </p>
                  ))}
                </div>
              )}

              {!isCorrect && (
                <div className="space-y-2 text-xs font-medium pl-8">
                  <p>
                    Ta réponse : <span className="font-black text-rose-700">{studentValue}</span>.
                    La réponse exacte était : <span className="font-black text-emerald-700">{problem.expectedResult}</span>.
                  </p>
                  <p className="bg-white/80 p-3 rounded-2xl border border-rose-200 text-slate-700">
                    💡 Explication : {problem.explanation}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
