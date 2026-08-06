import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Zap, Brain, Award, Flame, Target, ChevronRight, MessageCircle } from 'lucide-react';
import { AbacusTab, AbacusProgress } from './abacus.types';

interface AbacusHomeProps {
  progress: AbacusProgress;
  onSelectTab: (tab: AbacusTab) => void;
  onOpenKaramo?: (context: string) => void;
}

export const AbacusHome: React.FC<AbacusHomeProps> = ({
  progress,
  onSelectTab,
  onOpenKaramo
}) => {
  const dailyPercent = Math.min(100, Math.round((progress.dailyGoalCompleted / progress.dailyGoalTarget) * 100));

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero Header Card */}
      <div className="relative rounded-[32px] bg-gradient-to-r from-[#18bfd6] via-[#15adc1] to-[#0f8c9d] p-8 sm:p-10 text-white shadow-xl overflow-hidden border border-[#18bfd6]/30">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#fcb303]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider border border-white/20">
              <Brain size={14} />
              Boulier Japonais Soroban & Anzan
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Kharandi Abacus
            </h1>
            <p className="text-cyan-50 font-medium text-sm sm:text-base leading-relaxed">
              Apprends à calculer plus vite avec ton boulier mental. Développe une mémoire visuelle exceptionnelle et multiplie ta vitesse de calcul !
            </p>
          </div>

          {/* Quick Stats Panel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/15 backdrop-blur-md p-4 rounded-3xl border border-white/25 shadow-sm shrink-0">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-cyan-100 uppercase tracking-wider">Niveau</span>
              <span className="text-xl font-black text-white mt-0.5">Niveau {progress.level}</span>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-cyan-100 uppercase tracking-wider">Points Total</span>
              <span className="text-xl font-black text-[#fcb303] mt-0.5">{progress.points} pts</span>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex flex-col items-center text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-cyan-100 uppercase tracking-wider">Série</span>
              <span className="text-xl font-black text-rose-300 mt-0.5 flex items-center gap-1">
                <Flame size={18} className="fill-rose-400" />
                {progress.currentStreak} j
              </span>
            </div>
          </div>
        </div>

        {/* Daily Goal Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/15 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#fcb303] text-slate-900 rounded-xl font-bold shadow-xs">
              <Target size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-white">Objectif quotidien de calcul</p>
              <p className="text-xs text-cyan-100 font-medium">
                {progress.dailyGoalCompleted} / {progress.dailyGoalTarget} exercices réalisés aujourd'hui
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64 bg-black/20 h-3.5 rounded-full p-0.5 border border-white/15 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#fcb303] to-amber-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${dailyPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* 4 Main Interactive Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. Apprendre */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTab('learn')}
          className="group relative bg-white rounded-[32px] p-7 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(24,191,214,0.12)] hover:border-[#18bfd6]/30 transition-all cursor-pointer overflow-hidden flex flex-col justify-between min-h-[220px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#18bfd6]/10 rounded-bl-full transition-transform group-hover:scale-125 duration-500 pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#18bfd6]/10 text-[#18bfd6] flex items-center justify-center border border-[#18bfd6]/20">
              <BookOpen size={28} />
            </div>
            <span className="text-xs font-black text-[#18bfd6] bg-[#18bfd6]/10 px-3 py-1 rounded-full border border-[#18bfd6]/20">
              5 Niveaux & Leçons
            </span>
          </div>

          <div className="relative z-10 mt-6">
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#18bfd6] transition-colors flex items-center gap-2">
              Apprendre
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-[#18bfd6]" />
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
              Leçons pas-à-pas guidées : découverte des perles, représentation des nombres et règles d'additions/soustractions.
            </p>
          </div>
        </motion.div>

        {/* 2. S'entraîner */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTab('practice')}
          className="group relative bg-white rounded-[32px] p-7 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(252,179,3,0.15)] hover:border-[#fcb303]/30 transition-all cursor-pointer overflow-hidden flex flex-col justify-between min-h-[220px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#fcb303]/10 rounded-bl-full transition-transform group-hover:scale-125 duration-500 pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#fcb303]/10 text-amber-600 flex items-center justify-center border border-[#fcb303]/20">
              <Zap size={28} />
            </div>
            <span className="text-xs font-black text-amber-700 bg-[#fcb303]/10 px-3 py-1 rounded-full border border-[#fcb303]/20">
              3 Difficultés
            </span>
          </div>

          <div className="relative z-10 mt-6">
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#fcb303] transition-colors flex items-center gap-2">
              S’entraîner
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-[#fcb303]" />
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
              Exercices pratiques avec le boulier virtuel interactif : de la manipulation libre aux additions/soustractions chronométrées.
            </p>
          </div>
        </motion.div>

        {/* 3. Calcul mental */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTab('mental')}
          className="group relative bg-white rounded-[32px] p-7 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)] hover:border-purple-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between min-h-[220px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full transition-transform group-hover:scale-125 duration-500 pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20">
              <Brain size={28} />
            </div>
            <span className="text-xs font-black text-purple-700 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              Anzan Flash
            </span>
          </div>

          <div className="relative z-10 mt-6">
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors flex items-center gap-2">
              Calcul mental
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-purple-600" />
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
              Séries de nombres affichés à grande vitesse. Disparition du boulier pour simuler la représentation mentale dans ton cerveau !
            </p>
          </div>
        </motion.div>

        {/* 4. Mes progrès */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTab('progress')}
          className="group relative bg-white rounded-[32px] p-7 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] hover:border-emerald-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between min-h-[220px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full transition-transform group-hover:scale-125 duration-500 pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
              <Award size={28} />
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Statistiques & Badges
            </span>
          </div>

          <div className="relative z-10 mt-6">
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
              Mes progrès
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-emerald-600" />
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
              Consulte ton taux de réussite, ton temps moyen, débloque 7 badges d'excellence et suis ton évolution au fil des jours.
            </p>
          </div>
        </motion.div>

      </div>

      {/* Discreet Coach Karamo Callout */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#18bfd6] flex items-center justify-center shrink-0">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">Coach Virtuel Karamo</p>
            <p className="text-xs text-slate-400">Une question sur la manipulation des perles ou les retenues sur le boulier ?</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onOpenKaramo) {
              onOpenKaramo("Explique-moi le fonctionnement du boulier japonais Abacus et comment faire les retenues.");
            }
          }}
          className="w-full sm:w-auto px-4 py-2 bg-[#18bfd6] hover:bg-[#15adc1] text-white text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-xs"
        >
          <MessageCircle size={14} />
          <span>Demander de l'aide à Karamo</span>
        </button>
      </div>
    </div>
  );
};
