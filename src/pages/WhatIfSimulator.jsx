
import { useEffect, useState } from 'react';
import PlanetArt from '../components/PlanetArt';

const STORAGE_KEY = 'spaceverse-what-if-v2';

const EXPERIMENTS = [
  {
    id: 'moons',
    emoji: '🌙',
    title: 'What if Earth had two moons?',
    subtitle: 'A second moon in our sky',
    planet: 'earth',
    color: 'cyan',
    description:
      'Imagine two moons circling Earth. Their gravity could change ocean tides, and their different orbital positions could create spectacular night skies.',
    science:
      'Our Moon creates much of Earth’s tidal variation, while the Sun also affects tides. A second moon’s effects would depend on its mass, distance and orbit.',
    result:
      'Two moons would move through the sky at different speeds, showing different phases and positions.',
    question: 'What mainly causes ocean tides?',
    answers: [
      'The gravity of the Moon and Sun',
      'The colour of the ocean',
      'Clouds pushing the sea',
    ],
    correct: 0,
  },
  {
    id: 'oceans',
    emoji: '🌊',
    title: 'What if Mars had oceans?',
    subtitle: 'A blue world beyond Earth',
    planet: 'mars',
    color: 'orange',
    description:
      'Imagine ancient Mars with vast oceans. Coastlines might surround its giant volcanoes, but its thin atmosphere and cold climate would still make it a difficult place to live.',
    science:
      'Scientists have found evidence that liquid water once flowed on Mars. Stable oceans today would require major changes to the planet’s climate and atmospheric pressure.',
    result:
      'This is a thought experiment, not a realistic prediction of Mars today. The blue effects represent hypothetical water.',
    question: 'Why is stable liquid water difficult on Mars today?',
    answers: [
      'Mars has no mountains',
      'Its cold climate and low atmospheric pressure',
      'Mars never receives sunlight',
    ],
    correct: 1,
  },
  {
    id: 'gravity',
    emoji: '🧲',
    title: 'What if gravity changed?',
    subtitle: 'Explore another gravity level',
    planet: 'earth',
    color: 'purple',
    description:
      'Turn the gravity dial up or down. Explore how your weight would change on a world with different surface gravity.',
    science:
      'Mass measures how much matter you have. Weight depends on gravity. The slider models your weight on a hypothetical world.',
    result:
      'Lower gravity means less weight. Higher gravity means more weight. Your mass stays the same.',
    question: 'What happens to your weight when gravity decreases?',
    answers: [
      'It decreases',
      'It becomes zero in every situation',
      'Your mass disappears',
    ],
    correct: 0,
  },
];

function readProgress() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      xp: Number(data.xp) || 0,
      completed: Array.isArray(data.completed) ? data.completed : [],
    };
  } catch {
    return { xp: 0, completed: [] };
  }
}

