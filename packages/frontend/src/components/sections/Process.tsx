'use client';

import { useEffect, useRef, useState } from 'react';
import { useRevealAnimation } from '@/hooks/useRevealAnimation';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Search, PenTool, Code, Rocket } from 'lucide-react';
import { type ReactNode } from 'react';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
}

const steps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery',
    description:
      'We immerse ourselves in your world, understanding your goals, audience, and competitive landscape to uncover the strategic foundation.',
    icon: <Search className="w-5 h-5" />,
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Translating insights into compelling visual narratives. Every detail is crafted with intention, balancing aesthetics with functionality.',
    icon: <PenTool className="w-5 h-5" />,
  },
  {
    number: '03',
    title: 'Develop',
    description:
      'Bringing designs to life with clean, performant code. We build scalable solutions using modern technologies and best practices.',
    icon: <Code className="w-5 h-5" />,
  },
  {
    number: '04',
    title: 'Deliver',
    description:
      'Launch with confidence. We ensure everything is polished, tested, and optimized for real-world impact and measurable results.',
    icon: <Rocket className="w-5 h-5" />,
  },
];

function ProcessStepCard({ step, index }: { step: ProcessStep; index: number }) {
  const { ref, style } = useRevealAnimation<HTMLDivElement>({
    variant: 'fade-up',
    delay: index * 150,
  });

  return (
    <div ref={ref} style={style} className="relative flex gap-6 md:gap-8">
      {/* Step number and connecting line */}
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent-primary)] text-white font-bold text-sm shrink-0 z-10">
          {step.number}
        </div>
        {index < steps.length - 1 && (
          <div className="w-[2px] flex-1 bg-[var(--border-primary)] mt-3" />
        )}
      </div>

      {/* Step content */}
      <div className="pb-12 md:pb-16">
        <div className="inline-flex items-center gap-2 text-[var(--accent-primary)] mb-2">
          {step.icon}
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] mb-3">
          {step.title}
        </h3>
        <p className="text-[var(--text-secondary)] leading-relaxed max-w-md">
          {step.description}
        </p>
      </div>
    </div>
  );
}

/**
 * Animated connecting line that draws as user scrolls through the process section.
 */
function AnimatedLine() {
  const lineRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setLineHeight(100);
      return;
    }

    const element = lineRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;

      if (elementTop < windowHeight && elementTop + elementHeight > 0) {
        const visiblePortion = Math.min(
          Math.max((windowHeight - elementTop) / (elementHeight + windowHeight * 0.5), 0),
          1
        );
        setLineHeight(visiblePortion * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  return (
    <div
      ref={lineRef}
      className="absolute left-6 top-6 bottom-6 w-[2px] origin-top pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="w-full bg-gradient-to-b from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] rounded-full transition-[height] duration-100 ease-linear"
        style={{ height: `${lineHeight}%` }}
      />
    </div>
  );
}

/**
 * Visual process section showing the 1PLUS workflow.
 * Numbered steps connected by an animated line that draws as user scrolls.
 */
export function Process() {
  return (
    <section
      id="about"
      className="py-24 md:py-32 lg:py-40 bg-[var(--bg-primary)]"
      aria-labelledby="process-heading"
    >
      <Container size="lg">
        <SectionHeading
          overline="Our Process"
          heading="How We Work"
          subheading="A proven approach that balances creativity with precision, delivering exceptional results every time."
          id="process-heading"
        />

        {/* Process steps with animated line */}
        <div className="relative max-w-2xl mx-auto lg:mx-0">
          <AnimatedLine />
          <div className="relative">
            {steps.map((step, index) => (
              <ProcessStepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
