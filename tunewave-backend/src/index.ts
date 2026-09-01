import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import artistRoutes from './routes/artist';
import songRoutes from './routes/songs';
import playlistRoutes from './routes/playlists';
import recentlyPlayedRoutes from './routes/recentlyPlayed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/artist', artistRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/songs', recentlyPlayedRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'TuneWave API is running' });
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown startup error';
    console.error(`Server startup failed: ${message}`);
    process.exit(1);
  }
};

void startServer();
