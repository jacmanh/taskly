'use client';

import { useCallback, type ReactNode } from 'react';

// Types for props
export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

// Base button classes
const baseClasses =
  'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

// Variant class mapping
const variantClasses = {
  primary:
    'bg-accent-500 text-white shadow-sm hover:bg-accent-600 hover:shadow-md focus:ring-accent-500',
  secondary:
    'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500',
  outline:
    'border-2 border-accent-500 text-accent-600 bg-transparent hover:bg-accent-50 focus:ring-accent-500',
  ghost:
    'text-neutral-700 bg-transparent hover:bg-neutral-100 focus:ring-neutral-500',
} as const;

// Size class mapping
const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
} as const;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
}: ButtonProps) {
  // Typed handler with useCallback
  const handleClick = useCallback(() => {
    if (!disabled && !loading && onClick) {
      try {
        onClick();
      } catch (error) {
        console.error('Button click error:', error);
      }
    }
  }, [disabled, loading, onClick]);

  const isDisabled = disabled || loading;

  // Build className string, filtering out empty strings
  const classNames = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={classNames}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
