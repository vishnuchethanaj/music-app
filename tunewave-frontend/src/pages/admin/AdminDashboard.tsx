import { useState, useEffect } from 'react';
import { Play, Heart, Users, Music2 } from 'lucide-react';
import api from '../../api/axios';

type Stats = {
  totalUsers: number;
  totalArtists: number;
  totalSongs: number;
  publishedSongs: number;
  draftSongs: number;
  totalPlays: number;
  totalLikes: number;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Stats }>('/admin/dashboard').then((res) => setStats(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (!stats) return <div className="p-6 text-red-400">Failed to load admin dashboard</div>;

  return (
    <div className="p-4 space-y-8 pb-24 max-w-4xl mx-auto">
      <h1 className="text-2xl font-black">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
            <Users className="text-brand-primary mb-2" size={20}/>
            <p className="text-2xl font-black">{stats.totalUsers}</p>
            <p className="text-xs text-text-secondary">Total Users</p>
        </div>
        <div className="card">
            <Music2 className="text-brand-secondary mb-2" size={20}/>
            <p className="text-2xl font-black">{stats.totalSongs}</p>
            <p className="text-xs text-text-secondary">Total Songs</p>
        </div>
        <div className="card">
            <Play className="text-emerald-400 mb-2" size={20}/>
            <p className="text-2xl font-black">{stats.totalPlays.toLocaleString()}</p>
            <p className="text-xs text-text-secondary">Total Plays</p>
        </div>
        <div className="card">
            <Heart className="text-red-400 mb-2" size={20}/>
            <p className="text-2xl font-black">{stats.totalLikes.toLocaleString()}</p>
            <p className="text-xs text-text-secondary">Total Likes</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
