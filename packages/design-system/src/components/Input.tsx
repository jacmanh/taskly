'use client';

import { useCallback, type ReactNode, forwardRef } from 'react';

// Types for props
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  placeholder?: string;
  error?: string;
  label?: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  /**
   * If true, no border is shown until focus
   */
  borderless?: boolean;
  onChange?:
    | ((value: string | number) => void)
    | ((event: React.ChangeEvent<HTMLInputElement>) => void);
}

// Base input classes (with borders)
const baseClasses =
  'w-full px-4 py-2 rounded-lg border-2 border-neutral-200 text-neutral-900 transition-all focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-200 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500';

// Borderless input classes (no border until focus)
const borderlessClasses =
  'w-full px-4 py-2 rounded-lg border-2 border-transparent text-neutral-900 transition-all focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-200 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500';

// Error state classes
const errorClasses =
  'border-error-500 focus:border-error-500 focus:ring-error-200';

// Placeholder classes
const placeholderClasses = 'placeholder-neutral-400';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder = '',
      disabled = false,
      required = false,
      readOnly = false,
      error,
      label,
      className = '',
      id,
      name,
      icon,
      iconPosition = 'left',
      borderless = false,
      onChange,
      onBlur,
      onFocus,
      ...rest
    },
    ref
  ) => {
    // Typed handler for onChange
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled && !readOnly && onChange) {
          try {
            const inputValue = e.target.value;

            // Check if onChange accepts ChangeEvent (react-hook-form) or value
            if (onChange.length === 1 && typeof onChange !== 'function') {
              // For value-based onChange
              if (type === 'number' && inputValue) {
                (onChange as (value: string | number) => void)(
                  Number(inputValue)
                );
              } else {
                (onChange as (value: string | number) => void)(inputValue);
              }
            } else {
              // For event-based onChange (react-hook-form)
              (
                onChange as (event: React.ChangeEvent<HTMLInputElement>) => void
              )(e);
            }
          } catch (error) {
            console.error('Input change error:', error);
          }
        }
      },
      [disabled, readOnly, onChange, type]
    );

    // Typed handler for onBlur
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (onBlur) {
          try {
            onBlur(e);
          } catch (error) {
            console.error('Input blur error:', error);
          }
        }
      },
      [onBlur]
    );

    // Typed handler for onFocus
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (onFocus) {
          try {
            onFocus(e);
          } catch (error) {
            console.error('Input focus error:', error);
          }
        }
      },
      [onFocus]
    );

    // Build className string, filtering out empty strings
    const classNames = [
      borderless ? borderlessClasses : baseClasses,
      placeholderClasses,
      error ? errorClasses : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const inputId = id || name;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className={`text-sm font-medium ${
              error ? 'text-error-600' : 'text-neutral-700'
            }`}
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            className={`${classNames} text-sm ${icon && iconPosition === 'left' ? 'pl-10' : ''} ${icon && iconPosition === 'right' ? 'pr-10' : ''}`}
            {...rest}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-error-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
