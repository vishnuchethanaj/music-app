import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import api from '../api/axios';
import { usePlayer, type Song } from '../context/PlayerContext';

const SongDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const { playSong, toggleLike } = usePlayer();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    api.get<{ data: Song }>(`/songs/${id}`).then((res) => setSong(res.data.data));
  }, [id]);

  if (!song) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 space-y-6">
      <img src={song.coverUrl} className="w-full aspect-square rounded-3xl shadow-2xl" />
      <div className="space-y-1">
        <h1 className="text-3xl font-black">{song.title}</h1>
        <Link to={`/artist/${song.artistId}`} className="text-brand-primary font-semibold">{song.artistName}</Link>
      </div>
      <div className="flex gap-4">
        <button onClick={() => playSong(song)} className="flex-1 bg-brand-primary p-4 rounded-full font-bold flex items-center justify-center gap-2">
          <Play fill="white" /> Play
        </button>
        <button onClick={() => { toggleLike(song._id, isLiked); setIsLiked(!isLiked); }} className="p-4 bg-bg-surface rounded-full">
          <Heart fill={isLiked ? 'red' : 'none'} color={isLiked ? 'red' : 'white'} />
        </button>
      </div>
      <p className="text-sm text-text-secondary">{song.description}</p>
    </div>
  );
};

export default SongDetails;
