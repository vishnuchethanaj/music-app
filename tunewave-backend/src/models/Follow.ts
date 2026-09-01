import { Schema, model, type HydratedDocument } from 'mongoose';

export interface Follow {
  followerId: Schema.Types.ObjectId;
  artistId: Schema.Types.ObjectId;
  createdAt: Date;
}

export type FollowDocument = HydratedDocument<Follow>;

const FollowSchema = new Schema<Follow>(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Follower ID is required'],
    },
    artistId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Artist ID is required'],
    },
  },
  { timestamps: true },
);

// Prevent duplicate follows
FollowSchema.index({ followerId: 1, artistId: 1 }, { unique: true });

export default model<Follow>('Follow', FollowSchema);
