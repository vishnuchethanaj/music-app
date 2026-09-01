import { Router, Request, Response } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

// @route   GET /api/songs
// @desc    Get all public songs
router.get('/', async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: [] });
});

// @route   POST /api/songs
// @desc    Upload a new song (Artist only)
router.post('/', protect, async (req: Request, res: Response) => {
  res.status(201).json({ success: true, message: 'Upload song endpoint' });
});

export default router;
