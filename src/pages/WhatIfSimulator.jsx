
import { useEffect, useState } from 'react';
import PlanetArt from '../components/PlanetArt';

const STORAGE_KEY = 'spaceverse-what-if-v1';

const EXPERIMENTS = [
  {
    id: 'moons',
    emoji: '🌍',
    title: 'What if Earth had two moons?',
    short: 'A second moon in our sky',
    description:
      'Imagine a second moon sharing Earth’s sky. Depending on its mass and orbit, it could change tides and create spectacular nights.',
    fact:
      'REAL SCIENCE: The Moon raises tides through gravity. A second moon would have different effects depending on its mass, distance and orbit.',
    result:
      'Two moons could appear in the same sky. Their phases and positions would change over time.',
    question: 'What mainly causes ocean tides on Earth?',
    answers: [
      'The Moon’s gravity and the Sun’s gravity',
      'The colour of the ocean',
      'Clouds pushing the sea',
    ],
    correct: 0,
  },
  {
    id: 'oceans',
    emoji: '🔴',
    title: 'What if Mars had oceans?',
    short: 'A blue world beyond Earth',
    description:
      'Imagine huge oceans covering parts of Mars. The red deserts might become coastlines, but the planet would still have a thin atmosphere and harsh conditions.',
    fact:
      'REAL SCIENCE: Mars has evidence of ancient rivers and lakes. Stable Earth-like oceans today would require major changes to its environment.',
    result:
      'This experiment imagines oceans on Mars. The planet’s real surface remains cold, dusty and hostile to liquid water.',
    question: 'What is a major challenge for liquid water on Mars today?',
    answers: [
      'Mars has no mountains',
      'Its low atmospheric pressure and cold climate',
      'Mars receives no sunlight at all',
    ],
    correct: 1,
  },
  {
    id: 'gravity',
    emoji: '🪐',
    title: 'What if gravity changed?',
    short: 'Feel a different world',
    description:
      'Adjust gravity to imagine a world where it is weaker or stronger than Earth’s. Your mass stays the same, but your weight changes.',
    fact:
      'REAL SCIENCE: Weight depends on gravity. Mass is the amount of matter in your body and does not change just because gravity changes.',
    result:
      'At lower gravity, you would weigh less. At higher gravity, you would weigh more. This slider is an educational model.',
    question: 'If gravity becomes weaker, what happens to your weight?',
    answers: [
      'It decreases',
      'It doubles every second',
      'It never changes',
    ],
    correct: 0,
  },
];

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      xp: Number(saved.xp) || 0,
      completed: Array.isArray(saved.completed) ? saved.completed : [],
    };
  } catch {
    return { xp: 0, completed: [] };
  }
}

