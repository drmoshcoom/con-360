

import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  // Fix: Add size prop to ButtonProps to allow for different button sizes.
  size?: 'default' | 'sm' | 'lg';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'default', children, className, ...props }) => {
  // Fix: Separate base and size classes to handle the new `size` prop.
  const baseClasses = 'rounded-md font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const sizeClasses = {
    default: 'px-4 py-2',
    sm: 'px-2 py-1 text-sm',
    lg: 'px-6 py-3 text-lg'
  };
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-hover focus:ring-primary',
    secondary: 'bg-secondary hover:bg-orange-600 focus:ring-secondary',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-surface text-text-primary focus:ring-primary',
  };
  return (
    <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`w-full bg-surface border border-border rounded-md px-3 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      {...props}
    />
  );
};

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-surface rounded-lg border border-border shadow-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-md m-auto border border-border" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h2 id="modal-title" className="text-xl font-bold text-text-primary">{title}</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary" aria-label="Close">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
