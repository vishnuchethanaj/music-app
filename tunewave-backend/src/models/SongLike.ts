import { Schema, model, type HydratedDocument } from 'mongoose';

export interface SongLike {
  userId: Schema.Types.ObjectId;
  songId: Schema.Types.ObjectId;
  createdAt: Date;
}

export type SongLikeDocument = HydratedDocument<SongLike>;

const SongLikeSchema = new Schema<SongLike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    songId: {
      type: Schema.Types.ObjectId,
      ref: 'Song',
      required: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate likes
SongLikeSchema.index({ userId: 1, songId: 1 }, { unique: true });

export default model<SongLike>('SongLike', SongLikeSchema);