function PlanetScene({ experiment, gravity }) {
  const isEarth = experiment.id === 'moons';
  const isMars = experiment.id === 'oceans';
  const isGravity = experiment.id === 'gravity';

  return (
    <div
      className={`relative isolate flex h-[340px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 ${
        isEarth
          ? 'bg-gradient-to-b from-indigo-950 via-blue-950 to-slate-950'
          : isMars
          ? 'bg-gradient-to-b from-orange-950 via-red-950 to-slate-950'
          : 'bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950'
      }`}
    >
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 65 }, (_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${(i * 37 + 11) % 97}%`,
              top: `${(i * 23 + 7) % 93}%`,
              width: i % 5 === 0 ? 3 : 2,
              height: i % 5 === 0 ? 3 : 2,
              opacity: 0.25 + (i % 6) * 0.1,
            }}
          />
        ))}
      </div>

      {isEarth && (
        <>
          <div className="absolute left-[12%] top-[17%] h-9 w-9 rounded-full border border-white/30 bg-gradient-to-br from-gray-100 to-gray-500 shadow-[0_0_25px_#ffffff55]" />
          <div className="absolute right-[12%] top-[24%] h-14 w-14 rounded-full border border-white/30 bg-gradient-to-br from-gray-100 to-gray-500 shadow-[0_0_30px_#ffffff55]" />
          <p className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-2 text-xs font-bold text-white">
            TWO-MOON SCENARIO
          </p>
        </>
      )}

      {isMars && (
        <>
          <div className="absolute bottom-[8%] left-[-8%] h-20 w-[55%] rounded-[50%] bg-gradient-to-t from-orange-950 to-orange-700/80" />
          <div className="absolute bottom-[13%] right-[-10%] h-28 w-[60%] rounded-[50%] bg-gradient-to-t from-red-950 to-orange-800/80" />
          <div className="absolute bottom-[18%] left-[15%] h-16 w-[70%] rounded-[50%] border-t-4 border-cyan-200/80 bg-gradient-to-b from-cyan-400 to-blue-800 shadow-[0_0_30px_#22d3ee66]" />
          <p className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-2 text-xs font-bold text-white">
            HYPOTHETICAL OCEANS
          </p>
        </>
      )}

      {!isGravity ? (
        <div className="relative z-10 flex h-56 w-56 items-center justify-center">
          <PlanetArt
            body={{
              id: isEarth ? 'earth' : 'mars',
              name: isEarth ? 'Earth' : 'Mars',
            }}
            className="h-56 w-56"
          />
        </div>
      ) : (
        <div className="relative z-10 flex h-48 w-48 items-center justify-center">
          <div
            className="absolute rounded-full border border-violet-300/20 transition-all duration-300"
            style={{
              width: `${80 + gravity * 0.45}%`,
              height: `${80 + gravity * 0.45}%`,
            }}
          />
          <div className="absolute h-36 w-36 rounded-full border border-violet-300/30" />
          <div className="absolute h-24 w-24 rounded-full border border-violet-300/40" />
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-300 to-indigo-950 text-3xl shadow-[0_0_35px_#a78bfa77] transition-transform duration-300"
            style={{ transform: `scale(${0.65 + gravity / 180})` }}
          >
            🧑‍🚀
          </div>
          <p className="absolute bottom-[-18px] text-xs font-bold text-violet-200">
            GRAVITY FIELD · {gravity}%
          </p>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-2">
        <span className="rounded-full border border-white/15 bg-black/50 px-3 py-2 text-xs font-bold text-white backdrop-blur">
          {isEarth
            ? '🌙 TWO-MOON SCENARIO'
            : isMars
            ? '🌊 HYPOTHETICAL OCEANS'
            : '🧲 GRAVITY LAB'}
        </span>
        <span className="text-xs text-white/70">
          {isGravity ? 'Interactive gravity model' : 'Textured 3D planet'}
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
  const gravityWeight = (60 * gravity / 100).toFixed(1);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // The simulator remains usable without browser storage.
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
      setProgress((old) => ({
        xp: old.xp + 25,
        completed: [...old.completed, activeId],
      }));
    }
  }

  function nextExperiment() {
    const index = EXPERIMENTS.findIndex((item) => item.id === activeId);
    chooseExperiment(EXPERIMENTS[(index + 1) % EXPERIMENTS.length].id);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black tracking-[0.2em] text-cyan-200">
            SPACEVERSE EXPERIMENT ZONE
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl">
            What If<span className="text-cyan-300">?</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Change the rules of the cosmos. Explore strange worlds, run thought
            experiments, and discover the science behind impossible questions.
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
                {progress.completed.length}/3
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-extrabold text-white">
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
              <span className="mt-2 block font-extrabold text-white">
                {item.title}
              </span>
              <span className="mt-1 block text-sm text-slate-400">
                {item.short}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <PlanetScene experiment={experiment} gravity={gravity} />

          {activeId === 'gravity' && (
            <div className="mt-4 rounded-2xl border border-purple-300/20 bg-purple-950/40 p-5">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="gravity-slider" className="font-bold text-white">
                  Gravity strength
                </label>
                <span className="rounded-full bg-purple-300/10 px-3 py-1 font-black text-purple-200">
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
                  {gravityWeight} kg-equivalent
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  This is a simplified comparison. Your mass remains the same
                  while your weight changes with gravity.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
              Mission briefing
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">
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
                {experiment.fact}
              </p>
            </div>

            {completed && (
              <p className="mt-4 text-sm font-bold text-emerald-300">
                ✓ Experiment quiz completed — XP earned!
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-purple-300">
              Quick science quiz
            </p>
            <h3 className="mt-3 text-lg font-extrabold text-white">
              {experiment.question}
            </h3>

            <div className="mt-4 space-y-2">
              {experiment.answers.map((option, index) => {
                const correct = index === experiment.correct;
                const chosen = answer === index;
                let style = 'border-white/10 bg-white/5 hover:bg-white/10';

                if (answer !== null && correct) {
                  style = 'border-emerald-400/60 bg-emerald-400/10';
                } else if (chosen && !correct) {
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
          </div>
        </div>
      </section>

      <p className="mt-8 text-center text-xs leading-6 text-slate-500">
        SpaceVerse Academy • Explore boldly, ask questions, and test your ideas.
        Progress is saved in this browser.
      </p>
    </div>
  );
}
