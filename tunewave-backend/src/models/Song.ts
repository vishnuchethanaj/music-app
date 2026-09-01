import { Schema, model, type HydratedDocument } from 'mongoose';

export interface Song {
  title: string;
  artistId: Schema.Types.ObjectId;
  artistName: string;
  audioUrl: string;
  coverUrl: string;
  publicId: string;
  genre: string;
  description: string;
  duration: number;
  plays: number;
  likes: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export type SongDocument = HydratedDocument<Song>;

const SongSchema = new Schema<Song>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    artistId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Artist ID is required'],
    },
    artistName: {
      type: String,
      required: [true, 'Artist name is required'],
      trim: true,
    },
    audioUrl: {
      type: String,
      required: [true, 'Audio URL is required'],
    },
    coverUrl: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      required: [true, 'Public ID is required'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description must be 500 characters or less'],
    },
    duration: {
      type: Number,
      default: 0,
    },
    plays: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
  },
  { timestamps: true },
);

export default model<Song>('Song', SongSchema);
