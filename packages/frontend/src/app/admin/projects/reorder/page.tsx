'use client';

import { useEffect, useState, useCallback } from 'react';
import { GripVertical, Save, Loader2, Check } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api';
import type { Project } from '@1plus/shared';

export default function AdminReorderPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/projects`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.success) {
          setProjects(data.data.sort((a: Project, b: Project) => a.displayOrder - b.displayOrder));
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function handleDrop(index: number) {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newProjects = [...projects];
    const [removed] = newProjects.splice(dragIndex, 1);
    newProjects.splice(index, 0, removed);
    setProjects(newProjects);
    setDragIndex(null);
    setDragOverIndex(null);
    setSaved(false);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      const token = getToken();
      const items = projects.map((p, idx) => ({
        id: p.id,
        displayOrder: idx,
      }));

      const res = await fetch(`${API_BASE_URL}/projects/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save order:', error);
    } finally {
      setIsSaving(false);
    }
  }, [projects]);

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reorder Projects</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">Drag and drop to set the display order</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
            {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Order'}
          </button>
        </div>

        <div className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-primary)] shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-[var(--text-tertiary)]">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-sm text-[var(--text-tertiary)]">No projects to reorder.</div>
          ) : (
            <div className="divide-y divide-[var(--border-primary)]">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-4 px-5 py-4 cursor-grab active:cursor-grabbing transition-all hover:bg-[var(--bg-secondary)]/50 ${
                    dragIndex === index ? 'opacity-50 bg-[var(--bg-secondary)]' : ''
                  } ${dragOverIndex === index && dragIndex !== index ? 'border-t-2 border-[var(--accent-primary)]' : ''}`}
                >
                  <GripVertical size={18} className="text-[var(--text-tertiary)] flex-shrink-0" />
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-semibold text-[var(--text-secondary)] flex-shrink-0">
                    {index + 1}
                  </span>
                  {project.images?.[0] ? (
                    <img src={project.images[0].url} alt={project.title} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-[var(--bg-tertiary)] flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{project.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{project.category.replace(/-/g, ' ')}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                    project.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
