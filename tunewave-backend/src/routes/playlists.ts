import { Router, type Response } from 'express';
import { protect, type AuthRequest } from '../middleware/auth';
import Playlist from '../models/Playlist';
import { z } from 'zod';

const router = Router();

const playlistSchema = z.object({
  name: z.string().trim().min(1).max(50),
  description: z.string().trim().max(200).optional(),
});

router.post('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = playlistSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Invalid playlist data' });
    return;
  }

  const playlist = await Playlist.create({
    ...parsed.data,
    userId: req.user?._id,
  });
  res.status(201).json({ success: true, playlist });
});

router.get('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const playlists = await Playlist.find({ userId: req.user?._id });
  res.status(200).json({ success: true, data: playlists });
});

router.get('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.user?._id }).populate('songs');
  if (!playlist) {
    res.status(404).json({ success: false, message: 'Playlist not found' });
    return;
  }
  res.status(200).json({ success: true, data: playlist });
});

router.put('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = playlistSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Invalid playlist data' });
    return;
  }

  const playlist = await Playlist.findOneAndUpdate(
    { _id: req.params.id, userId: req.user?._id },
    parsed.data,
    { new: true }
  );
  if (!playlist) {
    res.status(404).json({ success: false, message: 'Playlist not found' });
    return;
  }
  res.status(200).json({ success: true, playlist });
});

router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, userId: req.user?._id });
  if (!playlist) {
    res.status(404).json({ success: false, message: 'Playlist not found' });
    return;
  }
  res.status(200).json({ success: true, message: 'Playlist deleted' });
});

router.post('/:id/songs/:songId', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: req.params.id, userId: req.user?._id },
    { $addToSet: { songs: req.params.songId } },
    { new: true }
  );
  if (!playlist) {
    res.status(404).json({ success: false, message: 'Playlist not found' });
    return;
  }
  res.status(200).json({ success: true, playlist });
});

router.delete('/:id/songs/:songId', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: req.params.id, userId: req.user?._id },
    { $pull: { songs: req.params.songId } },
    { new: true }
  );
  if (!playlist) {
    res.status(404).json({ success: false, message: 'Playlist not found' });
    return;
  }
  res.status(200).json({ success: true, playlist });
});

export default router;
