import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 12;
      });
    }, 35);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 z-50 overflow-hidden">
      {/* Decorative blurred background bubbles */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute w-[60vh] h-[60vh] bg-primary/5 rounded-full blur-3xl -top-20 -right-20 pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-[50vh] h-[50vh] bg-secondary/5 rounded-full blur-3xl -bottom-20 -left-20 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6 text-center">
        
        {/* LE RUNNING BOOK (LIVRE QUI COURT) CHARACTER */}
        <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
          
          {/* Speed Dust / Trails behind the book */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Speed line 1 */}
            <motion.div 
              animate={{ x: [160, -60], opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear", delay: 0 }}
              className="absolute top-1/3 right-0 w-8 h-[2px] bg-slate-400/20 rounded-full"
            />
            {/* Speed line 2 */}
            <motion.div 
              animate={{ x: [160, -60], opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear", delay: 0.2 }}
              className="absolute top-1/2 right-4 w-12 h-[3px] bg-slate-400/30 rounded-full"
            />
            {/* Speed line 3 */}
            <motion.div 
              animate={{ x: [160, -60], opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "linear", delay: 0.4 }}
              className="absolute top-2/3 right-2 w-6 h-[2px] bg-slate-400/20 rounded-full"
            />
          </div>

          {/* Core Book Character */}
          <motion.div
            animate={{ 
              y: [2, -10, 2],
              rotate: [12, 15, 12],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative w-28 h-28 flex flex-col items-center justify-center animate-pulse-slow"
          >
            {/* Graduation Cap tilted on the book */}
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-7 left-3 z-30 pointer-events-none select-none"
            >
              {/* Cap Diamond */}
              <div className="w-10 h-3 bg-slate-800 rotate-[20deg] rounded-sm relative shadow-sm">
                {/* Tassel */}
                <span className="absolute right-0 top-1/2 w-[2px] h-6 bg-amber-400 origin-top rotate-[45deg] rounded-sm" />
              </div>
              {/* Cap Base */}
              <div className="w-6 h-3 bg-slate-900 mx-auto -mt-1 rounded-sm border-t border-slate-700 shadow-md" />
            </motion.div>

            {/* Book Spine / Cover */}
            <div className="absolute inset-0 bg-primary rounded-xl shadow-xl shadow-primary/20 border-r-4 border-primary/90 overflow-hidden flex flex-col justify-between p-3.5 z-10">
              
              {/* Cover texture / inside gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              {/* Book content (the profile face looking determined) */}
              <div className="relative w-full h-full flex flex-col justify-between">
                
                {/* Book label tag or ribbon */}
                <div className="w-5 h-2.5 bg-secondary rounded-sm flex items-center justify-center text-[7px] text-white font-extrabold font-mono tracking-tighter">
                  GUINEE
                </div>

                {/* Glasses & Eye */}
                <div className="flex items-center justify-end gap-1.5 mt-1 mr-1">
                  {/* Eyeglasses frame */}
                  <div className="w-7 h-7 bg-white/10 border-2 border-slate-800 rounded-full flex items-center justify-center relative shadow-inner">
                    {/* Glass glare */}
                    <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full" />
                    {/* Determined pupil */}
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2.5 h-2.5 bg-slate-900 rounded-full"
                    />
                  </div>
                  {/* Glasses connector bridge going around the edge */}
                  <div className="w-2.5 h-1 bg-slate-800 rounded-full -ml-[3px]" />
                </div>

                {/* Determined running smile/mouth */}
                <div className="flex justify-end pr-3">
                  <div className="w-4 h-1.5 border-b-2 border-slate-900 rounded-b-full bg-white/5" />
                </div>

                {/* Pages protruding on the run */}
                <div className="absolute -right-3.5 top-2 bottom-2 w-2.5 bg-slate-50 border border-slate-200 rounded-r-md flex flex-col justify-between py-1 z-0 shadow-sm">
                  <div className="h-[1px] w-full bg-slate-200" />
                  <div className="h-[1px] w-full bg-slate-200" />
                  <div className="h-[1px] w-full bg-slate-200" />
                  <div className="h-[1px] w-full bg-slate-200" />
                </div>
              </div>
            </div>

            {/* Back cover shadow shadow-gap */}
            <div className="absolute -left-1 top-1 bottom-1 w-2 bg-primary/80 rounded-l-xl z-0" />

            {/* Flying Pages Flapping in the Wind (Wings) on the sides */}
            <motion.div 
              animate={{ 
                rotateY: [0, -60, 0],
                skewX: [0, 8, 0],
                x: [-2, 4, -2]
              }}
              transition={{ duration: 0.25, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-7 top-4 bottom-4 w-7 bg-slate-100 rounded-r-lg border border-slate-200 flex flex-col justify-around py-2 shadow-md origin-left z-25"
            >
              <div className="h-[1px] w-4/5 bg-slate-300 ml-1" />
              <div className="h-[1px] w-4/5 bg-slate-300 ml-1" />
              <div className="h-[1px] w-4/5 bg-slate-300 ml-1" />
            </motion.div>

            {/* Legs Running underneath */}
            <div className="absolute bottom-[-24px] left-0 right-0 h-10 flex justify-around px-4 z-0">
              
              {/* Left Leg (Running phase A) */}
              <motion.div
                animate={{ 
                  rotate: [-55, 45, -55],
                  y: [0, -3, 0]
                }}
                transition={{ duration: 0.35, repeat: Infinity, ease: "linear" }}
                className="w-2.5 h-7 origin-top flex flex-col items-center"
              >
                {/* Thigh & shin stem */}
                <div className="w-2 h-5 bg-slate-800 rounded-full" />
                {/* Sneaker */}
                <div className="w-5 h-2.5 bg-secondary rounded-full -mt-1 ml-0.5 border border-white/20 shadow-md relative">
                  {/* White sneaker sole */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-50 rounded-b-full" />
                </div>
              </motion.div>

              {/* Right Leg (Running phase B - Offset) */}
              <motion.div
                animate={{ 
                  rotate: [45, -55, 45],
                  y: [-3, 0, -3]
                }}
                transition={{ duration: 0.35, repeat: Infinity, ease: "linear" }}
                className="w-2.5 h-7 origin-top flex flex-col items-center"
              >
                {/* Thigh & shin stem */}
                <div className="w-2 h-5 bg-slate-800 rounded-full" />
                {/* Sneaker */}
                <div className="w-5 h-2.5 bg-secondary rounded-full -mt-1 ml-0.5 border border-white/20 shadow-md relative">
                  {/* White sneaker sole */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-50 rounded-b-full" />
                </div>
              </motion.div>
            </div>

          </motion.div>

          {/* cartoon shadow underneath */}
          <motion.div 
            animate={{ 
              scaleX: [1, 0.75, 1],
              opacity: [0.3, 0.15, 0.3]
            }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-4 w-12 h-2.5 bg-slate-900/10 rounded-full blur-[2px]"
          />
        </div>

        {/* Brand Name Text with beautiful animation */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-black tracking-tight mb-2 flex items-center justify-center gap-1 drop-shadow-sm"
        >
          <span className="text-slate-800">Khar</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">andi</span>
        </motion.div>
        
        {/* Nice, bouncy motivational teaching statuses based on percentage */}
        <motion.div
          key={Math.floor(progress / 25)}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-slate-500 font-bold mb-8 text-xs min-h-[16px] uppercase tracking-wider h-4"
        >
          {progress < 25 && "Préparation des cahiers ..."}
          {progress >= 25 && progress < 50 && "Taillage des crayons ..."}
          {progress >= 50 && progress < 75 && "Ouverture de la salle d'étude ..."}
          {progress >= 75 && "Ton Camarade arrive en courant !"}
        </motion.div>

        {/* Loading Bar Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-64 h-[8px] bg-slate-200/40 rounded-full overflow-hidden relative shadow-inner mx-auto"
        >
          {/* Animated fill */}
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-primary via-blue-500 to-secondary rounded-full"
          />
          
          {/* Shimmer effect over the fill */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
          />
        </motion.div>
        
        {/* Loading text / Progress text */}
        <motion.p
          className="mt-3 text-xs font-black text-primary font-mono"
        >
          {Math.min(progress, 100)}%
        </motion.p>
      </div>
    </div>
  );
};
