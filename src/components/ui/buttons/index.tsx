import React, { ReactNode } from 'react';

/**
 * Button components for consistent action styling across the app.
 */

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = "",
  ...props
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`button bg-black text-white hover:bg-gray-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const SecondaryButton: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = "",
  ...props
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`py-3 font-display font-semibold text-black border border-gray-300 rounded-xl hover:text-black hover:border-gray-400 transition-colors disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export interface FloatingIconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onClick?: () => void;
  icon: ReactNode;
  className?: string;
}

export const FloatingIconButton: React.FC<FloatingIconButtonProps> = ({
  onClick,
  icon,
  className = "",
  ...props
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-3 rounded-full bg-white hover:bg-gray-100 text-black backdrop-blur-sm transition-colors border border-gray-300 ${className}`}
    {...props}
  >
    {icon}
  </button>
);

export const TextButton: React.FC<Omit<ButtonProps, 'disabled'>> = ({
  onClick,
  children,
  className = "",
  ...props
}) => (
  <button
    onClick={onClick}
    className={`text-gray-500 text-xs hover:text-gray-700 transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);