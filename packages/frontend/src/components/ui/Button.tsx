'use client';

import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Full-width button */
  fullWidth?: boolean;
  /** Show loading spinner */
  loading?: boolean;
  /** Left icon element */
  leftIcon?: ReactNode;
  /** Right icon element */
  rightIcon?: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'relative overflow-hidden',
    'text-white font-semibold',
    'bg-gradient-to-r from-cyan-500 via-magenta-500 to-yellow-500',
    'bg-[length:200%_200%] bg-left',
    'hover:bg-right',
    'shadow-md hover:shadow-lg',
    'active:scale-[0.98]',
    'border-0',
  ].join(' '),
  secondary: [
    'bg-transparent',
    'font-semibold',
    'border-2 border-current',
    'text-[var(--accent-primary)]',
    'hover:bg-[var(--accent-primary)] hover:text-white',
    'active:scale-[0.98]',
  ].join(' '),
  ghost: [
    'bg-transparent',
    'font-medium',
    'text-[var(--text-secondary)]',
    'hover:text-[var(--text-primary)]',
    'hover:bg-[var(--bg-secondary)]',
    'active:scale-[0.98]',
    'border-0',
  ].join(' '),
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={[
          'inline-flex items-center justify-center',
          'rounded-lg',
          'font-medium',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          sizeClasses[size],
          variantClasses[variant],
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
        )}
        {!loading && leftIcon && <span className="button-icon">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="button-icon">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
