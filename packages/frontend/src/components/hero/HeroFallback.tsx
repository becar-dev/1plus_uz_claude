'use client';

import { useRef, useEffect, useState } from 'react';

/**
 * Static fallback hero for no-WebGL scenarios.
 * Uses CSS gradients and simple parallax on scroll.
 */
export function HeroFallback() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="hero-fallback" aria-hidden="true">
      <div
        className="hero-fallback__gradient"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      />
      <div
        className="hero-fallback__circle hero-fallback__circle--cyan"
        style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)` }}
      />
      <div
        className="hero-fallback__circle hero-fallback__circle--magenta"
        style={{ transform: `translate(-${scrollY * 0.08}px, ${scrollY * 0.12}px)` }}
      />
      <div
        className="hero-fallback__circle hero-fallback__circle--yellow"
        style={{ transform: `translate(${scrollY * 0.06}px, -${scrollY * 0.04}px)` }}
      />
      <div className="hero-fallback__logo">
        <span className="hero-fallback__logo-text">1</span>
        <span className="hero-fallback__logo-plus">+</span>
      </div>
    </div>
  );
}
