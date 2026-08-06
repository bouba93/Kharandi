import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Award, Zap, Trophy, Flame, ArrowLeft, Brain } from 'lucide-react';
import { AbacusTab, AbacusProgress } from './abacus.types';

interface AbacusHeaderProps {
  activeTab: AbacusTab;
  onSelectTab: (tab: AbacusTab) => void;
  progress: AbacusProgress;
  onBackToDashboard?: () => void;
}

export const AbacusHeader: React.FC<AbacusHeaderProps> = ({
  activeTab,
  onSelectTab,
  progress,
  onBackToDashboard
}) => {
  const tabs: { id: AbacusTab; label: string; icon: React.FC<any> }[] = [
    { id: 'home', label: 'Accueil', icon: Trophy },
    { id: 'learn', label: 'Apprendre', icon: BookOpen },
    { id: 'practice', label: 'S’entraîner', icon: Zap },
    { id: 'mental', label: 'Calcul mental', icon: Brain },
    { id: 'progress', label: 'Mes progrès', icon: Award },
  ];

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 shadow-xs mb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Module Title & Stats Badges */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-[#18bfd6] transition-all cursor-pointer"
                title="Retour au Dashboard"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#18bfd6] to-[#fcb303] flex items-center justify-center text-white shadow-xs">
                  <Brain size={18} />
                </div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                  Kharandi Abacus
                </h1>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Calcul mental & Boulier japonais Soroban
              </p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl text-amber-600 text-xs font-black">
              <Award size={14} className="fill-amber-500" />
              <span>{progress.points} pts</span>
            </div>
            <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-xl text-rose-600 text-xs font-black">
              <Flame size={14} className="fill-rose-500" />
              <span>{progress.currentStreak}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl w-full md:w-auto overflow-x-auto scrollbar-none">
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTab(t.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black tracking-tight transition-all cursor-pointer whitespace-nowrap ${
                  isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={15} />
                <span>{t.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="abacus-header-pill"
                    className="absolute inset-0 bg-white rounded-xl shadow-xs border border-slate-200/60 z-[-1]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
