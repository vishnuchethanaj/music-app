import { Router, type Response } from 'express';
import { protect, restrictToArtist, type AuthRequest } from '../middleware/auth';
import Follow from '../models/Follow';
import User from '../models/User';

const router = Router();

// @route   POST /api/artists/:id/follow
// @desc    Follow an artist
router.post('/:id/follow', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const artistId = req.params.id;
  const followerId = req.user?._id;

  if (artistId === followerId?.toString()) {
    res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    return;
  }

  const artist = await User.findById(artistId);
  if (!artist || !artist.isArtist) {
    res.status(404).json({ success: false, message: 'Artist not found' });
    return;
  }

  try {
    await Follow.create({ followerId, artistId });
    const followersCount = await Follow.countDocuments({ artistId });
    res.status(200).json({ success: true, following: true, followersCount });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Already following' });
  }
});

// @route   DELETE /api/artists/:id/follow
// @desc    Unfollow an artist
router.delete('/:id/follow', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const artistId = req.params.id;
  const followerId = req.user?._id;

  await Follow.findOneAndDelete({ followerId, artistId });
  const followersCount = await Follow.countDocuments({ artistId });
  res.status(200).json({ success: true, following: false, followersCount });
});

// @route   GET /api/artists/:id/follow
// @desc    Get follow status and count
router.get('/:id/follow', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const artistId = req.params.id;
  const followerId = req.user?._id;

  const following = await Follow.exists({ followerId, artistId });
  const followersCount = await Follow.countDocuments({ artistId });
  res.status(200).json({ success: true, following: !!following, followersCount });
});

// @route   GET /api/artists/following
// @desc    Get followed artists
router.get('/following', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const following = await Follow.find({ followerId: req.user?._id }).populate('artistId', 'username profileImage');
  res.status(200).json({ success: true, data: following });
});

// @route   GET /api/artists/dashboard/followers
// @desc    Get follower stats
router.get('/dashboard/followers', protect, restrictToArtist, async (req: AuthRequest, res: Response): Promise<void> => {
  const followers = await Follow.find({ artistId: req.user?._id }).populate('followerId', 'username profileImage');
  res.status(200).json({ success: true, data: followers });
});

// @route   GET /api/artists/popular
// @desc    Get popular artists
router.get('/popular', async (_req, res: Response): Promise<void> => {
  const popular = await User.aggregate([
    { $match: { isArtist: true } },
    {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'artistId',
        as: 'followers'
      }
    },
    { $project: { username: 1, profileImage: 1, followersCount: { $size: '$followers' } } },
    { $sort: { followersCount: -1 } },
    { $limit: 10 }
  ]);
  res.status(200).json({ success: true, data: popular });
});

export default router;
