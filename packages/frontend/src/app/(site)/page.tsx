import dynamic from 'next/dynamic';
import { BrandIntro } from '@/components/sections/BrandIntro';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { WhySection } from '@/components/sections/WhySection';
import { CTASection } from '@/components/sections/CTASection';
import { ContactSection } from '@/components/sections/ContactSection';
import { PortfolioSection } from '@/components/portfolio/PortfolioSection';

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
      <PortfolioSection />
      <Process />
      <WhySection />
      <CTASection />
      <ContactSection />
    </>
  );
}
