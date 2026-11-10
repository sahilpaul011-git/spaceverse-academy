
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Planet from './pages/Planet';
import Gallery from './pages/Gallery';
import Credits from './pages/Credits';
import Quiz from './pages/Quiz';
import MissionControl from './pages/MissionControl';
import CosmicLab from './pages/CosmicLab';
import WhatIfSimulator from './pages/WhatIfSimulator';
import Auth from './pages/Auth';
import { useAuth } from './context/AuthContext';

function ProtectedDashboard() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-20 text-center text-white">
        <p className="text-cyan-300">Preparing your space dashboard...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          SpaceVerse Student Portal
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          Welcome, {profile?.full_name || user.email || 'Space Explorer'}!
        </h1>
        <p className="mt-3 text-slate-400">
          Your learning dashboard is ready. Course, progress and certificate
          features will be added in the next stages.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Your role</p>
            <p className="mt-2 text-2xl font-bold capitalize">
              {profile?.role || 'Student'}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Experience points</p>
            <p className="mt-2 text-2xl font-bold">
              {profile?.xp ?? 0} XP
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/explore" className="rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950">
            Explore the universe
          </Link>
          <button
            type="button"
            onClick={async () => {
              const { error } = await signOut();
              if (error) window.alert(error.message);
            }}
            className="rounded-xl border border-white/15 px-5 py-3 font-semibold hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedDashboard />} />
          <Route path="/missions" element={<MissionControl />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/planet/:id" element={<Planet />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/cosmic-lab" element={<CosmicLab />} />
          <Route path="/what-if" element={<WhatIfSimulator />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-4xl px-4 py-20 text-center">
                <h1 className="text-3xl font-bold">Page not found</h1>
                <Link to="/" className="mt-4 inline-block text-blue-600 underline">
                  Return home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
