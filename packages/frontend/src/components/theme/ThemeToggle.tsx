'use client';

import { useTheme } from '@/lib/theme';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-0 border-none bg-transparent cursor-pointer ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      type="button"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div
        className="relative w-[52px] h-[28px] rounded-full border transition-colors duration-200"
        style={{
          background: 'var(--bg-tertiary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <div
          className="absolute top-[2px] left-[2px] w-[22px] h-[22px] rounded-full flex items-center justify-center transition-transform duration-500"
          style={{
            background: 'var(--bg-elevated)',
            boxShadow: 'var(--shadow-sm)',
            transform: isDark ? 'translateX(24px)' : 'translateX(0)',
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Sun icon */}
          <svg
            className="absolute transition-all duration-200"
            style={{
              opacity: isDark ? 0 : 1,
              transform: isDark ? 'scale(0.5) rotate(30deg)' : 'scale(1) rotate(0deg)',
              color: 'var(--color-yellow-600, #FFB300)',
            }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          {/* Moon icon */}
          <svg
            className="absolute transition-all duration-200"
            style={{
              opacity: isDark ? 1 : 0,
              transform: isDark ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-30deg)',
              color: 'var(--color-cyan-400, #26C6DA)',
            }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
