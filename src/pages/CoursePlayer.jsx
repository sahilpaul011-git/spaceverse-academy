
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

function getVideoEmbed(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = parsed.searchParams.get('v');

      if (id) {
        return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
      }

      const match = parsed.pathname.match(/^\/embed\/([a-zA-Z0-9_-]+)/);
      return match
        ? `https://www.youtube-nocookie.com/embed/${match[1]}`
        : null;
    }

    if (host === 'vimeo.com') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];

      return /^\d+$/.test(id || '')
        ? `https://player.vimeo.com/video/${id}`
        : null;
    }

    return null;
  } catch {
    return null;
  }
}

export default function CoursePlayer() {
  const { courseId } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [certificate, setCertificate] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadCourse = useCallback(async () => {
    if (!supabase || !user || !courseId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Confirm that the signed-in student is enrolled.
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('course_id', courseId)
        .eq('student_id', user.id)
        .maybeSingle();

      if (enrollmentError) throw enrollmentError;

      if (!enrollment) {
        setCourse(null);
        setLessons([]);
        setCompletedIds([]);
        setCertificate(null);
        setError('You are not enrolled in this course. Please enrol before opening the lessons.');
        return;
      }

      const [courseResult, lessonResult, progressResult, certificateResult] =
        await Promise.all([
          supabase
            .from('courses')
            .select('id, title, description, category, level, is_free')
            .eq('id', courseId)
            .eq('is_published', true)
            .maybeSingle(),

          supabase
            .from('course_lessons')
            .select('id, course_id, title, description, video_url, lesson_content, sort_order')
            .eq('course_id', courseId)
            .eq('is_published', true)
            .order('sort_order', { ascending: true }),

          supabase
            .from('lesson_progress')
            .select('lesson_id')
            .eq('student_id', user.id),

          supabase
            .from('certificates')
            .select('id, certificate_code, issued_at, course_id')
            .eq('student_id', user.id)
            .eq('course_id', courseId)
            .maybeSingle(),
        ]);

      if (courseResult.error) throw courseResult.error;
      if (lessonResult.error) throw lessonResult.error;
      if (progressResult.error) throw progressResult.error;
      if (certificateResult.error) throw certificateResult.error;

      if (!courseResult.data) {
        setError('This course is unavailable or has not been published.');
        setCourse(null);
        return;
      }

      const lessonRows = lessonResult.data || [];
      const completed = (progressResult.data || []).map(
        (item) => item.lesson_id
      );

      setCourse(courseResult.data);
      setLessons(lessonRows);
      setCompletedIds(completed);
      setCertificate(certificateResult.data || null);

      setActiveLessonId((current) => {
        if (current && lessonRows.some((lesson) => lesson.id === current)) {
          return current;
        }

        const firstIncomplete = lessonRows.find(
          (lesson) => !completed.includes(lesson.id)
        );

        return firstIncomplete?.id || lessonRows[0]?.id || null;
      });
    } catch (err) {
      setError(err.message || 'Could not load this course.');
    } finally {
      setLoading(false);
    }
  }, [courseId, user]);

  useEffect(() => {
    if (!authLoading && user) {
      loadCourse();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user, loadCourse]);

  const activeLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === activeLessonId) || null,
    [lessons, activeLessonId]
  );

  const completedCount = lessons.filter(
    (lesson) => completedIds.includes(lesson.id)
  ).length;

  const progressPercent = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  const allComplete =
    lessons.length > 0 && completedCount === lessons.length;

  async function markLessonComplete() {
    if (!activeLesson || !user || !supabase || marking) return;

    if (completedIds.includes(activeLesson.id)) return;

    setMarking(true);
    setError('');
    setMessage('');

    try {
      const { error: insertError } = await supabase
        .from('lesson_progress')
        .insert({
          student_id: user.id,
          lesson_id: activeLesson.id,
        });

      if (insertError && insertError.code !== '23505') {
        throw insertError;
      }

      setCompletedIds((current) =>
        current.includes(activeLesson.id)
          ? current
          : [...current, activeLesson.id]
      );

      setMessage('Lesson completed! Your progress has been saved.');

      // The Supabase database trigger issues a certificate
      // when every published lesson in the enrolled course is complete.
      const { data: issuedCertificate, error: certificateError } =
        await supabase
          .from('certificates')
          .select('id, certificate_code, issued_at, course_id')
          .eq('student_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle();

      if (certificateError) throw certificateError;

      if (issuedCertificate) {
        setCertificate(issuedCertificate);
        setMessage('Congratulations! Your course certificate has been issued.');
      }
    } catch (err) {
      setError(err.message || 'Could not save lesson progress.');
    } finally {
      setMarking(false);
    }
  }

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-24 text-center text-cyan-300">
        Loading your learning space...
      </main>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">

        <Link
          to="/courses"
          className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          ← Back to Courses
        </Link>

        {error && (
          <div
            role="alert"
            className="mt-6 break-words rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-300"
          >
            {message}
          </div>
        )}

        {!course ? (
          <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-7">
            <h1 className="text-2xl font-black">Course unavailable</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Please return to the course catalogue and check your enrolment.
            </p>
            <Link
              to="/courses"
              className="mt-5 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"
            >
              Browse courses
            </Link>
          </section>
        ) : (
          <>
            <section className="mt-5 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                SpaceVerse Learning Centre
              </p>

              <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                {course.title}
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                {course.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-300">
                <span className="rounded-full bg-white/10 px-3 py-2">
                  {course.category}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2">
                  {course.level}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2">
                  {lessons.length} lessons
                </span>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">Your course progress</p>
                  <p className="mt-1 text-2xl font-black text-cyan-300">
                    {progressPercent}%
                  </p>
                </div>

                <p className="text-sm text-slate-300">
                  {completedCount} of {lessons.length} completed
                </p>
              </div>

              <div
                className="mt-4 h-3 overflow-hidden rounded-full bg-slate-700"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Course completion"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </section>

            {certificate && (
              <section className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Course completed
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  Your certificate is ready! 🏆
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Certificate code: {certificate.certificate_code}
                </p>
                <Link
                  to="/certificates"
                  className="mt-5 inline-flex rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950"
                >
                  View my certificates →
                </Link>
              </section>
            )}

            <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">

              <aside className="h-fit rounded-2xl border border-white/10 bg-slate-900 p-5">
                <h2 className="text-lg font-black">Course lessons</h2>

                {lessons.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-400">
                    No published lessons are available yet.
                  </p>
                ) : (
                  <div className="mt-4 grid gap-2">
                    {lessons.map((lesson, index) => {
                      const completed = completedIds.includes(lesson.id);
                      const selected = activeLessonId === lesson.id;

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => {
                            setActiveLessonId(lesson.id);
                            setMessage('');
                          }}
                          className={`w-full rounded-xl border p-4 text-left transition ${
                            selected
                              ? 'border-cyan-400 bg-cyan-400/10'
                              : 'border-white/10 bg-slate-950 hover:border-cyan-400/40'
                          }`}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold">
                              {index + 1}. {lesson.title}
                            </span>
                            <span className={completed ? 'text-emerald-300' : 'text-slate-500'}>
                              {completed ? '✓' : '○'}
                            </span>
                          </span>

                          {lesson.description && (
                            <span className="mt-2 block text-xs leading-5 text-slate-400">
                              {lesson.description}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </aside>

              <section className="min-w-0 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7">
                {activeLesson ? (
                  <>
                    <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      Lesson {activeLesson.sort_order}
                    </p>

                    <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                      {activeLesson.title}
                    </h2>

                    {activeLesson.description && (
                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        {activeLesson.description}
                      </p>
                    )}

                    {activeLesson.video_url && (
                      <div className="mt-6 overflow-hidden rounded-2xl bg-black">
                        {getVideoEmbed(activeLesson.video_url) ? (
                          <iframe
                            src={getVideoEmbed(activeLesson.video_url)}
                            title={activeLesson.title}
                            className="aspect-video w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />
                        ) : (
                          <div className="p-6 text-center">
                            <p className="text-sm text-slate-300">
                              This video provider cannot be embedded here.
                            </p>
                            <a
                              href={activeLesson.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex rounded-lg bg-cyan-400 px-4 py-2 font-bold text-slate-950"
                            >
                              Watch video on provider website ↗
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {activeLesson.lesson_content && (
                      <article className="mt-7 rounded-xl border border-white/10 bg-slate-950/70 p-5">
                        <h3 className="mb-4 text-lg font-bold text-cyan-200">
                          Learning material
                        </h3>
                        <div className="whitespace-pre-wrap break-words text-sm leading-8 text-slate-200">
                          {activeLesson.lesson_content}
                        </div>
                      </article>
                    )}

                    <div className="mt-7 border-t border-white/10 pt-6">
                      {completedIds.includes(activeLesson.id) ? (
                        <p className="font-semibold text-emerald-300">
                          ✓ You completed this lesson
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={markLessonComplete}
                          disabled={marking}
                          className="w-full rounded-xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60 sm:w-auto"
                        >
                          {marking ? 'Saving progress...' : 'Mark lesson as complete ✓'}
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-4xl">📖</p>
                    <h2 className="mt-4 text-xl font-bold">
                      Lessons are coming soon
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Your instructor has not published lessons for this course yet.
                    </p>
                  </div>
                )}
              </section>
            </div>

            {allComplete && !certificate && (
              <section className="mt-8 rounded-2xl border border-purple-400/30 bg-purple-400/10 p-6">
                <h2 className="text-xl font-black">
                  All lessons completed!
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Your completion has been saved. Refresh this page in a moment
                  if your certificate has not appeared yet.
                </p>
                <button
                  type="button"
                  onClick={loadCourse}
                  className="mt-4 rounded-xl border border-purple-300/40 px-5 py-3 font-bold text-purple-200"
                >
                  Check certificate
                </button>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
