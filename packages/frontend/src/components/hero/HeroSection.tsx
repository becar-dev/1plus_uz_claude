'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { AvatarElement } from './AvatarElement';
import { HeroIntro } from './HeroIntro';
import { HeroFallback } from './HeroFallback';
import { Button } from '@/components/ui/Button';

// Dynamically import HeroCanvas with SSR disabled (Three.js is client-only)
const HeroCanvas = dynamic(
  () => import('./HeroCanvas').then((mod) => ({ default: mod.HeroCanvas })),
  { ssr: false }
);

/**
 * Main hero section container.
 * Full-viewport height with Three.js canvas behind content layer.
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  const mouse = useMousePosition({ lerpFactor: 0.05, enabled: !reducedMotion });
  const scrollProgress = useScrollProgress(sectionRef);

  useEffect(() => {
    // WebGL check
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }

    // Reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    // Low-end device detection
    const cores = navigator.hardwareConcurrency || 4;
    if (cores < 4) {
      setIsLowEnd(true);
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero-section"
      aria-label="Hero - 1PLUS Creative Studio"
    >
      {/* Three.js Canvas (background layer) */}
      <div className="hero-canvas-container hero-logo-3d hero-particles">
        {webglSupported ? (
          <HeroCanvas
            mouseX={mouse.normalizedX}
            mouseY={mouse.normalizedY}
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
            isLowEnd={isLowEnd}
          />
        ) : (
          <HeroFallback />
        )}
      </div>

      {/* Content layer (above canvas) */}
      <div className="hero-content">
        {/* Avatar */}
        <div className="hero-content__avatar">
          <AvatarElement />
        </div>

        {/* Text content */}
        <div className="hero-content__text">
          <h1 className="hero-headline">
            <span className="hero-headline__line">We Create</span>
            <span className="hero-headline__line hero-headline__line--accent">
              Digital Experiences
            </span>
          </h1>
          <p className="hero-subheadline">
            1PLUS is a premium creative studio crafting immersive brands, websites, and digital
            products that push boundaries.
          </p>
          <div className="hero-cta">
            <Button variant="primary" size="lg">
              Explore Our Work
            </Button>
            <Button variant="secondary" size="lg">
              Get in Touch
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-scroll-indicator"
        style={{ opacity: introComplete ? 1 : 0, transition: 'opacity 0.5s ease' }}
        aria-hidden="true"
      >
        <div className="hero-scroll-indicator__mouse">
          <div className="hero-scroll-indicator__wheel" />
        </div>
        <span className="hero-scroll-indicator__text">Scroll to explore</span>
      </div>

      {/* GSAP Intro Animation Controller */}
      <HeroIntro reducedMotion={reducedMotion} onComplete={handleIntroComplete} />
    </section>
  );
}
