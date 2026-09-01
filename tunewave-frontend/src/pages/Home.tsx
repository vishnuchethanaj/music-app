import { useState, useEffect } from 'react';
import NotificationBell from '../components/NotificationBell';
import api from '../api/axios';
import { usePlayer, type Song } from '../context/PlayerContext';

const Home = () => {
  const [trending, setTrending] = useState<Song[]>([]);
  const [followed, setFollowed] = useState<Song[]>([]);
  const { playSong } = usePlayer();

  useEffect(() => {
    api.get<{ data: Song[] }>('/songs').then((res) => setTrending(res.data.data));
    api.get<{ data: Song[] }>('/songs/followed').then((res) => setFollowed(res.data.data)).catch(() => setFollowed([]));
  }, []);

  return (
    <div className="p-4 space-y-8 pb-24">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-black">TuneWave</h1>
        <NotificationBell />
      </header>
      
      <section>
        <h2 className="text-lg font-bold mb-3">From Artists You Follow</h2>
        {followed.length === 0 ? (
          <p className="text-sm text-text-secondary">Follow artists to see their latest music here.</p>
        ) : (
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {followed.map((song) => (
              <div key={song._id} className="min-w-[140px] space-y-2">
                <div className="relative w-[140px] h-[140px] rounded-2xl shadow-lg overflow-hidden">
                  <img src={song.coverUrl} className="w-full h-full object-cover" />
                  <button onClick={() => playSong(song, followed)} className="absolute bottom-2 right-2 p-2 bg-brand-primary rounded-full"><Play size={16} fill="white" /></button>
                </div>
                <p className="font-medium text-sm truncate">{song.title}</p>
                <p className="text-xs text-text-secondary truncate">{song.artistName}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Trending Now</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {trending.map((song) => (
            <div key={song._id} className="min-w-[140px] space-y-2">
              <div className="relative w-[140px] h-[140px] rounded-2xl shadow-lg overflow-hidden">
                <img src={song.coverUrl} className="w-full h-full object-cover" />
                <button onClick={() => playSong(song, trending)} className="absolute bottom-2 right-2 p-2 bg-brand-primary rounded-full"><Play size={16} fill="white" /></button>
              </div>
              <p className="font-medium text-sm truncate">{song.title}</p>
              <p className="text-xs text-text-secondary truncate">{song.artistName}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
