import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Settings, ShieldCheck, Sparkles, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="p-4 space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-brand-primary/25 via-bg-surface to-brand-secondary/20 p-5 pt-8 shadow-2xl shadow-black/20">
        <div className="flex flex-col items-center text-center">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.username}
              className="mb-4 h-24 w-24 rounded-full border-4 border-white/10 object-cover shadow-lg"
            />
          ) : (
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/10 bg-gradient-to-br from-brand-primary to-brand-secondary text-3xl font-black uppercase shadow-lg">
              {user.username.charAt(0)}
            </div>
          )}

          <h1 className="text-2xl font-black">{user.username}</h1>
          <p className="text-sm text-text-secondary">{user.email}</p>

          <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold">
            <ShieldCheck size={15} className={user.isArtist ? 'text-brand-secondary' : 'text-brand-primary'} />
            {user.isArtist ? 'Independent Artist' : 'Listener Account'}
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-slate-700 bg-bg-surface p-4">
        <div className="flex items-center justify-between rounded-2xl px-1 py-3">
          <div className="flex items-center gap-3">
            <Settings size={19} className="text-text-secondary" />
            <span className="font-medium">Account Settings</span>
          </div>
          <span className="text-text-secondary">›</span>
        </div>

        <Link to="/artist-dashboard" className="flex items-center justify-between rounded-2xl px-1 py-3">
          <div className="flex items-center gap-3">
            <Sparkles size={19} className="text-brand-secondary" />
            <span className="font-medium">Artist Dashboard</span>
          </div>
          <span className="text-text-secondary">›</span>
        </Link>
        
        {user.role === 'admin' && (
          <Link to="/admin" className="flex items-center justify-between rounded-2xl px-1 py-3 text-brand-primary">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={19} />
              <span className="font-medium">Admin Panel</span>
            </div>
            <span className="text-brand-primary">›</span>
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center justify-between rounded-2xl px-1 py-3 text-left disabled:opacity-60"
        >
          <div className="flex items-center gap-3 text-red-300">
            <LogOut size={19} />
            <span className="font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </div>
        </button>
      </section>
    </div>
  );
};

export default Profile;
