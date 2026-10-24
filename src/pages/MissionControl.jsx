
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'spaceverse-mission-progress-v1';

const MISSIONS = [
  {
    id: 'earth',
    title: 'Protect Planet Earth',
    category: 'EARTH SCIENCE',
    icon: '🌍',
    difficulty: 'Easy',
    xp: 50,
    description: 'Discover why Earth has liquid water and can support life.',
    challenge: 'Name one thing living creatures need to survive.',
    answer: 'Water, air, food, or suitable temperatures.',
    badge: 'Earth Guardian',
  },
  {
    id: 'mars',
    title: 'Red Planet Scout',
    category: 'PLANET EXPLORATION',
    icon: '🔴',
    difficulty: 'Easy',
    xp: 75,
    description: 'Explore Mars, its rusty surface, and robotic rovers.',
    challenge: 'Why does Mars look red?',
    answer: 'Iron-rich dust on its surface has rusted.',
    badge: 'Mars Scout',
  },
  {
    id: 'saturn',
    title: 'Ring Detective',
    category: 'COSMIC MYSTERIES',
    icon: '🪐',
    difficulty: 'Medium',
    xp: 100,
    description: 'Investigate the amazing rings around Saturn.',
    challenge: 'What are Saturn’s rings mainly made from?',
    answer: 'Tiny and large pieces of ice and rock.',
    badge: 'Ring Detective',
  },
  {
    id: 'ice',
    title: 'Ice Giant Explorer',
    category: 'OUTER SOLAR SYSTEM',
    icon: '🧊',
    difficulty: 'Medium',
    xp: 125,
    description: 'Travel to Uranus and Neptune, the distant ice giants.',
    challenge: 'Which planet is farther from the Sun: Uranus or Neptune?',
    answer: 'Neptune.',
    badge: 'Ice Giant Explorer',
  },
  {
    id: 'sun',
    title: 'Solar Power Mission',
    category: 'OUR STAR',
    icon: '☀️',
    difficulty: 'Easy',
    xp: 50,
    description: 'Learn how our star provides light and energy.',
    challenge: 'What is the Sun?',
    answer: 'A star.',
    badge: 'Solar Specialist',
  },
  {
    id: 'jupiter',
    title: 'Giant Planet Investigator',
    category: 'PLANET EXPLORATION',
    icon: '🌪️',
    difficulty: 'Hard',
    xp: 150,
    description: 'Investigate Jupiter, the largest planet in our solar system.',
    challenge: 'What is the name of Jupiter’s famous giant storm?',
    answer: 'The Great Red Spot.',
    badge: 'Jupiter Expert',
  },
];

const BADGES = [
  { id: 'first', icon: '🚀', title: 'First Launch', rule: (n) => n >= 1, hint: 'Complete your first mission.' },
  { id: 'three', icon: '⭐', title: 'Star Collector', rule: (n) => n >= 3, hint: 'Complete 3 missions.' },
  { id: 'all', icon: '🏆', title: 'Galaxy Champion', rule: (n) => n >= MISSIONS.length, hint: 'Complete every mission.' },
];

