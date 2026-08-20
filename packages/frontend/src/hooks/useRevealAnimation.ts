'use client';

import { useEffect, useRef, useState } from 'react';

export type RevealVariant = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-in';

interface UseRevealAnimationOptions {
  /** Animation variant */
  variant?: RevealVariant;
  /** IntersectionObserver threshold (0-1) */
  threshold?: number;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Only animate once */
  once?: boolean;
}

/**
 * Reusable hook that applies a reveal animation to an element when it enters the viewport.
 * Respects prefers-reduced-motion preference.
 */
export function useRevealAnimation<T extends HTMLElement = HTMLDivElement>({
  variant = 'fade-up',
  threshold = 0.15,
  delay = 0,
  once = true,
}: UseRevealAnimationOptions = {}) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleChange);
    return () => motionQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, delay, once, reducedMotion]);

  const getStyles = (): React.CSSProperties => {
    if (reducedMotion) {
      return { opacity: 1 };
    }

    const baseHidden: React.CSSProperties = {
      opacity: 0,
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    };

    const baseVisible: React.CSSProperties = {
      opacity: 1,
      transform: 'none',
      transition: `opacity 0.6s ease, transform 0.6s ease`,
    };

    if (isVisible) return baseVisible;

    switch (variant) {
      case 'fade-up':
        return { ...baseHidden, transform: 'translateY(40px)' };
      case 'fade-in':
        return { ...baseHidden };
      case 'slide-left':
        return { ...baseHidden, transform: 'translateX(-40px)' };
      case 'slide-right':
        return { ...baseHidden, transform: 'translateX(40px)' };
      case 'scale-in':
        return { ...baseHidden, transform: 'scale(0.9)' };
      default:
        return baseHidden;
    }
  };

  return { ref, isVisible, style: getStyles() };
}
