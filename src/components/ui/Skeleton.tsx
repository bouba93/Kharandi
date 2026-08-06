import React from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular',
  width,
  height
}) => {
  const baseClasses = "bg-slate-200/60 animate-pulse";
  const variantClasses = {
    text: "rounded-md h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-2xl"
  };

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

export const HomeSkeleton = () => (
  <div className="p-6 space-y-10">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Skeleton className="md:col-span-2 lg:col-span-3 h-64" />
      <Skeleton className="h-64" />
      <div className="md:col-span-2 lg:col-span-4 grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-32" />)}
      </div>
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="md:col-span-2 h-48" />)}
    </div>
  </div>
);
