'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProjectForm, type ProjectFormData } from '@/components/admin/ProjectForm';
import { type UploadedImage } from '@/components/admin/ImageUpload';
import { getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api';

export default function AdminNewProjectPage() {
  const router = useRouter();

  async function handleSubmit(data: ProjectFormData, images: UploadedImage[]) {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to create project');
    }

    const projectId = result.data.id;

    // Upload images if any
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
          displayOrder: i,
        }),
      });
    }

    router.push('/admin/projects');
  }

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
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">New Project</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Create a new portfolio project</p>
          </div>
        </div>

        <div className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-primary)] shadow-sm p-6">
          <ProjectForm onSubmit={handleSubmit} submitLabel="Create Project" />
        </div>
      </div>
    </AdminShell>
  );
}
