'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@1plus/shared';

interface ProjectPreviewProps {
  project: Project | null;
  position: { x: number; y: number };
  onClose: () => void;
}

/**
 * Expanded preview overlay that appears near cursor on hover (desktop).
 * Shows a larger image, title, description, and "View Project" link.
 */
export function ProjectPreview({ project, position, onClose }: ProjectPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Calculate position to keep preview in viewport
  const getPosition = () => {
    const offset = 20;
    const previewWidth = 380;
    const previewHeight = 300;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    let x = position.x + offset;
    let y = position.y + offset;

    if (x + previewWidth > viewportWidth) {
      x = position.x - previewWidth - offset;
    }
    if (y + previewHeight > viewportHeight) {
      y = position.y - previewHeight - offset;
    }

    return { x: Math.max(16, x), y: Math.max(16, y) };
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={previewRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            left: getPosition().x,
            top: getPosition().y,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
          className="w-[360px] rounded-xl overflow-hidden shadow-2xl border border-[var(--border-primary)] bg-[var(--surface-card)]"
        >
          <div className="relative aspect-[16/10]">
            <Image
              src={
                project.images.find((img) => img.isPrimary)?.url ||
                project.images[0]?.url ||
                `https://picsum.photos/seed/${project.slug}/800/500`
              }
              alt={project.title}
              fill
              className="object-cover"
              sizes="360px"
            />
          </div>
          <div className="p-4">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              {project.title}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
              {project.description}
            </p>
            <span className="inline-block mt-2 text-xs font-medium text-[var(--accent-primary)]">
              View Project &rarr;
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
