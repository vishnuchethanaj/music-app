import { createContext, useCallback, useContext, useMemo, useState, type ReactNode, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import api from '../api/axios';
import { type Song } from './AuthContext';

type PlayerContextValue = {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  playSong: (song: Song, queue?: Song[]) => Promise<void>;
  togglePlay: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  incrementPlays: (id: string) => Promise<void>;
  toggleLike: (id: string, isLiked: boolean) => Promise<void>;
  progress: number;
  duration: number;
};

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playSong = useCallback(async (song: Song, newQueue?: Song[]) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: song.audioUrl },
      { shouldPlay: true }
    );
    
    sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setProgress(status.positionMillis);
          setDuration(status.durationMillis || 0);
          if (status.didJustFinish) {
             playNext();
          }
        }
    });

    soundRef.current = sound;
    setCurrentSong(song);
    setIsPlaying(true);
    if (newQueue) setQueue(newQueue);
    api.post(`/songs/${song._id}/play`).catch(console.error);
  }, []); // Note: This still needs to call playNext which requires queue

  // We need a stable reference to queue for playNext
  const queueRef = useRef<Song[]>([]);
  useEffect(() => { queueRef.current = queue; }, [queue]);

  const playNext = useCallback(async () => {
    const currentQueue = queueRef.current;
    if (currentQueue.length > 0) {
        const nextSong = currentQueue[0];
        const newQueue = currentQueue.slice(1);
        setQueue(newQueue);
        playSong(nextSong);
    } else {
        setIsPlaying(false);
    }
  }, [playSong]);

  const togglePlay = useCallback(async () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const playPrevious = useCallback(async () => {}, []);

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
    () => ({ 
        currentSong, 
        isPlaying, 
        queue, 
        playSong, 
        togglePlay, 
        playNext, 
        playPrevious, 
        incrementPlays, 
        toggleLike,
        progress,
        duration
    }),
    [currentSong, isPlaying, queue, playSong, togglePlay, playNext, playPrevious, incrementPlays, toggleLike, progress, duration],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};
