"use client";

import React from 'react';
import { COLORS } from '@/constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  let baseStyles = "py-3 px-6 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";

  if (fullWidth) baseStyles += " w-full";
  if (disabled) baseStyles += " opacity-50 cursor-not-allowed active:scale-100";

  let variantStyles = "";
  switch (variant) {
    case 'primary':
      variantStyles = `text-white shadow-lg shadow-purple-200`;
      break;
    case 'secondary':
      variantStyles = `bg-[${COLORS.secondary}] text-white`;
      break;
    case 'outline':
      variantStyles = `border-2 border-[${COLORS.primary}] text-[${COLORS.primary}] bg-transparent`;
      break;
    case 'ghost':
      variantStyles = `bg-transparent text-[${COLORS.secondary}] hover:bg-purple-50`;
      break;
  }

  // Inline style for dynamic colors to ensure Tailwind JIT works or fallback
  const style = variant === 'primary'
    ? { backgroundColor: COLORS.primary }
    : variant === 'secondary'
    ? { backgroundColor: COLORS.secondary }
    : variant === 'outline'
    ? { borderColor: COLORS.primary, color: COLORS.primary }
    : { color: COLORS.secondary };

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      style={!disabled ? style : { ...style, opacity: 0.5 }}
      {...props}
    >
      {children}
    </button>
  );
};
