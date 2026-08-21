'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useScrollProgress } from '@/hooks/useScrollProgress';

interface AvatarElementProps {
  className?: string;
}

/**
 * Brand ambassador avatar with CSS parallax effect driven by mouse position.
 * Displays the actual avatar image with subtle floating animation and
 * mouse-following parallax effects.
 */
export function AvatarElement({ className = '' }: AvatarElementProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition({ lerpFactor: 0.04 });
  const scrollProgress = useScrollProgress(containerRef);

  // Avatar moves at 0.7x parallax rate
  const parallaxY = -scrollProgress * 100 * 0.7;
  const mouseOffsetX = mouse.normalizedX * 15;
  const mouseOffsetY = mouse.normalizedY * 10;

  return (
    <div
      ref={containerRef}
      className={`hero-avatar ${className}`}
      style={{
        transform: `translate(${mouseOffsetX}px, ${parallaxY + mouseOffsetY}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div className="hero-avatar__inner">
        <div className="hero-avatar__image-wrapper">
          <Image
            src="/images/avatar.jpg"
            alt="1PLUS brand representative"
            width={400}
            height={560}
            className="hero-avatar__image"
            priority
            style={{
              objectFit: 'cover',
              borderRadius: '16px',
              width: '100%',
              height: '100%',
            }}
          />
          {/* Decorative ring around avatar */}
          <div className="hero-avatar__ring" aria-hidden="true" />
          <div className="hero-avatar__ring hero-avatar__ring--outer" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
