'use client';

import { useCallback } from 'react';

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}

export function NavLink({ href, label, isActive, onClick, className = '' }: NavLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);

      if (element) {
        const offset = 80;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }

      onClick?.();
    },
    [href, onClick]
  );

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`nav-link group relative inline-flex items-center px-1 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--border-focus)] rounded-sm ${
        isActive
          ? 'text-[var(--text-primary)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      } ${className}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="relative z-10">{label}</span>
      {/* Custom animated underline */}
      <span
        className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-500 via-magenta-500 to-yellow-500 transition-all duration-300 ease-out ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
        aria-hidden="true"
      />
    </a>
  );
}
