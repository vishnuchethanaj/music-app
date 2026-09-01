import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AtSign, LockKeyhole, RadioTower, User } from 'lucide-react';
import { apiErrorMessage } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): string | null => {
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      return 'All fields are required';
    }

    if (username.trim().length < 3) {
      return 'Username must be at least 3 characters';
    }

    if (!emailPattern.test(email.trim())) {
      return 'Please enter a valid email address';
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return 'Password must include uppercase, lowercase, and a number';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await register({ username, email, password, confirmPassword });
      navigate('/home', { replace: true });
    } catch (submitError) {
      setError(apiErrorMessage(submitError, 'Registration failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm space-y-7">
        <header className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-lg shadow-brand-primary/25">
            <RadioTower size={30} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
            Join TuneWave
          </h1>
          <p className="mt-2 text-sm text-text-secondary">Create a listener profile. Artist tools come next.</p>
        </header>

        <form className="space-y-4 rounded-3xl border border-slate-700 bg-bg-surface/80 p-5 shadow-2xl shadow-black/20" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-secondary">Username</span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 focus-within:border-brand-primary">
              <User className="text-text-secondary" size={18} />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                placeholder="wavebuilder"
                autoComplete="username"
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-secondary">Email</span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 focus-within:border-brand-primary">
              <AtSign className="text-text-secondary" size={18} />
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
                placeholder="8+ chars, Aa, 123"
                autoComplete="new-password"
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-secondary">Confirm password</span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 focus-within:border-brand-primary">
              <LockKeyhole className="text-text-secondary" size={18} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-primary/25 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-secondary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
