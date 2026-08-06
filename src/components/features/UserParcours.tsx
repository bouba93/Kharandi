import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  GraduationCap, 
  Store, 
  BookOpen, 
  ShoppingBag, 
  Award, 
  Map, 
  Play, 
  Pause,
  RotateCcw,
  Search, 
  Mail, 
  Phone, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown, 
  Check, 
  Info, 
  FileText, 
  Video, 
  BookMarked,
  Trophy,
  ExternalLink,
  ShieldAlert,
  Compass,
  ArrowRight,
  X,
  Volume2,
  MapPin,
  Globe,
  Building,
  Briefcase,
  Gift,
  Percent,
  Megaphone,
  Bell,
  MessageSquare
} from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  objective: string;
  steps: string[];
  goodToKnow: string;
}

const highlightStepText = (text: string) => {
  const wordsToHighlight = [
    'KHARANDI', 'Kharandi', 'Karamö', 'Makiti', 'Abonnement', 'Mobile Money', 
    'Orange Money', 'MTN', 'SMS', 'VISA', 'PDF', 'BAC', 'BEPC', 'WhatsApp', 
    'points', 'wallet', 'bulletins', 'Certificat', 'Certification', 'vendeur', 'parent', 'élève'
  ];
  
  const pattern = new RegExp(`\\b(${wordsToHighlight.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'gi');
  
  const parts = text.split(pattern);
  return parts.map((part, index) => {
    const isHighlight = wordsToHighlight.some(w => w.toLowerCase() === part.toLowerCase());
    if (isHighlight) {
      return (
        <span key={index} className="text-[#18bfd6] bg-[#18bfd6]/10 px-1.5 py-0.5 rounded-md font-extrabold shadow-sm border border-[#18bfd6]/10">
          {part}
        </span>
      );
    }
    return part;
  });
};

const renderSlideArtwork = (tutoId: string, step: number) => {
  switch (tutoId) {
    case "01": // S'inscrire / Créer un compte
      return (
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          {step <= 3 ? (
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-20 h-11 bg-slate-900 rounded-xl p-2 border border-slate-700 shadow-lg flex flex-col justify-between"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-slate-450 mx-auto" />
                <div className="bg-[#18bfd6] h-1.5 w-12 rounded mx-auto" />
                <div className="flex gap-1 justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#fcb303] animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                </div>
              </motion.div>
              {/* Floating key */}
              <motion.div
                animate={{ y: [-3, 3, -3], rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-amber-400 text-slate-900 border border-amber-300 shadow-md flex items-center justify-center text-xs font-black"
              >
                🔑
              </motion.div>
            </div>
          ) : (
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, rotate: -15 }}
                animate={{ scale: [1, 1.15, 1], rotate: 0 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-emerald-300"
              >
                ✓
              </motion.div>
              <span className="text-[10px] font-black text-emerald-600 mt-2.5 uppercase tracking-widest animate-pulse">
                Profil Validé
              </span>
            </div>
          )}
        </div>
      );

    case "02": // S'abonner
      return (
        <div className="relative flex flex-col items-center justify-center space-y-2">
          <motion.div 
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-1.5"
          >
            {/* Orange Money pill */}
            <div className="bg-orange-500 text-white font-black text-[9px] px-2 py-1 rounded shadow-md border border-orange-400">OM</div>
            {/* MTN pill */}
            <div className="bg-[#fcb303] text-slate-900 border border-amber-400 font-extrabold text-[9px] px-2 py-1 rounded shadow-md">MTN</div>
            {/* VISA pill */}
            <div className="bg-blue-600 text-white font-bold text-[9px] px-2 py-1 rounded shadow-md border border-blue-400">VISA</div>
          </motion.div>
          
          <div className="flex items-center gap-1.5 mt-1 text-slate-500">
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-emerald-500 text-sm"
            >
              🔒
            </motion.div>
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider animate-pulse">Paiement Écurisé</span>
          </div>
        </div>
      );

    case "03": // Dashboard
      return (
        <div className="flex flex-col items-center justify-center space-y-2 w-full px-2">
          <div className="flex gap-2.5 w-full justify-around items-end h-14">
            {[45, 80, 60, 95].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity, repeatType: "reverse" }}
                className={`w-3.5 rounded-t-lg shadow-sm ${i % 2 === 0 ? 'bg-[#18bfd6]' : 'bg-[#fcb303]'}`}
              />
            ))}
          </div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-0.5">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" /> Stats en direct
          </span>
        </div>
      );

    case "04": // Langues locales
      return (
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-1.5 justify-center h-5">
            {[0.3, 0.9, 0.5, 0.95, 0.4, 0.8].map((wave, i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [1, 3.4, 1] }}
                transition={{ duration: 1.1, delay: i * 0.12, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-3.5 bg-gradient-to-t from-[#18bfd6] to-cyan-400 rounded-full origin-center"
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
            <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }} className="text-[7.5px] font-extrabold bg-[#18bfd6]/10 border border-[#18bfd6]/20 text-[#18bfd6] px-1.5 py-0.5 rounded shadow-sm">Poular 🗩</motion.span>
            <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} className="text-[7.5px] font-extrabold bg-[#fcb303]/10 border border-[#fcb303]/20 text-[#fcb303] px-1.5 py-0.5 rounded shadow-sm">Soussou 🗩</motion.span>
            <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1.2 }} className="text-[7.5px] font-extrabold bg-emerald-50 border border-emerald-200 text-emerald-600 px-1.5 py-0.5 rounded shadow-sm">Malinké 🗩</motion.span>
          </div>
        </div>
      );

    case "05": // Cours et vidéos pédagogiques
      return (
        <div className="flex flex-col items-center justify-center space-y-1.5">
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 4, -4, 0], y: [-1, 2, -1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#18bfd6] to-cyan-500 text-white flex items-center justify-center shadow-lg relative"
            >
              <Video size={22} className="ml-0.5" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 border-2 border-cyan-300 rounded-xl"
              />
            </motion.div>
          </div>
          <span className="text-[9px] font-black text-slate-505 uppercase tracking-widest flex items-center gap-1">
            <Play size={8} className="text-secondary fill-secondary animate-pulse" /> Vidéos HD
          </span>
        </div>
      );

    case "06": // Sujets et traités d'examens nationaux
      return (
        <div className="flex flex-col items-center justify-center space-y-1.5">
          <div className="relative">
            <motion.div
              animate={{ y: [-3, 3, -3], rotate: [0, -3, 3, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-16 bg-white border-2 border-slate-200 shadow-md rounded-lg p-1.5 flex flex-col justify-between"
            >
              <div className="h-1 w-full bg-slate-300 rounded-sm" />
              <div className="h-1 w-4/5 bg-slate-200 rounded-sm" />
              <div className="bg-[#fcb303]/10 border border-[#fcb303]/30 rounded text-[7px] font-black text-[#e0a000] text-center py-0.5 uppercase tracking-tighter">
                BEPC
              </div>
              <div className="bg-[#18bfd6]/10 border border-[#18bfd6]/30 rounded text-[7px] font-black text-[#18bfd6] text-center py-0.5 uppercase tracking-tighter">
                BAC
              </div>
            </motion.div>
          </div>
        </div>
      );

    case "07": // Faire des exercices
      return (
        <div className="flex flex-col items-center justify-center space-y-1 w-full max-w-[120px]">
          <div className="space-y-1 w-full bg-white/85 p-2 rounded-xl border border-slate-100 shadow-sm">
            {[
              { label: "Q1: d(x)/dx", active: true },
              { label: "Q2: H2O", active: true },
              { label: "Q3: Newton", active: false }
            ].map((q, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[7px] font-extrabold text-slate-600">
                <motion.div 
                  animate={q.active ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center text-[5px] text-white ${
                    q.active ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-100 border-slate-300'
                  }`}
                >
                  {q.active ? "✓" : ""}
                </motion.div>
                <span>{q.label}</span>
              </div>
            ))}
          </div>
          <span className="text-[8px] font-black text-emerald-600 uppercase tracking-wider animate-pulse flex items-center gap-1 mt-1">
            +10 points 🪙
          </span>
        </div>
      );

    case "08": // Karamö, votre compagnon d'étude
      return (
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="relative">
            <motion.div 
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-12 h-12 bg-white border border-slate-100 shadow-md rounded-2xl overflow-hidden"
            >
              <img 
                src="https://lh3.googleusercontent.com/d/1T_HkF0Kf0tiZfRSXVgxTdpDmbMTVR9Wo" 
                alt="Karamö Avatar" 
                className="w-full h-full object-cover scale-110"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-1 -right-1.5 bg-[#18bfd6] text-white rounded-full p-1 border border-white shadow-sm"
            >
              <MessageSquare size={10} />
            </motion.div>
          </div>
          <span className="text-[8px] font-black text-[#18bfd6] tracking-widest uppercase animate-pulse">Prof Socratique</span>
        </div>
      );

    case "09": // Suivre une formation certifiante
      return (
        <div className="flex flex-col items-center justify-center space-y-1.5">
          <motion.div
            animate={{ rotateY: [0, 180, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="w-11 h-11 bg-gradient-to-tr from-amber-400 to-[#fcb303] text-white rounded-xl shadow-lg border-2 border-white flex items-center justify-center relative"
          >
            <Award size={20} />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-1 border-2 border-amber-300 rounded-xl"
            />
          </motion.div>
          <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-0.5">
            🎓 Certificat Pro
          </span>
        </div>
      );

    case "10": // Utiliser ses points dans Kharandi Makiti
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none flex justify-around">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: -20, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.8, delay: i * 0.7, repeat: Infinity }}
                className="text-[#fcb303] text-sm"
              >
                🪙
              </motion.div>
            ))}
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#fcb303] to-[#e09000] text-white flex items-center justify-center shadow-lg border-2 border-white relative z-10"
          >
            <ShoppingBag size={18} />
          </motion.div>
          <span className="text-[8px] font-black text-amber-600 uppercase tracking-wider mt-1.5 z-10">Boutique Makiti</span>
        </div>
      );

    case "11": // Trouver un répétiteur
      return (
        <div className="flex flex-col items-center justify-center space-y-1.5 relative w-full h-full">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }} 
              transition={{ duration: 4, repeat: Infinity }}
              className="w-14 h-14 rounded-full bg-cyan-50 border-2 border-[#18bfd6]/30 flex items-center justify-center relative overflow-hidden"
            >
              {/* Mini radar circle */}
              <motion.div
                animate={{ scale: [0.8, 2.2], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-6 h-6 rounded-full bg-[#18bfd6]/20 border border-[#18bfd6]/40"
              />
              <Map size={20} className="text-[#18bfd6]" />
            </motion.div>
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-1 -right-1 text-[#fcb303]"
            >
              <MapPin size={16} fill="currentColor" />
            </motion.div>
          </div>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Recherche Locale</span>
        </div>
      );

    case "12": // Publier un profil répétiteur
      return (
        <div className="flex flex-col items-center justify-center w-full px-2">
          <motion.div 
            animate={{ y: [-2, 2, -2], rotate: [-1, 1, -1] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            className="bg-white rounded-xl border border-slate-200/80 shadow-md p-2 w-full max-w-[130px] space-y-1.5 text-left relative"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-600 shrink-0">
                👨‍🏫
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[7.5px] font-black text-slate-800 truncate leading-tight">M. Camara</p>
                <p className="text-[5.5px] font-extrabold text-[#18bfd6] leading-none uppercase">Maths / Phys</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-1">
              <span className="text-[5px] font-black bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded border border-emerald-200">En Ligne</span>
              <span className="text-[5px] text-[#fcb303] font-bold">⭐⭐⭐⭐⭐</span>
            </div>
          </motion.div>
        </div>
      );

    case "13": // Gérer sa plateforme Kharandi École
      return (
        <div className="flex flex-col items-center justify-center space-y-1.5">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-14 h-12 bg-white rounded-xl border-2 border-slate-200 shadow-md p-1.5 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                <Building size={14} className="text-[#fcb303]" />
                <span className="text-[4.5px] font-black text-slate-400 font-mono uppercase">ADMIN PORTAL</span>
              </div>
              <div className="flex gap-1 items-end h-4 justify-center">
                <div className="w-1.5 h-3 bg-[#18bfd6] rounded-t-sm" />
                <div className="w-1.5 h-4 bg-[#fcb303] rounded-t-sm" />
                <div className="w-1.5 h-2 bg-[#18bfd6] rounded-t-sm" />
              </div>
            </motion.div>
          </div>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Dashboard Direction</span>
        </div>
      );

    case "14": // Renseigner les données des élèves (espace professeur)
      return (
        <div className="flex flex-col items-center justify-center space-y-1">
          <motion.div 
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 bg-slate-900 border border-slate-800 text-white p-2 rounded-lg shadow-lg relative text-center"
          >
            <span className="text-[5px] font-black text-[#18bfd6] uppercase tracking-widest block mb-1">Carnet De Notes</span>
            <div className="space-y-0.5 font-mono text-[7px] font-bold">
              <p className="text-emerald-400">Maths: 18/20</p>
              <p className="text-emerald-400">Phys: 19/20</p>
              <p className="text-[#fcb303]">Chimie: 16/20</p>
            </div>
          </motion.div>
          <span className="text-[8px] font-black text-cyan-600 uppercase tracking-wide">Espace Professeur</span>
        </div>
      );

    case "15": // Suivre son enfant
      return (
        <div className="flex flex-col items-center justify-center space-y-1.5 relative w-full h-full">
          <div className="relative">
            <motion.div 
              animate={{ rotate: [-15, 15, -15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              className="text-[#fcb303] bg-amber-50 border border-amber-200 p-2 rounded-2xl shadow-sm"
            >
              <Bell size={22} className="fill-amber-300" />
            </motion.div>
            <motion.div 
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center"
            >
              !
            </motion.div>
          </div>
          <span className="text-[8px] font-black text-amber-600 uppercase tracking-wider animate-pulse text-center">Alerte Parents SMS / WA</span>
        </div>
      );

    case "16": // Créer un compte vendeur Kharandi Makiti
      return (
        <div className="flex flex-col items-center justify-center space-y-1.5">
          <div className="relative">
            <motion.div 
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-13 h-11 bg-white border-2 border-slate-200 rounded-xl p-1 shadow-md flex flex-col justify-between"
            >
              <div className="bg-[#fcb303] text-white rounded text-[7px] py-[1px] font-black uppercase text-center tracking-tighter">
                K-Boutique
              </div>
              <div className="flex justify-between items-center">
                <Store size={14} className="text-[#18bfd6]" />
                <span className="text-[6.5px] text-[#fcb303] font-black">€ Profit</span>
              </div>
            </motion.div>
            <motion.span 
              animate={{ scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full text-[6px] px-1 font-bold shadow-sm"
            >
              Vendeur
            </motion.span>
          </div>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Espace Commis</span>
        </div>
      );

    case "17": // Consulter les résultats d'examens
      return (
        <div className="flex flex-col items-center justify-center space-y-1.5 w-full h-full relative">
          <div className="absolute inset-0 pointer-events-none">
            {/* confetti particles */}
            {[0, 1, 2].map((x) => (
              <motion.div
                key={x}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.4], y: [-15, -45] }}
                transition={{ duration: 2, delay: x * 0.5, repeat: Infinity }}
                className="absolute text-emerald-500 text-xs"
                style={{ left: `${30 + x * 20}%` }}
              >
                🎉
              </motion.div>
            ))}
          </div>
          <motion.div 
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="bg-white border-2 border-emerald-500 text-emerald-600 rounded-2xl px-3 py-2 shadow-lg text-center"
          >
            <span className="text-[7px] font-black uppercase tracking-widest block opacity-70">RÉSULTAT BAC</span>
            <p className="text-xs font-black tracking-wide">ADMIS(E) ! 🎓</p>
          </motion.div>
        </div>
      );

    case "18": // Accéder aux bourses d'études
      return (
        <div className="flex flex-col items-center justify-center space-y-1.5 w-full h-full">
          <motion.div 
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-1.5"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shadow">
              <Trophy size={18} className="text-amber-500 animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[6.5px] font-black bg-emerald-50 border border-emerald-250 text-emerald-600 px-1 py-0.5 rounded uppercase">Bourse active</span>
              <p className="text-[8px] font-extrabold text-slate-800">Guinée Externe</p>
            </div>
          </motion.div>
          <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Financement Guidé</span>
        </div>
      );

    case "19": // Explorer les études à l'étranger
      return (
        <div className="flex flex-col items-center justify-center space-y-1.5 relative w-full h-full overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-[#18bfd6] bg-cyan-50/50 p-2.5 rounded-full border border-cyan-150"
          >
            <Globe size={24} />
          </motion.div>
          
          <motion.div
            animate={{ x: [-40, 50], y: [10, -20] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute text-slate-700 text-xs text-center"
          >
            ✈️
          </motion.div>
          <span className="text-[8px] font-black text-cyan-600 uppercase tracking-widest text-center">Universités Internationales</span>
        </div>
      );

    case "20": // Consulter le palmarès des écoles
      return (
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-end justify-center gap-1 h-12">
            {/* Top 2 */}
            <div className="w-6 bg-slate-200 h-8 rounded-t-md flex flex-col justify-end items-center pb-1 text-[8px] font-black text-slate-600">
              2
            </div>
            {/* Top 1 */}
            <motion.div 
              animate={{ height: ["44px", "48px", "44px"] }} 
              transition={{ duration: 3, repeat: Infinity }}
              className="w-7 bg-gradient-to-t from-amber-500 to-yellow-400 h-11 rounded-t-md flex flex-col justify-end items-center pb-1 text-[9px] font-black text-white relative"
            >
              <div className="absolute -top-3.5 text-yellow-500 text-[10px] animate-bounce">👑</div>
              1
            </motion.div>
            {/* Top 3 */}
            <div className="w-6 bg-amber-700/20 h-6 rounded-t-md flex flex-col justify-end items-center pb-1 text-[8px] font-black text-amber-900">
              3
            </div>
          </div>
          <span className="text-[8px] font-black text-[#fcb303] uppercase tracking-widest">Classement Des Écoles</span>
        </div>
      );

    case "21": // Suivre l'actualité scolaire
      return (
        <div className="flex flex-col items-center justify-center space-y-1.5 relative w-full h-full">
          <motion.div
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-[#fcb303] bg-amber-50 border border-amber-200 p-2 rounded-xl shadow-inner shrink-0"
          >
            <Megaphone size={20} />
          </motion.div>
          <div className="flex justify-center items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Flash Info National</span>
          </div>
        </div>
      );

    case "22": // Profiter des Bons Plans
      return (
        <div className="flex flex-col items-center justify-center space-y-1.5 relative w-full h-full overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[#18bfd6] bg-cyan-50 border border-cyan-200 p-2.5 rounded-xl shadow relative"
          >
            <Gift size={22} className="text-[#18bfd6]" />
            <motion.div
              animate={{ opacity: [1, 0], scale: [1, 1.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border border-cyan-400 rounded-xl"
            />
          </motion.div>
          <span className="text-[8px] font-black text-[#18bfd6] uppercase tracking-widest flex items-center gap-0.5 animate-pulse">
            <Percent size={8} /> Code Promo Exclusif
          </span>
        </div>
      );

    default: // Generic beautiful spinning Compass mockup
      return (
        <div className="relative flex items-center justify-center w-full h-full">
          <motion.div
            animate={{ 
              rotateY: [0, 180, 360],
              y: [-2, 2, -2]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#18bfd6]/10 to-[#fcb303]/10 border border-[#18bfd6]/20 flex flex-col items-center justify-center shadow-md relative p-2 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-[#18bfd6]"
            >
              <Compass size={22} />
            </motion.div>
            <span className="text-[7px] font-black text-slate-500 uppercase mt-1 tracking-wider">KHARANDI</span>
            
            {/* Orbiting dots */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#fcb303]" />
              <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#18bfd6]" />
            </motion.div>
          </motion.div>
        </div>
      );
  }
};

const renderSummaryArtwork = (tutoId: string) => {
  return (
    <div className="relative flex flex-col items-center justify-center space-y-2">
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-[#fcb303] text-white flex items-center justify-center shadow-lg border-2 border-white relative"
      >
        <Award size={24} />
        <motion.div
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -inset-1 border-2 border-dashed border-amber-300 rounded-full"
        />
      </motion.div>
      <span className="text-[8px] font-black text-[#fcb303] tracking-wider uppercase bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shadow-inner animate-pulse">
        Prendre de l'avance 🚀
      </span>
    </div>
  );
};

const tutorials: Tutorial[] = [
  {
    id: "01",
    title: "Créer un compte",
    objective: "Ouvrir son espace personnel KHARANDI en quelques instants.",
    steps: [
      "Ouvrez l'application et appuyez sur Créer un compte.",
      "Choisissez votre profil : élève, parent, répétiteur, école ou vendeur.",
      "Saisissez votre numéro de téléphone.",
      "Recevez votre code de validation par SMS et saisissez-le.",
      "Complétez vos informations (nom, niveau, localisation…).",
      "Accédez immédiatement à votre espace KHARANDI."
    ],
    goodToKnow: "Votre profil détermine ce que vous voyez : choisissez bien dès le départ. Vous commencez maintenant à apprendre, progresser et réussir."
  },
  {
    id: "02",
    title: "S'abonner",
    objective: "Passer à l'expérience complète et débloquer tous les contenus premium.",
    steps: [
      "Dans votre tableau de bord, ouvrez la rubrique Abonnement.",
      "Choisissez votre formule (mensuelle, trimestrielle, semestrielle ou annuelle selon votre profil).",
      "Effectuez votre paiement via Mobile Money (Orange Money, MTN) ou carte VISA.",
      "Débloquez tous les contenus et fonctionnalités premium."
    ],
    goodToKnow: "Beaucoup de rubriques restent gratuites (résultats, bourses, actualités…). L'abonnement ouvre les cours, exercices, Karamö et le suivi personnalisé."
  },
  {
    id: "03",
    title: "Utiliser le tableau de bord",
    objective: "Retrouver toutes ses informations au même endroit et garder le contrôle.",
    steps: [
      "Depuis l'accueil, ouvrez votre Tableau de bord.",
      "Suivez vos cours en cours et reprenez là où vous vous êtes arrêté.",
      "Consultez vos points et votre wallet.",
      "Visualisez votre progression et vos résultats.",
      "Parcourez votre historique d'apprentissage et votre abonnement."
    ],
    goodToKnow: "Le tableau de bord est votre point de repère : un coup d'œil suffit pour savoir où vous en êtes."
  },
  {
    id: "04",
    title: "Utiliser KHARANDI en langues locales",
    objective: "Rendre la plateforme accessible au plus grand nombre, à l'écrit comme à l'oral.",
    steps: [
      "Ouvrez les Réglages puis Langue & accessibilité.",
      "Activez les langues locales et les options vocales.",
      "Écoutez les informations importantes lues à voix haute.",
      "Naviguez plus facilement grâce à la recherche vocale et à la messagerie audio."
    ],
    goodToKnow: "Idéal pour les parents peu ou non alphabétisés : ils restent connectés à la scolarité de leur enfant sans difficulté de lecture."
  },
  {
    id: "05",
    title: "Accéder aux cours et vidéos pédagogiques",
    objective: "Apprendre à son rythme avec des ressources fiables, disponibles 24h/24.",
    steps: [
      "Ouvrez la rubrique Sujets et traités.",
      "Sélectionnez votre niveau (primaire, collège, lycée, étudiant) et votre matière.",
      "Parcourez les cours, vidéos pédagogiques et fiches disponibles.",
      "Lisez, regardez ou téléchargez le contenu pour réviser même hors ligne.",
      "Retrouvez votre progression dans le tableau de bord pour reprendre facilement."
    ],
    goodToKnow: "Une question pendant un cours ? Ouvrez Karamö (Tuto 08) : il vous guide sans vous donner directement de réponse toute faite, pour favoriser une vraie compréhension."
  },
  {
    id: "06",
    title: "Accéder aux sujets et traités d'examens nationaux",
    objective: "Réviser efficacement avec les annales officielles et leurs corrigés.",
    steps: [
      "Ouvrez Sujets et traités puis la Bibliothèque des examens.",
      "Choisissez votre examen : Examen d’entrée en 7eme, BEPC ou BAC.",
      "Filtrez par matière et par année pour cibler vos révisions.",
      "Ouvrez le sujet en PDF ainsi que son corrigé détaillé.",
      "Accédez aux sujets et corrigés pour vous entraîner où que vous soyez."
    ],
    goodToKnow: "Travaillez un sujet en conditions réelles, puis comparez avec le corrigé. C'est la méthode la plus effective pour préparer un examen national."
  },
  {
    id: "07",
    title: "Faire des exercices et gagner des points",
    objective: "S'entraîner régulièrement, être corrigé automatiquement et être récompensé.",
    steps: [
      "Choisissez votre niveau et consultez le tableau de la valeur des points.",
      "Chaque deux semaines, traitez les nouveaux exercices soumis.",
      "Vos réponses sont corrigées automatiquement.",
      "Recevez votre score instantanément.",
      "Gagnez des points à chaque progression.",
      "Plus vous accumulez de points, plus vous pouvez acheter sur Kharandi Makiti."
    ],
    goodToKnow: "La régularité paye : un peu chaque jour rapporte plus de points qu'une longue session unique."
  },
  {
    id: "08",
    title: "Utiliser Karamö, votre compagnon d'étude",
    objective: "Être accompagné pas à pas pour vraiment comprendre, à tout moment.",
    steps: [
      "Besoin d'aide sur un exercice ? Ouvrez Karamö, votre compagnon d'étude.",
      "Posez votre question par écrit, par message vocal, ou téléchargez votre exercice.",
      "Karamö vous guide étape par étape pour mieux comprendre.",
      "Reposez vos questions autant que nécessaire : il est disponible 24h/24."
    ],
    goodToKnow: "Karamö utilise la méthode socratique : il ne donne pas la réponse toute faite, il vous aide à la trouver vous-même. C'est ainsi qu'on apprend durablement."
  },
  {
    id: "09",
    title: "Suivre une formation certifiante",
    objective: "Acquérir des compétences pratiques reconnues, utiles pour l'emploi.",
    steps: [
      "Ouvrez la rubrique Formations certifiantes.",
      "Choisissez votre formation : Bureautique – niveau de base (Word, Excel, Windows) ou niveau avancé (Excel avancé, PowerPoint).",
      "Réglez le tarif unique de la formation.",
      "Suivez les modules à votre rythme.",
      "Passez l'évaluation finale pour obtenir votre Certification KHARANDI."
    ],
    goodToKnow: "Une certification concrète valorise votre profil auprès des employeurs et complète idéalement votre parcours scolaire."
  },
  {
    id: "10",
    title: "Utiliser ses points dans Kharandi Makiti",
    objective: "Dépenser ses points gagnés contre de vraies fournitures scolaires.",
    steps: [
      "Accédez à Kharandi Makiti et vérifiez la valeur de vos points.",
      "Parcourez les articles disponibles (livres, fournitures, accessoires…).",
      "Utilisez vos points pour acheter des fournitures de valeur équivalente.",
      "Validez votre commande ; la livraison est assurée via les motards."
    ],
    goodToKnow: "Vos points ne sont pas virtuels : ils se transforment en matériel scolaire bien réel."
  },
  {
    id: "11",
    title: "Trouver un répétiteur",
    objective: "Bénéficier d'un accompagnement personnalisé près de chez soi.",
    steps: [
      "Accédez à l'espace Répétiteurs.",
      "Filtrez par matière, niveau ou localisation.",
      "Consultez les profils disponibles et leurs informations.",
      "Contactez directement le répétiteur qui vous correspond (WhatsApp / téléphone)."
    ],
    goodToKnow: "Comparez plusieurs profils avant de choisir : matière, niveau enseigné et proximité font la différence."
  },
  {
    id: "12",
    title: "Publier un profil répétiteur",
    objective: "Développer sa visibilité et son activité auprès des familles.",
    steps: [
      "Créez votre compte répétiteur puis activez votre abonnement dédié.",
      "Créez votre profil professionnel.",
      "Ajoutez vos matières, votre niveau et votre localisation.",
      "Soyez visible par les familles et les apprenants.",
      "Activez l'option Mise en avant du profil pour une visibilité accrue (optionnel)."
    ],
    goodToKnow: "Un profil complet, avec photo et matières précises, est contacté bien plus souvent. Le boost de visibilité vous place en priorité."
  },
  {
    id: "13",
    title: "Gérer sa plateforme Kharandi École",
    objective: "Digitaliser entièrement la gestion de l'établissement, sans expertise technique.",
    steps: [
      "Connectez-vous au portail École (espace direction).",
      "Enregistrez vos élèves avec un identifiant unique, et créez vos classes et matières.",
      "Laissez la plateforme calculer automatiquement notes et moyennes, et générer les bulletins digitaux.",
      "Activez les alertes bulletins : envoi automatisé aux parents par WhatsApp et e-mail.",
      "Activez les alertes paiement de scolarité : tableau de suivi avec statut en temps réel (payé / partiel / impayé).",
      "Diffusez vos alertes d'information générales aux parents (annonces, événements, réunions…).",
      "Traitez les demandes d'attestations (scolarité, congé…) directement depuis la plateforme.",
      "Pilotez le tout depuis le Dashboard direction avec statistiques de performance en temps réel."
    ],
    goodToKnow: "Le module Bulletins & Attestations (en option) ajoute l'envoi automatisé des bulletins et le suivi détaillé des paiements. L'interface inclusive garantit que tous les parents suivent, quel que soit leur niveau de lecture."
  },
  {
    id: "14",
    title: "Renseigner les données des élèves (espace professeur)",
    objective: "Permettre à chaque enseignant d'alimenter le suivi de sa classe en quelques clics.",
    steps: [
      "Connectez-vous à votre espace professeur et sélectionnez votre classe et votre matière.",
      "Saisissez les notes des élèves ; les moyennes se calculent automatiquement.",
      "Marquez les absences et retards pour déclencher une alerte absence vers les parents.",
      "Signalez une alerte baisse de niveau lorsqu'un élève décroche, pour réagir tôt.",
      "Renseignez les appréciations et le bulletin de chaque élève.",
      "Indiquez votre alerte de disponibilité (créneaux où vous êtes joignable / disponible pour la classe)."
    ],
    goodToKnow: "Renseigner régulièrement absences & notes alimente automatiquement le suivi côté parents et le dashboard direction."
  },
  {
    id: "15",
    title: "Suivre son enfant",
    objective: "Consulter la scolarité en temps réel et recevoir les alertes importantes, dans sa langue.",
    steps: [
      "Connectez-vous à votre espace parent et sélectionnez votre enfant.",
      "Consultez ses notes et bulletins mis à jour en temps réel.",
      "Recevez les alertes automatiques : absences, retards, résultats et impayés.",
      "Interrogez la plateforme par écrit ou par message vocal, en langue locale.",
      "Activez les notifications WhatsApp / e-mail pour ne rien manquer."
    ],
    goodToKnow: "Pas besoin de savoir lire couramment : la lecture vocale et les langues locales vous permettent de tout suivre simplement."
  },
  {
    id: "16",
    title: "Créer un compte vendeur Kharandi Makiti",
    objective: "Ouvrir sa boutique en ligne et accéder au marché scolaire numérique.",
    steps: [
      "Créez un compte en choisissant le profil Vendeur.",
      "Activez votre abonnement vendeur (Mobile Money ou VISA).",
      "Configurez votre boutique en fournissant impérativement votre numéro WhatsApp et votre lien Facebook pour un contact client instantané.",
      "Ajoutez vos produits : livres, fournitures, uniformes et accessoires (photos, prix, description).",
      "Activez la mise en avant de la boutique ou le boost d'un produit pour gagner en visibilité (optionnel).",
      "Recevez les commandes ; la livraison s'effectue via vos propres motards."
    ],
    goodToKnow: "Les élèves dépensent leurs points sur Makiti, les parents achètent pour leurs enfants sur Kharandi : proposer des produits attractifs augmente vos ventes."
  },
  {
    id: "17",
    title: "Consulter les résultats d'examens",
    objective: "Accéder rapidement aux résultats officiels en temps réel.",
    steps: [
      "Ouvrez la rubrique Résultats d'examens.",
      "Sélectionnez votre examen (BEPC, BAC, concours…).",
      "Entrez vos informations (numéro de candidat / identité).",
      "Accédez à vos résultats en temps réel."
    ],
    goodToKnow: "Service entièrement gratuit : inutile d'être abonné pour vérifier un résultat officiel."
  },
  {
    id: "18",
    title: "Accéder aux bourses d'études",
    objective: "Découvrir des opportunités de financement adaptées à son profil.",
    steps: [
      "Ouvrez la rubrique Bourses d'études.",
      "Parcourez les bourses disponibles.",
      "Filtrez selon votre niveau et vos objectifs.",
      "Préparez votre avenir académique en consultant les conditions et démarches."
    ],
    goodToKnow: "Consultez régulièrement : de nouvelles bourses sont ajoutées selon le profil, le niveau et les ambitions."
  },
  {
    id: "19",
    title: "Explorer les études à l'étranger",
    objective: "Découvrir les programmes et universités à l'international.",
    steps: [
      "Ouvrez la rubrique Études à l'étranger.",
      "Parcourez les programmes et universités proposés.",
      "Filtrez par pays, niveau ou domaine d'études.",
      "Consultez les opportunités et les conditions d'admission."
    ],
    goodToKnow: "Croisez cette rubrique avec les Bourses d'études (Tuto 18) pour concevoir un projet réaliste."
  },
  {
    id: "20",
    title: "Consulter le palmarès des écoles",
    objective: "Comparer les établissements selon leurs performances et résultats.",
    steps: [
      "Ouvrez la rubrique Palmarès des écoles.",
      "Choisissez la région et le niveau souhaités.",
      "Consultez le classement des établissements par performances et résultats.",
      "Utilisez ces informations pour orienter votre choix d'école."
    ],
    goodToKnow: "Un bon repère pour les parents au moment de choisir ou changer d'établissement scolaire."
  },
  {
    id: "21",
    title: "Suivre l'actualité scolaire",
    objective: "Rester informé des examens, réformes et opportunités, en Guinée et à l'international.",
    steps: [
      "Ouvrez la rubrique Actualités scolaires.",
      "Parcourez les informations sur les examens, réformes et opportunités.",
      "Activez les notifications pour être alerté des nouveautés."
    ],
    goodToKnow: "Activer les notifications vous évite de manquer une date importante d'examen ou l'ouverture d'une candidature."
  },
  {
    id: "22",
    title: "Profiter des Bons Plans",
    objective: "Accéder à des offres et opportunités ciblées selon son profil.",
    steps: [
      "Ouvrez la rubrique Bons Plans.",
      "Parcourez les offres, promotions et opportunités personnalisées.",
      "Consultez le détail d'une offre et suivez les indications pour en profiter."
    ],
    goodToKnow: "Les Bons Plans sont personnalisés : plus votre profil est complet, plus les offres proposées vous correspondent."
  }
];

const categories = [
  { name: "Tous les tutos", icon: BookMarked, ids: tutorials.map(t => t.id) },
  { name: "Pour bien démarrer", icon: Play, ids: ["01", "02", "03", "04"] },
  { name: "Apprendre & progresser", icon: GraduationCap, ids: ["05", "06", "07", "08", "09"] },
  { name: "Récompenses & marketplace", icon: ShoppingBag, ids: ["10"] },
  { name: "Répétiteurs", icon: Users, ids: ["11", "12"] },
  { name: "Kharandi École", icon: GraduationCap, ids: ["13", "14"] },
  { name: "Parents", icon: Users, ids: ["15"] },
  { name: "Vendeurs", icon: Store, ids: ["16"] },
  { name: "Opportunités & services gratuits", icon: Award, ids: ["17", "18", "19", "20", "21", "22"] }
];

const profiles = [
  {
    id: 'student',
    title: 'Élève / Étudiant',
    icon: GraduationCap,
    bgColor: 'bg-[#18bfd6]/5 border-[#18bfd6]/20 text-[#18bfd6]',
    activeBadge: 'bg-[#18bfd6] text-white',
    desc: "Je m'inscris, j'apprends avec les cours et vidéos, je m'entraîne, je gagne des points et je les dépense.",
    tutos: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]
  },
  {
    id: 'parent',
    title: 'Parent',
    icon: Users,
    bgColor: 'bg-[#fcb303]/5 border-[#fcb303]/20 text-[#fcb303]',
    activeBadge: 'bg-[#fcb303] text-white',
    desc: "Je suis la scolarité de mon enfant en temps réel, dans ma langue, et je reçois les alertes importantes.",
    tutos: ["01", "03", "04", "15"]
  },
  {
    id: 'repetiteur',
    title: 'Répétiteur de quartier',
    icon: Users,
    bgColor: 'bg-[#18bfd6]/5 border-[#18bfd6]/20 text-[#18bfd6]',
    activeBadge: 'bg-[#18bfd6] text-white',
    desc: "Je publie mon profil, je deviens visible et je suis contacté par les familles de ma région.",
    tutos: ["01", "02", "11", "12"]
  },
  {
    id: 'school',
    title: 'École partenaire',
    icon: GraduationCap,
    bgColor: 'bg-[#fcb303]/10 border-[#fcb303]/30 text-[#fcb303]',
    activeBadge: 'bg-[#fcb303] text-white',
    desc: "Je digitalise la gestion de mes classes, notes, bulletins, absences et paiements de scolarité.",
    tutos: ["13", "14"]
  },
  {
    id: 'seller',
    title: 'Vendeur (Makiti)',
    icon: Store,
    bgColor: 'bg-[#fcb303]/5 border-[#fcb303]/20 text-[#fcb303]',
    activeBadge: 'bg-[#fcb303] text-white',
    desc: "J'ouvre ma boutique scolaire en ligne et je vends mes fournitures à toute la communauté.",
    tutos: ["01", "02", "16"]
  },
  {
    id: 'all',
    title: 'Membres & Visiteurs',
    icon: Compass,
    bgColor: 'bg-[#18bfd6]/5 border-[#18bfd6]/10 text-slate-700',
    activeBadge: 'bg-[#18bfd6] text-white',
    desc: "Résultats d'examens, bourses guidées, études à l'étranger, palmarès des écoles et actualités.",
    tutos: ["17", "18", "19", "20", "21", "22"]
  }
];

const videoTutorials = [
  {
    id: "v1",
    title: "Présentation générale de Kharandi",
    duration: "2:45",
    category: "Général",
    thumbnail: "https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55",
    desc: "Découvrez toutes les opportunités de la plateforme éducative en République de Guinée.",
    views: "1.2k vues"
  },
  {
    id: "v2",
    title: "Comment s'inscrire et choisir son rôle",
    duration: "1:30",
    category: "Démarrage",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
    desc: "Guide pas-à-pas pour configurer votre compte de manière optimale.",
    views: "820 vues"
  },
  {
    id: "v3",
    title: "Gagner des points avec les Exercices Gagnants",
    duration: "3:15",
    category: "L'apprentissage",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
    desc: "Comment soumettre vos réponses et accumuler des points échangeables.",
    views: "2.4k vues"
  },
  {
    id: "v4",
    title: "Karamö : accompagnement d'étude",
    duration: "2:10",
    category: "Pédagogie",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    desc: "Demander de l'aide par message vocal, texte ou photo d'éducation.",
    views: "1.8k vues"
  }
];

export const UserParcours: React.FC = () => {
  const [activeTab, setActiveTabState] = useState<'text' | 'video'>('text');
  const [selectedProfile, setSelectedProfile] = useState<string>('student');
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous les tutos");
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTuto, setExpandedTuto] = useState<string | null>("01");

  // State for interactive slider player (Diaporama)
  const [activeSlideshowTuto, setActiveSlideshowTuto] = useState<Tutorial | null>(null);
  const [slideshowStep, setSlideshowStep] = useState<number>(1); // starts at 1, goes up to Steps + 1 (summary)
  const [slideshowAutoplay, setSlideshowAutoplay] = useState<boolean>(false);
  const [autoplayProgress, setAutoplayProgress] = useState<number>(0);
  const slideshowRef = useRef<HTMLDivElement>(null);
  
  const currentProfile = profiles.find(p => p.id === selectedProfile);
  const activeCategory = categories.find(c => c.name === selectedCategory);

  // Filter tutorials based on Search, Selected Profile, and Category
  const filteredTutorials = tutorials.filter(tuto => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchSearch = tuto.title.toLowerCase().includes(q) || 
                          tuto.objective.toLowerCase().includes(q) ||
                          tuto.steps.some(s => s.toLowerCase().includes(q)) ||
                          tuto.goodToKnow.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    if (selectedProfile && selectedProfile !== 'all') {
      if (currentProfile && !currentProfile.tutos.includes(tuto.id)) {
        return false;
      }
    }

    if (selectedCategory && selectedCategory !== "Tous les tutos") {
      if (activeCategory && !activeCategory.ids.includes(tuto.id)) {
        return false;
      }
    }

    return true;
  });

  // Slideshow Logic
  const startSlideshow = (tuto: Tutorial) => {
    setActiveSlideshowTuto(tuto);
    setSlideshowStep(1); // Start directly at Step 1 for direct informative slide play!
    setSlideshowAutoplay(true);
    setAutoplayProgress(0);
  };

  const closeSlideshow = () => {
    setActiveSlideshowTuto(null);
    setSlideshowAutoplay(false);
  };

  const handleNextSlide = () => {
    if (!activeSlideshowTuto) return;
    setAutoplayProgress(0);
    const totalSlides = activeSlideshowTuto.steps.length + 1; // steps (1..N) plus summary page (N+1)
    if (slideshowStep < totalSlides) {
      setSlideshowStep(prev => prev + 1);
    } else {
      // Loop back to step 1
      setSlideshowStep(1);
    }
  };

  const handlePrevSlide = () => {
    if (!activeSlideshowTuto) return;
    setAutoplayProgress(0);
    const totalSlides = activeSlideshowTuto.steps.length + 1;
    if (slideshowStep > 1) {
      setSlideshowStep(prev => prev - 1);
    } else {
      setSlideshowStep(totalSlides);
    }
  };

  // Scroll slideshow into view when triggered
  useEffect(() => {
    if (activeSlideshowTuto && slideshowRef.current) {
      const timer = setTimeout(() => {
        slideshowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeSlideshowTuto]);

  // Autoplay progression simulation
  useEffect(() => {
    let interval: any;
    if (slideshowAutoplay && activeSlideshowTuto) {
      interval = setInterval(() => {
        setAutoplayProgress(prev => {
          if (prev >= 100) {
            handleNextSlide();
            return 0;
          }
          return prev + 2; // Increments to reach 100% in ~5 seconds (2.5 seconds * 2 = 5s)
        });
      }, 100);
    } else {
      setAutoplayProgress(0);
    }
    return () => clearInterval(interval);
  }, [slideshowAutoplay, slideshowStep, activeSlideshowTuto]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 font-sans">
      
      {/* Elegantly Crafted Hero Banner - Visual Identity using Kharandi's colors & Guinea Ribbons */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] p-6 md:p-10 mb-8 bg-gradient-to-br from-white via-[#18bfd6]/10 to-[#fcb303]/15 text-slate-800 shadow-xl border border-[#18bfd6]/20"
      >
        {/* Guinea Flag Ribbon Styling */}
        <div className="absolute top-0 left-0 w-full h-[6px] flex">
          <div className="w-1/3 h-full bg-[#E51C23]"></div> {/* Red */}
          <div className="w-1/3 h-full bg-[#FFEB3B]"></div> {/* Yellow */}
          <div className="w-1/3 h-full bg-[#4CAF50]"></div> {/* Green */}
        </div>
        
        {/* Decorative Floating Brand Blobs */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#18bfd6]/20 rounded-full blur-[60px]" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-[#fcb303]/10 rounded-full blur-[60px]" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#18bfd6] text-white px-3 py-1.5 rounded-full shadow-md">
                KHARANDI
              </span>
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" /> 
                Plateforme Éducative Nationale — Guinée
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none text-slate-800">
              Guide Utilisateur & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18bfd6] to-[#fcb303] drop-shadow-sm font-black">
                Carte de Navigation interactive
              </span>
            </h1>
            
            <p className="text-slate-600 font-semibold text-sm leading-relaxed max-w-xl">
              Découvrez la carte facilitatrice de navigation Kharandi. Chaque type d'utilisateur peut visualiser pas à pas son chemin pédagogique grâce à des tutoriels interactifs.
            </p>
            
            {/* Slogan pillbox */}
            <div className="inline-flex items-center gap-2 bg-[#18bfd6]/10 px-4 py-2 rounded-2xl border border-[#18bfd6]/20 text-slate-700 font-black text-xs">
              <Compass size={14} className="text-[#18bfd6]" />
              KHARANDI, ton camarade scolaire !
            </div>
          </div>

          {/* Clean Light-Themed Support/Contact Information Cards */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200 shrink-0 w-full lg:w-80 space-y-3 shadow-lg">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#fcb303] border-b border-slate-100 pb-2">
              Assistance & Support
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
              <Mail size={14} className="text-[#18bfd6]" />
              <a href="mailto:contactkharandi@gmail.com" className="hover:text-[#18bfd6] transition-colors">contactkharandi@gmail.com</a>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-650 font-bold">
              <Phone size={14} className="text-emerald-500 animate-pulse" />
              <a href="tel:+224626187117" className="hover:text-emerald-600 transition-colors">+224 626 187 117</a>
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              République de Guinée, Conakry
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mode Navigation Tabs Switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#18bfd6]/5 p-1.5 rounded-2xl flex gap-1.5 border border-[#18bfd6]/10 shadow-sm w-full max-w-sm">
          <button 
            type="button"
            onClick={() => setActiveTabState('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-xs transition-all duration-300 ${
              activeTab === 'text' 
                ? 'bg-white text-slate-800 shadow-md border border-[#18bfd6]/10' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={15} className="text-[#18bfd6]" />
            Modes Diapos / Guides
          </button>
          <button 
            type="button"
            onClick={() => setActiveTabState('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-xs transition-all duration-300 ${
              activeTab === 'video' 
                ? 'bg-white text-slate-800 shadow-md border border-[#fcb303]/15' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video size={15} className="text-[#fcb303]" />
            Tutoriels Vidéos
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* INTERACTIVE TEXT DIAPORAMA / GUIDES RENDERER */}
        {activeTab === 'text' ? (
          <motion.div
            key="text-guides-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            
            {/* Interactive "Carte de Navigation" Picker */}
            <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <Map className="text-[#18bfd6]" size={20} />
                <h2 className="text-xl font-bold text-slate-800 select-none">
                  Quel est votre profil sur Kharandi ?
                </h2>
              </div>
              <p className="text-slate-500 font-semibold text-xs mb-6 max-w-3xl leading-relaxed">
                Cliquez sur votre situation ci-dessous ou parcourez tous les guides disponibles. Chantez la progression, vous allez voir sa carte interactive correspondante.
              </p>

              {/* Grid of Profile Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map(prof => {
                  const IconComp = prof.icon;
                  const isCurActive = selectedProfile === prof.id;
                  return (
                    <button
                      key={prof.id}
                      onClick={() => {
                        setSelectedProfile(prof.id);
                        setSelectedCategory("Tous les tutos"); // Reset category filter
                      }}
                      className={`p-4 rounded-2xl border-2 flex items-start gap-4 text-left transition-all duration-300 relative ${
                        isCurActive 
                          ? 'bg-[#18bfd6]/10 border-[#18bfd6] shadow-md scale-[1.01]' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        isCurActive ? 'bg-[#18bfd6] text-white' : 'bg-[#18bfd6]/5 text-[#18bfd6]'
                      }`}>
                        <IconComp size={18} />
                      </div>

                      <div className="space-y-1 pr-6 flex-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          PROFIL {prof.id === 'all' ? 'COMMUN' : ''}
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-800 leading-tight">{prof.title}</h3>
                        <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                          {prof.desc}
                        </p>
                      </div>

                      <span className="absolute top-4 right-4 bg-slate-100 text-slate-600 font-black text-[9px] px-2 py-1 rounded-md">
                        {prof.tutos.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INTRODUCING EXQUISITE FLOATING DIAPORAMA PLAYER BAR (Active Slideshow Screen) */}
            <AnimatePresence>
              {activeSlideshowTuto && (
                <motion.div
                  ref={slideshowRef}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border-2 border-[#18bfd6]/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
                >
                  {/* Guinea colors accent border interior */}
                  <div className="absolute top-0 left-0 w-full h-[4px] flex">
                    <div className="w-1/3 bg-[#E51C23]" />
                    <div className="w-1/3 bg-[#FFEB3B]" />
                    <div className="w-1/3 bg-[#4CAF50]" />
                  </div>

                  {/* Backdrop lights */}
                  <div className="absolute -right-20 -bottom-20 w-44 h-44 bg-[#fcb303]/10 rounded-full blur-[60px]" />
                  <div className="absolute -left-20 -top-20 w-44 h-44 bg-[#18bfd6]/10 rounded-full blur-[60px]" />

                  {/* Header action controls */}
                  <div className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#18bfd6] text-white flex items-center justify-center font-black text-xs shadow-md">
                        {activeSlideshowTuto.id}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Lecteur de Diaporama</span>
                        <h4 className="font-extrabold text-sm md:text-base text-slate-850 leading-tight">
                          {activeSlideshowTuto.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSlideshowAutoplay(!slideshowAutoplay)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                          slideshowAutoplay 
                            ? 'bg-[#fcb303] text-white hover:bg-[#fcb303]/90' 
                            : 'bg-[#18bfd6]/15 text-[#18bfd6] hover:bg-[#18bfd6]/20'
                        }`}
                        title={slideshowAutoplay ? "Pause automatique" : "Lancer le défilement automatique"}
                      >
                        {slideshowAutoplay ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
                        <span>{slideshowAutoplay ? "Pause Auto" : "Lecture Auto"}</span>
                      </button>

                      <button
                        onClick={closeSlideshow}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Fermer le lecteur"
                        type="button"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Main Slide show Stage */}
                  <div className="relative z-10 min-h-[300px] md:min-h-[260px] flex flex-col justify-between bg-gradient-to-b from-slate-50 to-[#18bfd6]/5 rounded-2xl p-6 border border-[#18bfd6]/10 overflow-hidden shadow-sm">
                    
                    {/* Auto progression bar */}
                    {slideshowAutoplay && (
                      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#18bfd6] to-[#fcb303] transition-all duration-100 rounded-t-lg" style={{ width: `${autoplayProgress}%` }} />
                    )}

                    <div className="flex-1 flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        
                        {/* SLIDES 1..N: STEPS DETAILED */}
                        {slideshowStep > 0 && slideshowStep <= activeSlideshowTuto.steps.length && (
                          <motion.div
                            key={`slide-step-${slideshowStep}`}
                            initial={{ opacity: 0, scale: 0.97, x: 25 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.97, x: -25 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full py-2"
                          >
                            <div className="md:col-span-8 space-y-4">
                              <div className="flex items-center gap-3">
                                <motion.span 
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#18bfd6] to-cyan-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-[#18bfd6]/20"
                                >
                                  {slideshowStep}
                                </motion.span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                  Étape {slideshowStep} de {activeSlideshowTuto.steps.length}
                                </span>
                              </div>

                              <h3 className="text-sm md:text-base lg:text-lg font-extrabold text-slate-800 leading-relaxed pr-2">
                                {highlightStepText(activeSlideshowTuto.steps[slideshowStep - 1])}
                              </h3>
                            </div>

                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className="md:col-span-4 h-28 md:h-34 w-full flex items-center justify-center relative bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 overflow-hidden shadow-inner p-2 shrink-0"
                            >
                              {renderSlideArtwork(activeSlideshowTuto.id, slideshowStep)}
                            </motion.div>
                          </motion.div>
                        )}

                        {/* SLIDE N+1: SUMMARY GOOD TO KNOW */}
                        {slideshowStep === activeSlideshowTuto.steps.length + 1 && (
                          <motion.div
                            key="slide-summary"
                            initial={{ opacity: 0, scale: 0.97, x: 25 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.97, x: -25 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full py-2"
                          >
                            <div className="md:col-span-8 space-y-4">
                              <div className="flex items-center gap-2 text-amber-500">
                                <Info size={16} className="animate-bounce" />
                                <span className="text-xs font-black uppercase tracking-wider">Astuce & Bon à savoir</span>
                              </div>

                              <p className="text-slate-700 font-bold text-xs md:text-sm leading-relaxed max-w-2xl">
                                {activeSlideshowTuto.goodToKnow}
                              </p>

                              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#18bfd6] animate-pulse">
                                <Check size={14} /> Tous les parcours sont intégralement expliqués et accessibles.
                              </div>
                            </div>

                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className="md:col-span-4 h-28 md:h-34 w-full flex items-center justify-center relative bg-gradient-to-br from-[#18bfd6]/10 to-[#fcb303]/10 backdrop-blur-md rounded-2xl border border-white/85 overflow-hidden shadow-inner shrink-0 p-2"
                            >
                              {renderSummaryArtwork(activeSlideshowTuto.id)}
                            </motion.div>
                          </motion.div>
                        )}

                      </AnimatePresence>
                    </div>

                    {/* Left & Right Stage Side Panels */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 relative z-10 mt-2">
                      <div className="flex items-center gap-1.5 text-xs">
                        {Array.from({ length: activeSlideshowTuto.steps.length + 1 }).map((_, stepIdx) => {
                          const targetStep = stepIdx + 1;
                          return (
                            <button
                              key={stepIdx}
                              onClick={() => {
                                setAutoplayProgress(0);
                                setSlideshowStep(targetStep);
                              }}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                slideshowStep === targetStep ? 'w-6 bg-[#18bfd6]' : 'w-2 bg-slate-200 hover:bg-slate-400'
                              }`}
                              title={targetStep === activeSlideshowTuto.steps.length + 1 ? "Bon à savoir" : `Étape ${targetStep}`}
                              type="button"
                            />
                          );
                        })}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handlePrevSlide}
                          className="p-2 bg-white text-slate-600 hover:text-slate-800 rounded-xl shadow-sm border border-slate-200 hover:border-slate-300 active:scale-95 transition-all"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <button
                          onClick={handleNextSlide}
                          className="px-4 py-2 bg-gradient-to-r from-[#18bfd6] to-cyan-500 hover:from-[#18bfd6]/95 hover:to-cyan-500/95 text-white rounded-xl shadow-md font-extrabold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                        >
                          <span>Suivant</span>
                          <ChevronRight size={14} className="animate-pulse" />
                        </button>
                      </div>
                    </div>

                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter controls & Search */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              {/* Category selector slider */}
              <div className="flex gap-2 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none shrink-1 max-w-full">
                {categories.map(cat => {
                  const CatIcon = cat.icon;
                  const isCatActive = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
                        isCatActive 
                          ? 'bg-[#18bfd6] text-white shadow-md shadow-[#18bfd6]/20' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      <CatIcon size={13} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative shrink-0 lg:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher un tutoriel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#18bfd6] focus:bg-white rounded-xl outline-none transition-all font-semibold text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Tutorials List Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredTutorials.length > 0 ? (
                filteredTutorials.map((tuto) => {
                  const isExpanded = expandedTuto === tuto.id;
                  const isBeingPlayed = activeSlideshowTuto?.id === tuto.id;
                  return (
                    <motion.div
                      layout="position"
                      key={tuto.id}
                      className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                        isExpanded ? 'border-[#18bfd6] shadow-sm ring-1 ring-[#18bfd6]/10' : 'border-slate-205'
                      }`}
                    >
                      {/* Accordion Header */}
                      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 text-left gap-4 select-none">
                        
                        <div className="flex items-center gap-3.5 cursor-pointer flex-1" onClick={() => setExpandedTuto(isExpanded ? null : tuto.id)}>
                          {/* Circle Tuto ID label with Guinea Colors Accents */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                            isExpanded ? 'bg-[#18bfd6] text-white scale-105 shadow-md shadow-[#18bfd6]/10' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {tuto.id}
                          </div>
                          
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                              Guide Pratique
                            </span>
                            <h3 className="text-sm md:text-base font-extrabold text-slate-850 leading-tight">
                              {tuto.title}
                            </h3>
                          </div>
                        </div>

                        {/* Interactive diaporama play and accordion trigger button */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => startSlideshow(tuto)}
                            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm ${
                              isBeingPlayed 
                                ? 'bg-[#fcb303] text-white hover:bg-[#fcb303]/90'
                                : 'bg-[#18bfd6] text-white hover:bg-[#18bfd6]/95'
                            }`}
                          >
                            <Play size={11} fill="currentColor" />
                            <span>Démarrer le Diapo</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedTuto(isExpanded ? null : tuto.id)}
                            className={`p-2 rounded-xl transition-all ${
                              isExpanded ? 'rotate-180 bg-[#18bfd6]/5 text-[#18bfd6]' : 'bg-slate-50 text-slate-500'
                            }`}
                          >
                            <ChevronDown size={15} />
                          </button>
                        </div>

                      </div>

                      {/* Accordion Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-slate-100"
                          >
                            <div className="p-5 md:p-6 space-y-5 bg-slate-50/50">
                              
                              {/* Objective Box */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Objectif principal</span>
                                <p className="text-xs md:text-sm font-bold text-slate-800 leading-normal">
                                  {tuto.objective}
                                </p>
                              </div>

                              <div className="h-[1px] bg-slate-100" />

                              {/* Steps detailed */}
                              <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-3">Étapes</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {tuto.steps.map((step, index) => (
                                    <div key={index} className="bg-white border border-slate-100 p-3 rounded-xl flex gap-3 shadow-sm">
                                      <span className="w-6 h-6 rounded-lg bg-[#18bfd6]/10 text-[#18bfd6] font-bold text-xs flex items-center justify-center shrink-0">
                                        {index + 1}
                                      </span>
                                      <p className="text-slate-600 font-semibold text-xs leading-relaxed">
                                        {step}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* good to know bottom segment */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                                <div className="md:col-span-2 bg-[#fcb303]/10 border border-[#fcb303]/20 p-3 rounded-xl flex gap-2.5 text-slate-700">
                                  <Info size={16} className="shrink-0 mt-0.5 text-[#fcb303]" />
                                  <div className="space-y-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-wider block text-slate-600">Bon à savoir</span>
                                    <p className="text-[11px] font-semibold leading-relaxed text-slate-600">
                                      {tuto.goodToKnow}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-end">
                                  <div className="text-right px-4 py-2 border border-[#18bfd6]/15 rounded-xl bg-white">
                                    <span className="text-[10px] font-bold text-[#18bfd6] block">COMPAGNON SCOLAIRE</span>
                                    <span className="text-[11px] font-black text-slate-800 block">KHARANDI</span>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-slate-50 border border-slate-200 border-dashed rounded-3xl">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Search size={22} />
                  </div>
                  <h3 className="text-md font-bold text-slate-700">Aucun guide trouvé</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Essaye d'autres mots-clés ou modifie tes filtres.
                  </p>
                </div>
              )}
            </div>

            {/* Slogan footnote */}
            <div className="bg-[#18bfd6]/5 border border-[#18bfd6]/10 rounded-2xl p-5 text-center space-y-1">
              <h3 className="font-extrabold text-sm text-slate-800">Un parcours unique pour chaque usager</h3>
              <p className="text-slate-500 text-xs max-w-xl mx-auto leading-relaxed">
                Kharandi permet à chaque profil d'apprendre efficacement, de suivre avec inclusion, d'être visible, de digitaliser son travail sans friction et de vendre sur un marché dédié.
              </p>
            </div>

          </motion.div>
        ) : (
          
          /* MULTIMEDIA VIDEO TUTORIALS RENDERER */
          <motion.div
            key="video-guides-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Rich Video Header */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-5 justify-between shadow-sm">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#18bfd6] bg-[#18bfd6]/10 px-3 py-1 rounded-full inline-block">
                  Aide animée
                </span>
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Vidéos et visuels de démonstration</h2>
                <p className="text-slate-500 font-semibold text-xs max-w-xl leading-relaxed">
                  Naviguez et visualisez pas à pas le fonctionnement de l'application grâce aux tutoriels animés pensés pour faciliter l'adoption de KHARANDI.
                </p>
              </div>
              <div className="bg-[#fcb303] text-white px-4 py-3 rounded-xl flex items-center gap-2 font-black text-xs shadow-md shadow-[#fcb303]/10 shrink-0 select-none">
                <span>Leçons Pratiques (~2 min)</span>
              </div>
            </div>

            {/* Video List Grid with Guinea Accents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {videoTutorials.map((vid) => (
                <div 
                  key={vid.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
                >
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden shrink-0">
                    <img 
                      src={vid.thumbnail} 
                      alt={vid.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent animate-fade-in" />
                    
                    <span className="absolute bottom-2.5 right-2 text-[10px] font-bold bg-slate-900/80 text-white px-2 py-0.5 rounded-md">
                      {vid.duration}
                    </span>

                    <span className="absolute top-2.5 left-2 bg-white text-[#18bfd6] font-bold text-[9px] px-2 py-0.5 rounded-md shadow-sm">
                      {vid.category}
                    </span>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#18bfd6] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative cursor-pointer">
                        <Play size={15} fill="currentColor" className="ml-0.5" />
                        <div className="absolute inset-0 bg-[#18bfd6]/20 rounded-full scale-110 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-xs text-slate-800 leading-tight group-hover:text-[#18bfd6] transition-colors line-clamp-2">
                        {vid.title}
                      </h3>
                      <p className="text-slate-400 font-semibold text-[11px] leading-relaxed line-clamp-2">
                        {vid.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                      <span>Kharandi Tuto</span>
                      <span className="font-semibold text-slate-500">
                        {vid.views}
                      </span>
                    </div>
                  </div>

                  {/* Bientôt Disponible Badge */}
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl border border-[#18bfd6]/30">
                    <span className="text-[#fcb303] font-extrabold text-xs tracking-wider uppercase mb-1">Bientôt disponible</span>
                    <p className="text-slate-650 text-[11px] font-bold px-2 leading-relaxed">
                      Nos équipes préparent activement ces vidéos explicatives.
                    </p>
                  </div>

                </div>
              ))}
            </div>

            {/* Need manual WhatsApp guide */}
            <div className="border border-[#18bfd6]/15 rounded-2xl p-5 bg-[#18bfd6]/5 flex flex-col sm:flex-row items-center gap-4 justify-between max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#18bfd6] flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                  <Volume2 size={18} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-xs text-slate-800">Assistance vocale ou démonstration ?</h4>
                  <p className="text-slate-500 font-semibold text-[11px] max-w-md leading-relaxed">
                    Vous souhaitez en savoir plus sur un module en particulier ? Notre messagerie locale sur Conakry est en ligne.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => window.open('https://wa.me/224626187117', '_blank')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5 justify-center"
              >
                Échanger sur WhatsApp <ExternalLink size={13} />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
