import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Heart, ChevronDown } from 'lucide-react';
import api from '../api/axios';
import { usePlayer, type Song } from '../context/PlayerContext';

const NowPlaying = () => {
  const { currentSong, isPlaying, togglePlay, toggleLike } = usePlayer();
  const [isLiked, setIsLiked] = useState(false);

  if (!currentSong) return <div className="p-6">No song playing</div>;

  return (
    <div className="fixed inset-0 bg-bg-base p-6 flex flex-col items-center justify-between z-50">
      <button onClick={() => window.history.back()}><ChevronDown /></button>
      <img src={currentSong.coverUrl} className="w-full aspect-square rounded-3xl" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">{currentSong.title}</h1>
        <p className="text-text-secondary">{currentSong.artistName}</p>
      </div>
      <div className="flex items-center gap-6">
        <button onClick={togglePlay} className="p-6 bg-white text-black rounded-full">
          {isPlaying ? <Play /> : <Play />}
        </button>
        <button onClick={() => { toggleLike(currentSong._id, isLiked); setIsLiked(!isLiked); }}>
          <Heart fill={isLiked ? 'red' : 'none'} />
        </button>
      </div>
    </div>
  );
};

export default NowPlaying;
