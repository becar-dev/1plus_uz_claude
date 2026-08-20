'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface MousePosition {
  /** Raw X coordinate */
  x: number;
  /** Raw Y coordinate */
  y: number;
  /** Normalized X from -1 (left) to 1 (right) */
  normalizedX: number;
  /** Normalized Y from -1 (top) to 1 (bottom) */
  normalizedY: number;
}

interface UseMousePositionOptions {
  /** Lerp smoothing factor (0-1). Lower = smoother. Default: 0.05 */
  lerpFactor?: number;
  /** Whether to track mouse position. Default: true */
  enabled?: boolean;
}

export function useMousePosition({
  lerpFactor = 0.05,
  enabled = true,
}: UseMousePositionOptions = {}): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const targetRef = useRef({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });
  const currentRef = useRef({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });
  const rafRef = useRef<number | null>(null);
  const isActiveRef = useRef(false);
  const lerpRef = useRef(lerpFactor);

  useEffect(() => {
    lerpRef.current = lerpFactor;
  }, [lerpFactor]);

  const animate = useCallback(() => {
    const target = targetRef.current;
    const current = currentRef.current;
    const lerp = lerpRef.current;

    current.x += (target.x - current.x) * lerp;
    current.y += (target.y - current.y) * lerp;
    current.normalizedX += (target.normalizedX - current.normalizedX) * lerp;
    current.normalizedY += (target.normalizedY - current.normalizedY) * lerp;

    setPosition({ ...current });

    const dx = Math.abs(target.normalizedX - current.normalizedX);
    const dy = Math.abs(target.normalizedY - current.normalizedY);

    if (dx > 0.001 || dy > 0.001) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      isActiveRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const normalizedX = (clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (clientY / window.innerHeight) * 2 - 1;

      targetRef.current = { x: clientX, y: clientY, normalizedX, normalizedY };

      if (!isActiveRef.current) {
        isActiveRef.current = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, animate]);

  return position;
}
