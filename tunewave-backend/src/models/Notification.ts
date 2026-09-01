import { Schema, model, type HydratedDocument } from 'mongoose';

export type NotificationType = 'FOLLOW' | 'LIKE' | 'NEW_SONG';

export interface Notification {
  recipientId: Schema.Types.ObjectId;
  senderId?: Schema.Types.ObjectId;
  type: NotificationType;
  songId?: Schema.Types.ObjectId;
  artistId?: Schema.Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationDocument = HydratedDocument<Notification>;

const NotificationSchema = new Schema<Notification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['FOLLOW', 'LIKE', 'NEW_SONG'],
      required: true,
    },
    songId: {
      type: Schema.Types.ObjectId,
      ref: 'Song',
    },
    artistId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Compound index for efficient querying by recipient
NotificationSchema.index({ recipientId: 1, createdAt: -1 });

export default model<Notification>('Notification', NotificationSchema);
