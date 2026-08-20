'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeroIntroProps {
  reducedMotion: boolean;
  onComplete?: () => void;
}

const INTRO_PLAYED_KEY = '1plus-hero-intro-played';

/**
 * GSAP-powered intro animation sequence.
 * Orchestrates the cinematic reveal of hero elements.
 * Only plays on first visit (sessionStorage flag).
 */
export function HeroIntro({ reducedMotion, onComplete }: HeroIntroProps) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const alreadyPlayed = sessionStorage.getItem(INTRO_PLAYED_KEY) === 'true';

    if (alreadyPlayed || reducedMotion) {
      gsap.set('.hero-logo-3d', { opacity: 1, scale: 1 });
      gsap.set('.hero-particles', { opacity: 1 });
      gsap.set('.hero-avatar', { opacity: 1, x: 0 });
      gsap.set('.hero-headline', { opacity: 1, y: 0 });
      gsap.set('.hero-subheadline', { opacity: 1, y: 0 });
      gsap.set('.hero-cta', { opacity: 1, y: 0 });
      onComplete?.();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(INTRO_PLAYED_KEY, 'true');
        onComplete?.();
      },
    });

    gsap.set('.hero-logo-3d', { opacity: 0, scale: 0.8 });
    gsap.set('.hero-particles', { opacity: 0 });
    gsap.set('.hero-avatar', { opacity: 0, x: 50 });
    gsap.set('.hero-headline', { opacity: 0, y: 30 });
    gsap.set('.hero-subheadline', { opacity: 0, y: 20 });
    gsap.set('.hero-cta', { opacity: 0, y: 20 });

    tl
      .to('.hero-logo-3d', {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      })
      .to('.hero-particles', {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.3')
      .to('.hero-avatar', {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.2')
      .to('.hero-headline', {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.2')
      .to('.hero-subheadline', {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.2')
      .to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      });

    return () => {
      tl.kill();
    };
  }, [reducedMotion, onComplete]);

  return null;
}
