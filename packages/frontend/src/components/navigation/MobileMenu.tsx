'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  activeSection: string | null;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const menuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)' },
};

export function MobileMenu({ isOpen, onClose, navItems, activeSection }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap within mobile menu
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      // Focus first link after animation
      setTimeout(() => firstLinkRef.current?.focus(), 200);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleLinkClick = (href: string) => {
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      onClose();
      // Small delay so menu closes before scroll
      setTimeout(() => {
        const offset = 80;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className="fixed inset-0 z-[var(--z-overlay)] flex flex-col"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[var(--bg-primary)] backdrop-blur-xl"
            aria-hidden="true"
          />

          {/* Header area with close button */}
          <div className="relative flex items-center justify-end px-6 h-20">
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="flex items-center justify-center w-11 h-11 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
              aria-label="Close navigation menu"
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <motion.nav
            className="relative flex-1 flex flex-col items-center justify-center gap-2 px-6"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {navItems.map((item, index) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <motion.a
                  key={item.href}
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.href);
                  }}
                  className={`block w-full max-w-xs text-center py-4 px-6 text-2xl font-semibold rounded-xl transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)] ${
                    isActive
                      ? 'text-[var(--accent-primary)] bg-[var(--bg-secondary)]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                  variants={itemVariants}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </motion.a>
              );
            })}

            {/* Theme toggle in mobile menu */}
            <motion.div className="mt-8 pt-6 border-t border-[var(--border-primary)]" variants={itemVariants}>
              <ThemeToggle />
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
