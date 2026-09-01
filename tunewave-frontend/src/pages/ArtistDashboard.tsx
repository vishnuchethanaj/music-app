import { useState, useEffect } from 'react';
import { Music2, TrendingUp, Mic2, BarChart3 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

type DashboardData = {
  artistName: string;
  totalSongs: number;
  totalPlays: number;
};

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get<{ data: DashboardData }>('/artist/dashboard');
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="p-6 text-center text-text-secondary">Loading dashboard...</div>;

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="space-y-1 pt-2">
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="text-sm text-text-secondary">Welcome back, {user?.username}</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl border border-slate-700 bg-bg-surface p-4 shadow-lg">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <Music2 size={20} />
          </div>
          <p className="text-2xl font-black">{data?.totalSongs || 0}</p>
          <p className="text-xs font-medium text-text-secondary">Songs</p>
        </div>
        <div className="rounded-3xl border border-slate-700 bg-bg-surface p-4 shadow-lg">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-secondary/10 text-brand-secondary">
            <TrendingUp size={20} />
          </div>
          <p className="text-2xl font-black">{data?.totalPlays || 0}</p>
          <p className="text-xs font-medium text-text-secondary">Total Plays</p>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-700 bg-bg-surface p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-white">
            <Mic2 size={28} />
          </div>
          <div>
            <h2 className="font-semibold">{data?.artistName}</h2>
            <p className="text-xs text-text-secondary">Artist Profile</p>
          </div>
        </div>
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-700 py-3 text-sm font-semibold text-white transition hover:bg-slate-600">
          <BarChart3 size={18} />
          View Analytics
        </button>
      </section>
    </div>
  );
};

export default ArtistDashboard;
