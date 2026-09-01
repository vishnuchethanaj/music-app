import { useState } from 'react';
import { Plus } from 'lucide-react';
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
    <div className="p-4 space-y-6 pb-24">
      <h1 className="text-2xl font-black">Your Library</h1>

      <section>
        <h2 className="text-lg font-bold mb-3">Liked Songs</h2>
        {likedSongs.length === 0 ? <p className="text-sm text-text-secondary">No liked songs yet.</p> : (
          likedSongs.map(song => (
            <div key={song._id} onClick={() => playSong(song, likedSongs)} className="flex items-center gap-4 bg-bg-surface p-3 rounded-xl mb-2">
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
        <h2 className="text-lg font-bold mb-3">Playlists</h2>
        <div className="flex gap-2 mb-3">
          <input value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} className="bg-bg-surface p-2 rounded-full text-sm flex-1" placeholder="New playlist name" />
          <button onClick={handleCreate} className="bg-brand-primary p-2 rounded-full"><Plus /></button>
        </div>
        {playlists.map(pl => (
            <div key={pl._id} className="bg-bg-surface p-3 rounded-xl mb-2">
                <p className="font-semibold">{pl.name}</p>
                <p className="text-xs text-text-secondary">{pl.songs.length} songs</p>
            </div>
        ))}
      </section>
    </div>
  );
};

export default Library;