function Starfield() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: 75 }, (_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${(i * 47 + 13) % 100}%`,
            top: `${(i * 31 + 7) % 100}%`,
            width: i % 7 === 0 ? 3 : 2,
            height: i % 7 === 0 ? 3 : 2,
            opacity: 0.25 + (i % 5) * 0.12,
          }}
        />
      ))}
    </div>
  );
}

function PlanetScene({ experiment, gravity }) {
  const isEarth = experiment.id === 'moons';
  const isMars = experiment.id === 'oceans';
  const planetId = isMars ? 'mars' : 'earth';

  return (
    <div
      className={`relative isolate min-h-[340px] overflow-hidden rounded-[2rem] border border-white/10 ${
        isMars
          ? 'bg-gradient-to-br from-[#200b12] via-[#32121a] to-[#070b18]'
          : isEarth
          ? 'bg-gradient-to-br from-[#050b25] via-[#091a3d] to-[#020617]'
          : 'bg-gradient-to-br from-[#10072b] via-[#101640] to-[#020617]'
      }`}
    >
      <Starfield />

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: isMars
            ? 'rgba(249,115,22,0.12)'
            : 'rgba(59,130,246,0.15)',
        }}
      />

      <div className="absolute left-4 top-4 z-20 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-bold tracking-wide text-white backdrop-blur">
        {isEarth
          ? '🌙 TWO-MOON EXPERIMENT'
          : isMars
          ? '🌊 MARS OCEAN EXPERIMENT'
          : '🧲 GRAVITY EXPERIMENT'}
      </div>

      {isEarth && (
        <>
          <div className="absolute left-[13%] top-[24%] h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-500 shadow-[0_0_22px_#ffffff55]" />
          <div className="absolute right-[12%] top-[34%] h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-500 shadow-[0_0_30px_#ffffff66]" />
        </>
      )}

      {isMars && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-orange-950/50 to-transparent" />
      )}

      <div className="relative z-10 flex min-h-[340px] items-center justify-center px-3 pb-12 pt-12">
        <div
          className="relative flex items-center justify-center"
          style={{
            width: 'min(70vw, 270px)',
            height: 'min(70vw, 270px)',
            maxWidth: 270,
            maxHeight: 270,
            transform: `scale(${experiment.id === 'gravity' ? 0.9 + gravity / 1000 : 1})`,
            transition: 'transform 300ms ease',
          }}
        >
          {experiment.id === 'gravity' && (
            <>
              <div
                className="pointer-events-none absolute rounded-full border border-violet-300/20"
                style={{
                  width: `${100 + gravity * 0.55}%`,
                  height: `${100 + gravity * 0.55}%`,
                  transition: 'all 300ms ease',
                }}
              />
              <div className="pointer-events-none absolute h-[115%] w-[115%] rounded-full border border-violet-300/15" />
              <div className="pointer-events-none absolute h-[130%] w-[130%] rounded-full border border-violet-300/10" />
            </>
          )}

          <PlanetArt
            key={planetId}
            body={{
              id: planetId,
              name: isMars ? 'Mars' : 'Earth',
            }}
            className="h-full w-full"
          />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-bold text-white backdrop-blur">
          {isEarth
            ? '🌍 EARTH + 2 MOONS'
            : isMars
            ? '🔴 HYPOTHETICAL MARS'
            : '🌎 EARTH GRAVITY MODEL'}
        </span>
        <span className="text-xs text-slate-300">
          {experiment.id === 'gravity'
            ? `${gravity}% Earth gravity`
            : 'Live 3D planet'}
        </span>
      </div>
    </div>
  );
}

export default function WhatIfSimulator() {
  const [activeId, setActiveId] = useState('moons');
  const [gravity, setGravity] = useState(100);
  const [answer, setAnswer] = useState(null);
  const [progress, setProgress] = useState(readProgress);

  const experiment =
    EXPERIMENTS.find((item) => item.id === activeId) || EXPERIMENTS[0];

  const completed = progress.completed.includes(activeId);
  const weight = (60 * gravity / 100).toFixed(1);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Continue to work if browser storage is unavailable.
    }
  }, [progress]);

  function chooseExperiment(id) {
    setActiveId(id);
    setAnswer(null);
  }

  function submitAnswer(index) {
    if (answer !== null) return;

    setAnswer(index);

    if (index === experiment.correct && !completed) {
      setProgress((previous) => ({
        xp: previous.xp + 25,
        completed: [...previous.completed, activeId],
      }));
    }
  }

  function nextExperiment() {
    const currentIndex = EXPERIMENTS.findIndex(
      (item) => item.id === activeId
    );
    chooseExperiment(
      EXPERIMENTS[(currentIndex + 1) % EXPERIMENTS.length].id
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 text-white sm:px-6">
      <header className="relative mb-8 overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-6 sm:p-10">
        <Starfield />

        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10">
          <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black tracking-[0.2em] text-cyan-200">
            SPACEVERSE • INTERACTIVE LAB
          </span>

          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
            What If<span className="text-cyan-300">?</span>
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-300 sm:text-lg">
            Change the rules of the cosmos. Explore 3D planets, test
            gravity, and discover the science behind extraordinary
            possibilities.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-slate-400">YOUR XP</p>
              <p className="text-2xl font-black text-amber-300">
                ⭐ {progress.xp}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-slate-400">EXPERIMENTS CLEARED</p>
              <p className="text-2xl font-black text-cyan-200">
                {progress.completed.length}/{EXPERIMENTS.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-extrabold">
          Choose your experiment
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          {EXPERIMENTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => chooseExperiment(item.id)}
              className={`min-h-28 rounded-2xl border p-4 text-left transition hover:-translate-y-1 ${
                activeId === item.id
                  ? 'border-cyan-300 bg-cyan-300/10 shadow-lg shadow-cyan-900/20'
                  : 'border-white/10 bg-slate-900/70 hover:border-white/30'
              }`}
            >
              <span className="text-3xl" aria-hidden="true">
                {item.emoji}
              </span>
              <span className="mt-2 block font-extrabold">
                {item.title}
              </span>
              <span className="mt-1 block text-sm text-slate-400">
                {item.subtitle}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <PlanetScene experiment={experiment} gravity={gravity} />

          {activeId === 'gravity' && (
            <div className="mt-4 rounded-2xl border border-violet-300/20 bg-violet-950/40 p-5">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="gravity-slider" className="font-bold">
                  Gravity strength
                </label>
                <span className="rounded-full bg-violet-300/10 px-3 py-1 font-black text-violet-200">
                  {gravity}%
                </span>
              </div>

              <input
                id="gravity-slider"
                type="range"
                min="20"
                max="200"
                step="10"
                value={gravity}
                onChange={(event) => setGravity(Number(event.target.value))}
                className="mt-4 w-full accent-fuchsia-400"
              />

              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>Weak</span>
                <span>Earth gravity</span>
                <span>Strong</span>
              </div>

              <div className="mt-4 rounded-xl bg-black/20 p-4">
                <p className="text-sm text-slate-300">
                  If your Earth weight is 60 kg-equivalent:
                </p>
                <p className="mt-1 text-2xl font-black text-fuchsia-200">
                  {weight} kg-equivalent
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  This is a simplified model. Your mass remains the
                  same, while your weight changes with gravity.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
              Mission briefing
            </p>

            <h2 className="mt-3 text-2xl font-black">
              {experiment.title}
            </h2>

            <p className="mt-3 leading-7 text-slate-300">
              {experiment.description}
            </p>

            <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4">
              <p className="font-extrabold text-cyan-200">
                🔬 Imagine the result
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {experiment.result}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4">
              <p className="font-extrabold text-amber-200">
                🧠 Real science check
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {experiment.science}
              </p>
            </div>

            {completed && (
              <p className="mt-4 text-sm font-bold text-emerald-300">
                ✓ Experiment completed — XP earned!
              </p>
            )}
          </article>

          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-purple-300">
              Quick science quiz
            </p>

            <h3 className="mt-3 text-lg font-extrabold">
              {experiment.question}
            </h3>

            <div className="mt-4 space-y-2">
              {experiment.answers.map((option, index) => {
                const isCorrect = index === experiment.correct;
                const isChosen = answer === index;

                let style =
                  'border-white/10 bg-white/5 hover:bg-white/10';

                if (answer !== null && isCorrect) {
                  style =
                    'border-emerald-400/60 bg-emerald-400/10';
                } else if (isChosen && !isCorrect) {
                  style = 'border-red-400/60 bg-red-400/10';
                }

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={answer !== null}
                    onClick={() => submitAnswer(index)}
                    className={`w-full rounded-xl border p-3 text-left text-sm font-semibold text-slate-100 transition disabled:cursor-default ${style}`}
                  >
                    <span className="mr-2 text-slate-400">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            {answer !== null && (
              <div
                className={`mt-4 rounded-xl p-4 text-sm leading-6 ${
                  answer === experiment.correct
                    ? 'bg-emerald-400/10 text-emerald-200'
                    : 'bg-amber-300/10 text-amber-100'
                }`}
              >
                <p className="font-extrabold">
                  {answer === experiment.correct
                    ? '🚀 Correct!'
                    : '🛰️ Not quite — keep learning!'}
                </p>

                <p className="mt-1">
                  {answer === experiment.correct
                    ? completed
                      ? 'You have already earned XP for this experiment.'
                      : 'Great discovery, Space Explorer. You earned 25 XP!'
                    : `Correct answer: ${experiment.answers[experiment.correct]}.`}
                </p>

                <button
                  type="button"
                  onClick={nextExperiment}
                  className="mt-3 rounded-full bg-white/10 px-4 py-2 font-bold text-white hover:bg-white/20"
                >
                  Explore next experiment →
                </button>
              </div>
            )}
          </article>
        </div>
      </section>

      <footer className="mt-8 text-center text-xs leading-6 text-slate-500">
        SpaceVerse Academy • Explore boldly, ask questions, and test
        your ideas. Your progress is saved in this browser.
      </footer>
    </main>
  );
}
