# Brand Assets Guide

This document describes where to place real brand assets when they are provided.

## Logo

Place logo files in the frontend public directory:

    packages/frontend/public/
    - logo.svg              # Primary logo (SVG)
    - logo-dark.svg         # Logo variant for dark backgrounds
    - logo-icon.svg         # Icon-only version (square)
    - favicon.svg           # Browser tab icon
    - favicon.ico           # Fallback for older browsers (32x32)

The logo component is at: packages/frontend/src/components/ui/Logo.tsx

## Avatar / Team Photos

The founder/team avatar appears in the hero section:

    packages/frontend/public/images/
    - avatar.webp           # Primary avatar (400x400 minimum, square)
    - avatar-fallback.png   # Fallback if WebP not supported

The avatar component is at: packages/frontend/src/components/hero/AvatarElement.tsx

## Open Graph / Social Sharing Image

    packages/frontend/public/
    - og-image.png          # Main OG image (1200x630, required)

Requirements:
- Format: PNG or JPG
- Size: 1200x630 pixels (OG standard)
- Content: Brand name, tagline, and key visual

## Project/Portfolio Images

Portfolio images are uploaded through the admin panel (/admin/projects).
They are stored in: packages/backend/uploads/

Recommended sizes:
- Hero/primary: 1600x900 (16:9 ratio)
- Gallery: 1200x800 minimum

## 3D Assets

Custom 3D models for the hero section:

    packages/frontend/public/models/
    - logo-3d.glb          # 3D logo model (GLTF binary)

The 3D hero component is at: packages/frontend/src/components/hero/HeroCanvas.tsx

## PWA Icons

    packages/frontend/public/
    - icon-192.png          # 192x192 PWA icon
    - icon-512.png          # 512x512 PWA icon
    - apple-touch-icon.png  # 180x180 Apple touch icon

Update manifest.json icon references after adding these files.

## File Naming Conventions

- Use lowercase with hyphens: logo-dark.svg, not LogoDark.svg
- Use WebP for photos (with PNG/JPG fallback)
- Use SVG for logos, icons, and illustrations
- Prefix with context: og-image.png, avatar.webp, logo-icon.svg

## Checklist

When replacing placeholder assets:

- [ ] Replace favicon.svg with real brand icon
- [ ] Add og-image.png (1200x630) for social sharing
- [ ] Add PWA icons (192x192, 512x512)
- [ ] Replace avatar placeholder in hero section
- [ ] Update Logo.tsx component with real logo
- [ ] Update manifest.json icon references
- [ ] Upload real project images through admin panel
- [ ] Test OG image with Facebook/Twitter card validators
- [ ] Verify favicon renders correctly across browsers
