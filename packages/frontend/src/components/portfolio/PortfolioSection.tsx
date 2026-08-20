'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Project } from '@1plus/shared';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { CategoryFilter } from './CategoryFilter';
import { ProjectGrid } from './ProjectGrid';
import { demoProjects, type Category } from '@/data/demoProjects';
import { fetchProjects } from '@/lib/api';
import { ArrowRight } from 'lucide-react';

/**
 * Main portfolio section for the homepage.
 * Fetches projects from backend API and falls back to demo projects if unavailable.
 * Shows 6 featured projects with category filter and a "View All" link.
 */
export function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>(demoProjects);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetchProjects('published');
        if (response.success && response.data && response.data.length > 0) {
          setProjects(response.data);
        } else {
          // Fall back to demo projects
          setProjects(demoProjects);
        }
      } catch {
        // Fall back to demo projects on network error
        setProjects(demoProjects);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section
      id="work"
      className="py-24 md:py-32 lg:py-40 bg-[var(--bg-primary)]"
      aria-labelledby="work-heading"
    >
      <Container size="xl">
        <SectionHeading
          overline="Our Work"
          heading="Selected Projects"
          subheading="A curated selection of our most impactful work across branding, web, motion, and production."
          id="work-heading"
        />

        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-xl bg-[var(--bg-secondary)] ${
                  i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                }`}
              />
            ))}
          </div>
        ) : (
          <ProjectGrid projects={filteredProjects} limit={6} />
        )}

        {/* View All link */}
        <div className="mt-12 md:mt-16 text-center">
          <Link href="/work">
            <Button
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              View All Projects
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
