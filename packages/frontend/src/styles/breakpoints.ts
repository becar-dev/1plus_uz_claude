'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Responsive breakpoint constants
 * mobile: 480px, tablet: 768px, laptop: 1024px, desktop: 1440px
 */
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Media query strings for use in CSS-in-JS or matchMedia
 */
export const mediaQueries = {
  mobile: `(min-width: ${breakpoints.mobile}px)`,
  tablet: `(min-width: ${breakpoints.tablet}px)`,
  laptop: `(min-width: ${breakpoints.laptop}px)`,
  desktop: `(min-width: ${breakpoints.desktop}px)`,
  mobileMax: `(max-width: ${breakpoints.mobile - 1}px)`,
  tabletMax: `(max-width: ${breakpoints.tablet - 1}px)`,
  laptopMax: `(max-width: ${breakpoints.laptop - 1}px)`,
  desktopMax: `(max-width: ${breakpoints.desktop - 1}px)`,
  reducedMotion: '(prefers-reduced-motion: reduce)',
} as const;

/**
 * Custom hook: returns true when the given media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Custom hook: returns the current active breakpoint based on viewport width
 */
export function useBreakpoint(): Breakpoint | 'base' {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | 'base'>('base');

  const updateBreakpoint = useCallback(() => {
    const width = window.innerWidth;
    if (width >= breakpoints.desktop) {
      setBreakpoint('desktop');
    } else if (width >= breakpoints.laptop) {
      setBreakpoint('laptop');
    } else if (width >= breakpoints.tablet) {
      setBreakpoint('tablet');
    } else if (width >= breakpoints.mobile) {
      setBreakpoint('mobile');
    } else {
      setBreakpoint('base');
    }
  }, []);

  useEffect(() => {
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, [updateBreakpoint]);

  return breakpoint;
}

/**
 * Utility: check if we are at or above a given breakpoint
 */
export function useIsAboveBreakpoint(bp: Breakpoint): boolean {
  return useMediaQuery(mediaQueries[bp]);
}

/**
 * Utility: check if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(mediaQueries.reducedMotion);
}
