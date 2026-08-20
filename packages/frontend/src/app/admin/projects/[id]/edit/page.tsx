'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProjectForm, type ProjectFormData } from '@/components/admin/ProjectForm';
import { type UploadedImage } from '@/components/admin/ImageUpload';
import { getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api';
import type { Project } from '@1plus/shared';

export default function AdminEditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.success) {
          setProject(data.data);
        } else {
          setError(data.error || 'Project not found');
        }
      } catch {
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    }
    if (projectId) loadProject();
  }, [projectId]);

  async function handleSubmit(data: ProjectFormData, images: UploadedImage[]) {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to update project');
    }

    // Upload new images
    const newImages = images.filter((img) => img.isNew && img.file);
    for (let i = 0; i < newImages.length; i++) {
      const img = newImages[i];
      await fetch(`${API_BASE_URL}/projects/${projectId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
          displayOrder: i + (project?.images?.length || 0),
        }),
      });
    }

    router.push('/admin/projects');
  }

  if (isLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
        </div>
      </AdminShell>
    );
  }

  if (error || !project) {
    return (
      <AdminShell>
        <div className="space-y-4">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-sm text-[var(--accent-primary)] hover:underline"
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <div className="p-8 rounded-xl bg-red-50 border border-red-200 text-center">
            <p className="text-red-600">{error || 'Project not found'}</p>
          </div>
        </div>
      </AdminShell>
    );
  }

  const initialData = {
    title: project.title,
    slug: project.slug,
    description: project.description,
    category: project.category,
    clientName: project.clientName || '',
    projectDate: project.projectDate ? project.projectDate.split('T')[0] : '',
    externalUrl: project.externalUrl || '',
    technologies: project.technologies || [],
    tags: project.tags || [],
    status: project.status,
  };

  const initialImages: UploadedImage[] = (project.images || []).map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
    isPrimary: img.isPrimary,
    isNew: false,
  }));

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects"
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit Project</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{project.title}</p>
          </div>
        </div>

        <div className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-primary)] shadow-sm p-6">
          <ProjectForm
            initialData={initialData}
            initialImages={initialImages}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            isEditing
          />
        </div>
      </div>
    </AdminShell>
  );
}
