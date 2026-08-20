'use client';

import { useState, type FormEvent } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { TagInput } from './TagInput';
import { ImageUpload, type UploadedImage } from './ImageUpload';

interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  clientName: string;
  projectDate: string;
  externalUrl: string;
  technologies: string[];
  tags: string[];
  status: 'published' | 'draft';
}

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  initialImages?: UploadedImage[];
  onSubmit: (data: ProjectFormData, images: UploadedImage[]) => Promise<void>;
  submitLabel?: string;
  isEditing?: boolean;
}

const CATEGORIES = [
  'branding',
  'web-development',
  'mobile-app',
  'ui-ux-design',
  'motion-graphics',
  'print-design',
  'social-media',
  'photography',
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function ProjectForm({
  initialData,
  initialImages = [],
  onSubmit,
  submitLabel = 'Save Project',
  isEditing = false,
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    clientName: initialData?.clientName || '',
    projectDate: initialData?.projectDate || '',
    externalUrl: initialData?.externalUrl || '',
    technologies: initialData?.technologies || [],
    tags: initialData?.tags || [],
    status: initialData?.status || 'draft',
  });

  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField(field: keyof ProjectFormData, value: string | string[]) {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && (!isEditing || !prev.slug)) {
        updated.slug = slugify(value as string);
      }
      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(formData, images);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClasses =
    'w-full px-4 py-2.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border-focus)] transition-colors text-sm';
  const labelClasses = 'block text-sm font-medium text-[var(--text-secondary)] mb-1.5';
  const errorClasses = 'text-xs text-red-500 mt-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {submitError}
        </div>
      )}

      {/* Title and Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Project title"
            className={inputClasses}
          />
          {errors.title && <p className={errorClasses}>{errors.title}</p>}
        </div>
        <div>
          <label className={labelClasses}>Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            placeholder="project-slug"
            className={inputClasses}
          />
          {errors.slug && <p className={errorClasses}>{errors.slug}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClasses}>Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Describe the project..."
          rows={4}
          className={`${inputClasses} resize-y min-h-[100px]`}
        />
        {errors.description && <p className={errorClasses}>{errors.description}</p>}
      </div>

      {/* Category and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Category *</label>
          <select
            value={formData.category}
            onChange={(e) => updateField('category', e.target.value)}
            className={inputClasses}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
          {errors.category && <p className={errorClasses}>{errors.category}</p>}
        </div>
        <div>
          <label className={labelClasses}>Status</label>
          <div className="flex items-center gap-4 h-[44px]">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={() => updateField('status', 'draft')}
                className="w-4 h-4 text-[var(--accent-primary)]"
              />
              <span className="text-sm text-[var(--text-primary)]">Draft</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={() => updateField('status', 'published')}
                className="w-4 h-4 text-[var(--accent-primary)]"
              />
              <span className="text-sm text-[var(--text-primary)]">Published</span>
            </label>
          </div>
        </div>
      </div>

      {/* Client and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Client Name</label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => updateField('clientName', e.target.value)}
            placeholder="Client name"
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Project Date</label>
          <input
            type="date"
            value={formData.projectDate}
            onChange={(e) => updateField('projectDate', e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      {/* External URL */}
      <div>
        <label className={labelClasses}>External URL</label>
        <input
          type="url"
          value={formData.externalUrl}
          onChange={(e) => updateField('externalUrl', e.target.value)}
          placeholder="https://example.com"
          className={inputClasses}
        />
      </div>

      {/* Technologies */}
      <TagInput
        label="Technologies"
        tags={formData.technologies}
        onChange={(tags) => updateField('technologies', tags)}
        placeholder="Type technology and press Enter"
      />

      {/* Tags */}
      <TagInput
        label="Tags"
        tags={formData.tags}
        onChange={(tags) => updateField('tags', tags)}
        placeholder="Type tag and press Enter"
      />

      {/* Image Upload */}
      <ImageUpload images={images} onChange={setImages} />

      {/* Submit Button */}
      <div className="flex items-center justify-end pt-4 border-t border-[var(--border-primary)]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-white font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export type { ProjectFormData };
