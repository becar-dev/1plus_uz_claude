import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// GET /api/projects - List all projects (public)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, category } = req.query;
    const where: Record<string, unknown> = {};

    if (status) where.status = status as string;
    if (category) where.category = category as string;

    const projects = await prisma.project.findMany({
      where,
      include: { images: { orderBy: { displayOrder: 'asc' } } },
      orderBy: { displayOrder: 'asc' },
    });

    const formatted = projects.map((p) => ({
      ...p,
      technologies: JSON.parse(p.technologies),
      tags: JSON.parse(p.tags),
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/projects/:id - Get single project (public)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    });

    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    const formatted = {
      ...project,
      technologies: JSON.parse(project.technologies),
      tags: JSON.parse(project.tags),
    };

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/projects - Create project (protected)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      slug,
      description,
      category,
      clientName,
      projectDate,
      externalUrl,
      technologies,
      tags,
      status,
      displayOrder,
    } = req.body;

    if (!title || !slug || !description || !category) {
      res.status(400).json({ success: false, error: 'Title, slug, description, and category are required' });
      return;
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        category,
        clientName: clientName || null,
        projectDate: projectDate ? new Date(projectDate) : null,
        externalUrl: externalUrl || null,
        technologies: JSON.stringify(technologies || []),
        tags: JSON.stringify(tags || []),
        status: status || 'draft',
        displayOrder: displayOrder || 0,
      },
      include: { images: true },
    });

    const formatted = {
      ...project,
      technologies: JSON.parse(project.technologies),
      tags: JSON.parse(project.tags),
    };

    res.status(201).json({ success: true, data: formatted });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/projects/reorder - Reorder projects (protected) - must be before /:id
router.put('/reorder', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.status(400).json({ success: false, error: 'Items array is required' });
      return;
    }

    await Promise.all(
      items.map((item: { id: string; displayOrder: number }) =>
        prisma.project.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      )
    );

    res.json({ success: true, message: 'Projects reordered successfully' });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/projects/:id - Update project (protected)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      description,
      category,
      clientName,
      projectDate,
      externalUrl,
      technologies,
      tags,
      status,
      displayOrder,
    } = req.body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (category !== undefined) data.category = category;
    if (clientName !== undefined) data.clientName = clientName;
    if (projectDate !== undefined) data.projectDate = projectDate ? new Date(projectDate) : null;
    if (externalUrl !== undefined) data.externalUrl = externalUrl;
    if (technologies !== undefined) data.technologies = JSON.stringify(technologies);
    if (tags !== undefined) data.tags = JSON.stringify(tags);
    if (status !== undefined) data.status = status;
    if (displayOrder !== undefined) data.displayOrder = displayOrder;

    const project = await prisma.project.update({
      where: { id },
      data,
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    });

    const formatted = {
      ...project,
      technologies: JSON.parse(project.technologies),
      tags: JSON.parse(project.tags),
    };

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/projects/:id - Delete project (protected)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    await prisma.project.delete({ where: { id } });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/projects/:id/images - Add image to project (protected)
router.post('/:id/images', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { url, alt, isPrimary, displayOrder } = req.body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    const image = await prisma.projectImage.create({
      data: {
        projectId: id,
        url,
        alt: alt || null,
        isPrimary: isPrimary || false,
        displayOrder: displayOrder || 0,
      },
    });

    res.status(201).json({ success: true, data: image });
  } catch (error) {
    console.error('Add image error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export { router as projectsRouter };
