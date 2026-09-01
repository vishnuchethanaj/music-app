import { useState, useEffect, useMemo } from 'react';
import { Play, Search } from 'lucide-react';
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

const genres = ['Pop', 'Rock', 'Hip Hop', 'Classical', 'Indie', 'Electronic', 'Telugu', 'Hindi', 'English', 'Other'];

const Discover = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const { playSong } = usePlayer();

  useEffect(() => {
    api.get<{ data: Song[] }>('/songs').then((res) => setSongs(res.data.data));
  }, []);

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => 
      (song.title.toLowerCase().includes(search.toLowerCase()) || 
       song.artistName.toLowerCase().includes(search.toLowerCase())) &&
      (genre === '' || song.genre === genre)
    );
  }, [songs, search, genre]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-black">Discover</h1>
      
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search songs or artists..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-bg-surface p-3 pl-10 rounded-full text-sm"
        />
        <Search className="absolute left-3 top-3 text-text-secondary" size={18} />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        <button onClick={() => setGenre('')} className={`px-4 py-1 rounded-full text-xs ${genre === '' ? 'bg-brand-primary' : 'bg-bg-surface'}`}>All</button>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)} className={`px-4 py-1 rounded-full text-xs ${genre === g ? 'bg-brand-primary' : 'bg-bg-surface'}`}>{g}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredSongs.map((song) => (
          <div key={song._id} className="flex items-center gap-4 bg-bg-surface p-3 rounded-xl">
            <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-semibold text-sm">{song.title}</p>
              <p className="text-xs text-text-secondary">{song.artistName}</p>
            </div>
            <button onClick={() => playSong(song, filteredSongs)} className="p-2 bg-brand-primary rounded-full"><Play size={16} /></button>
          </div>
        ))}
        {filteredSongs.length === 0 && <p className="text-text-secondary text-sm text-center pt-10">No songs found.</p>}
      </div>
    </div>
  );
};

export default Discover;
