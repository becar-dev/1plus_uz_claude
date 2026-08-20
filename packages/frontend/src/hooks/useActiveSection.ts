'use client';

import { useState, useEffect, useRef } from 'react';

interface UseActiveSectionOptions {
  /** Section IDs to observe */
  sectionIds: string[];
  /** Offset from top of viewport (accounts for sticky header) */
  offset?: number;
  /** Threshold for IntersectionObserver (0-1) */
  threshold?: number;
}

export function useActiveSection({
  sectionIds,
  offset = 100,
  threshold = 0.3,
}: UseActiveSectionOptions): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const visibleSections = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }
        });

        // Find the section with the highest visibility ratio
        if (visibleSections.size > 0) {
          let maxRatio = 0;
          let maxId = '';
          visibleSections.forEach((ratio, id) => {
            if (ratio > maxRatio) {
              maxRatio = ratio;
              maxId = id;
            }
          });
          setActiveSection(maxId);
        }
      },
      {
        rootMargin: `-${offset}px 0px -30% 0px`,
        threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1],
      }
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sectionIds, offset, threshold]);

  return activeSection;
}
