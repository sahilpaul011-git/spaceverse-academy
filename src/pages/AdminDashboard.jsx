
import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  title: '',
  description: '',
  provider: '',
  category: 'Astronomy',
  level: 'Beginner',
  course_url: '',
  affiliate_url: '',
  affiliate_status: 'not_approved',
  commission_rate: '0',
  price_type: 'free',
  is_published: false,
};

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth();

  const [resources, setResources] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadData = useCallback(async () => {
    if (!supabase) {
      setError('Supabase is not configured.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [resourceResult, clickResult, courseResult] =
        await Promise.all([
          supabase
            .from('external_courses')
            .select('*')
            .order('created_at', { ascending: false }),

          supabase
            .from('affiliate_clicks')
            .select('id, external_course_id, user_id, clicked_at')
            .order('clicked_at', { ascending: false }),

          supabase
            .from('courses')
            .select('id, title, is_published, is_free'),
        ]);

      if (resourceResult.error) throw resourceResult.error;
      if (clickResult.error) throw clickResult.error;
      if (courseResult.error) throw courseResult.error;

      setResources(resourceResult.data || []);
      setClicks(clickResult.data || []);
    } catch (err) {
      setError(
        err.message || 'Could not load admin information.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user && profile?.role === 'admin') {
      loadData();
    }
  }, [authLoading, user, profile?.role, loadData]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-center text-cyan-300">
        Checking administrator access...
      </main>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const publishedCount = resources.filter(
    (item) => item.is_published
  ).length;

  const approvedCount = resources.filter(
    (item) =>
      item.affiliate_status === 'approved' &&
      Boolean(item.affiliate_url)
  ).length;

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function startEdit(resource) {
    setEditingId(resource.id);
    setForm({
      title: resource.title || '',
      description: resource.description || '',
      provider: resource.provider || '',
      category: resource.category || 'Astronomy',
      level: resource.level || 'Beginner',
      course_url: resource.course_url || '',
      affiliate_url: resource.affiliate_url || '',
      affiliate_status: resource.affiliate_status || 'not_approved',
      commission_rate: String(resource.commission_rate ?? 0),
      price_type: resource.price_type || 'free',
      is_published: Boolean(resource.is_published),
    });

    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSave(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!form.title.trim() || !form.provider.trim() || !form.course_url.trim()) {
      setError('Please enter a title, provider and provider website URL.');
      return;
    }

    try {
      const providerUrl = new URL(form.course_url.trim());

      if (!['https:', 'http:'].includes(providerUrl.protocol)) {
        throw new Error('Provider URL must start with http:// or https://');
      }

      if (form.affiliate_url.trim()) {
        const affiliateUrl = new URL(form.affiliate_url.trim());

        if (!['https:', 'http:'].includes(affiliateUrl.protocol)) {
          throw new Error('Affiliate URL must start with http:// or https://');
        }
      }
    } catch (err) {
      setError(err.message || 'Please enter valid website URLs.');
      return;
    }

    const rate = Number(form.commission_rate);

    if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      setError('Commission rate must be between 0 and 100.');
      return;
    }

    if (
      form.affiliate_status === 'approved' &&
      !form.affiliate_url.trim()
    ) {
      setError('Add your approved affiliate URL before selecting approved status.');
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      provider: form.provider.trim(),
      category: form.category,
      level: form.level,
      course_url: form.course_url.trim(),
      affiliate_url: form.affiliate_url.trim() || null,
      affiliate_status: form.affiliate_status,
      commission_rate:
        form.affiliate_status === 'approved' ? rate : 0,
      price_type: form.price_type,
      is_published: form.is_published,
    };

    try {
      const result = editingId
        ? await supabase
            .from('external_courses')
            .update(payload)
            .eq('id', editingId)
        : await supabase
            .from('external_courses')
            .insert(payload);

      if (result.error) throw result.error;

      setMessage(
        editingId
          ? 'Learning resource updated successfully.'
          : 'New learning resource added successfully.'
      );

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || 'Could not save this resource.');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(resource) {
    setError('');
    setMessage('');

    const { error: updateError } = await supabase
      .from('external_courses')
      .update({ is_published: !resource.is_published })
      .eq('id', resource.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(
      resource.is_published
        ? 'Resource unpublished.'
        : 'Resource published.'
    );

    await loadData();
  }

  async function deleteResource(resource) {
    const confirmed = window.confirm(
      `Delete "${resource.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setError('');
    setMessage('');

    const { error: deleteError } = await supabase
      .from('external_courses')
      .delete()
      .eq('id', resource.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (editingId === resource.id) resetForm();

    setMessage('Resource deleted.');
    await loadData();
  }

  function countClicks(resourceId) {
    return clicks.filter(
      (click) => click.external_course_id === resourceId
    ).length;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">

        <section className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-7 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-300">
            SpaceVerse Administration
          </p>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">
            Admin Control Centre
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Manage external learning resources, publishing and
            affiliate activity from one place.
          </p>
          <p className="mt-4 break-all text-xs text-slate-400">
            Administrator: {user.email}
          </p>
        </section>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'External resources',
              value: resources.length,
              icon: '🌍',
            },
            {
              label: 'Published resources',
              value: publishedCount,
              icon: '📚',
            },
            {
              label: 'Approved affiliate links',
              value: approvedCount,
              icon: '🔗',
            },
            {
              label: 'Recorded clicks',
              value: clicks.length,
              icon: '📈',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-slate-900 p-5"
            >
              <div className="text-2xl">{item.icon}</div>
              <p className="mt-4 text-sm text-slate-400">
                {item.label}
              </p>
              <p className="mt-1 text-3xl font-black text-cyan-300">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {message && (
          <p
            role="status"
            className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-300"
          >
            {message}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <section className="mt-10 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Marketplace editor
              </p>
              <h2 className="mt-2 text-2xl font-black">
                {editingId ? 'Edit resource' : 'Add a learning resource'}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm"
              >
                Cancel editing
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-300">
              Resource title *
              <input
                name="title"
                value={form.title}
                onChange={updateField}
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                placeholder="Example: Astronomy courses"
              />
            </label>

            <label className="text-sm text-slate-300">
              Provider *
              <input
                name="provider"
                value={form.provider}
                onChange={updateField}
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                placeholder="Example: NASA"
              />
            </label>

            <label className="text-sm text-slate-300 sm:col-span-2">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows={3}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                placeholder="Describe this learning resource..."
              />
            </label>

            <label className="text-sm text-slate-300">
              Category
              <select
                name="category"
                value={form.category}
                onChange={updateField}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
              >
                <option>Astronomy</option>
                <option>Planet Science</option>
                <option>Space Technology</option>
                <option>Space Science</option>
                <option>Earth Science</option>
              </select>
            </label>

            <label className="text-sm text-slate-300">
              Level
              <select
                name="level"
                value={form.level}
                onChange={updateField}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>All Levels</option>
              </select>
            </label>

            <label className="text-sm text-slate-300 sm:col-span-2">
              Provider website URL *
              <input
                name="course_url"
                type="url"
                value={form.course_url}
                onChange={updateField}
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                placeholder="https://..."
              />
            </label>

            <label className="text-sm text-slate-300 sm:col-span-2">
              Approved affiliate URL
              <input
                name="affiliate_url"
                type="url"
                value={form.affiliate_url}
                onChange={updateField}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                placeholder="Paste only a provider-approved tracking URL"
              />
            </label>

            <label className="text-sm text-slate-300">
              Affiliate status
              <select
                name="affiliate_status"
                value={form.affiliate_status}
                onChange={updateField}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
              >
                <option value="not_approved">Not approved</option>
                <option value="pending">Pending approval</option>
                <option value="approved">Approved</option>
              </select>
            </label>

            <label className="text-sm text-slate-300">
              Commission rate (%)
              <input
                name="commission_rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.commission_rate}
                onChange={updateField}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
              />
            </label>

            <label className="text-sm text-slate-300">
              Price type
              <select
                name="price_type"
                value={form.price_type}
                onChange={updateField}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="varies">Free / Paid options</option>
              </select>
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                name="is_published"
                checked={form.is_published}
                onChange={updateField}
                className="h-5 w-5 accent-cyan-400"
              />
              Publish this resource
            </label>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 disabled:opacity-50"
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Save changes'
                    : 'Add resource'}
              </button>

              <button
                type="button"
                onClick={loadData}
                className="rounded-xl border border-white/15 px-5 py-3 font-semibold"
              >
                Refresh data
              </button>
            </div>
          </form>

          <p className="mt-5 text-xs leading-6 text-slate-500">
            Only mark a link approved after the provider accepts your
            affiliate application and gives you that tracking URL.
            Enter the actual agreed commission rate, not a target rate.
          </p>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Resource library
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Manage marketplace listings
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              {resources.length} total
            </span>
          </div>

          {loading ? (
            <p className="py-12 text-center text-cyan-300">
              Loading marketplace data...
            </p>
          ) : resources.length === 0 ? (
            <p className="mt-5 rounded-xl border border-white/10 bg-slate-900 p-6 text-slate-400">
              No resources found.
            </p>
          ) : (
            <div className="mt-5 grid gap-4">
              {resources.map((resource) => (
                <article
                  key={resource.id}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-purple-300">
                        {resource.provider} · {resource.category}
                      </p>
                      <h3 className="mt-2 text-lg font-bold">
                        {resource.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {resource.description}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        resource.is_published
                          ? 'bg-emerald-400/10 text-emerald-300'
                          : 'bg-amber-400/10 text-amber-300'
                      }`}
                    >
                      {resource.is_published ? 'Published' : 'Unpublished'}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
                    <span>
                      Clicks: {countClicks(resource.id)}
                    </span>
                    <span>
                      Affiliate: {resource.affiliate_status}
                    </span>
                    <span>
                      Commission: {resource.commission_rate}%
                    </span>
                    <span>
                      Price: {resource.price_type}
                    </span>
                  </div>

  <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => startEdit(resource)}
                      className="rounded-lg border border-cyan-400/30 px-4 py-2 text-sm font-semibold text-cyan-300"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => togglePublished(resource)}
                      className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold"
                    >
                      {resource.is_published ? 'Unpublish' : 'Publish'}
                    </button>
  <button
                      type="button"
                      onClick={() => deleteResource(resource)}
                      className="rounded-lg border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            Affiliate activity
          </p>
          <h2 className="mt-2 text-2xl font-black">
            Recent outbound clicks
          </h2>

          {clicks.length === 0 ? (
            <p className="mt-5 text-sm text-slate-400">
No clicks have been recorded yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {clicks.slice(0, 10).map((click) => {
                const resource = resources.find(
                  (item) => item.id === click.external_course_id
                );

                return (
                  <div
                    key={click.id}
                    className="rounded-xl border border-white/10 bg-slate-950 p-4"
                  >
                    <p className="font-semibold">
                      {resource?.title || 'Resource no longer available'}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(click.clicked_at).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
<p className="mt-5 text-xs leading-6 text-slate-500">
            These are outbound clicks, not confirmed purchases or
            commission earnings. Purchase reporting must come from
            the affiliate provider.
          </p>
        </section>

      </div>
    </main>
  );
}
