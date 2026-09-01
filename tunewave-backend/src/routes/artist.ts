import { Router, type Request, type Response } from 'express';
import { protect, restrictToArtist, type AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = Router();

router.post('/become', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    
    if (user.isArtist) {
      res.status(400).json({ success: false, message: 'User is already an artist' });
      return;
    }

    user.isArtist = true;
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upgrade to artist';
    res.status(500).json({ success: false, message });
  }
});

router.get('/dashboard', protect, restrictToArtist, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // In future: fetch song stats from Song model
    res.status(200).json({
      success: true,
      data: {
        artistName: req.user?.username,
        totalSongs: 0,
        totalPlays: 0,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch dashboard';
    res.status(500).json({ success: false, message });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const artist = await User.findOne({ _id: req.params.id, isArtist: true });
    
    if (!artist) {
      res.status(404).json({ success: false, message: 'Artist not found' });
      return;
    }

    res.status(200).json({
      success: true,
      artist: {
        _id: artist.id,
        username: artist.username,
        bio: artist.bio,
        profileImage: artist.profileImage,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch artist';
    res.status(500).json({ success: false, message });
  }
});

export default router;
