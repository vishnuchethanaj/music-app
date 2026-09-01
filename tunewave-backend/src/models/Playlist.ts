import { Schema, model, type HydratedDocument } from 'mongoose';

export interface Playlist {
  name: string;
  userId: Schema.Types.ObjectId;
  description: string;
  coverUrl: string;
  songs: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type PlaylistDocument = HydratedDocument<Playlist>;

const PlaylistSchema = new Schema<Playlist>(
  {
    name: {
      type: String,
      required: [true, 'Playlist name is required'],
      trim: true,
      maxlength: [50, 'Name must be 50 characters or less'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [200, 'Description must be 200 characters or less'],
    },
    coverUrl: {
      type: String,
      default: '',
    },
    songs: [{
      type: Schema.Types.ObjectId,
      ref: 'Song',
    }],
  },
  { timestamps: true },
);

PlaylistSchema.index({ userId: 1 });

export default model<Playlist>('Playlist', PlaylistSchema);
