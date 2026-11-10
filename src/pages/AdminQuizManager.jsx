
import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const emptyQuestion = {
  question: '',
  options: ['', '', '', ''],
  correct_option: 0,
  explanation: '',
  sort_order: 1,
};

export default function AdminQuizManager() {
  const { user, profile, loading: authLoading } = useAuth();

  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);

  const [selectedLesson, setSelectedLesson] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [quizTitle, setQuizTitle] = useState('Lesson Quiz');
  const [passPercentage, setPassPercentage] = useState(70);
  const [quizPublished, setQuizPublished] = useState(false);

  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showAttempts, setShowAttempts] = useState(false);

  const loadData = useCallback(async () => {
    if (!supabase) {
      setError('Supabase is not configured.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [lessonResult, quizResult] = await Promise.all([
        supabase
          .from('course_lessons')
          .select('id, title, course_id, sort_order, is_published')
          .order('created_at', { ascending: false }),

        supabase
          .from('lesson_quizzes')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      if (lessonResult.error) throw lessonResult.error;
      if (quizResult.error) throw quizResult.error;

      setLessons(lessonResult.data || []);
      setQuizzes(quizResult.data || []);
    } catch (err) {
      setError(err.message || 'Could not load quiz data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user && profile?.role === 'admin') {
      loadData();
    }
  }, [authLoading, user, profile?.role, loadData]);

  const loadQuestions = useCallback(async (quizId) => {
    if (!quizId) {
      setQuestions([]);
      return;
    }

    const { data, error: loadError } = await supabase
      .from('lesson_quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('sort_order', { ascending: true });

    if (loadError) {
      setError(loadError.message);
      return;
    }

    setQuestions(data || []);
  }, []);

  async function loadAttempts(quizId) {
    setError('');
    setShowAttempts(true);

    const { data, error: attemptError } = await supabase
      .from('lesson_quiz_attempts')
      .select('id, student_id, score, total_questions, percentage, passed, xp_awarded, attempted_at')
      .eq('quiz_id', quizId)
      .order('attempted_at', { ascending: false })
      .limit(100);

    if (attemptError) {
      setError(attemptError.message);
      return;
    }

    setAttempts(data || []);
  }

  function selectLesson(lessonId) {
    setSelectedLesson(lessonId);
    setSelectedQuiz('');
    setQuestions([]);
    setQuestionForm(emptyQuestion);
    setEditingQuestion(null);
    setShowAttempts(false);

    const existing = quizzes.find((quiz) => quiz.lesson_id === lessonId);

    if (existing) {
      setSelectedQuiz(existing.id);
      setQuizTitle(existing.title);
      setPassPercentage(existing.pass_percentage);
      setQuizPublished(existing.is_published);
      loadQuestions(existing.id);
    } else {
      setQuizTitle('Lesson Quiz');
      setPassPercentage(70);
      setQuizPublished(false);
    }

    setMessage('');
    setError('');
  }

  async function saveQuiz() {
    setError('');
    setMessage('');

    if (!selectedLesson) {
      setError('Select a lesson first.');
      return;
    }

    if (!quizTitle.trim()) {
      setError('Enter a quiz title.');
      return;
    }

    const percentage = Number(passPercentage);

    if (!Number.isInteger(percentage) || percentage < 1 || percentage > 100) {
      setError('Passing percentage must be between 1 and 100.');
      return;
    }

    setSaving(true);

    try {
      const existing = quizzes.find((quiz) => quiz.lesson_id === selectedLesson);

      const payload = {
        lesson_id: selectedLesson,
        title: quizTitle.trim(),
        pass_percentage: percentage,
        is_published: quizPublished,
      };

      const result = existing
        ? await supabase
            .from('lesson_quizzes')
            .update(payload)
            .eq('id', existing.id)
            .select()
            .single()
        : await supabase
            .from('lesson_quizzes')
            .insert(payload)
            .select()
            .single();

      if (result.error) throw result.error;

      setSelectedQuiz(result.data.id);
      setMessage(existing ? 'Quiz settings updated.' : 'Quiz created successfully.');
      await loadData();
      await loadQuestions(result.data.id);
    } catch (err) {
      setError(err.message || 'Could not save quiz.');
    } finally {
      setSaving(false);
    }
  }

  function updateQuestionField(field, value) {
    setQuestionForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateOption(index, value) {
    setQuestionForm((current) => ({
      ...current,
      options: current.options.map((option, i) =>
        i === index ? value : option
      ),
    }));
  }

  function startEditQuestion(question) {
    setEditingQuestion(question.id);

    setQuestionForm({
      question: question.question,
      options: question.options,
      correct_option: question.correct_option,
      explanation: question.explanation || '',
      sort_order: question.sort_order,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetQuestion() {
    setEditingQuestion(null);
    setQuestionForm({
      ...emptyQuestion,
      sort_order: questions.length + 1,
    });
  }

  async function saveQuestion(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!selectedQuiz) {
      setError('Save the quiz settings first.');
      return;
    }

    if (!questionForm.question.trim()) {
      setError('Enter the question.');
      return;
    }

    if (questionForm.options.some((option) => !option.trim())) {
      setError('Fill in all four answer choices.');
      return;
    }

    if (!questionForm.explanation.trim()) {
      setError('Add an explanation for the correct answer.');
      return;
    }

    const order = Number(questionForm.sort_order);

    if (!Number.isInteger(order) || order < 1) {
      setError('Question order must be a positive whole number.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        quiz_id: selectedQuiz,
        question: questionForm.question.trim(),
        options: questionForm.options.map((option) => option.trim()),
        correct_option: Number(questionForm.correct_option),
        explanation: questionForm.explanation.trim(),
        sort_order: order,
      };

      const result = editingQuestion
        ? await supabase
            .from('lesson_quiz_questions')
            .update(payload)
            .eq('id', editingQuestion)
        : await supabase
            .from('lesson_quiz_questions')
            .insert(payload);

      if (result.error) throw result.error;

      setMessage(editingQuestion ? 'Question updated.' : 'Question added.');
      resetQuestion();
      await loadQuestions(selectedQuiz);
    } catch (err) {
      setError(err.message || 'Could not save question.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteQuestion(question) {
    if (!window.confirm(`Delete this question: "${question.question}"?`)) return;

    const { error: deleteError } = await supabase
      .from('lesson_quiz_questions')
      .delete()
      .eq('id', question.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setMessage('Question deleted.');
    if (editingQuestion === question.id) resetQuestion();
    await loadQuestions(selectedQuiz);
  }

  async function toggleQuizPublished() {
    if (!selectedQuiz) return;

    const nextValue = !quizPublished;

    if (nextValue && questions.length < 1) {
      setError('Add at least one question before publishing.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    const { error: updateError } = await supabase
      .from('lesson_quizzes')
      .update({ is_published: nextValue })
      .eq('id', selectedQuiz);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setQuizPublished(nextValue);
    setMessage(nextValue ? 'Quiz published for students.' : 'Quiz unpublished.');
    await loadData();
  }

  async function deleteQuiz() {
    if (!selectedQuiz) return;

    if (!window.confirm('Delete this quiz, its questions and its attempt history?')) {
      return;
    }

    const { error: deleteError } = await supabase
      .from('lesson_quizzes')
      .delete()
      .eq('id', selectedQuiz);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setMessage('Quiz deleted.');
    setSelectedQuiz('');
    setQuestions([]);
    setAttempts([]);
    setShowAttempts(false);
    setQuizTitle('Lesson Quiz');
    setPassPercentage(70);
    setQuizPublished(false);
    await loadData();
  }

  function lessonName(lessonId) {
    return lessons.find((lesson) => lesson.id === lessonId)?.title || 'Lesson';
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-center text-cyan-300">
        Checking administrator access...
      </main>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (profile?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link to="/dashboard" className="text-sm font-semibold text-cyan-300">
          ← Back to Dashboard
        </Link>

        <section className="mt-5 rounded-3xl border border-purple-400/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-7">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-300">
            SpaceVerse Academy
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Lesson Quiz Manager
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Create interactive assessments, explain answers and track student results.
          </p>
        </section>

        {message && (
          <p role="status" className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-300">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-5 break-words rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
            {error}
          </p>
        )}

        <section className="mt-7 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7">
          <h2 className="text-xl font-black">1. Choose a lesson</h2>

          <label className="mt-4 block text-sm text-slate-300">
            Select lesson
            <select
              value={selectedLesson}
              onChange={(event) => selectLesson(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
            >
              <option value="">Choose a lesson</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title} {lesson.is_published ? '' : '(Draft)'}
                </option>
              ))}
            </select>
          </label>

          {loading && <p className="mt-4 text-cyan-300">Loading lessons...</p>}
          {!loading && lessons.length === 0 && (
            <p className="mt-4 text-amber-300">Create a lesson before creating a quiz.</p>
          )}
        </section>

        {selectedLesson && (
          <>
            <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7">
              <h2 className="text-xl font-black">2. Quiz settings</h2>

              <label className="mt-4 block text-sm text-slate-300">
                Quiz title
                <input
                  value={quizTitle}
                  onChange={(event) => setQuizTitle(event.target.value)}
                  maxLength={120}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                />
              </label>

              <label className="mt-4 block text-sm text-slate-300">
                Passing percentage
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={passPercentage}
                  onChange={(event) => setPassPercentage(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                />
              </label>

              <button
                type="button"
                onClick={saveQuiz}
                disabled={saving}
                className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save quiz settings'}
              </button>

              {selectedQuiz && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={toggleQuizPublished}
                    disabled={saving}
                    className="rounded-xl border border-emerald-400/30 px-4 py-3 text-sm font-bold text-emerald-300"
                  >
                    {quizPublished ? 'Unpublish quiz' : 'Publish quiz'}
                  </button>

                  <button
                    type="button"
                    onClick={() => loadAttempts(selectedQuiz)}
                    className="rounded-xl border border-purple-400/30 px-4 py-3 text-sm font-bold text-purple-300"
                  >
                    View student attempts
                  </button>

                  <button
                    type="button"
                    onClick={deleteQuiz}
                    className="rounded-xl border border-red-400/30 px-4 py-3 text-sm font-bold text-red-300"
                  >
                    Delete quiz
                  </button>
                </div>
              )}

              <p className="mt-4 text-xs leading-5 text-slate-400">
                Selected lesson: {lessonName(selectedLesson)}
              </p>
            </section>

            {selectedQuiz && (
              <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7">
                <h2 className="text-xl font-black">
                  3. {editingQuestion ? 'Edit question' : 'Add a question'}
                </h2>

                <form onSubmit={saveQuestion} className="mt-5 grid gap-4">
                  <label className="text-sm text-slate-300">
                    Question
                    <textarea
                      value={questionForm.question}
                      onChange={(event) => updateQuestionField('question', event.target.value)}
                      rows={3}
                      required
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                      placeholder="Example: Which planet is known as the Red Planet?"
                    />
                  </label>

                  {questionForm.options.map((option, index) => (
                    <label key={index} className="text-sm text-slate-300">
                      Option {index + 1}
                      <input
                        value={option}
                        onChange={(event) => updateOption(index, event.target.value)}
                        required
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                        placeholder={`Enter answer ${index + 1}`}
                      />
                    </label>
                  ))}

                  <label className="text-sm text-slate-300">
                    Correct answer
                    <select
                      value={questionForm.correct_option}
                      onChange={(event) => updateQuestionField('correct_option', Number(event.target.value))}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                    >
                      {questionForm.options.map((option, index) => (
                        <option key={index} value={index}>
                          Option {index + 1}{option.trim() ? ` — ${option}` : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm text-slate-300">
                    Explanation shown after submission
                    <textarea
                      value={questionForm.explanation}
                      onChange={(event) => updateQuestionField('explanation', event.target.value)}
                      rows={3}
                      required
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                      placeholder="Explain why this answer is correct."
                    />
                  </label>

                  <label className="text-sm text-slate-300">
                    Question order
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={questionForm.sort_order}
                      onChange={(event) => updateQuestionField('sort_order', event.target.value)}
                      required
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                    />
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-purple-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : editingQuestion ? 'Update question' : 'Add question'}
                    </button>

                    {editingQuestion && (
                      <button
                        type="button"
                        onClick={resetQuestion}
                        className="rounded-xl border border-white/20 px-5 py-3 font-semibold"
                      >
                        Cancel editing
                      </button>
                    )}
                  </div>
                </form>
              </section>
            )}

            <section className="mt-6">
              <h2 className="text-xl font-black">4. Quiz questions ({questions.length})</h2>

              {questions.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-slate-900 p-7 text-center text-slate-400">
                  Save quiz settings, then add 