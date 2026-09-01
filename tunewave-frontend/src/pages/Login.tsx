import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, RadioTower } from 'lucide-react';
import { apiErrorMessage } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { from?: { pathname?: string } } | null;
  const from = locationState?.from?.pathname || '/home';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (submitError) {
      setError(apiErrorMessage(submitError, 'Login failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm space-y-8">
        <header className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-lg shadow-brand-primary/25">
            <RadioTower size={30} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-text-secondary">Pick up your wave where you left it.</p>
        </header>

        <form className="space-y-5 rounded-3xl border border-slate-700 bg-bg-surface/80 p-5 shadow-2xl shadow-black/20" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-secondary">Email</span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 focus-within:border-brand-primary">
              <Mail className="text-text-secondary" size={18} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-secondary">Password</span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 focus-within:border-brand-primary">
              <LockKeyhole className="text-text-secondary" size={18} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                placeholder="Your password"
                autoComplete="current-password"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-primary/25 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary">
          New to TuneWave?{' '}
          <Link to="/signup" className="font-semibold text-brand-secondary">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
