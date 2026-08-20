'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderOpen, PlusCircle, Eye, FileText } from 'lucide-react';
import { getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api';
import { AdminShell } from '@/components/admin/AdminShell';
import type { Project } from '@1plus/shared';

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    loadProjects();
  }, []);

  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;
  const recentProjects = projects.slice(0, 5);

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderOpen, color: 'var(--accent-primary)' },
    { label: 'Published', value: publishedCount, icon: Eye, color: '#10b981' },
    { label: 'Drafts', value: draftCount, icon: FileText, color: 'var(--accent-tertiary)' },
  ];

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">
              Welcome back to 1PLUS Admin
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white font-medium text-sm hover:opacity-90 transition-all"
          >
            <PlusCircle size={16} />
            Add Project
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)] shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Icon size={20} style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">
                      {isLoading ? '-' : stat.value}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Projects */}
        <div className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-primary)] shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-primary)]">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Recent Projects</h2>
            <Link href="/admin/projects" className="text-xs font-medium text-[var(--accent-primary)] hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-[var(--border-primary)]">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">Loading...</div>
            ) : recentProjects.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
                No projects yet. Create your first project!
              </div>
            ) : (
              recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 hover:bg-[var(--bg-secondary)] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {project.images?.[0] ? (
                      <img src={project.images[0].url} alt={project.title} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-[var(--bg-secondary)] flex items-center justify-center flex-shrink-0">
                        <FolderOpen size={16} className="text-[var(--text-tertiary)]" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{project.title}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{project.category.replace(/-/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {project.status}
                    </span>
                    <Link href={`/admin/projects/${project.id}/edit`} className="text-xs font-medium text-[var(--accent-primary)] hover:underline">
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
