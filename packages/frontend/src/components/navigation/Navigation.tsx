'use client';

import { useState, useMemo } from 'react';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useActiveSection } from '@/hooks/useActiveSection';

const NAV_ITEMS = [
  { href: '#home', label: 'Home' },
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.href.replace('#', ''));

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { direction, isAtTop } = useScrollDirection({ threshold: 10 });
  const activeSection = useActiveSection({ sectionIds: SECTION_IDS, offset: 100 });

  const isHidden = direction === 'down' && !isAtTop && !isMobileMenuOpen;
  const isScrolled = !isAtTop;

  const headerClasses = useMemo(() => {
    const base = [
      'fixed top-0 left-0 right-0',
      'z-[var(--z-sticky)]',
      'transition-all duration-300 ease-out',
    ];

    if (isHidden) {
      base.push('-translate-y-full');
    } else {
      base.push('translate-y-0');
    }

    if (isScrolled) {
      base.push(
        'bg-[var(--bg-primary)]/80 backdrop-blur-xl',
        'border-b border-[var(--border-primary)]',
        'shadow-sm'
      );
    } else {
      base.push('bg-transparent border-b border-transparent');
    }

    return base.join(' ');
  }, [isHidden, isScrolled]);

  return (
    <>
      <header className={headerClasses} role="banner">
        <nav
          className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8"
          aria-label="Primary navigation"
        >
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Desktop Nav Links - Center */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={activeSection === item.href.replace('#', '')}
              />
            ))}
          </div>

          {/* Right side - Theme Toggle + CTA + Mobile Hamburger */}
          <div className="flex items-center gap-4">
            {/* Theme toggle - desktop only */}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            {/* CTA Button - desktop only */}
            <div className="hidden lg:block">
              <Button variant="primary" size="sm">
                Let&apos;s Talk
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={NAV_ITEMS}
        activeSection={activeSection}
      />

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-20" aria-hidden="true" />
    </>
  );
}
