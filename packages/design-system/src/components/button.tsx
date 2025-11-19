'use client';

import { useCallback, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

// Button variants using cva for shadcn compatibility
export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-accent-500 text-white shadow-sm hover:bg-accent-600 hover:shadow-md focus:ring-accent-500',
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500',
        destructive:
          'bg-error-500 text-white shadow-sm hover:bg-error-600 hover:shadow-md focus:ring-error-500',
        outline:
          'border-2 border-accent-500 text-accent-600 bg-transparent hover:bg-accent-50 focus:ring-accent-500',
        ghost:
          'text-neutral-700 bg-transparent hover:bg-neutral-100 focus:ring-neutral-500',
        subtle:
          'border border-neutral-200 text-neutral-600 bg-white hover:bg-neutral-50 focus:ring-neutral-300',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        icon: 'h-5 w-5 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// Types for props
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}: ButtonProps) {
  // Typed handler with useCallback
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading && onClick) {
        try {
          onClick(event);
        } catch (error) {
          console.error('Button click error:', error);
        }
      }
    },
    [disabled, loading, onClick]
  );

  const isDisabled = disabled || loading;

  return (
    <button
      {...rest}
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size }), className)}
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
