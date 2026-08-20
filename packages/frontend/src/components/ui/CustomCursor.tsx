'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom cursor for desktop: small dot + larger circle following with delay.
 * Grows on buttons/links, hidden on touch devices.
 * Disabled when prefers-reduced-motion is set.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const posRef = useRef({ x: 0, y: 0 });
  const circlePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const updateVisibility = useCallback((visible: boolean) => {
    setIsVisible(visible);
  }, []);

  useEffect(() => {
    // Check if touch device
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    // Check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedMotion = motionQuery.matches;

    if (isTouchDevice || reducedMotion) {
      setIsDisabled(true);
      return;
    }

    setIsDisabled(false);

    function handleMouseMove(e: MouseEvent) {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
      updateVisibility(true);
    }

    function handleMouseLeave() {
      updateVisibility(false);
    }

    function animateCircle() {
      const lerp = 0.15;
      circlePos.current.x += (posRef.current.x - circlePos.current.x) * lerp;
      circlePos.current.y += (posRef.current.y - circlePos.current.y) * lerp;

      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${circlePos.current.x - 20}px, ${circlePos.current.y - 20}px)`;
      }

      rafRef.current = requestAnimationFrame(animateCircle);
    }

    // Detect interactive elements
    function handleMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
      );
      setIsHovering(!!interactive);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    rafRef.current = requestAnimationFrame(animateCircle);

    // Listen for reduced motion changes
    const motionHandler = (e: MediaQueryListEvent) => {
      if (e.matches) setIsDisabled(true);
    };
    motionQuery.addEventListener('change', motionHandler);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      motionQuery.removeEventListener('change', motionHandler);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateVisibility]);

  if (isDisabled) return null;

  return (
    <>
      {/* Small dot - follows cursor exactly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[10000] mix-blend-difference"
        style={{
          backgroundColor: 'white',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
        aria-hidden="true"
      />
      {/* Larger circle - follows with delay */}
      <div
        ref={circleRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[10000] mix-blend-difference"
        style={{
          border: '1.5px solid white',
          opacity: isVisible ? 0.6 : 0,
          transition: 'opacity 0.2s ease, width 0.2s ease, height 0.2s ease',
          width: isHovering ? '56px' : '40px',
          height: isHovering ? '56px' : '40px',
        }}
        aria-hidden="true"
      />
    </>
  );
}
