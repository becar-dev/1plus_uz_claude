'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Project } from '@1plus/shared';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CategoryFilter } from '@/components/portfolio/CategoryFilter';
import { ProjectGrid } from '@/components/portfolio/ProjectGrid';
import { demoProjects, type Category } from '@/data/demoProjects';
import { fetchProjects } from '@/lib/api';

type SortOption = 'newest' | 'oldest' | 'category';

/**
 * Full portfolio page at /work.
 * Shows all projects with category filters and sort options.
 */
export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>(demoProjects);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetchProjects('published');
        if (response.success && response.data && response.data.length > 0) {
          setProjects(response.data);
        } else {
          setProjects(demoProjects);
        }
      } catch {
        setProjects(demoProjects);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let filtered =
      activeCategory === 'All'
        ? projects
        : projects.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case 'newest':
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(b.projectDate || b.createdAt).getTime() -
            new Date(a.projectDate || a.createdAt).getTime()
        );
        break;
      case 'oldest':
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(a.projectDate || a.createdAt).getTime() -
            new Date(b.projectDate || b.createdAt).getTime()
        );
        break;
      case 'category':
        filtered = [...filtered].sort((a, b) =>
          a.category.localeCompare(b.category)
        );
        break;
    }

    return filtered;
  }, [projects, activeCategory, sortBy]);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[var(--bg-primary)]">
      <Container size="xl">
        <SectionHeading
          overline="Portfolio"
          heading="All Projects"
          subheading="Explore our complete body of work across all disciplines and categories."
        />

        {/* Filters and sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <div className="flex items-center gap-2 shrink-0">
            <label
              htmlFor="sort-select"
              className="text-sm text-[var(--text-secondary)]"
            >
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-xl bg-[var(--bg-secondary)] ${
                  i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                }`}
              />
            ))}
          </div>
        ) : (
          <ProjectGrid projects={filteredAndSorted} />
        )}

        {!isLoading && filteredAndSorted.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-[var(--text-secondary)]">
              No projects found in this category.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
