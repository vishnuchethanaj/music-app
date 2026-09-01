import { useState, useEffect, useMemo } from 'react';
import { Play, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { usePlayer, type Song } from '../context/PlayerContext';

type Artist = {
  _id: string;
  username: string;
  profileImage: string;
  followersCount: number;
};

const genres = ['Pop', 'Rock', 'Hip Hop', 'Classical', 'Indie', 'Electronic', 'Telugu', 'Hindi', 'English', 'Other'];

const Discover = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const { playSong } = usePlayer();

  useEffect(() => {
    api.get<{ data: Song[] }>('/songs').then((res) => setSongs(res.data.data));
    api.get<{ data: Artist[] }>('/artists/popular').then((res) => setArtists(res.data.data)).catch(() => setArtists([]));
  }, []);

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => 
      (song.title.toLowerCase().includes(search.toLowerCase()) || 
       song.artistName.toLowerCase().includes(search.toLowerCase())) &&
      (genre === '' || song.genre === genre)
    );
  }, [songs, search, genre]);

  return (
    <div className="p-4 space-y-8 pb-24 max-w-4xl mx-auto">
      <h1 className="text-2xl font-black">Discover</h1>
      
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search songs or artists..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full input-field pl-10"
        />
        <Search className="absolute left-3 top-3 text-text-secondary" size={18} />
      </div>

      <section>
        <h2 className="text-lg font-bold mb-3">Popular Artists</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {artists.map(artist => (
                <Link to={`/artist/${artist._id}`} key={artist._id} className="min-w-[100px] text-center space-y-2 card">
                    {artist.profileImage ? (
                        <img src={artist.profileImage} className="w-20 h-20 rounded-full object-cover mx-auto" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mx-auto"><User size={30} /></div>
                    )}
                    <p className="font-semibold text-sm truncate">{artist.username}</p>
                </Link>
            ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Genres</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => setGenre('')} className={`px-4 py-2 rounded-full text-xs font-bold ${genre === '' ? 'bg-brand-primary' : 'bg-bg-surface border border-slate-700'}`}>All</button>
            {genres.map((g) => (
            <button key={g} onClick={() => setGenre(g)} className={`px-4 py-2 rounded-full text-xs font-bold ${genre === g ? 'bg-brand-primary' : 'bg-bg-surface border border-slate-700'}`}>{g}</button>
            ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Songs</h2>
        {filteredSongs.map((song) => (
          <div key={song._id} className="flex items-center gap-4 card p-3">
            <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-semibold text-sm">{song.title}</p>
              <p className="text-xs text-text-secondary">{song.artistName}</p>
            </div>
            <button onClick={() => playSong(song, filteredSongs)} className="p-2 bg-brand-primary rounded-full"><Play size={16} /></button>
          </div>
        ))}
        {filteredSongs.length === 0 && <p className="text-text-secondary text-sm text-center pt-10 card">No songs found.</p>}
      </section>
    </div>
  );
};

export default Discover;
