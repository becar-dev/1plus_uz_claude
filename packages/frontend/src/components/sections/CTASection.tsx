'use client';

import { useRevealAnimation } from '@/hooks/useRevealAnimation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

/**
 * Call-to-action section with bold headline, supporting text, and primary CTA button.
 * Subtle animated gradient background for visual impact.
 */
export function CTASection() {
  const { ref: headingRef, style: headingStyle } = useRevealAnimation<HTMLDivElement>({
    variant: 'scale-in',
  });
  const { ref: ctaRef, style: ctaStyle } = useRevealAnimation<HTMLDivElement>({
    variant: 'fade-up',
    delay: 200,
  });

  return (
    <section
      className="py-24 md:py-32 lg:py-40 bg-[var(--bg-primary)] relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-primary)] opacity-[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-secondary)] opacity-[0.04] rounded-full blur-3xl" />
      </div>

      <Container size="lg">
        <div className="text-center max-w-4xl mx-auto">
          <div ref={headingRef} style={headingStyle}>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent-primary)] mb-6">
              Start a Project
            </span>
            <h2
              id="cta-heading"
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--text-primary)] leading-[1.1] tracking-tight"
            >
              Let&apos;s create something{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)]">
                extraordinary
              </span>
            </h2>
            <p className="mt-6 md:mt-8 text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
              Ready to elevate your brand? We would love to hear about your project and explore how
              we can bring your vision to life.
            </p>
          </div>

          <div ref={ctaRef} style={ctaStyle} className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#contact">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Get in Touch
              </Button>
            </a>
            <a
              href="#work"
              className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors duration-200"
            >
              View our work
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
