'use client';

import { Logo } from '@/components/ui/Logo';

const footerNavItems = [
  { href: '#home', label: 'Home' },
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/1plus',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Telegram',
    href: 'https://t.me/1plus',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .126 4.173l3.7 1.11 1.47 4.7a1.5 1.5 0 0 0 2.483.57l2.193-2.193 3.84 2.88a2.25 2.25 0 0 0 3.465-1.22l3.75-16.5a2.25 2.25 0 0 0-3.505-1.235z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/1plus',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Behance',
    href: 'https://behance.net/1plus',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12.5h6.588a3.5 3.5 0 1 0 0-7H1v14h7.176a4 4 0 1 0 0-8H1" />
        <path d="M15 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0zm0-1h6" />
        <path d="M15 6h6" />
      </svg>
    ),
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer
      className="relative border-t border-[var(--border-primary)]"
      role="contentinfo"
    >
      {/* Gradient separator */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-50"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Brand column */}
          <div className="space-y-6">
            <Logo size="lg" />
            <p className="max-w-md text-[var(--text-secondary)] text-base leading-relaxed">
              Premium creative digital studio specializing in branding, web development,
              and immersive digital experiences. Based in Tashkent, working worldwide.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
                  aria-label={`Follow us on ${social.label}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links & contact column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">
                Navigation
              </h3>
              <ul className="space-y-3">
                {footerNavItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)] rounded-sm"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">
                Contact
              </h3>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                <li>
                  <a
                    href="mailto:hello@1plus.uz"
                    className="hover:text-[var(--text-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)] rounded-sm"
                  >
                    hello@1plus.uz
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+998901234567"
                    className="hover:text-[var(--text-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)] rounded-sm"
                  >
                    +998 90 123 45 67
                  </a>
                </li>
                <li className="text-[var(--text-tertiary)]">
                  Tashkent, Uzbekistan
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-primary)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-tertiary)]">
            &copy; {currentYear} 1PLUS Studio. All rights reserved.
          </p>
          <p className="text-sm text-[var(--text-tertiary)]">
            Crafted with passion in Uzbekistan
          </p>
        </div>
      </div>
    </footer>
  );
}
