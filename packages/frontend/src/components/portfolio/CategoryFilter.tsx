'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { categories, type Category } from '@/data/demoProjects';

interface CategoryFilterProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

/**
 * Horizontal scrollable category filter with animated active indicator.
 * Mobile: horizontally scrollable. Desktop: centered pill layout.
 */
export function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  return (
    <div className="relative mb-8 md:mb-12">
      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:justify-center"
        role="tablist"
        aria-label="Project category filter"
      >
        {categories.map((category) => (
          <button
            key={category}
            ref={(el) => {
              if (el) buttonRefs.current.set(category, el);
            }}
            onClick={() => onCategoryChange(category)}
            role="tab"
            aria-selected={activeCategory === category}
            className={`
              relative px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap
              transition-colors duration-200
              ${
                activeCategory === category
                  ? 'text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            {activeCategory === category && (
              <motion.div
                layoutId="category-pill"
                className="absolute inset-0 rounded-full bg-[var(--accent-primary)]"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
