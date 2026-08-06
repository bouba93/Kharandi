import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wrench, Shield, ArrowRight, Heart, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MaintenanceMode: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 0, seconds: 0 });

  useEffect(() => {
    const key = 'kharandi_maintenance_until';
    let targetTime = localStorage.getItem(key);
    
    if (!targetTime) {
      // 48 hours = 48 * 60 * 60 * 1000
      const futureTime = Date.now() + 48 * 60 * 60 * 1000;
      localStorage.setItem(key, String(futureTime));
      targetTime = String(futureTime);
    }

    const updateTimer = () => {
      const difference = Number(targetTime) - Date.now();
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const totalSeconds = Math.floor(difference / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 relative flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      
      {/* Background Orbs with Kharandi brand colors (Cyan & Secondary Yellow) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Kharandi Cyan Orb */}
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
            opacity: [0.12, 0.2, 0.12] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-[#18bfd6]/30 blur-[130px]"
        />
        {/* Kharandi Gold Orb */}
        <motion.div 
          animate={{ 
            scale: [1, 1.25, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.08, 0.15, 0.08] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-[550px] h-[550px] rounded-full bg-[#fcb303]/20 blur-[150px]"
        />

        {/* Brand Specific Dot Map Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#18bfd6_0.5px,transparent_0.5px),radial-gradient(#fcb303_0.5px,transparent_0.5px)] bg-[size:24px_24px] [background-position:0_0,12px_12px] opacity-[0.04]" />
      </div>

      {/* Main Container */}
      <div className="max-w-2xl w-full text-center z-10 flex flex-col items-center">
        
        {/* Top Notification Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8 flex items-center gap-2.5 bg-white border border-slate-100 shadow-sm px-5 py-2 rounded-full"
        >
          <span className="w-2 h-2 rounded-full bg-[#fcb303] animate-pulse" />
          <span className="text-[11px] font-sans tracking-widest font-extrabold uppercase text-slate-600">
            Mise à jour Kharandi
          </span>
        </motion.div>

        {/* Kharandi Brand Logo + Wrench Integration */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer Rotating/Pulse Glow using Kharandi Cyan/Gold */}
          <motion.div
            animate={{ 
              scale: [0.98, 1.05, 0.98],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-2 rounded-[36px] bg-gradient-to-r from-[#18bfd6]/20 to-[#fcb303]/20 blur-xl opacity-75"
          />

          {/* Dual Shell container for Kharandi Logo card */}
          <motion.div 
            animate={{ 
              y: [0, -6, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative w-32 h-32 bg-white rounded-[32px] p-[1px] shadow-xl border border-slate-100/80 flex items-center justify-center transition-transform hover:scale-105"
          >
            <img 
              src="https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55" 
              alt="Kharandi Logo" 
              className="w-20 h-20 object-contain"
              referrerPolicy="no-referrer"
            />

            {/* Inset maintenance badge replacing Gemini icon */}
            <div className="absolute -bottom-2 -right-2 bg-[#18bfd6] hover:bg-[#15adc1] text-white p-2.5 rounded-2xl shadow-lg border-2 border-white transition-all">
              <Wrench size={18} className="animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl font-black tracking-tight mb-6 text-[#0F172A] leading-tight font-sans"
        >
          Kharandi se refait une beauté !
        </motion.h1>

        {/* Countdown Visual Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-3 gap-3 md:gap-4 max-w-sm w-full mx-auto mb-8"
        >
          {/* Hours Box */}
          <div className="bg-white border border-slate-100 shadow-md rounded-[22px] px-3 py-4 flex flex-col items-center relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#18bfd6] to-[#15adc1]" />
            <span className="text-3xl md:text-4xl font-black text-[#18bfd6] font-mono tracking-tight">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mt-1.5 font-sans">
              Heures
            </span>
          </div>

          {/* Minutes Box */}
          <div className="bg-white border border-slate-100 shadow-md rounded-[22px] px-3 py-4 flex flex-col items-center relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-[#fcb303]" />
            <span className="text-3xl md:text-4xl font-black text-[#fcb303] font-mono tracking-tight">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mt-1.5 font-sans">
              Minutes
            </span>
          </div>

          {/* Seconds Box */}
          <div className="bg-white border border-slate-100 shadow-md rounded-[22px] px-3 py-4 flex flex-col items-center relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-rose-500" />
            <span className="text-3xl md:text-4xl font-black text-rose-500 font-mono tracking-tight">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mt-1.5 font-sans">
              Secondes
            </span>
          </div>
        </motion.div>

        {/* Beautiful Informative Card inside Kharandi style */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white border border-slate-100/80 rounded-3xl p-8 shadow-xl max-w-lg mb-8"
        >
          <p className="text-slate-600 leading-relaxed font-semibold md:text-md text-sm">
            Notre école virtuelle s'actualise avec de formidables fonctionnalités pour enrichir votre parcours d'apprentissage.
          </p>
          <p className="text-slate-500 leading-relaxed mt-3 md:text-sm text-xs font-medium">
            Toutes vos données et progressions d'études sont totalement sécurisées et seront disponibles instantanément à la réouverture.
          </p>

          <div className="flex items-center justify-center gap-2 mt-6 text-[#fcb303] bg-[#fcb303]/5 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider">
            <Heart size={14} className="fill-current text-rose-500 animate-pulse" />
            <span>À très vite sur Kharandi !</span>
          </div>
        </motion.div>

        {/* Discreet Entrance Link for Admins, Schools & VIPs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 flex flex-col sm:flex-row items-center gap-3 justify-center w-full max-w-md px-4"
        >
          <button 
            type="button"
            onClick={() => navigate('/ecole')}
            className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#18bfd6] to-[#15adc1] hover:from-[#15adc1] hover:to-[#18bfd6] text-white cursor-pointer shadow-lg shadow-[#18bfd6]/10 hover:shadow-xl hover:shadow-[#18bfd6]/20 transition-all text-xs font-black uppercase tracking-wider transform active:scale-95 duration-200"
          >
            <span>🎒 Accéder à Kharandi École</span>
            <ArrowRight size={13} className="transition-all transform group-hover:translate-x-1" />
          </button>

          <button 
            type="button"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto group flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-slate-200 hover:border-[#18bfd6]/30 bg-white hover:bg-[#18bfd6]/5 cursor-pointer shadow-sm text-slate-500 hover:text-[#18bfd6] transition-all text-xs font-extrabold"
          >
            <Shield size={13} className="text-[#fcb303] fill-[#fcb303]/10" />
            <span>Portail VIP / Admin</span>
          </button>
        </motion.div>

      </div>

      {/* Footer copyright in Kharandi font-mono */}
      <div className="absolute bottom-6 z-10 text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">
        © 2026 KHARANDI · TOUS DROITS RÉSERVÉS
      </div>

    </div>
  );
};
