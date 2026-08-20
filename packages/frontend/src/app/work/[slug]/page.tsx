'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, User, Tag } from 'lucide-react';
import type { Project } from '@1plus/shared';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ProjectGallery } from '@/components/portfolio/ProjectGallery';
import { demoProjects } from '@/data/demoProjects';
import { fetchProjects } from '@/lib/api';

/**
 * Individual project detail page.
 * Full-width hero image, project info, image gallery, and prev/next navigation.
 */
export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>(demoProjects);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetchProjects('published');
        if (response.success && response.data && response.data.length > 0) {
          setAllProjects(response.data);
          const found = response.data.find((p) => p.slug === slug);
          setProject(found || null);
        } else {
          setAllProjects(demoProjects);
          const found = demoProjects.find((p) => p.slug === slug);
          setProject(found || null);
        }
      } catch {
        setAllProjects(demoProjects);
        const found = demoProjects.find((p) => p.slug === slug);
        setProject(found || null);
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [slug]);

  // Find prev/next projects
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 bg-[var(--bg-primary)]">
        <div className="w-full aspect-[21/9] animate-pulse bg-[var(--bg-secondary)]" />
        <Container size="lg">
          <div className="py-12 space-y-4">
            <div className="h-10 w-2/3 bg-[var(--bg-secondary)] animate-pulse rounded" />
            <div className="h-6 w-1/3 bg-[var(--bg-secondary)] animate-pulse rounded" />
            <div className="h-24 w-full bg-[var(--bg-secondary)] animate-pulse rounded" />
          </div>
        </Container>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-[var(--bg-primary)]">
        <Container size="lg">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
              Project Not Found
            </h1>
            <p className="text-[var(--text-secondary)] mb-8">
              The project you are looking for does not exist or has been removed.
            </p>
            <Link href="/work">
              <Button variant="secondary">Back to Portfolio</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const heroImage =
    project.images.find((img) => img.isPrimary) || project.images[0];
  const heroImageUrl =
    heroImage?.url || `https://picsum.photos/seed/${project.slug}/1600/700`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[var(--bg-primary)]"
    >
      {/* Hero image */}
      <div className="relative w-full aspect-[21/9] md:aspect-[21/8] overflow-hidden">
        <Image
          src={heroImageUrl}
          alt={heroImage?.alt || project.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
      </div>

      <Container size="lg">
        {/* Back button */}
        <div className="py-6">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>

        {/* Project header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
              {project.category}
            </span>
            {project.projectDate && (
              <span className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)]">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(project.projectDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-4">
            {project.title}
          </h1>

          {project.clientName && (
            <p className="flex items-center gap-2 text-lg text-[var(--text-secondary)] mb-6">
              <User className="w-4 h-4" />
              {project.clientName}
            </p>
          )}

          <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            {project.description}
          </p>
        </motion.div>

        {/* Project meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 p-6 rounded-xl bg-[var(--surface-card)] border border-[var(--border-primary)]"
        >
          {/* Technologies */}
          {project.technologies.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External link */}
          {project.externalUrl && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
                Live Project
              </h3>
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)] hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </a>
            </div>
          )}
        </motion.div>

        {/* Image gallery */}
        {project.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
              Project Gallery
            </h2>
            <ProjectGallery images={project.images} projectTitle={project.title} />
          </motion.div>
        )}

        {/* Previous / Next navigation */}
        <div className="border-t border-[var(--border-primary)] py-12">
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            {prevProject ? (
              <Link
                href={`/work/${prevProject.slug}`}
                className="group flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                    Previous
                  </span>
                  <span className="text-sm font-medium">{prevProject.title}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link
                href={`/work/${nextProject.slug}`}
                className="group flex items-center gap-3 text-right text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                    Next
                  </span>
                  <span className="text-sm font-medium">{nextProject.title}</span>
                </div>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </Container>
    </motion.div>
  );
}
