import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  isLoading, 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center rounded-[14px] font-bold transition-all duration-200 active:scale-[0.97] min-h-[52px] px-6";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "border-2 border-primary text-primary hover:bg-primary/10",
    danger: "bg-[#C0392B] text-white hover:bg-[#C0392B]/90",
    ghost: "text-primary hover:bg-primary/10 underline"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Chargement..." : children}
    </button>
  );
};
