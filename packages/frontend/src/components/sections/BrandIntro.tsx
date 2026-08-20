'use client';

import { useRevealAnimation } from '@/hooks/useRevealAnimation';
import { Container } from '@/components/ui/Container';

/**
 * Editorial-style brand introduction section.
 * Large statement typography with subtle animated accent elements.
 * Two-column layout on desktop: text left, visual element right.
 */
export function BrandIntro() {
  const { ref: textRef, style: textStyle } = useRevealAnimation<HTMLDivElement>({
    variant: 'fade-up',
    delay: 0,
  });
  const { ref: visualRef, style: visualStyle } = useRevealAnimation<HTMLDivElement>({
    variant: 'fade-in',
    delay: 200,
  });
  const { ref: detailRef, style: detailStyle } = useRevealAnimation<HTMLDivElement>({
    variant: 'fade-up',
    delay: 400,
  });

  return (
    <section
      className="py-24 md:py-32 lg:py-40 bg-[var(--bg-primary)] relative overflow-hidden"
      aria-labelledby="brand-intro-heading"
    >
      {/* Subtle geometric accent shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-20 right-[10%] w-32 h-32 md:w-48 md:h-48 border border-[var(--accent-primary)] opacity-10 rotate-45 rounded-lg" />
        <div className="absolute bottom-32 left-[5%] w-24 h-24 md:w-36 md:h-36 border border-[var(--accent-secondary)] opacity-10 rotate-12 rounded-full" />
        <div className="absolute top-1/2 right-[25%] w-16 h-16 md:w-24 md:h-24 border border-[var(--accent-tertiary)] opacity-10 -rotate-12" />
      </div>

      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text content - left column */}
          <div className="lg:col-span-7" ref={textRef} style={textStyle}>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent-primary)] mb-6">
              Creative Studio
            </span>
            <h2
              id="brand-intro-heading"
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--text-primary)] leading-[1.1] tracking-tight"
            >
              We craft digital experiences that{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]">
                move people
              </span>
            </h2>
            <div ref={detailRef} style={detailStyle}>
              <p className="mt-8 text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-xl">
                We believe design is more than aesthetics. It is about creating meaningful
                connections between brands and their audiences through considered, intentional work.
              </p>
            </div>
          </div>

          {/* Visual element - right column */}
          <div className="lg:col-span-5" ref={visualRef} style={visualStyle}>
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
              {/* Abstract composition */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Large circle */}
                  <div className="absolute top-[10%] left-[10%] w-[60%] h-[60%] rounded-full border-2 border-[var(--accent-primary)] opacity-30" />
                  {/* Solid accent */}
                  <div className="absolute bottom-[15%] right-[10%] w-[40%] h-[40%] rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-20" />
                  {/* Small detail */}
                  <div className="absolute top-[40%] right-[25%] w-[20%] h-[20%] rounded-full bg-[var(--accent-tertiary)] opacity-15" />
                  {/* Center element */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-xl border-2 border-[var(--text-primary)] opacity-20 rotate-12" />
                </div>
              </div>
              {/* Text watermark */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-8xl md:text-9xl font-black text-[var(--text-primary)] opacity-[0.03] select-none">
                  1+
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
