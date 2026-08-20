'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  /** Target number to count to */
  target: number;
  /** Suffix to display after number (e.g., '+', '%') */
  suffix?: string;
  /** Prefix to display before number (e.g., '$') */
  prefix?: string;
  /** Duration of animation in ms */
  duration?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Counter component that animates from 0 to target number when scrolled into view.
 * Uses requestAnimationFrame for smooth counting. Only counts up once.
 */
export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2000,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.unobserve(element);

          // If user prefers reduced motion, just set the final value
          if (reducedMotionRef.current) {
            setCount(target);
            return;
          }

          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
