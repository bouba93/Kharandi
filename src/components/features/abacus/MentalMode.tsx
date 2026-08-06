import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Play, RotateCcw, Volume2, VolumeX, CheckCircle2, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { DifficultyLevel, MentalSpeed, AbacusProgress } from './abacus.types';
import { generateMentalSequence, MentalSequence, playFlashBeep } from './abacus.engine';
import { AbacusBoard } from './AbacusBoard';
import { saveAbacusAttempt } from '../../../services/abacus';

interface MentalModeProps {
  progress: AbacusProgress;
  onRefreshProgress: () => void;
}

export const MentalMode: React.FC<MentalModeProps> = ({
  progress,
  onRefreshProgress
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [speed, setSpeed] = useState<MentalSpeed>('normal');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // States: 'config' | 'countdown' | 'flashing' | 'input' | 'result'
  const [state, setState] = useState<'config' | 'countdown' | 'flashing' | 'input' | 'result'>('config');

  const [sequence, setSequence] = useState<MentalSequence | null>(null);
  const [countdown, setCountdown] = useState<number>(3);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [pointsEarned, setPointsEarned] = useState<number>(0);

  const handleStart = () => {
    const seq = generateMentalSequence(difficulty, speed);
    setSequence(seq);
    setCountdown(3);
    setUserAnswer('');
    setState('countdown');
  };

  // Countdown timer
  useEffect(() => {
    if (state !== 'countdown') return;
    if (countdown > 0) {
      if (soundEnabled) playFlashBeep(600);
      const timer = setTimeout(() => setCountdown(c => c - 1), 800);
      return () => clearTimeout(timer);
    } else {
      setState('flashing');
      setCurrentIndex(0);
    }
  }, [state, countdown, soundEnabled]);

  // Number flashing loop
  useEffect(() => {
    if (state !== 'flashing' || !sequence) return;

    if (soundEnabled) playFlashBeep(880);

    if (currentIndex < sequence.numbers.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(i => i + 1);
      }, sequence.speedMs);
      return () => clearTimeout(timer);
    } else {
      // Finished sequence, move to answer input
      setState('input');
    }
  }, [state, currentIndex, sequence, soundEnabled]);

  const handleSubmitAnswer = () => {
    if (!sequence) return;
    const ansNum = parseInt(userAnswer.trim(), 10);
    const correct = ansNum === sequence.expectedSum;

    setIsCorrect(correct);

    let earned = 0;
    if (correct) {
      earned = difficulty === 'beginner' ? 15 : difficulty === 'intermediate' ? 25 : 40;
      saveAbacusAttempt({
        type: 'mental',
        correct: true,
        timeSeconds: (sequence.numbers.length * sequence.speedMs) / 1000,
        pointsEarned: earned
      });
    } else {
      saveAbacusAttempt({
        type: 'mental',
        correct: false,
        timeSeconds: (sequence.numbers.length * sequence.speedMs) / 1000,
        pointsEarned: 0
      });
    }

    setPointsEarned(earned);
    setState('result');
    onRefreshProgress();
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto px-4 sm:px-6">

      {/* Mode Config Header */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-6">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20">
              <Brain size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Calcul Mental Anzan
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Entraîne ta mémoire de travail et ta capacité de projection visuelle du boulier.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            {soundEnabled ? <Volume2 size={16} className="text-purple-600" /> : <VolumeX size={16} />}
            <span>{soundEnabled ? 'Sons activés' : 'Sons coupés'}</span>
          </button>
        </div>

        {/* Setup Parameters */}
        {state === 'config' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Difficulty Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                  Difficulté de la série :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map(d => {
                    const labels: Record<DifficultyLevel, string> = {
                      beginner: 'Débutant (4 nbrs)',
                      intermediate: 'Moyen (6 nbrs)',
                      advanced: 'Avancé (8 nbrs)'
                    };
                    const isSel = difficulty === d;

                    return (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                          isSel
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                        }`}
                      >
                        {labels[d]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Speed Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                  Vitesse d'affichage :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['slow', 'normal', 'fast'] as MentalSpeed[]).map(s => {
                    const labels: Record<MentalSpeed, string> = {
                      slow: 'Lente (1.5s)',
                      normal: 'Normale (1.0s)',
                      fast: 'Rapide (0.6s)'
                    };
                    const isSel = speed === s;

                    return (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                          isSel
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                        }`}
                      >
                        {labels[s]}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={handleStart}
                className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-purple-500/25 transition-all cursor-pointer flex items-center gap-3 hover:scale-105"
              >
                <Play size={20} className="fill-white" />
                <span>Lancer le calcul mental</span>
              </button>
            </div>
          </div>
        )}

        {/* Countdown Overlay */}
        {state === 'countdown' && (
          <div className="py-16 flex flex-col items-center justify-center space-y-4 text-center">
            <span className="text-xs font-black text-purple-600 uppercase tracking-widest">
              Prépare ton esprit...
            </span>
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="text-7xl font-black text-purple-600"
            >
              {countdown > 0 ? countdown : 'C’est parti !'}
            </motion.div>
          </div>
        )}

        {/* Flashing Sequence Display */}
        {state === 'flashing' && sequence && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              Nombre {currentIndex + 1} / {sequence.numbers.length}
            </div>

            <motion.div
              key={currentIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="text-6xl sm:text-8xl font-black text-purple-600 font-mono tracking-tight bg-purple-50 px-12 py-6 rounded-3xl border-2 border-purple-200 shadow-inner"
            >
              {sequence.numbers[currentIndex] > 0
                ? `+${sequence.numbers[currentIndex]}`
                : sequence.numbers[currentIndex]}
            </motion.div>

            {/* Beginner mode keeps abacus visible, advanced hides it */}
            {difficulty === 'beginner' && (
              <div className="w-full max-w-md pt-4">
                <AbacusBoard
                  value={Math.abs(sequence.numbers[currentIndex] || 0)}
                  columns={6}
                  readOnly
                  compact
                />
              </div>
            )}
            {difficulty !== 'beginner' && (
              <div className="text-xs font-bold text-purple-400 italic">
                🧠 Visualise le boulier mentalement !
              </div>
            )}
          </div>
        )}

        {/* User Answer Input */}
        {state === 'input' && (
          <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto">
            <Brain size={32} className="text-purple-600" />
            <h3 className="text-2xl font-black text-slate-900">
              Quel est le résultat final ?
            </h3>

            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              placeholder="Entre ton résultat"
              autoFocus
              className="w-full p-4 text-3xl font-black text-center bg-slate-50 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10"
            />

            <button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim()}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              Valider mon calcul
            </button>
          </div>
        )}

        {/* Result Screen */}
        {state === 'result' && sequence && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className={`p-6 rounded-3xl border text-center space-y-3 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              <div className="flex items-center justify-center gap-2">
                {isCorrect ? (
                  <CheckCircle2 size={32} className="text-emerald-600" />
                ) : (
                  <AlertCircle size={32} className="text-rose-600" />
                )}
                <h3 className="text-2xl font-black">
                  {isCorrect ? 'Superbe calcul mental !' : 'Calcul erroné'}
                </h3>
              </div>

              <p className="text-sm font-semibold">
                {isCorrect
                  ? `Tu as trouvé le résultat exact de ${sequence.expectedSum} ! (+${pointsEarned} pts)`
                  : `Ta réponse : ${userAnswer}. Le résultat exact était : ${sequence.expectedSum}.`}
              </p>
            </div>

            {/* Sequence Breakdown */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <span className="font-black text-slate-700 uppercase tracking-wider">
                Détail de la série flash :
              </span>
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-sm font-bold text-slate-800">
                {sequence.numbers.map((n, idx) => (
                  <span key={idx} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    {n > 0 ? `+${n}` : n}
                  </span>
                ))}
                <span className="font-black text-purple-600 text-base">
                  = {sequence.expectedSum}
                </span>
              </div>
            </div>

            {/* Replay or New Sequence */}
            <div className="pt-4 flex items-center justify-center gap-4">
              <button
                onClick={() => setState('config')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition-all cursor-pointer"
              >
                Changer de paramètres
              </button>

              <button
                onClick={handleStart}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw size={16} />
                <span>Nouvelle série</span>
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
