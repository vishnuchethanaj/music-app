import { Router, type Response } from 'express';
import { protect, type AuthRequest } from '../middleware/auth';
import Notification from '../models/Notification';

const router = Router();

// @route   GET /api/notifications
// @desc    Get user notifications
router.get('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const notifications = await Notification.find({ recipientId: req.user?._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.status(200).json({ success: true, data: notifications });
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread count
router.get('/unread-count', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const unreadCount = await Notification.countDocuments({ 
    recipientId: req.user?._id, 
    isRead: false 
  });
  res.status(200).json({ success: true, unreadCount });
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
router.put('/:id/read', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipientId: req.user?._id },
    { isRead: true },
    { new: true }
  );
  
  if (!notification) {
    res.status(404).json({ success: false, message: 'Notification not found' });
    return;
  }
  
  res.status(200).json({ success: true });
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all as read
router.put('/read-all', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  await Notification.updateMany(
    { recipientId: req.user?._id, isRead: false },
    { isRead: true }
  );
  res.status(200).json({ success: true });
});

export default router;
