'use client';

import { useState, useEffect, useRef, type RefObject } from 'react';

interface UseScrollProgressOptions {
  /** Offset from the top to start measuring (px). Default: 0 */
  offset?: number;
  /** Whether to track. Default: true */
  enabled?: boolean;
}

/**
 * Returns scroll progress (0 to 1) for a given element ref.
 * 0 = element top is at viewport bottom, 1 = element bottom is at viewport top.
 */
export function useScrollProgress(
  elementRef: RefObject<HTMLElement | null>,
  { offset = 0, enabled = true }: UseScrollProgressOptions = {}
): number {
  const [progress, setProgress] = useState(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;

    const updateProgress = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;

      const totalDistance = windowHeight + elementHeight;
      const traveled = windowHeight - rect.top + offset;
      const rawProgress = traveled / totalDistance;

      setProgress(Math.max(0, Math.min(1, rawProgress)));
      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [elementRef, offset, enabled]);

  return progress;
}
