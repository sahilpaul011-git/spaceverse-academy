
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const categories = [
  'All',
  'Astronomy',
  'Planet Science',
  'Space Technology',
];

const icons = {
  Astronomy: '🌌',
  'Planet Science': '🪐',
  'Space Technology': '🚀',
  'Space Science': '🔭',
  'Earth Science': '🌍',
};

export default function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [externalCourses, setExternalCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [externalLoading, setExternalLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [externalError, setExternalError] = useState('');

  async function loadCourses() {
    setLoading(true);
    setError('');

    if (!supabase) {
      setError(
        'Course catalogue is temporarily unavailable. Please try again later.'
      );
      setLoading(false);
      setExternalLoading(false);
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
        const { data: enrolments, error: enrolmentError } =
          await supabase
            .from('enrollments')
            .select('course_id')
            .eq('student_id', user.id);

        if (enrolmentError) throw enrolmentError;

        setEnrolledIds(
          (enrolments || []).map((item) => item.course_id)
        );
      } else {
        setEnrolledIds([]);
      }
    } catch (err) {
      setError(err.message || 'Could not load courses.');
    } finally {
      setLoading(false);
    }
  }

  async function loadExternalCourses() {
    setExternalLoading(true);
    setExternalError('');

    if (!supabase) {
      setExternalError('External learning resources are unavailable.');
      setExternalLoading(false);
      return;
    }

    try {
      const { data, error: externalCourseError } = await supabase
        .from('external_courses')
        .select(
          'id, title, description, provider, category, level, course_url, affiliate_url, affiliate_status, commission_rate, price_type'
        )
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (externalCourseError) throw externalCourseError;

      setExternalCourses(data || []);
    } catch (err) {
      setExternalError(
        'External resources could not be loaded. Please check the marketplace database setup.'
      );
    } finally {
      setExternalLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
    loadExternalCourses();
  }, [user?.id]);

  const visibleCourses = useMemo(() => {
    if (category === 'All') return courses;

    return courses.filter(
      (course) => course.category === category
    );
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

    if (!supabase) {
      setError('The enrolment service is unavailable.');
      return;
    }

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
          setEnrolledIds((current) =>
            current.includes(course.id)
              ? current
              : [...current, course.id]
          );

          setMessage('You are already enrolled in this course.');
        } else {
          throw enrolmentError;
        }
      } else {
        setEnrolledIds((current) => [...current, course.id]);
        setMessage(
          `Successfully enrolled in ${course.title}!`
        );
      }
    } catch (err) {
      setError(err.message || 'Could not enrol in this course.');
    } finally {
      setEnrollingId(null);
    }
  }

  async function trackExternalClick(course) {
    if (!supabase || !user) return;

    try {
      await supabase.from('affiliate_clicks').insert({
        external_course_id: course.id,
        user_id: user.id,
      });
    } catch (err) {
      console.error('External click tracking failed:', err);
    }
  }

  function getExternalUrl(course) {
    if (
      course.affiliate_status === 'approved' &&
      course.affiliate_url
    ) {
      return course.affiliate_url;
    }

    return course.course_url;
  }

  function getPriceLabel(type) {
    if (type === 'free') return 'FREE';
    if (type === 'paid') return 'PAID';

    return 'FREE / PAID OPTIONS';
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* HERO SECTION */}
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
              Explore space science through exciting courses and
              educational resources. Start with free learning and
              grow your knowledge one mission at a time.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-emerald-300">
                ✓ Free learning available
              </span>

              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-cyan-300">
                ✦ Global learning resources
              </span>
            </div>
          </div>
        </section>

        {/* INTERNAL COURSES */}
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                SpaceVerse courses
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Learn inside SpaceVerse
              </h2>
            </div>

            <Link
              to="/dashboard"
              className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              My dashboard →
            </Link>
          </div>

          {/* CATEGORY FILTERS */}
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

          {/* SUCCESS MESSAGE */}
          {message && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-300"
            >
              {message}
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {/* COURSE LIST */}
          {loading ? (
            <div className="py-20 text-center text-cyan-300">
              Loading SpaceVerse courses...
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

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <span className="font-bold text-white">
                          {free
                            ? 'Free'
                            : `₹${Number(course.price).toFixed(0)}`}
                        </span>

                        {enrolled ? (
                          <Link
                            to={`/learn/${course.id}`}
                            className="rounded-xl bg-emerald-400 px-4 py-2 text-center text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                          >
                            Continue learning →
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleEnroll(course)}
                            disabled={enrollingId === course.id}
                            className={`rounded-xl px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                              free
                                ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                                : 'border border-purple-400/40 bg-purple-400/10 text-purple-200 hover:bg-purple-400/20'
                            }`}
                          >
                            {enrollingId === course.id
                              ? 'Enrolling...'
                              : free
                                ? 'Enrol free'
                                : 'Coming soon'}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* EXTERNAL MARKETPLACE */}
        <section className="mt-16 border-t border-white/10 pt-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
              Global learning marketplace
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Explore courses beyond SpaceVerse
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Discover learning opportunities from space agencies,
              universities and education platforms around the world.
              These courses are hosted by their respective providers.
            </p>
          </div>

          {externalError && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200"
            >
              {externalError}
            </div>
          )}

          {externalLoading ? (
            <div className="py-16 text-center text-purple-300">
              Loading global learning resources...
            </div>
          ) : externalCourses.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-slate-900/60 p-8 text-center">
              <div className="text-4xl">🌍</div>

              <h3 className="mt-3 text-lg font-bold">
                No external resources available
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Published provider resources will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {externalCourses.map((course) => {
                const approvedAffiliate =
                  course.affiliate_status === 'approved' &&
                  Boolean(course.affiliate_url);

                return (
                  <article
                    key={course.id}
                    className="flex flex-col rounded-2xl border border-purple-400/20 bg-gradient-to-b from-slate-900 to-slate-950 p-5 transition hover:border-purple-300/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-3xl">
                        {icons[course.category] || '🛰️'}
                      </span>

                      <span className="rounded-full bg-purple-400/10 px-3 py-1 text-xs font-bold text-purple-200">
                        {getPriceLabel(course.price_type)}
                      </span>
                    </div>

                    <p className="mt-5 text-xs font-bold uppercase tracking-wider text-purple-300">
                      {course.provider}
                    </p>

                    <h3 className="mt-2 text-xl font-bold">
                      {course.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
                      {course.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">
                      <span className="rounded-full bg-white/5 px-3 py-1">
                        {course.category}
                      </span>

                      <span className="rounded-full bg-white/5 px-3 py-1">
                        {course.level}
                      </span>
                    </div>

                    <a
                      href={getExternalUrl(course)}
                      target="_blank"
                      rel={
                        approvedAffiliate
                          ? 'sponsored noopener noreferrer'
                          : 'noopener noreferrer'
                      }
                      onClick={() => trackExternalClick(course)}
                      className="mt-6 inline-flex items-center justify-center rounded-xl border border-purple-400/40 bg-purple-400/10 px-4 py-3 text-sm font-bold text-purple-200 transition hover:bg-purple-400/20"
                    >
                      Visit provider website ↗
                    </a>

                    {approvedAffiliate ? (
                      <p className="mt-3 text-xs leading-5 text-slate-500">
                        Affiliate link: SpaceVerse may earn a commission
                        from eligible purchases.
                      </p>
                    ) : (
                      <p className="mt-3 text-xs text-slate-500">
                        External provider website. Course details and
                        pricing are controlled by the provider.
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <p className="mt-10 text-center text-xs leading-6 text-slate-500">
          SpaceVerse Academy is an independent learning platform.
          External courses are provided by third-party organisations.
          Their availability, fees and terms may change.
        </p>
      </div>
    </main>
  );
}
