
import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const BUCKET = 'spaceverse-course-media';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const emptyForm = {
  course_id: '',
  title: '',
  description: '',
  video_url: '',
  lesson_content: '',
  image_url: '',
  sort_order: '1',
  is_published: false,
};

function validateImage(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Choose a JPG, PNG, WEBP or GIF image.');
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Image must be 5 MB or smaller.');
  }
}

async function uploadImage(file, folder) {
  validateImage(file);

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const path = `${folder}/${safeName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function validateImageUrl(value) {
  if (!value.trim()) return '';

  try {
    const url = new URL(value.trim());
    if (!['https:', 'http:'].includes(url.protocol)) {
      throw new Error('Image URL must start with https:// or http://');
    }
    return url.href;
  } catch {
    throw new Error('Please enter a valid image URL.');
  }
}

export default function AdminCourseManager() {
  const { user, profile, loading: authLoading } = useAuth();

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLesson, setUploadingLesson] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [savingCover, setSavingCover] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');

  const [coverCourseId, setCoverCourseId] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const loadData = useCallback(async () => {
    if (!supabase) {
      setError('Supabase is not configured.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [courseResult, lessonResult] = await Promise.all([
        supabase
          .from('courses')
          .select('id, title, is_published, is_free, thumbnail')
          .order('created_at', { ascending: false }),

        supabase
          .from('course_lessons')
          .select('*')
          .order('sort_order', { ascending: true }),
      ]);

      if (courseResult.error) throw courseResult.error;
      if (lessonResult.error) throw lessonResult.error;

      const courseRows = courseResult.data || [];
      setCourses(courseRows);
      setLessons(lessonResult.data || []);

      if (!coverCourseId && courseRows.length) {
        setCoverCourseId(courseRows[0].id);
        setCoverUrl(courseRows[0].thumbnail || '');
      } else if (coverCourseId) {
        const selected = courseRows.find((item) => item.id === coverCourseId);
        if (selected) setCoverUrl(selected.thumbnail || '');
      }
    } catch (err) {
      setError(err.message || 'Could not load course lessons.');
    } finally {
      setLoading(false);
    }
  }, [coverCourseId]);

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

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function resetForm() {
    setForm({
      ...emptyForm,
      course_id: filterCourse !== 'all' ? filterCourse : '',
    });
    setEditingId(null);
  }

  function startEdit(lesson) {
    setEditingId(lesson.id);
    setForm({
      course_id: lesson.course_id,
      title: lesson.title || '',
      description: lesson.description || '',
      video_url: lesson.video_url || '',
      lesson_content: lesson.lesson_content || '',
      image_url: lesson.image_url || '',
      sort_order: String(lesson.sort_order || 1),
      is_published: Boolean(lesson.is_published),
    });

    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleLessonImageUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError('');
    setMessage('');
    setUploadingLesson(true);

    try {
      const url = await uploadImage(file, 'lessons');
      setForm((current) => ({ ...current, image_url: url }));
      setMessage('Lesson image uploaded. Save the lesson to keep this image.');
    } catch (err) {
      setError(err.message || 'Could not upload lesson image.');
    } finally {
      setUploadingLesson(false);
    }
  }

  async function handleCoverUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError('');
    setMessage('');
    setUploadingCover(true);

    try {
      const url = await uploadImage(file, 'course-covers');
      setCoverUrl(url);
      setMessage('Course cover uploaded. Tap Save course cover to apply it.');
    } catch (err) {
      setError(err.message || 'Could not upload course cover.');
    } finally {
      setUploadingCover(false);
    }
  }

  async function saveCourseCover(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!coverCourseId) {
      setError('Select a course first.');
      return;
    }

    let imageUrl;
    try {
      imageUrl = validateImageUrl(coverUrl);
    } catch (err) {
      setError(err.message);
      return;
    }

    setSavingCover(true);
    try {
      const { error: updateError } = await supabase
        .from('courses')
        .update({ thumbnail: imageUrl || null })
        .eq('id', coverCourseId);

      if (updateError) throw updateError;

      setMessage('Course cover image saved.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Could not save course cover.');
    } finally {
      setSavingCover(false);
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!form.course_id) {
      setError('Please select a course.');
      return;
    }

    if (!form.title.trim()) {
      setError('Please enter a lesson title.');
      return;
    }

    if (!form.video_url.trim() && !form.lesson_content.trim() && !form.image_url.trim()) {
      setError('Add a video link, written content or lesson image.');
      return;
    }

    if (form.video_url.trim()) {
      try {
        const url = new URL(form.video_url.trim());
        if (!['https:', 'http:'].includes(url.protocol)) {
          throw new Error('Video URL must begin with http:// or https://');
        }
      } catch (err) {
        setError(err.message || 'Please enter a valid video URL.');
        return;
      }
    }

    let imageUrl;
    try {
      imageUrl = validateImageUrl(form.image_url);
    } catch (err) {
      setError(err.message);
      return;
    }

    const order = Number(form.sort_order);
    if (!Number.isInteger(order) || order < 1) {
      setError('Lesson order must be a whole number greater than zero.');
      return;
    }

    setSaving(true);

    const payload = {
      course_id: form.course_id,
      title: form.title.trim(),
      description: form.description.trim(),
      video_url: form.video_url.trim() || null,
      lesson_content: form.lesson_content.trim(),
      image_url: imageUrl || null,
      sort_order: order,
      is_published: form.is_published,
    };

    try {
      const result = editingId
        ? await supabase.from('course_lessons').update(payload).eq('id', editingId)
        : await supabase.from('course_lessons').insert(payload);

      if (result.error) throw result.error;

      setMessage(editingId ? 'Lesson updated successfully.' : 'Lesson created successfully.');
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || 'Could not save this lesson.');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(lesson) {
    setError('');
    setMessage('');

    const { error: updateError } = await supabase
      .from('course_lessons')
      .update({ is_published: !lesson.is_published })
      .eq('id', lesson.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(lesson.is_published ? 'Lesson unpublished.' : 'Lesson published.');
    await loadData();
  }

  async function deleteLesson(lesson) {
    const confirmed = window.confirm(
      `Delete "${lesson.title}"? Student progress for this lesson will also be deleted.`
    );
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from('course_lessons')
      .delete()
      .eq('id', lesson.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (editingId === lesson.id) resetForm();
    setMessage('Lesson deleted.');
    await loadData();
  }

  function changeCoverCourse(id) {
    setCoverCourseId(id);
    setCoverUrl(courses.find((course) => course.id === id)?.thumbnail || '');
  }

  const visibleLessons = lessons.filter((lesson) =>
    filterCourse === 'all' ? true : lesson.course_id === filterCourse
  );

  function courseName(courseId) {
    return courses.find((course) => course.id === courseId)?.title || 'Course unavailable';
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link to="/admin" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
          ← Back to Admin Dashboard
        </Link>

        <section className="mt-5 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-7 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
            SpaceVerse Academy
          </p>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">Course & Lesson Manager</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Manage course covers, lesson images, videos, written material and student access.
          </p>
        </section>

        {message && (
          <p role="status" className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-300">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-6 break-words rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
            {error}
          </p>
        )}

        <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-300">Course artwork</p>
          <h2 className="mt-2 text-2xl font-black">Course cover image</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Upload an image from your phone or paste an image URL. This image will be used on the course card.
          </p>

          <form onSubmit={saveCourseCover} className="mt-5 grid gap-4">
            <label className="text-sm text-slate-300">
              Select course
              <select
                value={coverCourseId}
                onChange={(event) => changeCoverCourse(event.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
              >
                <option value="">Choose a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-slate-300">
              Upload from Android gallery
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleCoverUpload}
                disabled={uploadingCover || !coverCourseId}
                className="mt-2 block w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
              />
            </label>
            {uploadingCover && <p className="text-sm text-cyan-300">Uploading course cover...</p>}

            <label className="text-sm text-slate-300">
              Or paste image URL
              <input
                type="url"
                value={coverUrl}
                onChange={(event) => setCoverUrl(event.target.value)}
                placeholder="https://example.com/space-image.jpg"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
              />
            </label>

            {coverUrl && (
              <img
                src={coverUrl}
                alt="Course cover preview"
                className="max-h-56 w-full rounded-xl border border-white/10 object-cover"
                onError={(event) => { event.currentTarget.style.display = 'none'; }}
                onLoad={(event) => { event.currentTarget.style.display = 'block'; }}
              />
            )}

            <button
              type="submit"
              disabled={savingCover || uploadingCover || !coverCourseId}
              className="rounded-xl bg-purple-400 px-6 py-3 font-bold text-slate-950 disabled:opacity-50"
            >
              {savingCover ? 'Saving cover...' : 'Save course cover'}
            </button>
          </form>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Lesson editor</p>
              <h2 className="mt-2 text-2xl font-black">{editingId ? 'Edit lesson' : 'Create a new lesson'}</h2>
            </div>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-lg border border-white/15 px-4 py-2 text-sm">
                Cancel editing
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="mt-6 grid gap-4">
            <label className="text-sm text-slate-300">
              Select course *
              <select
                name="course_id"
                value={form.course_id}
                onChange={updateField}
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
              >
                <option value="">Choose a course</option>
                {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
            </label>

            <label className="text-sm text-slate-300">
              Lesson title *
              <input name="title" value={form.title} onChange={updateField} required maxLength={150}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                placeholder="Example: Introduction to the Solar System" />
            </label>

            <label className="text-sm text-slate-300">
              Short description
              <textarea name="description" value={form.description} onChange={updateField} rows={2}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                placeholder="What will students learn?" />
            </label>

            <label className="text-sm text-slate-300">
              Lesson image — upload from Android
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleLessonImageUpload} disabled={uploadingLesson}
                className="mt-2 block w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm" />
            </label>
            {uploadingLesson && <p className="text-sm text-cyan-300">Uploading lesson image...</p>}

            <label className="text-sm text-slate-300">
              Or paste lesson image URL
              <input name="image_url" type="url" value={form.image_url} onChange={updateField}
                placeholder="https://example.com/lesson-image.jpg"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" />
            </label>

            {form.image_url && (
              <img src={form.image_url} alt="Lesson image preview"
                className="max-h-64 w-full rounded-xl border border-white/10 object-cover"
                onError={(event) => { event.currentTarget.style.display = 'none'; }}
                onLoad={(event) => { event.currentTarget.style.display = 'block'; }} />
            )}

            <label className="text-sm text-slate-300">
              Video URL
              <input name="video_url" type="url" value={form.video_url} onChange={updateField}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                placeholder="Paste a YouTube or other video link" />
            </label>

            <label className="text-sm text-slate-300">
              Written lesson content
              <textarea name="lesson_content" value={form.lesson_content} onChange={updateField} rows={8}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                placeholder="Write the lesson explanation here..." />
            </label>

            <label className="text-sm text-slate-300">
              Lesson order
              <input name="sort_order" type="number" min="1" step="1" value={form.sort_order}
                onChange={updateField} required
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" />
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input type="checkbox" name="is_published" checked={form.is_published}
                onChange={updateField} className="h-5 w-5 accent-cyan-400" />
              Publish this lesson for enrolled students
            </label>

            <button type="submit" disabled={saving || uploadingLesson || courses.length === 0}
              className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 disabled:opacity-50">
              {saving ? 'Saving lesson...' : editingId ? 'Save lesson changes' : 'Create lesson'}
            </button>

            {courses.length === 0 && !loading && (
              <p className="text-sm text-amber-300">No courses were found. Add a course before creating lessons.</p>
            )}
          </form>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-300">Lesson library</p>
              <h2 className="mt-2 text-2xl font-black">Manage lessons</h2>
            </div>
            <button type="button" onClick={loadData} className="rounded-lg border border-white/15 px-4 py-2 text-sm">
              Refresh
            </button>
          </div>

          <label className="mt-5 block text-sm text-slate-300">
            Filter by course
            <select value={filterCourse} onChange={(event) => setFilterCourse(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white">
              <option value="all">All courses</option>
              {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
            </select>
          </label>

          {loading ? (
            <p className="py-12 text-center text-cyan-300">Loading lessons...</p>
          ) : visibleLessons.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-slate-900 p-8 text-center">
              <p className="text-3xl">📖</p>
              <h3 className="mt-3 text-lg font-bold">No lessons created yet</h3>
              <p className="mt-2 text-sm text-slate-400">Use the lesson editor above to create your first lesson.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4">
              {visibleLessons.map((lesson) => (
                <article key={lesson.id} className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {lesson.image_url && (
                        <img src={lesson.image_url} alt="" className="mb-4 max-h-44 w-full rounded-xl object-cover" />
                      )}
                      <p className="text-xs font-semibold text-cyan-300">
                        {courseName(lesson.course_id)} · Lesson {lesson.sort_order}
                      </p>
                      <h3 className="mt-2 text-lg font-bold">{lesson.title}</h3>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">{lesson.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                        <span>{lesson.image_url ? 'Image added' : 'No image'}</span>
                        <span>{lesson.video_url ? 'Video added' : 'No video'}</span>
                        <span>{lesson.lesson_content ? 'Written content added' : 'No written content'}</span>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      lesson.is_published ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-400/10 text-amber-300'
                    }`}>
                      {lesson.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                    <button type="button" onClick={() => startEdit(lesson)}
                      className="rounded-lg border border-cyan-400/30 px-4 py-2 text-sm font-semibold text-cyan-300">
                      Edit
                    </button>
                    <button type="button" onClick={() => togglePublished(lesson)}
                      className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold">
                      {lesson.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button type="button" onClick={() => deleteLesson(lesson)}
                      className="rounded-lg border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-300">
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
