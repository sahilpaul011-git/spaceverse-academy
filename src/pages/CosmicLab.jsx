
import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'spaceverse-cosmic-lab-v1';

const PLANETS = [
  {
    id: 'mercury',
    name: 'Mercury',
    icon: '🌑',
    color: '#A9A9A9',
    diameter: 4879,
    gravity: 0.38,
    temperature: '167°C average',
    day: '58.6 Earth days',
    distance: 0.39,
    moons: 0,
    fact: 'Mercury is the smallest planet and the closest to the Sun.',
  },
  {
    id: 'venus',
    name: 'Venus',
    icon: '🟠',
    color: '#E7AD69',
    diameter: 12104,
    gravity: 0.90,
    temperature: '464°C average',
    day: '243 Earth days',
    distance: 0.72,
    moons: 0,
    fact: 'Venus is the hottest planet because its thick atmosphere traps heat.',
  },
  {
    id: 'earth',
    name: 'Earth',
    icon: '🌍',
    color: '#38BDF8',
    diameter: 12742,
    gravity: 1,
    temperature: '15°C average',
    day: '24 hours',
    distance: 1,
    moons: 1,
    fact: 'Earth is the only world currently known to support life.',
  },
  {
    id: 'mars',
    name: 'Mars',
    icon: '🔴',
    color: '#F87171',
    diameter: 6779,
    gravity: 0.38,
    temperature: '-65°C average',
    day: '24.6 hours',
    distance: 1.52,
    moons: 2,
    fact: 'Mars looks red because its surface contains rusty iron minerals.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    icon: '🟤',
    color: '#D6A77A',
    diameter: 139820,
    gravity: 2.53,
    temperature: '-110°C cloud tops',
    day: '9.9 hours',
    distance: 5.20,
    moons: 101,
    fact: 'Jupiter is the largest planet and has a giant storm called the Great Red Spot.',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    icon: '🪐',
    color: '#E8D29A',
    diameter: 116460,
    gravity: 1.07,
    temperature: '-140°C cloud tops',
    day: '10.7 hours',
    distance: 9.58,
    moons: 274,
    fact: 'Saturn’s beautiful rings are made mostly of ice and rocky pieces.',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    icon: '🩵',
    color: '#67E8F9',
    diameter: 50724,
    gravity: 0.89,
    temperature: '-195°C cloud tops',
    day: '17.2 hours',
    distance: 19.2,
    moons: 29,
    fact: 'Uranus rotates on its side compared with most other planets.',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    icon: '🔵',
    color: '#60A5FA',
    diameter: 49244,
    gravity: 1.14,
    temperature: '-200°C cloud tops',
    day: '16.1 hours',
    distance: 30.05,
    moons: 16,
    fact: 'Neptune is a distant, windy world beyond Uranus.',
  },
];

const CHALLENGES = [
  {
    id: 'largest',
    question: 'Which of these two planets has the larger diameter?',
    getAnswer: (a, b) =>
      a.diameter === b.diameter
        ? 'same'
        : a.diameter > b.diameter
          ? a.id
          : b.id,
    explanation: (a, b) =>
      `${a.name} is ${a.diameter > b.diameter ? 'larger' : a.diameter < b.diameter ? 'smaller' : 'the same size as'} ${b.name} by diameter.`,
  },
  {
    id: 'gravity',
    question: 'On which planet would you feel stronger gravity?',
    getAnswer: (a, b) =>
      a.gravity === b.gravity
        ? 'same'
        : a.gravity > b.gravity
          ? a.id
          : b.id,
    explanation: (a, b) =>
      `${a.name}: ${a.gravity} times Earth's gravity. ${b.name}: ${b.gravity} times Earth's gravity.`,
  },
  {
    id: 'distance',
    question: 'Which planet is farther from the Sun?',
    getAnswer: (a, b) =>
      a.distance === b.distance
        ? 'same'
        : a.distance > b.distance
          ? a.id
          : b.id,
    explanation: (a, b) =>
      `${a.name} is ${a.distance > b.distance ? 'farther from' : a.distance < b.distance ? 'closer to' : at} the Sun: ${a.distance} AU versus ${b.distance} AU.`,
  },
];

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

