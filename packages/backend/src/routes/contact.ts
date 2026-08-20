import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/contact - Handle contact form submissions
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, error: 'Name, email, and message are required' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, error: 'Please provide a valid email address' });
      return;
    }

    // Log the contact submission (in production, you would send an email or store in DB)
    console.log('Contact form submission:', { name, email, message: message.substring(0, 100) });

    res.json({ success: true, message: 'Message received successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export { router as contactRouter };
