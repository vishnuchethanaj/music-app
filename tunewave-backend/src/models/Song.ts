import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  audioUrl: {
    type: String,
    required: true, // URL to cloud storage
  },
  coverUrl: {
    type: String,
    default: '',
  },
  duration: {
    type: Number, // In seconds
    default: 0,
  },
  plays: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model('Song', SongSchema);
