import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import api from '../api/axios';
import { type Song } from './PlayerContext';

type Playlist = {
  _id: string;
  name: string;
  description: string;
  songs: Song[];
};

type LibraryContextValue = {
  likedSongs: Song[];
  recentSongs: Song[];
  playlists: Playlist[];
  loading: boolean;
  fetchLibrary: () => Promise<void>;
  createPlaylist: (name: string, description?: string) => Promise<Playlist>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
};

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const [liked, recent, pls] = await Promise.all([
        api.get<{ data: Song[] }>('/songs/liked'),
        api.get<{ data: Song[] }>('/songs/recently-played'),
        api.get<{ data: Playlist[] }>('/playlists'),
      ]);
      setLikedSongs(liked.data.data);
      setRecentSongs(recent.data.data);
      setPlaylists(pls.data.data);
    } catch (error) {
      console.error('Failed to fetch library', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const createPlaylist = useCallback(async (name: string, description?: string) => {
    const res = await api.post<Playlist>('/playlists', { name, description });
    await fetchLibrary();
    return res.data;
  }, [fetchLibrary]);

  const addSongToPlaylist = useCallback(async (playlistId: string, songId: string) => {
    await api.post(`/playlists/${playlistId}/songs/${songId}`);
    await fetchLibrary();
  }, [fetchLibrary]);

  const value = useMemo(
    () => ({ likedSongs, recentSongs, playlists, loading, fetchLibrary, createPlaylist, addSongToPlaylist }),
    [likedSongs, recentSongs, playlists, loading, fetchLibrary, createPlaylist, addSongToPlaylist],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within LibraryProvider');
  return context;
};
