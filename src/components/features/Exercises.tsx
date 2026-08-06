import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight, X, Loader2, Lightbulb, Trophy, AlertCircle,
  ChevronRight, ChevronLeft, Award, GraduationCap, CheckCircle2,
  XCircle, Flame, Star, BookOpen, Calculator, Atom, FlaskConical, Leaf, Globe, Compass, TrendingUp, Clock, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { api } from '../../config/api';

// ─── STUCTURES DES CLASSES ET NIVEAUX D'ENSEIGNEMENT ──────────────────────────────
export const EXERCISE_LEVELS = [
  {
    id: 'COLLEGE',
    label: 'Collège (7e, 8e, 9e, 10e)',
    icon: BookOpen,
    gradient: 'from-indigo-600 to-indigo-400',
    light: 'bg-indigo-50 text-indigo-600 border-indigo-200/50',
    description: 'Exercices hebdomadaires par classe & prépa BEPC',
    levels: [
      { id: '7e', label: '7ème Année', sub: '1ère Année Collège' },
      { id: '8e', label: '8ème Année', sub: '2ème Année Collège' },
      { id: '9e', label: '9ème Année', sub: '3ème Année Collège' },
      { id: '10e (BEPC)', label: '10ème Année (BEPC)', sub: 'Brevet d\'Études du Premier Cycle' },
    ],
    subjects: ['Mathématiques', 'Physique', 'Chimie', 'Français', 'Histoire-Géographie', 'Anglais', 'SVT']
  },
  {
    id: 'LYCEE',
    label: 'Lycée (11e, 12e, Terminale)',
    icon: GraduationCap,
    gradient: 'from-[#18bfd6] to-sky-600',
    light: 'bg-[#18bfd6]/10 text-[#18bfd6] border-[#18bfd6]/20',
    description: 'Exercices hebdomadaires par série & prépa BAC',
    levels: [
      { id: '11e', label: '11ème Année', sub: 'Tronc Commun & Orientation Lycée' },
      { id: '12e', label: '12ème Année', sub: 'Sciences & Lettres (Pré-BAC)' },
      { id: 'Terminale SM', label: 'Terminale SM (BAC)', sub: 'Sciences Mathématiques' },
      { id: 'Terminale SS', label: 'Terminale SS (BAC)', sub: 'Sciences de la Nature' },
      { id: 'Terminale SE', label: 'Terminale SE (BAC)', sub: 'Sciences Économiques' },
    ],
    subjects: ['Mathématiques', 'Physique', 'Chimie', 'SVT', 'Français', 'Anglais', 'Philosophie', 'Économie', 'Histoire-Géographie']
  },
  {
    id: 'PRIMAIRE',
    label: 'Primaire & CEE (1ère à 6e)',
    icon: Trophy,
    gradient: 'from-emerald-600 to-emerald-400',
    light: 'bg-emerald-50 text-emerald-600 border-emerald-200/50',
    description: 'Programme Primaire & Examen d\'Entrée en 7ème',
    levels: [
      { id: '3e-4e', label: '3ème & 4ème Année', sub: 'Niveau Élémentaire' },
      { id: '5e', label: '5ème Année', sub: 'Moyen 1' },
      { id: '6e (CEE)', label: '6ème Année (CEE)', sub: 'Examen d\'Entrée en 7ème' },
    ],
    subjects: ['Mathématiques', 'Français', 'Histoire-Géographie', 'SVT']
  },
  {
    id: 'CULTURE_GENERALE',
    label: 'Culture Générale & Quiz',
    icon: Compass,
    gradient: 'from-amber-500 to-orange-500',
    light: 'bg-amber-50 text-amber-600 border-amber-200/50',
    description: 'Testez vos connaissances (Strictement 1 min / question)',
    levels: [
      { id: 'Culture Guinée', label: 'Culture & Histoire Guinée', sub: 'Patrimoine, Géographie, Symboles' },
      { id: 'Sciences & Tech', label: 'Sciences & Inventions', sub: 'Inventions, Espace & Nature' },
      { id: 'Quiz Hebdo', label: 'Quiz Gagnant Hebdomadaire', sub: 'Culture générale & Citoyenneté (1 min)' },
    ],
    subjects: ['Culture Générale', 'Histoire-Géographie', 'Sciences & Innovation', 'Citoyenneté & Institutions']
  }
];

