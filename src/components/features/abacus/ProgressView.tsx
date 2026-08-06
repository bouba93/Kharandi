import React from 'react';
import { motion } from 'motion/react';
import { Award, Flame, Target, Trophy, Clock, CheckCircle2, Lock, Percent, BookOpen } from 'lucide-react';
import { AbacusProgress } from './abacus.types';

interface ProgressViewProps {
  progress: AbacusProgress;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ progress }) => {
  const successRate = progress.totalExercises > 0
    ? Math.round((progress.correctAnswers / progress.totalExercises) * 100)
    : 0;

  const avgTime = progress.totalExercises > 0
    ? Math.round(progress.totalTimeSeconds / progress.totalExercises)
    : 0;

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto px-4 sm:px-6">

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Exercices</span>
            <div className="p-2 bg-[#18bfd6]/10 text-[#18bfd6] rounded-xl">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-900">{progress.totalExercises}</p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
              {progress.correctAnswers} réponses exactes
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Réussite</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <Percent size={18} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-900">{successRate}%</p>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
              Précision globale
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Série Max</span>
            <div className="p-2 bg-rose-500/10 text-rose-600 rounded-xl">
              <Flame size={18} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-900">{progress.bestStreak} à la suite</p>
            <p className="text-[11px] font-semibold text-rose-500 mt-0.5">
              Actuel : {progress.currentStreak}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Temps Moyen</span>
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-900">{avgTime}s</p>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
              Par exercice
            </p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-6">

        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fcb303]/10 text-amber-600 flex items-center justify-center font-black">
              <Award size={22} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Insignes Honorifiques d'Excellence
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Débloque tous les badges Kharandi Abacus en progressant dans tes entraînements.
              </p>
            </div>
          </div>

          <span className="text-xs font-black text-amber-700 bg-[#fcb303]/10 px-3 py-1 rounded-full border border-[#fcb303]/20">
            {progress.badges.filter(b => b.unlocked).length} / {progress.badges.length} Débloqués
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {progress.badges.map((b) => (
            <div
              key={b.id}
              className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                b.unlocked
                  ? 'bg-amber-500/5 border-amber-300/80 text-amber-950 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200/60 text-slate-400 grayscale opacity-70'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                b.unlocked ? 'bg-[#fcb303]/20 border border-[#fcb303]/30' : 'bg-slate-200/60'
              }`}>
                {b.unlocked ? b.icon : <Lock size={20} className="text-slate-400" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-black ${b.unlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                    {b.title}
                  </h4>
                  {b.unlocked && (
                    <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
                      Acquis
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium leading-normal text-slate-500">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
