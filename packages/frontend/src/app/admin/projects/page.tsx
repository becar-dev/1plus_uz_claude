'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Pencil, Trash2, FolderOpen, Eye, EyeOff } from 'lucide-react';
import { getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api';
import { AdminShell } from '@/components/admin/AdminShell';
import { DeleteModal } from '@/components/admin/DeleteModal';
import type { Project } from '@1plus/shared';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadProjects() {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/projects`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/projects/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function toggleStatus(project: Project) {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage your portfolio projects</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white font-medium text-sm hover:opacity-90 transition-all"
          >
            <PlusCircle size={16} />
            New Project
          </Link>
        </div>

        <div className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-primary)] shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-[var(--text-tertiary)]">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center">
              <FolderOpen className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-3" />
              <p className="text-sm text-[var(--text-tertiary)]">No projects yet. Create your first one!</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-primary)]">
              <div className="hidden md:grid grid-cols-[1fr_120px_100px_100px_140px] gap-4 px-5 py-3 bg-[var(--bg-secondary)] text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                <span>Project</span>
                <span>Category</span>
                <span>Status</span>
                <span>Date</span>
                <span className="text-right">Actions</span>
              </div>

              {projects.map((project) => (
                <div
                  key={project.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_120px_100px_100px_140px] gap-2 md:gap-4 items-center px-5 py-4 hover:bg-[var(--bg-secondary)]/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {project.images?.[0] ? (
                      <img src={project.images[0].url} alt={project.title} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-[var(--bg-secondary)] flex items-center justify-center flex-shrink-0">
                        <FolderOpen size={14} className="text-[var(--text-tertiary)]" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{project.title}</p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate md:hidden">{project.category.replace(/-/g, ' ')}</p>
                    </div>
                  </div>

                  <span className="hidden md:block text-xs text-[var(--text-secondary)] capitalize">
                    {project.category.replace(/-/g, ' ')}
                  </span>

                  <div>
                    <button
                      onClick={() => toggleStatus(project)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                        project.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                      title={project.status === 'published' ? 'Click to unpublish' : 'Click to publish'}
                    >
                      {project.status === 'published' ? <Eye size={10} /> : <EyeOff size={10} />}
                      {project.status}
                    </button>
                  </div>

                  <span className="hidden md:block text-xs text-[var(--text-tertiary)]">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '-'}
                  </span>

                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(project)}
                      className="p-2 rounded-md text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DeleteModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Project"
          message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
          isDeleting={isDeleting}
        />
      </div>
    </AdminShell>
  );
}
