import { useState, useEffect } from 'react';
import { Play, Heart, Users, Music2, BarChart3, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../../context/AuthContext';

type Song = {
  _id: string;
  title: string;
  genre: string;
  status: 'draft' | 'published';
  plays: number;
  createdAt: string;
};

type AnalyticsData = {
  totalPlays: number;
  totalLikes: number;
  followersCount: number;
  publishedSongsCount: number;
  topSongs: { _id: string; title: string; coverUrl: string; plays: number; likes: number }[];
};

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, songsRes] = await Promise.all([
        api.get<{ data: AnalyticsData }>('/artist/analytics'),
        api.get<{ data: Song[] }>('/songs/my-songs')
      ]);
      setAnalytics(analyticsRes.data.data);
      setSongs(songsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return;
    try {
      await api.delete(`/songs/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (!analytics) return <div className="p-6 text-red-400">Failed to load analytics</div>;

  return (
    <div className="p-4 space-y-8 pb-24 max-w-4xl mx-auto">
      <header className="space-y-1">
        <h1 className="text-2xl font-black">Artist Dashboard</h1>
        <p className="text-sm text-text-secondary">Welcome back, {user?.username}</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
            <Play className="text-brand-primary mb-2" size={20} />
            <p className="text-2xl font-black">{analytics.totalPlays.toLocaleString()}</p>
            <p className="text-xs text-text-secondary">Total Plays</p>
        </div>
        <div className="card">
            <Heart className="text-brand-secondary mb-2" size={20} />
            <p className="text-2xl font-black">{analytics.totalLikes.toLocaleString()}</p>
            <p className="text-xs text-text-secondary">Total Likes</p>
        </div>
        <div className="card">
            <Users className="text-indigo-400 mb-2" size={20} />
            <p className="text-2xl font-black">{analytics.followersCount.toLocaleString()}</p>
            <p className="text-xs text-text-secondary">Followers</p>
        </div>
        <div className="card">
            <Music2 className="text-emerald-400 mb-2" size={20} />
            <p className="text-2xl font-black">{analytics.publishedSongsCount}</p>
            <p className="text-xs text-text-secondary">Published Songs</p>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BarChart3 size={20} /> Top Performing Songs
        </h2>
        <div className="space-y-3">
          {analytics.topSongs.map((song, idx) => (
            <div key={song._id} className="card p-3 flex items-center gap-4">
              <span className="font-black text-slate-500 w-4">{idx + 1}</span>
              <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{song.title}</p>
                <p className="text-xs text-text-secondary">{song.plays.toLocaleString()} plays</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Your Songs</h2>
            <Link to="/upload" className="btn-primary text-xs py-2 px-4 flex items-center gap-2">
                <Plus size={16} /> Upload
            </Link>
        </div>
        {songs.length === 0 ? <p className="card text-sm text-text-secondary">No songs uploaded yet.</p> : (
          songs.map((song) => (
            <div key={song._id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{song.title}</p>
                <p className="text-xs text-text-secondary">{song.genre} • {song.status}</p>
              </div>
              <button onClick={() => handleDelete(song._id)} className="text-red-500 p-2"><Trash2 size={18} /></button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default ArtistDashboard;
