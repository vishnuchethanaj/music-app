import { Router, type Response } from 'express';
import { protect, restrictToArtist, type AuthRequest } from '../middleware/auth';
import upload from '../middleware/upload';
import cloudinary from '../config/cloudinary';
import Song from '../models/Song';
import SongLike from '../models/SongLike';
const router = Router();

// @route   POST /api/songs/upload
// @desc    Upload song
router.post(
  '/upload',
  protect,
  restrictToArtist,
  upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const { title, genre, description } = req.body;

      if (!files.audio?.[0] || !title || !genre) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
      }

      // Upload Audio
      const audioResult = await cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'songs/audio' },
        (error, result) => {
          if (error) throw error;
          return result;
        }
      ).end(files.audio[0].buffer);

      // Upload Cover (Optional)
      let coverUrl = '';
      let publicId = '';
      if (files.cover?.[0]) {
        const coverResult = await cloudinary.uploader.upload(
          `data:${files.cover[0].mimetype};base64,${files.cover[0].buffer.toString('base64')}`,
          { folder: 'songs/covers' }
        );
        coverUrl = coverResult.secure_url;
        publicId = coverResult.public_id;
      }

      // Save to MongoDB
      const song = await Song.create({
        title,
        genre,
        description,
        audioUrl: (audioResult as any).secure_url,
        publicId: (audioResult as any).public_id,
        coverUrl,
        artistId: req.user?._id,
        artistName: req.user?.username,
      });

      res.status(201).json({ success: true, song });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Upload failed' });
    }
  }
);

// @route   GET /api/songs/my-songs
// @desc    Get artist's songs
router.get('/my-songs', protect, restrictToArtist, async (req: AuthRequest, res: Response): Promise<void> => {
  const songs = await Song.find({ artistId: req.user?._id });
  res.status(200).json({ success: true, data: songs });
});

// @route   DELETE /api/songs/:id
// @desc    Delete song
router.delete('/:id', protect, restrictToArtist, async (req: AuthRequest, res: Response): Promise<void> => {
  const song = await Song.findOne({ _id: req.params.id, artistId: req.user?._id });
  
  if (!song) {
    res.status(404).json({ success: false, message: 'Song not found' });
    return;
  }

  await cloudinary.uploader.destroy(song.publicId, { resource_type: 'video' });
  await song.deleteOne();
  
  res.status(200).json({ success: true, message: 'Song deleted' });
});

// @route   GET /api/songs
// @desc    Get all published songs
router.get('/', async (_req, res: Response): Promise<void> => {
  const songs = await Song.find({ status: 'published' }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: songs });
});

router.post('/:id/play', async (req: Request, res: Response): Promise<void> => {
  const song = await Song.findByIdAndUpdate(req.params.id, { $inc: { plays: 1 } }, { new: true });
  if (!song) {
    res.status(404).json({ success: false, message: 'Song not found' });
    return;
  }
  res.status(200).json({ success: true, plays: song.plays });
});

router.post('/:id/like', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await SongLike.create({ userId: req.user?._id, songId: req.params.id });
    await Song.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Already liked' });
  }
});

router.delete('/:id/like', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const like = await SongLike.findOneAndDelete({ userId: req.user?._id, songId: req.params.id });
  if (like) {
    await Song.findByIdAndUpdate(req.params.id, { $inc: { likes: -1 } });
  }
  res.status(200).json({ success: true });
});
export default router;