export default function CosmicLab() {
  const [firstId, setFirstId] = useState('earth');
  const [secondId, setSecondId] = useState('mars');
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [choice, setChoice] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (Array.isArray(saved.completed)) {
        setCompleted(saved.completed.filter((id) => typeof id === 'string'));
      }
    } catch {
      // The lab still works if browser storage is unavailable.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed }));
    } catch {
      // Progress remains available for this session.
    }
  }, [completed, loaded]);

  const first = PLANETS.find((planet) => planet.id === firstId) || PLANETS[2];
  const second =
    PLANETS.find((planet) => planet.id === secondId) || PLANETS[3];
  const challenge = CHALLENGES[challengeIndex];

  const pairKey = [first.id, second.id].sort().join('-');
  const challengeKey = `${pairKey}-${challenge.id}`;
  const alreadyCompleted = completed.includes(challengeKey);

  const xp = completed.length * 25;
  const badges = [
    {
      title: 'Cosmic Beginner',
      icon: '🌟',
      unlocked: completed.length >= 1,
      hint: 'Answer one challenge',
    },
    {
      title: 'Planet Pro',
      icon: '🪐',
      unlocked: completed.length >= 5,
      hint: 'Answer five challenges',
    },
    {
      title: 'Galaxy Genius',
      icon: '🏆',
      unlocked: completed.length >= 10,
      hint: 'Answer ten challenges',
    },
  ];

  const sizeDifference = useMemo(() => {
    const ratio = Math.max(first.diameter, second.diameter) /
      Math.min(first.diameter, second.diameter);
    return ratio.toFixed(1);
  }, [first.diameter, second.diameter]);

  function changePlanet(which, id) {
    if (which === 'first') {
      setFirstId(id);
      if (id === secondId) setSecondId(firstId);
    } else {
      setSecondId(id);
      if (id === firstId) setFirstId(secondId);
    }
    setChoice('');
    setFeedback(null);
  }

  function chooseAnswer(answer) {
    setChoice(answer);
    if (alreadyCompleted) {
      setFeedback({
        correct: answer === challenge.getAnswer(first, second),
        message: 'You have already earned XP for this challenge.',
      });
      return;
    }

    const correct = answer === challenge.getAnswer(first, second);
    setFeedback({
      correct,
      message: correct
        ? 'Brilliant! You earned 25 XP. Keep exploring!'
        : 'Not quite! Check the comparison and try another challenge.',
    });

    if (correct) {
      setCompleted((current) =>
        current.includes(challengeKey)
          ? current
          : [...current, challengeKey]
      );
    }
  }

  function nextChallenge() {
    setChallengeIndex((current) => (current + 1) % CHALLENGES.length);
    setChoice('');
    setFeedback(null);
  }

  function resetProgress() {
    if (window.confirm('Reset all Cosmic Lab challenge progress and XP?')) {
      setCompleted([]);
      setChoice('');
      setFeedback(null);
    }
  }

  const maxDiameter = Math.max(first.diameter, second.diameter);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:py-10">
      <header className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-4 -top-6 text-8xl opacity-20" aria-hidden="true">
          🪐
        </div>
        <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-cyan-300">
          SpaceVerse Academy · Discovery lab
        </p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">
          Cosmic Comparison Lab 🔭
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Put two planets side by side. Compare their sizes, gravity, days,
          temperatures, and distances from the Sun. Then test your space smarts!
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-200">
              Your XP
            </p>
            <p className="mt-1 text-3xl font-black text-white">{xp}</p>
            <p className="text-xs text-slate-300">From correct answers</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-200">
              Challenges solved
            </p>
            <p className="mt-1 text-3xl font-black text-white">
              {completed.length}
            </p>
            <p className="text-xs text-slate-300">Saved on this device</p>
          </div>
        </div>
      </header>

      <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
            Choose your worlds
          </p>
          <h2 className="mt-1 text-2xl font-black">Planet selector</h2>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-200">
              Planet A
            </span>
            <select
              value={firstId}
              onChange={(event) => changePlanet('first', event.target.value)}
              className="min-h-12 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-3 text-base text-white"
            >
              {PLANETS.map((planet) => (
                <option key={planet.id} value={planet.id}>
                  {planet.icon} {planet.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-200">
              Planet B
            </span>
            <select
              value={secondId}
              onChange={(event) => changePlanet('second', event.target.value)}
              className="min-h-12 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-3 text-base text-white"
            >
              {PLANETS.map((planet) => (
                <option key={planet.id} value={planet.id}>
                  {planet.icon} {planet.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[first, second].map((planet) => {
            const diameter = Math.max(
              12,
              (planet.diameter / maxDiameter) * 150
            );

            return (
              <article
                key={planet.id}
                className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-indigo-950/80 to-slate-950 p-5 text-center"
              >
                <div className="flex h-40 w-full items-center justify-center">
                  <div
                    className="rounded-full shadow-[0_0_35px_rgba(96,165,250,0.22)]"
                    style={{
                      width: `${diameter}px`,
                      height: `${diameter}px`,
                      maxWidth: '100%',
                      background: `radial-gradient(circle at 30% 25%, white 0%, ${planet.color} 18%, ${planet.color} 58%, #172554 100%)`,
                    }}
                    role="img"
                    aria-label={`${planet.name}, scaled for comparison`}
                  />
                </div>
                <h3 className="mt-2 text-xl font-black">{planet.icon} {planet.name}</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Diameter: {formatNumber(planet.diameter)} km
                </p>
              </article>
            );
          })}
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
          Size illustration scales with diameter. A minimum display size keeps
          smaller planets visible on phones.
        </p>

        <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
          <p className="text-xs font-extrabold uppercase tracking-wider text-cyan-200">
            Quick discovery
          </p>
          <p className="mt-2 text-lg font-bold">
            {first.diameter > second.diameter
              ? `${first.name} is larger than ${second.name}.`
              : first.diameter < second.diameter
                ? `${second.name} is larger than ${first.name}.`
                : 'Both planets have the same diameter.'}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            The larger planet is about {sizeDifference} times the diameter of
            the smaller planet.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-violet-300/20 bg-violet-950/20">
        <div className="p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
            The science scoreboard
          </p>
          <h2 className="mt-1 text-2xl font-black">Compare the facts</h2>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/15 text-cyan-200">
                  <th className="px-3 py-3 font-bold">Fact</th>
                  <th className="px-3 py-3 font-bold">{first.name}</th>
                  <th className="px-3 py-3 font-bold">{second.name}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Diameter', `${formatNumber(first.diameter)} km`, `${formatNumber(second.diameter)} km`],
                  ['Gravity', `${first.gravity}× Earth`, `${second.gravity}× Earth`],
                  ['Temperature', first.temperature, second.temperature],
                  ['Length of day', first.day, second.day],
                  ['Distance from Sun', `${first.distance} AU`, `${second.distance} AU`],
                  ['Known moons', first.moons, second.moons],
                ].map(([label, a, b]) => (
                  <tr key={label} className="border-b border-white/10 last:border-0">
                    <th scope="row" className="px-3 py-3 font-semibold text-slate-200">
                      {label}
                    </th>
                    <td className="px-3 py-3 text-slate-300">{a}</td>
                    <td className="px-3 py-3 text-slate-300">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            AU means astronomical unit: approximately the average distance
            between Earth and the Sun. Temperature figures are approximate;
            cloud-top and surface conditions vary by planet.
          </p>
        </div>

        <div className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-2 sm:p-7">
          {[first, second].map((planet) => (
            <div key={planet.id} className="rounded-2xl bg-black/20 p-4">
              <h3 className="font-extrabold">{planet.icon} {planet.name} fact</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {planet.fact}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-950/30 to-slate-950 p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
          Brain booster · +25 XP
        </p>
        <h2 className="mt-1 text-2xl font-black">Cosmic challenge</h2>
        <p className="mt-3 text-lg font-bold">{challenge.question}</p>
        <p className="mt-1 text-sm text-slate-300">
          Compare {first.name} and {second.name}, then choose your answer.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { value: first.id, label: first.name, icon: first.icon },
            { value: second.id, label: second.name, icon: second.icon },
            { value: 'same', label: 'They are equal', icon: '⚖️' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => chooseAnswer(option.value)}
              className={`min-h-14 rounded-2xl border px-4 py-3 text-sm font-extrabold transition ${
                choice === option.value
                  ? 'border-cyan-300 bg-cyan-300/15 text-cyan-100'
                  : 'border-white/15 bg-slate-950/60 text-white hover:border-cyan-300/50'
              }`}
            >
              <span className="mr-2" aria-hidden="true">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>

        {feedback && (
          <div
            role="status"
            className={`mt-4 rounded-2xl border p-4 ${
              feedback.correct
                ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100'
                : 'border-rose-300/30 bg-rose-400/10 text-rose-100'
            }`}
          >
            <p className="font-extrabold">{feedback.message}</p>
            {feedback.correct && (
              <p className="mt-2 text-sm">{challenge.explanation(first, second)}</p>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={nextChallenge}
            className="min-h-11 rounded-full bg-amber-300 px-5 py-3 font-extrabold text-slate-950 hover:bg-amber-200"
          >
            Next challenge →
          </button>
          <button
            type="button"
            onClick={resetProgress}
            className="min-h-11 rounded-full border border-white/20 px-5 py-3 font-bold text-slate-200 hover:bg-white/10"
          >
            Reset lab XP
          </button>
        </div>
        {alreadyCompleted && (
          <p className="mt-3 text-xs text-slate-400">
            You've already earned XP for this planet pair and question. Change
            the planets or switch challenge to discover more.
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              Keep discovering
            </p>
            <h2 className="mt-1 text-2xl font-black">Cosmic badges</h2>
          </div>
          <p className="text-sm text-slate-300">
            {badges.filter((badge) => badge.unlocked).length}/{badges.length} unlocked
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {badges.map((badge) => (
            <article
              key={badge.title}
              className={`rounded-2xl border p-4 ${
                badge.unlocked
                  ? 'border-amber-300/40 bg-amber-300/[0.08]'
                  : 'border-white/10 bg-black/10 opacity-70'
              }`}
            >
              <p className="text-4xl">{badge.unlocked ? badge.icon : '🔒'}</p>
              <h3 className="mt-3 font-extrabold">{badge.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{badge.hint}</p>
              <p className={`mt-3 text-xs font-bold ${
                badge.unlocked ? 'text-amber-200' : 'text-slate-400'
              }`}>
                {badge.unlocked ? 'BADGE UNLOCKED' : 'LOCKED'}
              </p>
            </article>
          ))}
        </div>
      </section>

      <p className="text-xs leading-relaxed text-slate-400">
        Learning data is built into this page. XP and badges are saved locally
        in this browser and do not sync with Mission Control or other devices.
        Moon counts and planetary measurements can change as new observations
        are confirmed; the figures here are educational reference values.
      </p>
    </div>
  );
}