# 1PLUS Creative Digital Studio

Premium creative digital studio website featuring immersive 3D experiences, sophisticated animations, and a full-featured admin panel for project management.

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Custom Properties
- **3D:** Three.js (dynamically imported)
- **Animation:** GSAP + Framer Motion
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js + Express.js
- **Database:** SQLite via Prisma ORM
- **Auth:** JWT (JSON Web Tokens)
- **File Upload:** Multer

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: 22.x)
- npm 9+ (recommended: 11.x)

### Installation

    git clone https://github.com/becar-dev/1plus_uz_claude.git
    cd 1plus_uz_claude
    npm install
    npm run prisma:generate
    npm run seed

### Development

    npm run dev
    # Frontend: http://localhost:3000
    # Backend: http://localhost:4000

### Build

    npm run build

## Environment Variables

### Frontend (packages/frontend/.env.local)
    NEXT_PUBLIC_API_URL=http://localhost:4000/api

### Backend (packages/backend/.env)
    PORT=4000
    DATABASE_URL="file:./dev.db"
    JWT_SECRET=your-secret-key-here
    UPLOAD_DIR=./uploads
    CORS_ORIGIN=http://localhost:3000

## Key Features

### Public Site
- 3D Hero with Three.js, GSAP animations, and parallax
- Filterable portfolio grid with detail pages
- Day/Night theme system with smooth transitions
- Mobile-first responsive design
- WCAG AA accessible, keyboard navigable
- Full SEO: Open Graph, JSON-LD, sitemap, robots.txt
- Custom cursor (desktop only, respects reduced motion)
- Page transitions with framer-motion
- Scroll progress indicator

### Admin Panel
- JWT authentication
- Project CRUD with image upload
- Drag-and-drop project reordering
- Dashboard with statistics

## Security Headers

- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- Referrer-Policy: strict-origin-when-cross-origin
- X-DNS-Prefetch-Control: on
- Permissions-Policy: camera=(), microphone=(), geolocation=()

## SEO

- Open Graph + Twitter Card meta tags
- JSON-LD structured data (Organization + WebSite)
- Dynamic sitemap at /sitemap.xml
- robots.txt allowing all crawlers
- Canonical URLs and PWA manifest

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/projects | List published projects |
| POST | /api/auth/login | Admin login |
| POST | /api/projects | Create project (auth) |
| PUT | /api/projects/:id | Update project (auth) |
| DELETE | /api/projects/:id | Delete project (auth) |
| POST | /api/upload | Upload image (auth) |

## License

Private. All rights reserved by 1PLUS Studio.
