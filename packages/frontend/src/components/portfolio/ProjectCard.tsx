'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Project } from '@1plus/shared';

interface ProjectCardProps {
  project: Project;
  /** Whether this card should span 2 columns in the grid */
  featured?: boolean;
  /** Index for staggered animation */
  index?: number;
}

/**
 * Individual project card with hover effects, lazy-loaded image, and link to detail page.
 * Featured cards span 2 columns in the masonry grid.
 */
export function ProjectCard({ project, featured = false, index = 0 }: ProjectCardProps) {
  const primaryImage = project.images.find((img) => img.isPrimary) || project.images[0];
  const imageUrl = primaryImage?.url || `https://picsum.photos/seed/${project.slug}/1200/800`;
  const imageAlt = primaryImage?.alt || project.title;

  // Determine aspect ratio class based on featured status
  const aspectClass = featured ? 'aspect-[16/9]' : 'aspect-[4/3]';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group relative ${featured ? 'md:col-span-2' : ''}`}
    >
      <Link
        href={`/work/${project.slug}`}
        className="block relative rounded-xl overflow-hidden bg-[var(--surface-card)] border border-[var(--border-primary)] transition-all duration-300 hover:shadow-xl hover:border-[var(--accent-primary)]/30"
      >
        {/* Image container */}
        <div className={`relative ${aspectClass} overflow-hidden`}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 md:p-6">
            <p className="text-white/90 text-sm md:text-base line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {project.description}
            </p>
          </div>
        </div>

        {/* Card info */}
        <div className="p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="text-base md:text-lg font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors duration-200">
              {project.title}
            </h3>
            {project.projectDate && (
              <span className="text-xs text-[var(--text-tertiary)] shrink-0">
                {new Date(project.projectDate).getFullYear()}
              </span>
            )}
          </div>

          <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--bg-secondary)] text-[var(--accent-primary)]">
            {project.category}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
