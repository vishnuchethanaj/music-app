import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Music2, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Upload = () => {
  const { user, becomeArtist } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (user?.isArtist) {
    navigate('/artist-dashboard', { replace: true });
    return null;
  }

  const handleBecomeArtist = async () => {
    setIsLoading(true);
    try {
      await becomeArtist();
      navigate('/artist-dashboard', { replace: true });
    } catch (error) {
      console.error('Failed to become artist', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm space-y-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
          <Sparkles size={40} />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-black tracking-tight">Become an Artist</h1>
          <p className="text-text-secondary leading-relaxed">
            Ready to share your sound? Join the TuneWave artist community and publish your original music to the world.
          </p>
        </div>

        <div className="space-y-4 text-left">
          <div className="flex items-center gap-4 rounded-2xl bg-bg-surface p-4">
            <Music2 className="text-brand-primary" />
            <span className="text-sm">Publish original tracks</span>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-bg-surface p-4">
            <TrendingUp className="text-brand-secondary" />
            <span className="text-sm">Track your audience</span>
          </div>
        </div>

        <button
          onClick={handleBecomeArtist}
          disabled={isLoading}
          className="w-full rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-6 py-4 font-bold text-white shadow-lg shadow-brand-primary/20 transition disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Become an Artist'}
        </button>
      </div>
    </div>
  );
};

export default Upload;
