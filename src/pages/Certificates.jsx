
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Certificates() {
  const { user, profile, loading: authLoading } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [courseNames, setCourseNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCertificates() {
      if (!user || !supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error: certificateError } = await supabase
          .from('certificates')
          .select('id, course_id, certificate_code, issued_at')
          .eq('student_id', user.id)
          .order('issued_at', { ascending: false });

        if (certificateError) throw certificateError;

        const rows = data || [];
        setCertificates(rows);

        const ids = [...new Set(rows.map((item) => item.course_id))];

        if (ids.length > 0) {
          const { data: courses, error: courseError } = await supabase
            .from('courses')
            .select('id, title')
            .in('id', ids);

          if (courseError) throw courseError;

          const names = {};
          (courses || []).forEach((course) => {
            names[course.id] = course.title;
          });
          setCourseNames(names);
        }
      } catch (err) {
        setError(err.message || 'Could not load certificates.');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) loadCertificates();
  }, [user?.id, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-10 text-center text-white">
        Loading your certificates...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const studentName =
    profile?.full_name || user.email?.split('@')[0] || 'Space Explorer';

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
            SpaceVerse Academy
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">
            My Certificates 🏆
          </h1>
          <p className="mt-4 text-slate-400">
            Every completed course is another achievement in your space journey.
          </p>
        </div>

        {loading && (
          <p className="py-16 text-center text-cyan-300">
            Loading certificates...
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-300">
            {error}
          </p>
        )}

        {!loading && !error && certificates.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900 p-10 text-center">
            <div className="text-5xl">🎓</div>
            <h2 className="mt-4 text-xl font-bold">Your first certificate is waiting!</h2>
            <p className="mt-2 text-sm text-slate-400">
              Complete all published lessons in an enrolled course to earn your certificate.
            </p>
            <a href="#/courses" className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950">
              Browse courses →
            </a>
          </div>
        )}

        <div className="space-y-8">
          {certificates.map((certificate) => (
            <article
              key={certificate.id}
              className="overflow-hidden rounded-2xl border border-cyan-300/30 bg-slate-900 shadow-xl"
            >
              <div
                id={`certificate-${certificate.id}`}
                className="certificate-paper m-3 border-4 border-double border-amber-400/70 bg-gradient-to-br from-slate-50 to-cyan-50 p-6 text-center text-slate-900 sm:m-6 sm:p-10"
              >
                <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-800">
                  SpaceVerse Academy
                </p>

                <div className="my-4 text-5xl">🚀</div>

                <h2 className="text-3xl font-black text-indigo-950 sm:text-4xl">
                  Certificate of Completion
                </h2>

                <p className="mt-6 text-sm text-slate-600">
                  This certificate is proudly presented to
                </p>

                <p className="mt-3 break-words text-2xl font-black text-indigo-900 sm:text-3xl">
                  {studentName}
                </p>

                <p className="mt-5 text-sm text-slate-600">
                  for successfully completing the course
                </p>

                <h3 className="mt-3 text-xl font-black text-indigo-900 sm:text-2xl">
                  {courseNames[certificate.course_id] || 'SpaceVerse Course'}
                </h3>

                <div className="mt-8 flex flex-col justify-between gap-6 border-t border-indigo-200 pt-5 text-sm sm:flex-row">
                  <div>
                    <p className="font-bold">Date of issue</p>
                    <p>
                      {new Date(certificate.issued_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-bold">Certificate ID</p>
                    <p className="break-all">{certificate.certificate_code}</p>
                  </div>
                </div>

                <p className="mt-8 text-xs font-semibold text-indigo-700">
                  Keep exploring. Keep discovering.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6">
                <span className="text-sm text-emerald-300">
                  ✓ Course completed
                </span>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
                >
                  Print / Save PDF
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
          }

          body * {
            visibility: hidden !important;
          }

          .certificate-paper,
          .certificate-paper * {
            visibility: visible !important;
          }

          .certificate-paper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </main>
  );
}
