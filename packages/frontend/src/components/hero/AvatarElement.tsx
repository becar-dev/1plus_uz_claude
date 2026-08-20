'use client';

import { useRef } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useScrollProgress } from '@/hooks/useScrollProgress';

interface AvatarElementProps {
  className?: string;
}

/**
 * Avatar placeholder with CSS parallax effect driven by mouse position.
 * Uses a placeholder silhouette SVG with subtle floating animation.
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
        <svg
          viewBox="0 0 200 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hero-avatar__svg"
          aria-hidden="true"
        >
          <circle cx="100" cy="70" r="40" fill="var(--accent-primary)" opacity="0.3" />
          <circle cx="100" cy="70" r="35" fill="var(--accent-primary)" opacity="0.2" />
          <path
            d="M50 280 C50 180 70 150 100 140 C130 150 150 180 150 280"
            fill="var(--accent-secondary)"
            opacity="0.25"
          />
          <circle
            cx="100"
            cy="140"
            r="80"
            stroke="var(--accent-primary)"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          >
            <animate attributeName="r" values="75;85;75" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle
            cx="100"
            cy="140"
            r="50"
            stroke="var(--accent-tertiary)"
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          >
            <animate attributeName="r" values="45;55;45" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  );
}
