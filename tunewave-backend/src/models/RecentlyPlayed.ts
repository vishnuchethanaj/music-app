import { Schema, model, type HydratedDocument } from 'mongoose';

export interface RecentlyPlayed {
  userId: Schema.Types.ObjectId;
  songId: Schema.Types.ObjectId;
  playedAt: Date;
}

export type RecentlyPlayedDocument = HydratedDocument<RecentlyPlayed>;

const RecentlyPlayedSchema = new Schema<RecentlyPlayed>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    songId: {
      type: Schema.Types.ObjectId,
      ref: 'Song',
      required: [true, 'Song ID is required'],
    },
    playedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Index for efficient querying of user's recent songs
RecentlyPlayedSchema.index({ userId: 1, playedAt: -1 });

export default model<RecentlyPlayed>('RecentlyPlayed', RecentlyPlayedSchema);
