import { Router, type Response } from 'express';
import { protect, type AuthRequest } from '../middleware/auth';
import RecentlyPlayed from '../models/RecentlyPlayed';
import SongLike from '../models/SongLike';
import Song from '../models/Song';

const router = Router();

// @route   POST /api/songs/:id/recently-played
// @desc    Add song to recently played
router.post('/:id/recently-played', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?._id;
  const songId = req.params.id;

  // Use upsert to update playedAt if already exists, otherwise create new
  await RecentlyPlayed.findOneAndUpdate(
    { userId, songId },
    { playedAt: new Date() },
    { upsert: true }
  );

  // Keep only the last 20 songs
  const count = await RecentlyPlayed.countDocuments({ userId });
  if (count > 20) {
    const oldest = await RecentlyPlayed.find({ userId }).sort({ playedAt: 1 }).limit(count - 20);
    await RecentlyPlayed.deleteMany({ _id: { $in: oldest.map(o => o._id) } });
  }

  res.status(200).json({ success: true });
});

// @route   GET /api/songs/recently-played
// @desc    Get recently played songs
router.get('/recently-played', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const recent = await RecentlyPlayed.find({ userId: req.user?._id })
    .sort({ playedAt: -1 })
    .limit(20)
    .populate('songId');
  
  res.status(200).json({ success: true, data: recent.map(r => r.songId) });
});

// @route   GET /api/songs/liked
// @desc    Get liked songs
router.get('/liked', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const likes = await SongLike.find({ userId: req.user?._id }).populate('songId');
  res.status(200).json({ success: true, data: likes.map(l => l.songId) });
});

export default router;
