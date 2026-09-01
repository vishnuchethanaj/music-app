import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import api from '../api/axios';
import { type Song } from './AuthContext';

type PlayerContextValue = {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  incrementPlays: (id: string) => Promise<void>;
  toggleLike: (id: string, isLiked: boolean) => Promise<void>;
};

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);

  const playSong = useCallback((song: Song, newQueue?: Song[]) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (newQueue) setQueue(newQueue);
    api.post(`/songs/${song._id}/play`).catch(console.error);
  }, []);

  const togglePlay = useCallback(() => setIsPlaying((prev) => !prev), []);

  const playNext = useCallback(() => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setQueue((prev) => prev.slice(1));
      playSong(nextSong);
    }
  }, [queue, playSong]);

  const playPrevious = useCallback(() => {}, []);

  const incrementPlays = useCallback(async (id: string) => {
    await api.post(`/songs/${id}/play`);
  }, []);

  const toggleLike = useCallback(async (id: string, isLiked: boolean) => {
    if (isLiked) {
      await api.delete(`/songs/${id}/like`);
    } else {
      await api.post(`/songs/${id}/like`);
    }
  }, []);

  const value = useMemo(
    () => ({ currentSong, isPlaying, queue, playSong, togglePlay, playNext, playPrevious, incrementPlays, toggleLike }),
    [currentSong, isPlaying, queue, playSong, togglePlay, playNext, playPrevious, incrementPlays, toggleLike],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};
