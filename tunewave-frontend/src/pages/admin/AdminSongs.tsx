import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../../api/axios';

type Song = {
  _id: string;
  title: string;
  artistId: { username: string };
  genre: string;
  status: 'draft' | 'published';
};

const AdminSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = () => api.get<{ data: Song[] }>('/admin/songs').then(res => setSongs(res.data.data));

  const deleteSong = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await api.delete(`/admin/songs/${id}`);
    fetchSongs();
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <h1 className="text-2xl font-black">Song Moderation</h1>
      {songs.map(s => (
        <div key={s._id} className="bg-bg-surface p-4 rounded-xl flex justify-between items-center">
            <div>
                <p className="font-semibold">{s.title}</p>
                <p className="text-xs text-text-secondary">{s.artistId?.username} • {s.genre} • {s.status}</p>
            </div>
            <button onClick={() => deleteSong(s._id)} className="text-red-500"><Trash2 /></button>
        </div>
      ))}
    </div>
  );
};

export default AdminSongs;
