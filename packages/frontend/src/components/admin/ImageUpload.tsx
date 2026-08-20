'use client';

import { useState, useCallback, useRef, type DragEvent } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface UploadedImage {
  id?: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  file?: File;
  isNew?: boolean;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp';

export function ImageUpload({
  images,
  onChange,
  maxFiles = 10,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        return `"${file.name}" is not a supported format. Use JPG, PNG, or WebP.`;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `"${file.name}" exceeds ${maxSizeMB}MB limit.`;
      }
      return null;
    },
    [maxSizeMB]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);

      if (images.length + fileArray.length > maxFiles) {
        setError(`Maximum ${maxFiles} images allowed.`);
        return;
      }

      const newImages: UploadedImage[] = [];
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
        newImages.push({
          url: URL.createObjectURL(file),
          alt: file.name.replace(/\.[^/.]+$/, ''),
          isPrimary: images.length === 0 && newImages.length === 0,
          file,
          isNew: true,
        });
      }

      onChange([...images, ...newImages]);
    },
    [images, maxFiles, validateFile, onChange]
  );

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleRemove(index: number) {
    const updated = images.filter((_, i) => i !== index);
    if (images[index].isPrimary && updated.length > 0) {
      updated[0] = { ...updated[0], isPrimary: true };
    }
    onChange(updated);
  }

  function handleSetPrimary(index: number) {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[var(--text-secondary)]">
        Images
      </label>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
          isDragging
            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5 scale-[1.01]'
            : 'border-[var(--border-secondary)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--bg-secondary)]'
        }`}
      >
        <Upload
          className={`w-8 h-8 ${isDragging ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'}`}
        />
        <div className="text-center">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Drop images here or click to browse
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            JPG, PNG, WebP - Max {maxSizeMB}MB each
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative group rounded-lg overflow-hidden border-2 aspect-square ${
                image.isPrimary
                  ? 'border-[var(--accent-primary)]'
                  : 'border-[var(--border-primary)]'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt || 'Upload preview'}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.isPrimary && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleSetPrimary(index); }}
                    className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 text-white text-xs"
                    title="Set as primary"
                  >
                    <ImageIcon size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                  className="p-1.5 rounded-md bg-red-500/80 hover:bg-red-500 text-white"
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Primary Badge */}
              {image.isPrimary && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--accent-primary)] text-white">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type { UploadedImage };