const TOPIC_HINTS: Record<string, string[]> = {
  'Mathématiques': ['suites numériques', 'probabilités', 'équations', 'géométrie', 'fonctions'],
  'Physique': ['mécanique', 'électricité', 'optique', 'énergies'],
  'Chimie': ['solutions acides', 'réactions chimiques', 'atomes et molécules'],
  'SVT': ['génétique', 'système nerveux', 'environnement et santé', 'respiration'],
  'Français': ['grammaire et conjugaison', 'orthographe', 'lecture et compréhension'],
  'Philosophie': ['conscience', 'liberté', 'morale', 'justice'],
  'Anglais': ['vocabulary', 'grammar', 'reading comprehension'],
  'Économie': ['marchés et monnaie', 'économie guinéenne', 'développement'],
  'Histoire-Géographie': ['histoire de la Guinée', 'géographie physique', 'mondialisation'],
  'Culture Générale': ['histoire et symboles de Guinée', 'géographie du monde', 'inventions célèbres'],
  'Sciences & Innovation': ['astronomie', 'inventions majeures', 'biologie'],
  'Citoyenneté & Institutions': ['constitution guinéenne', 'droits et devoirs', 'démocratie']
};

const subjectIcons: Record<string, React.ComponentType<any>> = {
  'Mathématiques': Calculator,
  'Physique': Atom,
  'Chimie': FlaskConical,
  'SVT': Leaf,
  'Français': BookOpen,
  'Anglais': Globe,
  'Philosophie': Lightbulb,
  'Économie': TrendingUp,
  'Histoire-Géographie': Compass,
  'Culture Générale': Compass,
  'Sciences & Innovation': Atom,
  'Citoyenneté & Institutions': Award,
};

type Step = 'category' | 'level' | 'subject' | 'playing' | 'results';

