
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const categories = ['All', 'Astronomy', 'Planet Science', 'Space Technology'];

const icons = {
  Astronomy: '🌌',
  'Planet Science': '🪐',
  'Space Technology': '🚀',
};

export default function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadCourses() {
    setLoading(true);
    setError('');

    if (!supabase) {
      setError('Course catalogue is temporarily unavailable. Please try again later.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: courseError } = await supabase
        .from('courses')
        .select(
          'id, title, description, category, level, price, is_free, is_published, duration_minutes'
        )
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (courseError) throw courseError;

      setCourses(data || []);

      if (user) {
        const { data: enrolments, error: enrolmentError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', user.id);

        if (enrolmentError) throw enrolmentError;

        setEnrolledIds((enrolments || []).map((item) => item.course_id));
      } else {
        setEnrolledIds([]);
      }
    } catch (err) {
      setError(err.message || 'Could not load courses.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, [user?.id]);

  const visibleCourses = useMemo(() => {
    if (category === 'All') return courses;
    return courses.filter((course) => course.category === category);
  }, [courses, category]);

  async function handleEnroll(course) {
    setMessage('');
    setError('');

    if (!user) {
      navigate('/auth');
      return;
    }

    if (!course.is_free || Number(course.price) > 0) {
      setMessage(
        'This premium course is listed for discovery. Secure payment and enrolment will be added later.'
      );
      return;
    }

    if (enrolledIds.includes(course.id)) return;

    setEnrollingId(course.id);

    try {
      const { error: enrolmentError } = await supabase
        .from('enrollments')
        .insert({
          student_id: user.id,
          course_id: course.id,
        });

      if (enrolmentError) {
        if (enrolmentError.code === '23505') {
          setEnrolledIds((current) => [...current, course.id]);
          setMessage('You are already enrolled in this course.');
        } else {
          throw enrolmentError;
        }
      } else {
        setEnrolledIds((current) => [...current, course.id]);
        setMessage(`Successfully enrolled in ${course.title}!`);
      }
    } catch (err) {
      setError(err.message || 'Could not enrol in this course.');
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">

        <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-7 sm:p-10">
          <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
              SpaceVerse Learning Centre
            </p>

            <h1 className="mt-4 max-w-3xl text-3xl font-black sm:text-5xl">
              Discover. Learn. Explore.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Explore space science through exciting courses designed
              for curious minds. Start with free learning and grow
              your knowledge one mission at a time.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-emerald-300">
                ✓ Free courses available
              </span>
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-cyan-300">
                ✦ Learn at your own pace
              </span>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                Course catalogue
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Find your next adventure
              </h2>
            </div>

            <Link
              to="/dashboard"
              className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              My dashboard →
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  category === item
                    ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                    : 'border-white/10 bg-slate-900 text-slate-300 hover:border-cyan-400/50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {message && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-300"
            >
              {message}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center text-cyan-300">
              Loading courses from SpaceVerse...
            </div>
          ) : visibleCourses.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-slate-900/60 p-10 text-center">
              <div className="text-4xl">🔭</div>
              <h3 className="mt-4 text-xl font-bold">
                No courses found
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                There are no published courses in this category yet.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleCourses.map((course) => {
                const enrolled = enrolledIds.includes(course.id);
                const free =
                  course.is_free && Number(course.price) === 0;

                return (
                  <article
                    key={course.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition hover:-translate-y-1 hover:border-cyan-400/40"
                  >
                    <div className="flex min-h-36 items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-800 to-slate-950">
                      <span className="text-6xl">
                        {icons[course.category] || '✨'}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-cyan-300">
                          {course.category}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            free
                              ? 'bg-emerald-400/10 text-emerald-300'
                              : 'bg-purple-400/10 text-purple-300'
                          }`}
                        >
                          {free ? 'FREE' : 'PREMIUM'}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold">
                        {course.title}
                      </h3>

                      <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
                        {course.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-400">
                        <span>◈ {course.level}</span>
                        <span>◷ {course.duration_minutes} minutes</span>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="font-bold text-white">
                          {free ? 'Free' : `₹${Number(course.price).toFixed(0)}`}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleEnroll(course)}
                          disabled={enrollingId === course.id || enrolled}
                          className={`rounded-xl px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            enrolled
                              ? 'border border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                              : free
                                ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                                : 'border border-purple-400/40 bg-purple-400/10 text-purple-200 hover:bg-purple-400/20'
                          }`}
                        >
                          {enrollingId === course.id
                            ? 'Enrolling...'
                            : enrolled
                              ? 'Enrolled ✓'
                              : free
                                ? 'Enrol free'
                                : 'Coming soon'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
