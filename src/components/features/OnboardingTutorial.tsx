import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, BookOpen, MessageCircle, Trophy, ShoppingBag, Star } from 'lucide-react';

interface Step {
  icon: React.ElementType;
  color: string;
  title: string;
  desc: string;
  tip: string;
  action?: string;
  actionPath?: string;
}

const STEPS_ELEVE: Step[] = [
  {
    icon: Star, color: '#00B4C8',
    title: "Bienvenue sur Kharandi ! 🎉",
    desc: "La plateforme éducative guinéenne qui t'accompagne du primaire jusqu'au BAC.",
    tip: "Ton compagnon Karamö est disponible 24h/24 pour t'aider.",
  },
  {
    icon: BookOpen, color: '#F5A623',
    title: "Bibliothèque de sujets",
    desc: "Accède à plus de 250 sujets BAC Guinée (SM, SS, SE) de 2000 à 2024, plus les sujets BEPC et d'entrée en 7ème.",
    tip: "Clique sur 'Bibliothèque' dans le menu pour commencer.",
    action: "Voir la bibliothèque", actionPath: "/bibliotheque",
  },
  {
    icon: MessageCircle, color: '#10B981',
    title: "Karamö — Ton tuteur IA",
    desc: "Pose n'importe quelle question à Karamö. Il connaît tout le programme guinéen et cherche les infos sur Internet pour toi.",
    tip: "Clique sur le bouton flottant en bas à droite pour l'ouvrir.",
    action: "Parler à Karamö", actionPath: "/",
  },
  {
    icon: Trophy, color: '#8B5CF6',
    title: "Points & Exercices",
    desc: "Fais des QCM pour gagner des points Kharandi. 1 point = 5 GNF que tu peux dépenser chez nos vendeurs Makiti.",
    tip: "100% de bonnes réponses = 50 points bonus !",
    action: "Faire un exercice", actionPath: "/exercices",
  },
  {
    icon: ShoppingBag, color: '#F5A623',
    title: "Kharandi Makiti",
    desc: "Échange tes points contre des fournitures scolaires livrées par des motards dans tout Conakry.",
    tip: "Sac à dos 95 000 GNF = 19 000 pts. Économise tes points !",
    action: "Voir la boutique", actionPath: "/makiti",
  },
];

const STEPS_BY_ROLE: Record<string, Step[]> = {
  STUDENT: STEPS_ELEVE,
  PARENT:  [
    STEPS_ELEVE[0],
    { icon: Star, color: '#00B4C8', title: "Espace Parent", desc: "Suis les progrès, notes, absences et badges de ton enfant en temps réel.", tip: "Va dans 'Mon espace parent' pour lier le compte de ton enfant.", action: "Espace parent", actionPath: "/parent" },
    { icon: Trophy, color: '#F5A623', title: "Badges & Distinctions", desc: "Télécharge les certificats d'honneur de ton enfant en PDF pour les partager ou les imprimer.", tip: "Les badges sont attribués par l'école. Contact l'administration.", },
  ],
  TUTOR: [
    STEPS_ELEVE[0],
    { icon: BookOpen, color: '#10B981', title: "Ton profil Répétiteur", desc: "Une fois validé par Kharandi, ton profil sera visible par tous les élèves de ta zone.", tip: "La validation prend moins de 24h. Tu recevras un SMS de confirmation.", },
    { icon: Star, color: '#8B5CF6', title: "Booster ta visibilité", desc: "Plus ton profil est complet (photo, matières, niveaux, zone), plus tu apparaîtras en haut des résultats.", tip: "Complète ton profil maintenant pour attirer plus d'élèves.", action: "Mon profil", actionPath: "/profil" },
  ],
  VENDOR: [
    STEPS_ELEVE[0],
    { icon: ShoppingBag, color: '#8B5CF6', title: "Ta boutique Makiti", desc: "Ajoute tes produits scolaires et fixe leurs prix en GNF. Le système convertit automatiquement en points (Prix GNF ÷ 5 = points).", tip: "Ex: Sac 95 000 GNF = 19 000 pts. Ajoute des photos pour vendre plus.", action: "Ma boutique", actionPath: "/makiti/boutique" },
    { icon: Trophy, color: '#F5A623', title: "Livraisons & Commandes", desc: "Tu seras notifié par SMS dès qu'un élève commande chez toi. Livraison par motards partenaires.", tip: "Réponds vite aux commandes pour maintenir ta note vendeur.", },
  ],
};

