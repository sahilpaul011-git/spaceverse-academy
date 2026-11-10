
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const { signIn, signUp, signInWithProvider, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';

  function clearMessages() {
    setMessage('');
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    clearMessages();
    setBusy(true);

    try {
      if (isSignup) {
        const { data, error } = await signUp({
          fullName,
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          navigate('/dashboard');
        } else {
          setMessage('Account created! Check your email to confirm your account before signing in.');
          setMode('login');
        }
      } else {
        const { error } = await signIn({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSocial(provider) {
    clearMessages();
    setBusy(true);

    try {
      const { error } = await signInWithProvider(provider);
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Social sign-in could not start.');
      setBusy(false);
    }
  }

  async function handleForgotPassword() {
    clearMessages();

    if (!email.trim()) {
      setError('Enter your email address first.');
      return;
    }

    setBusy(true);

    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setMessage('Password reset instructions have been sent if this email belongs to an account.');
    } catch (err) {
      setError(err.message || 'Could not send the reset email.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl md:grid-cols-2">

        <section className="relative flex min-h-64 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-8 md:p-10">
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative">
            <Link to="/" className="text-sm font-bold tracking-[0.25em] text-cyan-300">
              ✦ SPACEVERSE ACADEMY
            </Link>

            <div className="my-12">
              <div className="mb-5 text-6xl">🪐</div>
              <h1 className="text-4xl font-black leading-tight">
                Your universe<br />
                of discovery.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
                Explore planets, complete missions, discover amazing facts
                and begin your journey through space.
              </p>
            </div>
          </div>

          <p className="relative text-xs text-slate-400">
            Learn. Explore. Imagine. Discover.
          </p>
        </section>

        <section className="p-6 sm:p-10">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              Welcome to SpaceVerse
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {isSignup
                ? 'Join the academy and start exploring.'
                : 'Sign in to continue your space journey.'}
            </p>
          </div>

          {error && (
            <div role="alert" className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div role="status" className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm text-slate-300">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            {!isSignup && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={busy}
                  className="text-sm text-cyan-300 hover:text-cyan-200"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy
                ? 'Please wait...'
                : isSignup
                  ? 'Create Account'
                  : 'Sign In'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-500">OR CONTINUE WITH</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleSocial('google')}
              className="rounded-xl border border-white/10 bg-slate-800 px-3 py-3 text-sm font-semibold transition hover:bg-slate-700 disabled:opacity-50"
            >
              <span className="mr-2">G</span> Google
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => handleSocial('facebook')}
              className="rounded-xl border border-white/10 bg-slate-800 px-3 py-3 text-sm font-semibold transition hover:bg-slate-700 disabled:opacity-50"
            >
              <span className="mr-2">f</span> Facebook
            </button>
          </div>

          <p className="mt-7 text-center text-sm text-slate-400">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                clearMessages();
                setMode(isSignup ? 'login' : 'signup');
              }}
              className="font-bold text-cyan-300 hover:text-cyan-200"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>

          <p className="mt-5 text-center text-xs text-slate-500">
            By continuing, you agree to use SpaceVerse Academy responsibly.
          </p>
        </section>
      </div>
    </div>
  );
}
