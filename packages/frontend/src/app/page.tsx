import dynamic from 'next/dynamic';

// HeroSection uses Three.js and must be client-rendered
const HeroSection = dynamic(
  () => import('@/components/hero/HeroSection').then((mod) => ({ default: mod.HeroSection })),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Additional sections will be added below */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-gradient">Work</span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Portfolio section coming soon.
          </p>
        </div>
      </section>
    </>
  );
}
