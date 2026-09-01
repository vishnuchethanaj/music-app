import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import api from '../api/axios';
import { usePlayer } from '../context/PlayerContext';

type Song = {
  _id: string;
  title: string;
  artistName: string;
  audioUrl: string;
  coverUrl: string;
  genre: string;
  duration: number;
};

const Home = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const { playSong } = usePlayer();

  useEffect(() => {
    api.get<{ data: Song[] }>('/songs').then((res) => setSongs(res.data.data));
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-black">Trending Now</h1>
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {songs.map((song) => (
          <div key={song._id} className="min-w-[140px] space-y-2">
            <div className="relative w-[140px] h-[140px] rounded-2xl shadow-lg overflow-hidden">
              <img src={song.coverUrl} className="w-full h-full object-cover" />
              <button 
                onClick={() => playSong(song, songs)} 
                className="absolute bottom-2 right-2 p-2 bg-brand-primary rounded-full"
              >
                <Play size={16} fill="white" />
              </button>
            </div>
            <p className="font-medium text-sm truncate">{song.title}</p>
            <p className="text-xs text-text-secondary truncate">{song.artistName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