export const OnboardingTutorial: React.FC<{ role?: string; onClose: () => void }> = ({ role = 'STUDENT', onClose }) => {
  const normalizedRole = (role || 'STUDENT').toUpperCase();
  let lookupRole = 'STUDENT';
  if (normalizedRole === 'PARENT') {
    lookupRole = 'PARENT';
  } else if (normalizedRole === 'TUTOR' || normalizedRole === 'TEACHER' || normalizedRole === 'REPETITEUR') {
    lookupRole = 'TUTOR';
  } else if (normalizedRole === 'SELLER' || normalizedRole === 'VENDOR') {
    lookupRole = 'VENDOR';
  }

  const steps = STEPS_BY_ROLE[lookupRole] || STEPS_ELEVE;
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const isLast = current === steps.length - 1;

  const handleClose = () => {
    localStorage.setItem('kharandi_show_onboarding', 'false');
    localStorage.setItem('kharandi_onboarding_done', 'true');
    onClose();
  };

  const handleAction = () => {
    if (step.actionPath) {
      handleClose();
      window.location.href = step.actionPath;
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Header coloré */}
        <div className="relative p-8 text-center" style={{ backgroundColor: step.color + '15' }}>
          <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ backgroundColor: step.color }}>
            <step.icon size={36} className="text-white" />
          </div>
          <AnimatePresence mode="wait">
            <motion.h2 key={current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-xl font-black text-slate-900">{step.title}</motion.h2>
          </AnimatePresence>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-slate-600 text-sm leading-relaxed text-center">{step.desc}</p>
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
                <span className="text-amber-500 text-lg leading-none">💡</span>
                <p className="text-amber-800 text-xs font-medium">{step.tip}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-1.5">
            {steps.map((_, i) => (
              <div key={i} onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full cursor-pointer transition-all ${
                  i === current ? 'w-6' : 'w-2 bg-slate-200'
                }`}
                style={i === current ? { backgroundColor: step.color } : {}} />
            ))}
          </div>

          {/* Boutons */}
          <div className="flex gap-2">
            {current > 0 && (
              <button onClick={() => setCurrent(c => c - 1)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center gap-1 hover:bg-slate-50">
                <ChevronLeft size={16} /> Retour
              </button>
            )}
            {step.action && !isLast && (
              <button onClick={handleAction}
                className="flex-1 py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-1"
                style={{ backgroundColor: step.color }}>
                {step.action} <ChevronRight size={16} />
              </button>
            )}
            <button onClick={isLast ? handleClose : () => setCurrent(c => c + 1)}
              className="flex-1 py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-1"
              style={{ backgroundColor: step.color }}>
              {isLast ? "Commencer ! 🚀" : <>Suivant <ChevronRight size={16} /></>}
            </button>
          </div>

          {!isLast && (
            <button onClick={handleClose} className="w-full text-center text-xs text-slate-400 hover:text-slate-600">
              Passer le tutoriel
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Hook pour afficher l'onboarding au premier login
export const useOnboarding = (role?: string) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const shouldShow = localStorage.getItem('kharandi_show_onboarding') === 'true';
    const done       = localStorage.getItem('kharandi_onboarding_done') === 'true';
    if (shouldShow && !done) setShow(true);
  }, []);
  return { show, close: () => setShow(false) };
};
