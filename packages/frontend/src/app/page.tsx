import dynamic from 'next/dynamic';
import { BrandIntro } from '@/components/sections/BrandIntro';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { WhySection } from '@/components/sections/WhySection';
import { CTASection } from '@/components/sections/CTASection';
import { ContactSection } from '@/components/sections/ContactSection';

// HeroSection uses Three.js and must be client-rendered
const HeroSection = dynamic(
  () => import('@/components/hero/HeroSection').then((mod) => ({ default: mod.HeroSection })),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <HeroSection />
      <BrandIntro />
      <Services />

      {/* Portfolio section placeholder - will be implemented in FEAT-006 */}
      <section
        id="work"
        className="py-24 md:py-32 lg:py-40 bg-[var(--bg-primary)]"
        aria-labelledby="work-heading"
      >
        <div className="text-center max-w-3xl mx-auto px-6">
          <h2
            id="work-heading"
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]">Work</span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Portfolio section coming soon.
          </p>
        </div>
      </section>

      <Process />
      <WhySection />
      <CTASection />
      <ContactSection />
    </>
  );
}
