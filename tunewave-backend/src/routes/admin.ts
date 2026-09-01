import { Router, type Response } from 'express';
import { protect, restrictToAdmin, type AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Song from '../models/Song';
import Follow from '../models/Follow';
import SongLike from '../models/SongLike';
import cloudinary from '../config/cloudinary';

const router = Router();

// @route   GET /api/admin/dashboard
// @desc    Get platform stats
router.get('/dashboard', protect, restrictToAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  const [stats, users, artists, songs] = await Promise.all([
    Song.aggregate([
      {
        $group: {
          _id: null,
          totalPlays: { $sum: '$plays' },
          totalLikes: { $sum: '$likes' },
        },
      },
    ]),
    User.countDocuments(),
    User.countDocuments({ isArtist: true }),
    Song.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const songStats = songs.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, { published: 0, draft: 0 } as Record<string, number>);

  res.status(200).json({
    success: true,
    data: {
      totalUsers: users,
      totalArtists: artists,
      totalSongs: songStats.published + songStats.draft,
      publishedSongs: songStats.published,
      draftSongs: songStats.draft,
      totalPlays: stats[0]?.totalPlays || 0,
      totalLikes: stats[0]?.totalLikes || 0,
    },
  });
});

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', protect, restrictToAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  const users = await User.find().select('username email isArtist status createdAt');
  res.status(200).json({ success: true, data: users });
});

// @route   PUT /api/admin/users/:id/status
// @desc    Suspend/Activate user
router.put('/users/:id/status', protect, restrictToAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;
  if (!['active', 'suspended'].includes(status)) {
    res.status(400).json({ success: false, message: 'Invalid status' });
    return;
  }
  const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.status(200).json({ success: true, user });
});

// @route   GET /api/admin/artists
// @desc    Get all artists
router.get('/artists', protect, restrictToAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
    const artists = await User.find({ isArtist: true });
    res.status(200).json({ success: true, data: artists });
});

// @route   GET /api/admin/songs
// @desc    Get all songs
router.get('/songs', protect, restrictToAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
    const songs = await Song.find().populate('artistId', 'username');
    res.status(200).json({ success: true, data: songs });
});

// @route   DELETE /api/admin/songs/:id
// @desc    Remove a song
router.delete('/songs/:id', protect, restrictToAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    res.status(404).json({ success: false, message: 'Song not found' });
    return;
  }

  await cloudinary.uploader.destroy(song.publicId, { resource_type: 'video' });
  await song.deleteOne();
  
  res.status(200).json({ success: true, message: 'Song removed' });
});

export default router;
