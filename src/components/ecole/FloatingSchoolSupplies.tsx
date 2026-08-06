import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingItem {
  id: number;
  emoji: string;
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
  color: string;
  rotationDirection: number;
}

export const FloatingSchoolSupplies: React.FC = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  useEffect(() => {
    const emojis = ['🎒', '🖊️', '✏️', '📚', '📓', '🎨', '📏', '📐', '✂️', '🎓'];
    const colors = [
      'from-pink-500/10 to-transparent',
      'from-amber-500/10 to-transparent',
      'from-cyan-500/10 to-transparent',
      'from-indigo-500/10 to-transparent',
      'from-emerald-500/10 to-transparent',
    ];

    const generated: FloatingItem[] = Array.from({ length: 18 }).map((_, i) => {
      const size = Math.floor(Math.random() * 24) + 20; // 20px to 44px
      return {
        id: i,
        emoji: emojis[i % emojis.length],
        size,
        initialX: Math.random() * 100, // 0% to 100% width
        initialY: Math.random() * 100, // 0% to 100% height
        duration: Math.random() * 25 + 20, // 20s to 45s for gentle movement
        delay: Math.random() * -20, // Negative delay so they start animated
        color: colors[i % colors.length],
        rotationDirection: Math.random() > 0.5 ? 1 : -1,
      };
    });

    setItems(generated);
  }, []);

  // Adds a little interactive colorful splash whenever they click in the background
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only spawn bubbles on empty background clicks to be non-intrusive
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickColors = ['#ff007f', '#06b6d4', '#10b981', '#f59e0b', '#6366f1'];
    const randomColor = clickColors[Math.floor(Math.random() * clickColors.length)];
    
    const newBubble = {
      id: Date.now(),
      x,
      y,
      color: randomColor,
    };
    
    setBubbles(prev => [...prev, newBubble].slice(-10)); // Keep last 10
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{ minHeight: '100%' }}
    >
      {/* Dynamic Interactive Clicks */}
      <div className="absolute inset-0 pointer-events-auto" onClick={handleBackgroundClick} style={{ zIndex: 1 }} />

      {/* Colorful Moving Ambient Blobs (Rend le coloré) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-pink-400/15 via-red-300/10 to-transparent blur-[80px] animate-[pulse_8s_infinite_alternate]" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-[#fcb303]/10 via-[#18bfd6]/10 to-transparent blur-[100px] animate-[pulse_12s_infinite_alternate_2s]" />
      <div className="absolute top-[35%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-indigo-500/5 via-purple-400/10 to-transparent blur-[90px] animate-[pulse_10s_infinite_alternate_1s]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-emerald-400/10 via-teal-300/10 to-transparent blur-[110px]" />

      {/* Floating School Items */}
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute flex items-center justify-center pointer-events-auto"
          style={{
            left: `${item.initialX}%`,
            top: `${item.initialY}%`,
            fontSize: `${item.size}px`,
            WebkitUserSelect: 'none',
            userSelect: 'none',
            zIndex: 2,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.15, 0.45, 0.15],
            scale: [1, 1.15, 1],
            x: [0, Math.sin(item.id) * 60, 0],
            y: [0, Math.cos(item.id) * 60, 0],
            rotate: [0, 360 * item.rotationDirection],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ 
            scale: 1.4, 
            opacity: 0.9, 
            rotate: item.rotationDirection * 45,
            transition: { duration: 0.3 }
          }}
        >
          <div className="relative group filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] cursor-grab active:cursor-grabbing">
            {item.emoji}
            {/* Subtle glow underneath supply items */}
            <span className={`absolute -inset-2 rounded-full bg-radial ${item.color} blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </div>
        </motion.div>
      ))}

      {/* Burst Bubbles Animations on Click */}
      <AnimatePresence>
        {bubbles.map(b => (
          <motion.div
            key={b.id}
            className="absolute rounded-full border-2 mix-blend-screen pointer-events-none"
            style={{
              left: b.x,
              top: b.y,
              borderColor: b.color,
              boxShadow: `0 0 15px ${b.color}`,
              width: 10,
              height: 10,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: [0.5, 4.5], opacity: [1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
