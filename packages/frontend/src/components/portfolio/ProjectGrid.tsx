'use client';

import { AnimatePresence } from 'framer-motion';
import type { Project } from '@1plus/shared';
import { ProjectCard } from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  /** Maximum number of projects to show (for homepage section) */
  limit?: number;
}

/**
 * Dynamic masonry-style grid layout for projects.
 * Uses CSS Grid with variable spans for featured (first and every 4th) projects.
 * Smooth reflow when filters change via AnimatePresence.
 */
export function ProjectGrid({ projects, limit }: ProjectGridProps) {
  const displayProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 auto-rows-auto">
      <AnimatePresence mode="popLayout">
        {displayProjects.map((project, index) => {
          // First project and every 4th are featured (span 2 columns)
          const isFeatured = index === 0 || (index > 0 && index % 4 === 0);
          return (
            <ProjectCard
              key={project.id}
              project={project}
              featured={isFeatured}
              index={index}
            />
          );
        })}
      </AnimatePresence>

      {displayProjects.length === 0 && (
        <div className="col-span-full text-center py-16">
          <p className="text-[var(--text-secondary)] text-lg">
            No projects found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
