import { useState, useEffect } from 'react';
import { Music2, TrendingUp, Mic2, BarChart3, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

type Song = {
  _id: string;
  title: string;
  genre: string;
  status: 'draft' | 'published';
  plays: number;
  createdAt: string;
};

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await api.get<{ data: Song[] }>('/songs/my-songs');
      setSongs(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return;
    try {
      await api.delete(`/songs/${id}`);
      fetchDashboard();
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  if (loading) return <div className="p-6 text-center text-text-secondary">Loading dashboard...</div>;

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="space-y-1 pt-2">
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="text-sm text-text-secondary">Welcome back, {user?.username}</p>
      </header>

      <div className="flex gap-4">
        <Link to="/upload" className="flex-1 flex items-center justify-center gap-2 bg-brand-primary p-4 rounded-xl font-bold">
          <Plus size={20} /> Upload Song
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Your Songs</h2>
        {songs.length === 0 ? (
          <p className="text-text-secondary text-sm">No songs uploaded yet.</p>
        ) : (
          songs.map((song) => (
            <div key={song._id} className="bg-bg-surface p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-semibold">{song.title}</p>
                <p className="text-xs text-text-secondary">{song.genre} • {song.status}</p>
              </div>
              <button onClick={() => handleDelete(song._id)} className="text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default ArtistDashboard;