export const Exercises: React.FC = () => {
  const { userProfile, refreshProfile } = useAuth();
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<typeof EXERCISE_LEVELS[0] | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<{ id: string; label: string; sub: string } | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answered, setAnswered] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute (60s) limit
  const [streak, setStreak] = useState(0);
  const timerRef = useRef<any>(null);

  // Liste des exercices déjà effectués par l'utilisateur pour bloquer la repasse (Exigence 3)
  const [completedExercises, setCompletedExercises] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('kharandi_completed_exercises');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const reset = () => {
    setStep('category');
    setSelectedCategory(null);
    setSelectedLevel(null);
    setSelectedSubject(null);
    setQuestions([]);
    setCurrentQ(0);
    setScore(0);
    setError(null);
    setAnswered(null);
    setStreak(0);
    clearInterval(timerRef.current);
  };

  const startTimer = () => {
    // Limite stricte de 1 minute (60 secondes) par question
    setTimeLeft(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(-1); // Temps écoulé => Mauvaise réponse automatique
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const isExerciseAlreadyDone = (levelId: string, subjectName: string) => {
    const key = `${levelId}_${subjectName}`;
    return completedExercises.includes(key);
  };

  const startExercise = async (category: typeof EXERCISE_LEVELS[0], levelObj: { id: string; label: string; sub: string }, subject: string) => {
    const key = `${levelObj.id}_${subject}`;
    if (completedExercises.includes(key)) {
      toast.error(`Vous avez déjà effectué l'exercice ${levelObj.label} - ${subject}. La repasse des exercices est désactivée.`);
      return;
    }

    setIsGenerating(true);
    setError(null);
    const hints = TOPIC_HINTS[subject] || ['programme guinéen'];
    const hint = hints[Math.floor(Math.random() * hints.length)];

    try {
      let qs: any[] = [];

      // Chargement depuis la base locale si disponible (CEE, BEPC, Culture)
      if (levelObj.id.includes('6e') || levelObj.id.includes('CEE')) {
        const { REAL_CEE_QUESTIONS } = await import('../../data/realQcmQuestions');
        const localQs = REAL_CEE_QUESTIONS[subject];
        if (localQs && localQs.length > 0) {
          qs = [...localQs].sort(() => 0.5 - Math.random());
        }
      } else if (levelObj.id.includes('10e') || levelObj.id.includes('BEPC')) {
        const { REAL_BEPC_QUESTIONS } = await import('../../data/realQcmQuestions');
        const localQs = REAL_BEPC_QUESTIONS[subject];
        if (localQs && localQs.length > 0) {
          qs = [...localQs].sort(() => 0.5 - Math.random());
        }
      } else if (category.id === 'CULTURE_GENERALE') {
        const { REAL_CULTURE_QUESTIONS } = await import('../../data/realQcmQuestions');
        const localQs = REAL_CULTURE_QUESTIONS[subject] || REAL_CULTURE_QUESTIONS['Culture Générale'];
        if (localQs && localQs.length > 0) {
          qs = [...localQs].sort(() => 0.5 - Math.random());
        }
      }

      // Si pas de questions locales, génération par IA
      if (qs.length === 0) {
        const { generateQCM } = await import('../../services/ai');
        const topicPrompt = `Exercice hebdomadaire niveau ${levelObj.label} - Matière ${subject} - Thème ${hint}`;
        const result = await generateQCM({ subject, level: levelObj.label, topic: topicPrompt, difficulty: 'MOYEN' });
        if (Array.isArray(result)) qs = result;
        else if (result?.questions) qs = result.questions;
        else if (result?.data?.questions) qs = result.data.questions;
      }

      if (!qs?.length) {
        setError("Karamo n'a pas pu charger les questions. Veuillez réessayer.");
        return;
      }

      setQuestions(qs);
      setCurrentQ(0);
      setScore(0);
      setAnswered(null);
      setStreak(0);
      setStep('playing');
      setTimeout(startTimer, 500);
    } catch (err: any) {
      const msg = err?.response?.status === 429 ? "Limite d'exercices atteinte." : "Impossible de charger l'exercice. Vérifiez votre connexion.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    clearInterval(timerRef.current);
    setAnswered(idx);

    const q = questions[currentQ];
    const correct = idx === q?.correct_index;
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentQ + 1 >= questions.length) {
        const finalScore = score + (correct ? 1 : 0);
        const pts = Math.round((finalScore / questions.length) * 10);

        // Marquer cet exercice comme complété (Exigence 3: Empêcher de refaire le même exercice)
        if (selectedLevel && selectedSubject) {
          const key = `${selectedLevel.id}_${selectedSubject}`;
          const updated = Array.from(new Set([...completedExercises, key]));
          setCompletedExercises(updated);
          localStorage.setItem('kharandi_completed_exercises', JSON.stringify(updated));
        }

        if (pts > 0) {
          api.post('/users/me/points/', { points: pts })
            .then(() => {
              if (refreshProfile) refreshProfile();
            })
            .catch(() => {});

          if (userProfile?.uid) {
            const key = `kharandi_wallet_transactions_${userProfile.uid}`;
            const existing = localStorage.getItem(key);
            let txs = [];
            if (existing) {
              try { txs = JSON.parse(existing); } catch (e) {}
            }
            const newTx = {
              id: `tx-${Date.now()}`,
              date: new Date().toISOString(),
              type: 'credit',
              amount: pts,
              description: `Exo Gagnant Hebdomadaire - ${selectedLevel?.label} (${selectedSubject})`,
              status: 'completed'
            };
            localStorage.setItem(key, JSON.stringify([newTx, ...txs]));
          }
        }
        setStep('results');
      } else {
        setCurrentQ(c => c + 1);
        setAnswered(null);
        startTimer();
      }
    }, 1500);
  };

  if (userProfile?.role === 'TUTOR') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <GraduationCap className="text-primary mb-4" size={48} />
        <h2 className="text-2xl font-bold text-slate-900">Espace Répétiteur</h2>
        <p className="text-slate-500">Les exercices hebdomadaires sont réservés aux élèves.</p>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Lightbulb size={40} className="text-primary animate-pulse" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
          />
        </div>
        <div className="text-center">
          <p className="font-black text-slate-800 text-xl mb-1">Karamo prépare l'exercice</p>
          <p className="text-sm text-slate-500">
            {selectedLevel?.label} · {selectedSubject} (Limité à 1 min / question)
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="text-red-400" size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Exercice non disponible</h3>
        <p className="text-slate-500 mb-6 max-w-sm">{error}</p>
        <button onClick={reset} className="px-6 py-3 bg-primary text-white rounded-2xl font-bold">
          Retour aux catégories
        </button>
      </div>
    );
  }

  // ─── ÉTAPE 5 : RÉSULTATS (Suppression du bouton Refaire) ────────────────────────
  if (step === 'results') {
    const total = questions.length;
    const note = Math.round((score / total) * 20 * 10) / 10;
    const pct = Math.round((score / total) * 100);
    const pts = Math.round((score / total) * 10);
    const mention = note >= 16 ? 'Excellent !' : note >= 14 ? 'Très Bien' : note >= 12 ? 'Bien' : note >= 10 ? 'Passable' : 'À travailler';
    const isGood = note >= 10;

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 max-w-md mx-auto">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full">
          <div className={`w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center ${isGood ? 'bg-gradient-to-br from-primary/20 to-secondary/20' : 'bg-red-50'}`}>
            <Trophy size={48} className={isGood ? 'text-primary' : 'text-red-400'} />
          </div>

          <div className="bg-white rounded-[28px] border border-slate-100 shadow-xl p-6 w-full mb-5 text-center">
            <span className="text-xs font-black uppercase text-slate-400 block mb-1">
              {selectedLevel?.label} · {selectedSubject}
            </span>

            <p className={`text-6xl font-black mb-1 ${isGood ? 'text-primary' : 'text-red-500'}`}>
              {note}<span className="text-2xl text-slate-300">/20</span>
            </p>
            <p className={`font-black text-lg mb-4 ${isGood ? 'text-slate-700' : 'text-red-500'}`}>{mention}</p>

            <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1 }}
                className={`h-full rounded-full ${isGood ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-red-500'}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-2xl p-3">
                <p className="font-black text-slate-900 text-sm">{score} / {total}</p>
                <p className="text-[10px] text-slate-400 font-bold">Bonnes réponses</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3">
                <p className="font-black text-amber-600 text-sm">+{pts} pts</p>
                <p className="text-[10px] text-slate-400 font-bold">Points gagnés</p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Exercice validé et enregistré ! Vous ne pouvez plus refaire cet exercice.</span>
            </div>
          </div>

          {/* Uniquement bouton pour passer à un autre exercice (Exigence 3) */}
          <button
            onClick={reset}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl font-black shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer"
          >
            Choisir un autre exercice <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── ÉTAPE 4 : EN TRAIN DE JOUER (Timer 1 minute strict) ─────────────────────────
  if (step === 'playing' && questions.length > 0) {
    const q = questions[currentQ];
    if (!q) return null;
    const isCulture = selectedCategory?.id === 'CULTURE_GENERALE' || selectedSubject === 'Culture Générale';
    const timerPct = (timeLeft / 60) * 100;
    const timerColor = timeLeft > 30 ? 'text-green-600' : timeLeft > 10 ? 'text-amber-500' : 'text-red-500';

    return (
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Entête de jeu */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                {selectedLevel?.label} · {selectedSubject}
              </span>
              {isCulture && (
                <span className="text-[10px] font-extrabold bg-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock size={10} /> 1 min max
                </span>
              )}
            </div>
            <p className="text-sm font-black text-slate-700 mt-0.5">
              Question {currentQ + 1} sur {questions.length}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {streak >= 2 && (
              <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full text-xs font-black">
                <Flame size={13} /> {streak}
              </div>
            )}
            <button onClick={reset} className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer">
              <X size={18} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Chronomètre 1 minute strict (Exigence 2) */}
        <div className="mb-5 space-y-1.5">
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i < currentQ ? 'bg-primary' : i === currentQ ? 'bg-slate-300' : 'bg-slate-100'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Clock size={12} /> Temps restant :
            </span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden mx-3">
              <motion.div
                animate={{ width: `${timerPct}%` }}
                className={`h-full rounded-full transition-all ${
                  timeLeft > 30 ? 'bg-green-500' : timeLeft > 10 ? 'bg-amber-500' : 'bg-red-500'
                }`}
              />
            </div>
            <span className={`text-xs font-black w-10 text-right ${timerColor}`}>{timeLeft}s</span>
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[24px] border border-slate-100 shadow-lg p-6 mb-5"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white mb-3 bg-gradient-to-br from-primary to-primary/80">
            {currentQ + 1}
          </div>
          <p className="text-[16px] font-bold text-slate-900 leading-relaxed">{q.question}</p>
        </motion.div>

        {/* Options de réponses */}
        <div className="space-y-3">
          {(q.options || []).map((opt: string, i: number) => {
            const isSelected = answered === i;
            const isCorrect = i === q.correct_index;
            const isWrong = isSelected && !isCorrect;

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered !== null}
                className={`w-full text-left p-4 rounded-[20px] border-2 transition-all font-bold text-[14.5px] flex items-center gap-3 cursor-pointer ${
                  answered === null
                    ? 'bg-white border-slate-100 hover:border-primary/40 hover:bg-primary/5 text-slate-700 shadow-sm'
                    : isCorrect
                    ? 'bg-green-50 border-green-400 text-green-800 shadow-lg'
                    : isWrong
                    ? 'bg-red-50 border-red-400 text-red-700'
                    : 'bg-white border-slate-100 text-slate-400 cursor-default'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    answered === null
                      ? 'bg-slate-100 text-slate-600'
                      : isCorrect
                      ? 'bg-green-500 text-white'
                      : isWrong
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt}</span>
                {answered !== null && (
                  <div>
                    {isCorrect && <CheckCircle2 size={18} className="text-green-500 shrink-0" />}
                    {isWrong && <XCircle size={18} className="text-red-500 shrink-0" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {answered !== null && q.explanation && (
          <div className="mt-4 p-4 rounded-[20px] bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium leading-relaxed flex gap-2">
            <Lightbulb size={16} className="shrink-0 mt-0.5" />
            <span>{q.explanation}</span>
          </div>
        )}
      </div>
    );
  }

  // ─── ÉTAPE 1 : CHOIX DE LA CATÉGORIE ─────────────────────────────────────────────
  if (step === 'category') {
    return (
      <div className="p-5 max-w-4xl mx-auto pb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Award size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Exercices Hebdomadaires</h1>
            <p className="text-slate-500 text-sm">Sélectionnez votre classe de la 7ème à la Terminale ou Culture Générale</p>
          </div>
        </div>

        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Cycles d'enseignement</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXERCISE_LEVELS.map(cat => {
            const CatIcon = cat.icon;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedCategory(cat);
                  setStep('level');
                }}
                className={`bg-gradient-to-br ${cat.gradient} text-white p-6 rounded-[24px] shadow-xl text-left relative overflow-hidden group cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 bg-white/20 rounded-xl text-white">
                    <CatIcon size={28} />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-full">
                    {cat.levels.length} Niveaux
                  </span>
                </div>

                <h3 className="font-black text-xl">{cat.label}</h3>
                <p className="text-white/80 text-xs mt-1 leading-relaxed">{cat.description}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cat.levels.map(l => (
                    <span key={l.id} className="text-[10px] font-bold bg-black/20 text-white px-2 py-0.5 rounded-md">
                      {l.label}
                    </span>
                  ))}
                </div>

                <div className="absolute -bottom-6 -right-6 text-white/10 group-hover:rotate-12 transition-transform">
                  <CatIcon size={110} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── ÉTAPE 2 : CHOIX DE LA CLASSE / DU NIVEAU (Exigence 1) ──────────────────────
  if (step === 'level' && selectedCategory) {
    const CatIcon = selectedCategory.icon;
    return (
      <div className="p-5 max-w-3xl mx-auto pb-24">
        <button
          onClick={() => {
            setStep('category');
            setSelectedCategory(null);
          }}
          className="flex items-center gap-2 text-slate-500 font-bold mb-5 hover:text-primary transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} /> Tous les cycles
        </button>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black border mb-6 ${selectedCategory.light}`}>
          <CatIcon size={16} />
          <span>{selectedCategory.label}</span>
        </div>

        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
          Choisis directement ta classe ou ton niveau :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {selectedCategory.levels.map(levelObj => {
            return (
              <motion.button
                key={levelObj.id}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedLevel(levelObj);
                  setStep('subject');
                }}
                className="p-5 bg-white rounded-[22px] border-2 border-slate-100 shadow-sm hover:border-primary/40 hover:shadow-md text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{levelObj.label}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{levelObj.sub}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                  <ChevronRight size={18} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── ÉTAPE 3 : CHOIX DE LA MATIÈRE ET BLOCAGE SI DÉJÀ EFFECTUÉ (Exigence 3) ────
  if (step === 'subject' && selectedCategory && selectedLevel) {
    return (
      <div className="p-5 max-w-2xl mx-auto pb-24">
        <button
          onClick={() => {
            setStep('level');
            setSelectedLevel(null);
          }}
          className="flex items-center gap-2 text-slate-500 font-bold mb-4 hover:text-primary transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} /> {selectedCategory.label} · Niveaux
        </button>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black border mb-6 ${selectedCategory.light}`}>
          <GraduationCap size={14} />
          <span>Classe : {selectedLevel.label}</span>
        </div>

        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
          Choisis la matière de l'exercice :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {selectedCategory.subjects.map(subject => {
            const IconComponent = subjectIcons[subject] || BookOpen;
            const done = isExerciseAlreadyDone(selectedLevel.id, subject);

            return (
              <motion.button
                key={subject}
                whileHover={done ? {} : { x: 4, scale: 1.01 }}
                whileTap={done ? {} : { scale: 0.98 }}
                onClick={() => {
                  if (done) {
                    toast.error(`Exercice ${selectedLevel.label} - ${subject} déjà validé ! Repasse impossible.`);
                    return;
                  }
                  setSelectedSubject(subject);
                  startExercise(selectedCategory, selectedLevel, subject);
                }}
                className={`p-4 rounded-[20px] border-2 transition-all flex items-center justify-between text-left ${
                  done
                    ? 'bg-slate-50 border-slate-200 opacity-80 cursor-not-allowed'
                    : 'bg-white border-slate-100 hover:border-primary/30 shadow-sm hover:shadow-md cursor-pointer group'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                      done ? 'bg-slate-200 text-slate-500 border-slate-300' : selectedCategory.light
                    }`}
                  >
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <p className={`font-black ${done ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{subject}</p>
                    <p className="text-[11px] text-slate-400 font-bold">
                      {done ? '✓ Exercice terminé' : '10 QCM · 1 min max / Q'}
                    </p>
                  </div>
                </div>

                {done ? (
                  <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                    <Check size={12} /> Fait
                  </span>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shrink-0">
                    <ChevronRight size={14} className="text-white" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
