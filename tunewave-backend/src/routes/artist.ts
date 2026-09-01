import { Router, type Response } from 'express';
import { protect, restrictToArtist, type AuthRequest } from '../middleware/auth';
import Follow from '../models/Follow';
import User from '../models/User';
import Song from '../models/Song';
import SongLike from '../models/SongLike';

const router = Router();

// @route   GET /api/artist/analytics
// @desc    Get artist analytics overview
router.get('/analytics', protect, restrictToArtist, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const artistId = req.user?._id;

    const [
      stats,
      followersCount,
      publishedSongsCount,
      draftSongsCount,
      topSongs
    ] = await Promise.all([
      Song.aggregate([
        { $match: { artistId } },
        {
          $group: {
            _id: null,
            totalPlays: { $sum: '$plays' },
            totalLikes: { $sum: '$likes' },
          },
        },
      ]),
      Follow.countDocuments({ artistId }),
      Song.countDocuments({ artistId, status: 'published' }),
      Song.countDocuments({ artistId, status: 'draft' }),
      Song.find({ artistId, status: 'published' })
        .sort({ plays: -1 })
        .limit(5)
        .select('title coverUrl plays likes'),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPlays: stats[0]?.totalPlays || 0,
        totalLikes: stats[0]?.totalLikes || 0,
        followersCount,
        publishedSongsCount,
        draftSongsCount,
        topSongs,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch analytics';
    res.status(500).json({ success: false, message });
  }
});

// @route   POST /api/artist/become
// @desc    Become an artist
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

// @route   GET /api/artist/dashboard
// @desc    Get dashboard stats
router.get('/dashboard', protect, restrictToArtist, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: {
        artistName: req.user?.username,
        totalSongs: await Song.countDocuments({ artistId: req.user?._id }),
        totalPlays: (await Song.aggregate([{ $match: { artistId: req.user?._id } }, { $group: { _id: null, plays: { $sum: '$plays' } } }]))[0]?.plays || 0,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch dashboard';
    res.status(500).json({ success: false, message });
  }
});

// @route   GET /api/artist/dashboard/followers
// @desc    Get follower stats
router.get('/dashboard/followers', protect, restrictToArtist, async (req: AuthRequest, res: Response): Promise<void> => {
  const followers = await Follow.find({ artistId: req.user?._id }).populate('followerId', 'username profileImage');
  res.status(200).json({ success: true, data: followers });
});

// @route   GET /api/artist/:id
// @desc    Get artist profile
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
