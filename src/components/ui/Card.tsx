import React from 'react';
import { motion } from 'motion/react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; whileHover?: any; onClick?: () => void }> = ({ children, className = '', whileHover, onClick }) => {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={whileHover || { y: -4, transition: { duration: 0.2 } }}
      className={`glass-card rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 overflow-hidden relative ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};
