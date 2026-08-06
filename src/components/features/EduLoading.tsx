import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Atom, Compass, Lightbulb, Dna, RotateCw, RefreshCw } from 'lucide-react';

interface LoadingFact {
  category: 'math' | 'physics' | 'chemistry' | 'riddle' | 'general';
  title: string;
  content: string;
  extra?: string;
}

const loadingFacts: LoadingFact[] = [
  {
    category: 'math',
    title: 'Théorème de Pythagore',
    content: "a² + b² = c²",
    extra: "Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés."
  },
  {
    category: 'physics',
    title: 'Équivalence Masse-Énergie',
    content: "E = mc²",
    extra: "La célèbre formule d'Albert Einstein montrant que la masse peut se transformer en énergie."
  },
  {
    category: 'physics',
    title: 'Loi de Newton',
    content: "F = m × a",
    extra: "La force (F) est égale à la masse (m) multipliée par l'accélération (a)."
  },
  {
    category: 'math',
    title: 'Identité d’Euler',
    content: "e^(iπ) + 1 = 0",
    extra: "Considérée comme la plus belle formule des mathématiques, elle relie 5 constantes fondamentales."
  },
  {
    category: 'math',
    title: 'Le fameux Discriminant',
    content: "Δ = b² - 4ac",
    extra: "Si Δ > 0, l'équation ax² + bx + c = 0 possède deux solutions réelles distinctes !"
  },
  {
    category: 'chemistry',
    title: 'Chimie Organique',
    content: "Le Carbone (C) a une valence de 4.",
    extra: "Cela signifie qu'il peut former jusqu'à 4 liaisons chimiques, ce qui est la base de toute la vie sur Terre."
  },
  {
    category: 'chemistry',
    title: 'Humour de Laboratoire',
    content: "Pourquoi l'Hélium est le gaz le plus relaxé du tableau périodique ?",
    extra: "Parce qu'il est tellement stable qu'il ne réagit jamais avec personne !"
  },
  {
    category: 'physics',
    title: 'Humour Électrisant',
    content: "Deux atomes se promènent. L'un dit : 'Je crois que j’ai perdu un électron !'",
    extra: "L'autre demande : 'Tu en es sûr ?' — 'Oui, je suis positif !'"
  },
  {
    category: 'physics',
    title: 'Physique des Particules',
    content: "Pourquoi les neutrons boivent-ils gratuitement au café de la science ?",
    extra: "Parce que le serveur leur dit : 'Pour vous, pas de charge !'"
  },
  {
    category: 'riddle',
    title: 'Devinette de Génie',
    content: "Je commence par la nuit, je finis par le matin, et j'apparais deux fois dans l'année. Qui suis-je ?",
    extra: "La lettre 'N' (N-uit, mati-N, a-N-N-ée) !"
  },
  {
    category: 'riddle',
    title: 'Logique & Réflexion',
    content: "Qu'est-ce qui appartient à tout le monde mais que les autres utilisent plus que vous ?",
    extra: "Votre prénom !"
  },
  {
    category: 'riddle',
    title: 'Énigme Lumineuse',
    content: "Je suis grand quand je suis jeune, et petit quand je suis vieux. Qui suis-je ?",
    extra: "Une bougie (ou un crayon) !"
  },
  {
    category: 'chemistry',
    title: 'La Formule de l’Eau',
    content: "H₂O",
    extra: "L'hydrogène et l'oxygène s'associent pour former de l'eau claire pour irriguer nos esprits !"
  },
  {
    category: 'general',
    title: 'Le Saviez-Vous ?',
    content: "La lumière du Soleil met environ 8 minutes et 20 secondes pour arriver sur Terre.",
    extra: "Quand tu vois le soleil, tu le vois tel qu'il était il y a un peu plus de 8 minutes !"
  }
];

export const EduLoading: React.FC<{ 
  message?: string;
  className?: string;
}> = ({ message = "Préparation du savoir en cours...", className = "" }) => {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    // Pick a random fact on mount
    setFactIndex(Math.floor(Math.random() * loadingFacts.length));
    
    // Auto cycle every 5 seconds
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % loadingFacts.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setFactIndex((prev) => (prev + 1) % loadingFacts.length);
  };

  const currentFact = loadingFacts[factIndex];

  const getIcon = () => {
    switch (currentFact.category) {
      case 'math':
        return <Compass className="text-amber-500 animate-pulse" size={24} />;
      case 'physics':
        return <Atom className="text-blue-500 animate-spin" style={{ animationDuration: '4s' }} size={24} />;
      case 'chemistry':
        return <Dna className="text-emerald-500 animate-pulse" size={24} />;
      case 'riddle':
        return <Lightbulb className="text-yellow-500 animate-bounce" size={24} />;
      default:
        return <Atom className="text-primary animate-spin" size={24} />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 bg-slate-50/50 backdrop-blur-md rounded-[32px] border border-slate-100 max-w-xl mx-auto text-center shadow-lg relative overflow-hidden ${className}`}>
      
      {/* Dynamic graphic animation */}
      <div className="w-16 h-16 rounded-full bg-white shadow-md border border-slate-100/50 flex items-center justify-center mb-6 relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
        />
        {getIcon()}
      </div>

       {/* Loading status */}
      <div className="flex items-center gap-2 mb-4 justify-center">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#0D1B2A]/60">{message}</p>
      </div>

      <div className="min-h-[140px] px-2 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={factIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <span className="inline-block text-[11px] font-black tracking-normal px-3 py-1 bg-white border border-slate-100 shadow-sm rounded-full text-slate-800">
              {currentFact.title}
            </span>
            
            <p className="text-[17px] font-extrabold text-slate-900 leading-snug font-sans max-w-sm mx-auto">
              "{currentFact.content}"
            </p>

            {currentFact.extra && (
              <p className="text-xs font-bold text-slate-500 max-w-sm mx-auto italic">
                {currentFact.extra}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Button to cycle manually */}
      <button
        onClick={handleNext}
        className="mt-6 flex items-center gap-2 px-4 py-2 text-[11px] font-black text-slate-600 hover:text-primary bg-white border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all active:scale-95"
      >
        <RefreshCw size={12} className="animate-spin-slow text-primary" />
        Une autre formule ?
      </button>
    </div>
  );
};
