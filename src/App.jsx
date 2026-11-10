
import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from 'react-router-dom';

import AdminCourseManager from './pages/AdminCourseManager';
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
import Courses from './pages/Courses';
import AdminDashboard from './pages/AdminDashboard';

import { useAuth } from './context/AuthContext';

function DashboardLink({ to, icon, title, description }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-white/10 bg-slate-900/80 p-5 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-slate-800"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <span className="mt-4 inline-block text-sm font-semibold text-cyan-400">
        Open section →
      </span>
    </Link>
  );
}

function ProtectedDashboard() {
  const { user, profile, loading, signOut } = useAuth();

  const [signingOut, setSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-24 text-center text-white">
        <p className="text-cyan-300">
          Preparing your space dashboard...
        </p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const displayName =
    profile?.full_name ||
    user.email?.split('@')[0] ||
    'Space Explorer';

  const xp = Number(profile?.xp ?? 0);
  const role = profile?.role || 'student';

  async function handleSignOut() {
    setErrorMessage('');
    setSigningOut(true);

    try {
      const { error } = await signOut();

      if (error) {
        setErrorMessage(
          error.message || 'Could not sign out. Please try again.'
        );
        setSigningOut(false);
      }
    } catch (error) {
      setErrorMessage(
        error.message || 'Something went wrong while signing out.'
      );
      setSigningOut(false);
    }
  }

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">

        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
              SpaceVerse Student Portal
            </p>

            <h1 className="mt-4 text-3xl font-black sm:text-4xl">
              Welcome back, {displayName}!
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Your next space adventure starts here. Explore the universe,
              complete missions and keep learning at your own pace.
            </p>

            <Link
              to="/explore"
              className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Start exploring →
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Experience points
            </p>

            <p className="mt-2 text-3xl font-black text-cyan-300">
              {xp} XP
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Your current XP from your student profile
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Account type
            </p>

            <p className="mt-2 text-3xl font-black capitalize text-purple-300">
              {role}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Your account role
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Your learning space
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Continue your adventure
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Choose a learning activity to get started.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <DashboardLink
              to="/courses"
              icon="📚"
              title="Courses"
              description="Browse free and premium space-learning courses."
            />

            {role === 'admin' && (
              <>
                <DashboardLink
                  to="/admin"
                  icon="🛠️"
                  title="Admin Dashboard"
                  description="Manage courses, external providers, affiliate links and marketplace activity."
                />

                <DashboardLink
                  to="/admin-lessons"
                  icon="🎓"
                  title="Course & Lesson Manager"
                  description="Create lessons, add videos and manage course content."
                />
              </>
            )}

            <DashboardLink
              to="/explore"
              icon="🪐"
              title="Explore"
              description="Discover planets, moons and fascinating space facts."
            />

            <DashboardLink
              to="/missions"
              icon="🚀"
              title="Missions"
              description="Take on space challenges and build your XP."
            />

            <DashboardLink
              to="/cosmic-lab"
              icon="🔭"
              title="Cosmic Lab"
              description="Explore comparisons and scientific discoveries."
            />

            <DashboardLink
              to="/quiz"
              icon="🧠"
              title="Quiz Arena"
              description="Test your space knowledge with quizzes."
            />

          </div>
        </div>

        {role === 'admin' && (
          <div className="mt-8 rounded-2xl border border-purple-400/20 bg-purple-400/5 p-5 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
              Administrator access
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Manage SpaceVerse Academy
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Access your administration tools to manage learning resources,
              lessons and marketplace activity.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/admin"
                className="inline-flex rounded-xl bg-purple-400 px-5 py-3 font-bold text-slate-950 hover:bg-purple-300"
              >
                Open Admin Dashboard →
              </Link>

              <Link
                to="/admin-lessons"
                className="inline-flex rounded-xl border border-purple-300/30 px-5 py-3 font-bold text-purple-200 hover:bg-purple-400/10"
              >
                Manage Lessons →
              </Link>
            </div>
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/80 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
            My courses
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Your learning journey
          </h2>

          <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-slate-950/60 px-5 py-8 text-center">
            <div className="text-4xl">📚</div>

            <h3 className="mt-3 text-lg font-bold">
              Ready to start learning?
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
              Browse the course catalogue and enrol in a free course.
            </p>

            <Link
              to="/courses"
              className="mt-5 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
            >
              Browse courses →
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Signed in as
            </p>

            <p className="mt-1 break-all text-sm text-slate-400">
              {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {signingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300"
          >
            {errorMessage}
          </p>
        )}

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

          <Route
            path="/dashboard"
            element={<ProtectedDashboard />}
          />

          <Route path="/admin" element={<AdminDashboard />} />

          <Route
            path="/admin-lessons"
            element={<AdminCourseManager />}
          />

          <Route path="/courses" element={<Courses />} />

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
                <h1 className="text-3xl font-bold">
                  Page not found
                </h1>

                <Link
                  to="/"
                  className="mt-4 inline-block text-cyan-400 underline"
                >
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
