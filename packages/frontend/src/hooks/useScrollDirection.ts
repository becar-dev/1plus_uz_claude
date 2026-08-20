'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type ScrollDirection = 'up' | 'down' | null;

interface UseScrollDirectionOptions {
  /** Minimum scroll distance before direction change triggers (prevents jitter) */
  threshold?: number;
  /** Initial direction value */
  initialDirection?: ScrollDirection;
}

interface ScrollDirectionState {
  direction: ScrollDirection;
  scrollY: number;
  isAtTop: boolean;
}

export function useScrollDirection({
  threshold = 10,
  initialDirection = null,
}: UseScrollDirectionOptions = {}): ScrollDirectionState {
  const [state, setState] = useState<ScrollDirectionState>({
    direction: initialDirection,
    scrollY: 0,
    isAtTop: true,
  });

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollDirection = useCallback(() => {
    const currentScrollY = window.scrollY;
    const isAtTop = currentScrollY < 5;

    if (Math.abs(currentScrollY - lastScrollY.current) < threshold) {
      ticking.current = false;
      return;
    }

    const direction: ScrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';

    setState({ direction, scrollY: currentScrollY, isAtTop });
    lastScrollY.current = currentScrollY;
    ticking.current = false;
  }, [threshold]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    // Set initial values
    lastScrollY.current = window.scrollY;
    setState({
      direction: initialDirection,
      scrollY: window.scrollY,
      isAtTop: window.scrollY < 5,
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollDirection, initialDirection]);

  return state;
}
