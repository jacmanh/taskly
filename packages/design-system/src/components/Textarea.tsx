'use client';

import { forwardRef, useCallback, type ReactNode } from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  error?: string;
}

const baseClasses =
  'text-sm w-full px-4 py-2 rounded-lg border-2 border-neutral-200 text-neutral-900 transition-all focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-200 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500 placeholder-neutral-400';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      className = '',
      onChange,
      onBlur,
      onFocus,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
          onChange(event);
        }
      },
      [onChange]
    );

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (onBlur) {
          onBlur(event);
        }
      },
      [onBlur]
    );

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (onFocus) {
          onFocus(event);
        }
      },
      [onFocus]
    );

    const textareaId = id || name;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={textareaId}
            className={`text-sm font-medium ${
              error ? 'text-error-600' : 'text-neutral-700'
            }`}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          className={[
            baseClasses,
            error
              ? 'border-error-500 focus:border-error-500 focus:ring-error-200'
              : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...props}
        />
        {error && <p className="text-sm text-error-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
