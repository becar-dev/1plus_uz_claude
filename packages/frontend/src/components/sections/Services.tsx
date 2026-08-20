'use client';

import { useRevealAnimation } from '@/hooks/useRevealAnimation';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  Palette,
  Globe,
  Film,
  Box,
  TrendingUp,
  Camera,
} from 'lucide-react';
import { type ReactNode } from 'react';

interface ServiceItem {
  icon: ReactNode;
  title: string;
  description: string;
  featured?: boolean;
}

const services: ServiceItem[] = [
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Branding',
    description:
      'Strategic identity design that captures your essence and resonates with your audience across every touchpoint.',
    featured: true,
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Web Development',
    description:
      'High-performance websites and applications built with cutting-edge technology and meticulous attention to detail.',
    featured: true,
  },
  {
    icon: <Film className="w-6 h-6" />,
    title: 'Motion Design',
    description:
      'Captivating animations and motion graphics that bring your brand to life with energy and purpose.',
  },
  {
    icon: <Box className="w-6 h-6" />,
    title: '3D Experience',
    description:
      'Immersive three-dimensional visuals and interactive experiences that push creative boundaries.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Digital Strategy',
    description:
      'Data-driven insights and strategic planning to maximize your digital presence and impact.',
    featured: true,
  },
  {
    icon: <Camera className="w-6 h-6" />,
    title: 'Visual Production',
    description:
      'Professional photography and video production that tells your story with cinematic quality.',
  },
];

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const { ref, style } = useRevealAnimation<HTMLDivElement>({
    variant: 'fade-up',
    delay: index * 100,
  });

  return (
    <div
      ref={ref}
      style={style}
      className={`
        group relative p-6 md:p-8 rounded-2xl
        bg-[var(--surface-card)] border border-[var(--border-primary)]
        transition-all duration-300 ease-out
        hover:shadow-lg hover:-translate-y-1
        hover:border-[var(--accent-primary)]
        ${service.featured ? 'md:col-span-2 md:row-span-1' : ''}
      `}
    >
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--bg-secondary)] text-[var(--accent-primary)] mb-5 transition-colors duration-300 group-hover:bg-[var(--accent-primary)] group-hover:text-white">
        {service.icon}
      </div>

      {/* Content */}
      <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] mb-3">
        {service.title}
      </h3>
      <p className="text-[var(--text-secondary)] leading-relaxed">
        {service.description}
      </p>

      {/* Hover accent line */}
      <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  );
}

/**
 * Services/capabilities section with variable-sized cards.
 * Featured services get larger cards. Staggered reveal animation on scroll.
 */
export function Services() {
  return (
    <section
      id="services"
      className="py-24 md:py-32 lg:py-40 bg-[var(--bg-secondary)]"
      aria-labelledby="services-heading"
    >
      <Container size="xl">
        <SectionHeading
          overline="What We Do"
          heading="Services & Capabilities"
          subheading="We offer a comprehensive suite of creative and digital services tailored to elevate your brand."
          id="services-heading"
        />

        {/* Variable-size grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
