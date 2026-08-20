'use client';

import { useRevealAnimation } from '@/hooks/useRevealAnimation';

interface SectionHeadingProps {
  /** Small caps overline text */
  overline?: string;
  /** Main heading text */
  heading: string;
  /** Optional subheading paragraph */
  subheading?: string;
  /** Heading alignment */
  align?: 'left' | 'center';
  /** HTML ID for aria-labelledby */
  id?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable section heading component with consistent styling.
 * Includes overline label, main heading, optional subheading, and reveal animation.
 */
export function SectionHeading({
  overline,
  heading,
  subheading,
  align = 'left',
  id,
  className = '',
}: SectionHeadingProps) {
  const { ref, style } = useRevealAnimation<HTMLDivElement>({ variant: 'fade-up' });

  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div
      ref={ref}
      style={style}
      className={`mb-12 md:mb-16 ${alignClass} ${className}`}
    >
      {overline && (
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent-primary)] mb-4">
          {overline}
        </span>
      )}
      <h2
        id={id}
        className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight tracking-tight"
      >
        {heading}
      </h2>
      {subheading && (
        <p className="mt-4 md:mt-6 text-base md:text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          {subheading}
        </p>
      )}
    </div>
  );
}
