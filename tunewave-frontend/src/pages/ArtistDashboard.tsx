import { Music2, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ArtistDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 space-y-6">
      <header className="space-y-2 pt-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-secondary">Artist Space</p>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-text-secondary">
          {user?.isArtist
            ? 'Your creator tools will live here after uploads are enabled.'
            : 'Become an artist to publish original tracks on TuneWave.'}
        </p>
      </header>

      <section className="rounded-3xl border border-slate-700 bg-bg-surface p-5 shadow-xl shadow-black/10">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/15 text-brand-primary">
            <Music2 size={28} />
          </div>
          <div>
            <h2 className="font-semibold">{user?.isArtist ? 'Artist account active' : 'Listener account'}</h2>
            <p className="text-sm text-text-secondary">
              {user?.isArtist ? 'Ready for future publishing tools.' : 'Artist onboarding is protected and ready for Phase 3.'}
            </p>
          </div>
        </div>
      </section>

      <Link
        to="/upload"
        className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/25"
      >
        <UploadCloud size={18} />
        Open Become an Artist
      </Link>
    </div>
  );
};

export default ArtistDashboard;
