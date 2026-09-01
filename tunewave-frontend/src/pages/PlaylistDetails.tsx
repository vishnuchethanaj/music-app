import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play } from 'lucide-react';
import api from '../api/axios';
import { usePlayer, type Song } from '../context/PlayerContext';

type Playlist = {
  _id: string;
  name: string;
  description: string;
  songs: Song[];
};

const PlaylistDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const { playSong } = usePlayer();

  useEffect(() => {
    api.get<{ data: Playlist }>(`/playlists/${id}`).then((res) => setPlaylist(res.data.data));
  }, [id]);

  if (!playlist) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 space-y-6 pb-24">
      <h1 className="text-2xl font-black">{playlist.name}</h1>
      <p className="text-text-secondary">{playlist.description}</p>
      <button onClick={() => playlist.songs.length > 0 && playSong(playlist.songs[0], playlist.songs)} className="bg-brand-primary w-full p-4 rounded-full font-bold">Play All</button>
      
      {playlist.songs.map((song) => (
        <div key={song._id} onClick={() => playSong(song, playlist.songs)} className="flex items-center gap-4 bg-bg-surface p-3 rounded-xl">
          <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover" />
          <div className="flex-1">
            <p className="font-semibold text-sm">{song.title}</p>
            <p className="text-xs text-text-secondary">{song.artistName}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistDetails;
