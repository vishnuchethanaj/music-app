import { useState } from 'react';
import { Plus, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';

const Library = () => {
  const { likedSongs, recentSongs, playlists, createPlaylist } = useLibrary();
  const { playSong } = usePlayer();
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreate = async () => {
    if (!newPlaylistName) return;
    await createPlaylist(newPlaylistName);
    setNewPlaylistName('');
  };

  return (
    <div className="p-4 space-y-8 pb-24 max-w-4xl mx-auto">
      <h1 className="text-2xl font-black">Your Library</h1>

      <section>
        <h2 className="text-lg font-bold mb-3">Liked Songs</h2>
        {likedSongs.length === 0 ? <p className="text-sm text-text-secondary card">No liked songs yet.</p> : (
          likedSongs.map(song => (
            <div key={song._id} onClick={() => playSong(song, likedSongs)} className="flex items-center gap-4 card p-3 mb-2 cursor-pointer hover:bg-slate-700/50">
              <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <p className="font-semibold text-sm">{song.title}</p>
                <p className="text-xs text-text-secondary">{song.artistName}</p>
              </div>
            </div>
          ))
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Recently Played</h2>
        {recentSongs.length === 0 ? <p className="text-sm text-text-secondary card">No recently played songs.</p> : (
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {recentSongs.map(song => (
                    <div key={song._id} onClick={() => playSong(song, recentSongs)} className="min-w-[120px] card space-y-2">
                        <img src={song.coverUrl} className="w-full h-24 rounded-lg object-cover" />
                        <p className="font-semibold text-xs truncate">{song.title}</p>
                    </div>
                ))}
            </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Playlists</h2>
        <div className="flex gap-2 mb-3">
          <input value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} className="input-field flex-1 text-sm" placeholder="New playlist name" />
          <button onClick={handleCreate} className="bg-brand-primary p-3 rounded-full"><Plus size={20} /></button>
        </div>
        {playlists.map(pl => (
            <Link to={`/playlist/${pl._id}`} key={pl._id} className="card p-4 flex items-center justify-between mb-2">
                <div className='flex items-center gap-4'>
                    <div className='bg-slate-700 p-3 rounded-lg'><Music2 /></div>
                    <div>
                        <p className="font-semibold">{pl.name}</p>
                        <p className="text-xs text-text-secondary">{pl.songs.length} songs</p>
                    </div>
                </div>
            </Link>
        ))}
      </section>
    </div>
  );
};

export default Library;