export default function MissionControl() {
  const [completed, setCompleted] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeMission, setActiveMission] = useState(null);
  const [answerVisible, setAnswerVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCompleted(
            parsed.filter((id) => MISSIONS.some((mission) => mission.id === id))
          );
        }
      }
    } catch {
      // The page remains usable if browser storage is unavailable.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // Progress still works for this session if storage is unavailable.
    }
  }, [completed, loaded]);

  const xp = MISSIONS.reduce(
    (total, mission) => total + (completed.includes(mission.id) ? mission.xp : 0),
    0
  );

  const finishedCount = completed.length;
  const progress = Math.round((finishedCount / MISSIONS.length) * 100);
  const nextMission = MISSIONS.find((mission) => !completed.includes(mission.id));

  function completeMission(id) {
    setCompleted((current) =>
      current.includes(id) ? current : [...current, id]
    );
    setActiveMission(null);
    setAnswerVisible(false);
  }

  function resetProgress() {
    setCompleted([]);
    setActiveMission(null);
    setAnswerVisible(false);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:py-10">
      <header className="relative overflow-hidden rounded-3xl border border-indigo-300/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-8 -top-12 text-9xl opacity-20" aria-hidden="true">
          🪐
        </div>

        <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-cyan-300">
          SpaceVerse Academy · Training division
        </p>

        <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">
          Mission Control 🚀
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Every great space explorer starts with curiosity. Complete missions,
          test your knowledge, earn XP, and unlock your explorer badges.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-200">Total XP</p>
            <p className="mt-1 text-3xl font-black text-white">{xp}</p>
            <p className="text-xs text-slate-300">Experience points</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-200">Missions</p>
            <p className="mt-1 text-3xl font-black text-white">
              {finishedCount}/{MISSIONS.length}
            </p>
            <p className="text-xs text-slate-300">Successfully completed</p>
          </div>

          <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.07] p-4 sm:col-span-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-200">Progress</p>
              <p className="text-sm font-extrabold text-white">{progress}%</p>
            </div>
            <div
              className="mt-3 h-3 overflow-hidden rounded-full bg-slate-700"
              role="progressbar"
              aria-label="Mission completion"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-300">
              {nextMission ? 'Your next discovery awaits!' : 'All missions completed!'}
            </p>
          </div>
        </div>
      </header>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Choose your adventure</p>
            <h2 className="mt-1 text-2xl font-black">Available missions</h2>
          </div>
          <p className="text-sm text-slate-300">{MISSIONS.length - finishedCount} left to explore</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MISSIONS.map((mission, index) => {
            const done = completed.includes(mission.id);

            return (
              <article
                key={mission.id}
                className={`group relative overflow-hidden rounded-3xl border p-5 transition duration-300 hover:-translate-y-1 ${
                  done
                    ? 'border-emerald-400/40 bg-emerald-950/30'
                    : 'border-white/10 bg-slate-900/80 hover:border-cyan-300/50'
                }`}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.08] text-3xl">
                    {mission.icon}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    done ? 'bg-emerald-400/15 text-emerald-300' : 'bg-cyan-400/10 text-cyan-200'
                  }`}>
                    {done ? '✓ Complete' : `+${mission.xp} XP`}
                  </span>
                </div>

                <p className="mt-4 text-[10px] font-extrabold tracking-[0.18em] text-cyan-300">
                  {mission.category}
                </p>
                <h3 className="mt-1 text-xl font-extrabold">{mission.title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-relaxed text-slate-300">
                  {mission.description}
                </p>

                <div className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-400">
                  <span>{mission.difficulty} mission</span>
                  <span>🏅 {mission.badge}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveMission(mission);
                    setAnswerVisible(false);
                  }}
                  className={`mt-5 min-h-11 w-full rounded-full px-4 py-3 text-sm font-extrabold transition ${
                    done
                      ? 'border border-emerald-300/40 text-emerald-200 hover:bg-emerald-400/10'
                      : 'bg-cyan-300 text-slate-950 hover:bg-cyan-200'
                  }`}
                >
                  {done ? 'Review mission' : 'Start mission →'}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-violet-300/20 bg-violet-950/20 p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Your collection</p>
            <h2 className="mt-1 text-2xl font-black">Explorer badges</h2>
          </div>
          <p className="text-sm text-slate-300">
            {BADGES.filter((badge) => badge.rule(finishedCount)).length}/{BADGES.length} unlocked
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {BADGES.map((badge) => {
            const unlocked = badge.rule(finishedCount);

            return (
              <div
                key={badge.id}
                className={`rounded-2xl border p-4 transition ${
                  unlocked
                    ? 'border-amber-300/40 bg-amber-300/[0.08]'
                    : 'border-white/10 bg-black/10 opacity-70'
                }`}
              >
                <div className={`text-4xl ${unlocked ? 'animate-pulse' : 'grayscale'}`}>
                  {unlocked ? badge.icon : '🔒'}
                </div>
                <h3 className="mt-3 font-extrabold">{badge.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{badge.hint}</p>
                <p className={`mt-3 text-xs font-bold ${unlocked ? 'text-amber-200' : 'text-slate-400'}`}>
                  {unlocked ? 'BADGE UNLOCKED' : 'NOT YET UNLOCKED'}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {activeMission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/85 p-3 backdrop-blur-md">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="mission-dialog-title"
            className="w-full max-w-lg rounded-3xl border border-cyan-300/30 bg-gradient-to-br from-indigo-950 to-slate-950 p-6 shadow-2xl sm:p-8"
          >
            <div className="text-5xl" aria-hidden="true">{activeMission.icon}</div>
            <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300">
              Mission briefing
            </p>
            <h2 id="mission-dialog-title" className="mt-1 text-2xl font-black">
              {activeMission.title}
            </h2>
            <p className="mt-3 leading-relaxed text-slate-200">
              {activeMission.description}
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-200">
                Your challenge
              </p>
              <p className="mt-2 font-bold">{activeMission.challenge}</p>

              {answerVisible && (
                <p className="mt-3 rounded-xl bg-emerald-400/10 p-3 text-sm leading-relaxed text-emerald-200">
                  <strong>Answer:</strong> {activeMission.answer}
                </p>
              )}

              <button
                type="button"
                className="mt-3 text-sm font-bold text-cyan-300 underline underline-offset-4"
                onClick={() => setAnswerVisible((value) => !value)}
              >
                {answerVisible ? 'Hide answer' : 'Reveal answer'}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {!completed.includes(activeMission.id) ? (
                <button
                  type="button"
                  className="min-h-11 flex-1 rounded-full bg-cyan-300 px-4 py-3 font-extrabold text-slate-950 hover:bg-cyan-200"
                  onClick={() => completeMission(activeMission.id)}
                >
                  Mission complete · +{activeMission.xp} XP
                </button>
              ) : (
                <div className="flex-1 rounded-full bg-emerald-400/10 px-4 py-3 text-center font-bold text-emerald-200">
                  ✓ Mission already completed
                </div>
              )}

              <button
                type="button"
                className="min-h-11 rounded-full border border-white/20 px-4 py-3 font-bold hover:bg-white/10"
                onClick={() => {
                  setActiveMission(null);
                  setAnswerVisible(false);
                }}
              >
                Close
              </button>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              Learning tip: read the answer, understand the fact, then mark
              the mission complete. XP is a fun progress tracker, not a test grade.
            </p>
          </section>
        </div>
      )}

      <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-5">
        <p className="max-w-xl text-xs leading-relaxed text-slate-400">
          Progress is stored only in this browser on this device. It does not
          sync between devices. Clearing browser data may erase your progress.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all mission progress and XP on this device?')) {
              resetProgress();
            }
          }}
          className="min-h-10 rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10"
        >
          Reset progress
        </button>
      </div>
    </div>
  );
}
