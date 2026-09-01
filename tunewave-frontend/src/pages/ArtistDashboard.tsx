import { useState, useEffect } from 'react';
import { BarChart3, Users, Play, Heart, Music2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

type AnalyticsData = {
  totalPlays: number;
  totalLikes: number;
  followersCount: number;
  publishedSongsCount: number;
  draftSongsCount: number;
  topSongs: { _id: string; title: string; coverUrl: string; plays: number; likes: number }[];
};

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get<{ data: AnalyticsData }>('/artist/analytics');
        setAnalytics(response.data.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-6 text-center text-text-secondary">Loading analytics...</div>;
  if (!analytics) return <div className="p-6 text-center text-red-400">Failed to load analytics</div>;

  return (
    <div className="p-4 space-y-8 pb-24">
      <header className="space-y-1">
        <h1 className="text-2xl font-black">Artist Analytics</h1>
        <p className="text-sm text-text-secondary">Welcome back, {user?.username}</p>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl border border-slate-700 bg-bg-surface p-4">
          <Play className="mb-2 text-brand-primary" size={20} />
          <p className="text-2xl font-black">{analytics.totalPlays.toLocaleString()}</p>
          <p className="text-xs text-text-secondary font-medium">Total Plays</p>
        </div>
        <div className="rounded-3xl border border-slate-700 bg-bg-surface p-4">
          <Heart className="mb-2 text-brand-secondary" size={20} />
          <p className="text-2xl font-black">{analytics.totalLikes.toLocaleString()}</p>
          <p className="text-xs text-text-secondary font-medium">Total Likes</p>
        </div>
        <div className="rounded-3xl border border-slate-700 bg-bg-surface p-4">
          <Users className="mb-2 text-indigo-400" size={20} />
          <p className="text-2xl font-black">{analytics.followersCount.toLocaleString()}</p>
          <p className="text-xs text-text-secondary font-medium">Followers</p>
        </div>
        <div className="rounded-3xl border border-slate-700 bg-bg-surface p-4">
          <Music2 className="mb-2 text-emerald-400" size={20} />
          <p className="text-2xl font-black">{analytics.publishedSongsCount}</p>
          <p className="text-xs text-text-secondary font-medium">Published Songs</p>
        </div>
      </div>

      {/* Top Songs */}
      <section>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BarChart3 size={20} /> Top Performing Songs
        </h2>
        {analytics.topSongs.length === 0 ? (
          <div className="bg-bg-surface p-6 rounded-2xl text-center border border-dashed border-slate-700">
             <p className="text-sm text-text-secondary">Upload and publish your first song to see performance data!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analytics.topSongs.map((song, idx) => (
              <div key={song._id} className="flex items-center gap-4 bg-bg-surface p-3 rounded-xl">
                <span className="font-black text-slate-500 w-4">{idx + 1}</span>
                <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{song.title}</p>
                  <p className="text-xs text-text-secondary">{song.plays.toLocaleString()} plays • {song.likes.toLocaleString()} likes</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex gap-4">
        <Link to="/upload" className="flex-1 flex items-center justify-center gap-2 bg-brand-primary p-4 rounded-xl font-bold text-sm">
          Upload New Song
        </Link>
      </div>
    </div>
  );
};

export default ArtistDashboard;
