'use client';

import { useRevealAnimation } from '@/hooks/useRevealAnimation';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 100, suffix: '%', label: 'Client Satisfaction' },
  { value: 5, suffix: '+', label: 'Years of Excellence' },
  { value: 12, suffix: '+', label: 'Team Members' },
];

interface DifferentiatorItem {
  title: string;
  description: string;
}

const differentiators: DifferentiatorItem[] = [
  {
    title: 'Premium Quality',
    description:
      'Every pixel, every interaction, every line of code is held to the highest standard. We do not compromise on quality.',
  },
  {
    title: 'Full-Service Studio',
    description:
      'From initial concept through to final delivery, we handle every aspect of your project under one roof.',
  },
  {
    title: 'Strategic Thinking',
    description:
      'We combine creative excellence with business acumen, ensuring our work delivers measurable impact.',
  },
];

function DifferentiatorCard({ item, index }: { item: DifferentiatorItem; index: number }) {
  const { ref, style } = useRevealAnimation<HTMLDivElement>({
    variant: 'fade-up',
    delay: index * 120,
  });

  return (
    <div
      ref={ref}
      style={style}
      className="relative p-6 md:p-8 rounded-2xl bg-[var(--surface-card)] border border-[var(--border-primary)]"
    >
      <div className="absolute -top-3 -left-1 font-display text-5xl md:text-6xl font-black text-[var(--accent-primary)] opacity-10">
        {String(index + 1).padStart(2, '0')}
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-[var(--text-primary)] mb-3">
        {item.title}
      </h3>
      <p className="text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
    </div>
  );
}

/**
 * "Why 1PLUS" differentiator section with animated statistics and proof points.
 * Large background watermark for visual depth.
 */
export function WhySection() {
  const { ref: statsRef, style: statsStyle } = useRevealAnimation<HTMLDivElement>({
    variant: 'fade-up',
    delay: 100,
  });

  return (
    <section
      className="py-24 md:py-32 lg:py-40 bg-[var(--bg-secondary)] relative overflow-hidden"
      aria-labelledby="why-heading"
    >
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <span className="font-display text-[12rem] md:text-[18rem] lg:text-[24rem] font-black text-[var(--text-primary)] opacity-[0.02] select-none whitespace-nowrap">
          WHY
        </span>
      </div>

      <Container size="xl">
        <SectionHeading
          overline="Why Choose Us"
          heading="Why 1PLUS"
          subheading="We are not just another agency. We are your creative partners, committed to excellence at every stage."
          id="why-heading"
        />

        {/* Stats row */}
        <div
          ref={statsRef}
          style={statsStyle}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--accent-primary)]">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2000} />
              </div>
              <p className="mt-2 text-sm md:text-base text-[var(--text-secondary)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Differentiator cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {differentiators.map((item, index) => (
            <DifferentiatorCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
