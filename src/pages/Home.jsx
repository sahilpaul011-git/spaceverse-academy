
import { Link } from 'react-router-dom';
import OrbitView from '../components/OrbitView';

const learningZones = [
  {
    icon: '🪐',
    title: 'Solar System Explorer',
    description: 'Explore planets, moons, orbits, and amazing facts about our cosmic neighbourhood.',
    tag: 'START EXPLORING',
    to: '/explore',
    color: 'from-cyan-400/20 to-blue-600/10',
  },
  {
    icon: '🧪',
    title: 'Cosmic Lab',
    description: 'Discover space science through interactive experiments and cosmic discoveries.',
    tag: 'EXPERIMENT',
    to: '/cosmic-lab',
    color: 'from-violet-500/25 to-fuchsia-500/10',
  },
  {
    icon: '🌠',
    title: 'What If? Universe',
    description: 'What if Earth had two moons? What if the Sun disappeared? Explore the possibilities.',
    tag: 'TEST YOUR IDEAS',
    to: '/what-if',
    color: 'from-indigo-500/25 to-cyan-500/10',
  },
  {
    icon: '🛰️',
    title: 'Mission Control',
    description: 'Take on space missions, follow your progress, and become a space explorer.',
    tag: 'ACCEPT A MISSION',
    to: '/missions',
    color: 'from-amber-400/20 to-orange-500/10',
  },
];

const discoveries = [
  {
    title: 'Pillars of Creation',
    subtitle: 'Stellar nurseries',
    query: 'Webb Hubble Pillars of Creation',
    icon: '✨',
  },
  {
    title: 'The Red Planet',
    subtitle: 'Discover Mars',
    query: 'NASA Mars rover landscape',
    icon: '🔴',
  },
  {
    title: 'Saturn’s Rings',
    subtitle: 'A spectacular world',
    query: 'NASA Cassini Saturn rings',
    icon: '🪐',
  },
  {
    title: 'Beyond Our Galaxy',
    subtitle: 'Galaxies and deep space',
    query: 'NASA Hubble distant galaxies',
    icon: '🌌',
  },
];

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-6 max-w-2xl">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.25em] text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 leading-7 text-slate-300">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="overflow-hidden text-slate-100">
      {/* HERO */}
      <section className="relative isolate mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-2 lg:gap-8 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse at 15% 20%, rgba(34,211,238,.14), transparent 42%), radial-gradient(ellipse at 85% 60%, rgba(124,58,237,.16), transparent 45%)',
          }}
        />

        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-bold tracking-wide text-cyan-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
            YOUR ADVENTURE STARTS HERE
          </div>

          <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Big questions.
            <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
              Infinite universe.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Discover strange worlds, explore real space imagery, run cosmic
            experiments, and find out what makes our universe extraordinary.
            Your journey to the stars begins with curiosity.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/explore"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 font-extrabold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              Explore the universe <span aria-hidden="true">↗</span>
            </Link>

            <Link
              to="/what-if"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-bold text-white transition hover:border-violet-300/60 hover:bg-violet-400/10"
            >
              <span aria-hidden="true">✦</span> Try What If?
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
            <span>✦ Learn at your own pace</span>
            <span>✦ Kid-friendly discovery</span>
            <span>✦ Start for free</span>
          </div>
        </div>

        {/* PLANETARY SHOWCASE */}
        <div className="relative mx-auto w-full max-w-xl">
          <div
            className="absolute inset-5 rounded-full blur-3xl"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(circle, rgba(59,130,246,.25), rgba(124,58,237,.13) 45%, transparent 72%)',
            }}
          />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 p-3 shadow-2xl shadow-indigo-950/60 sm:p-5">
            <div
              className="relative overflow-hidden rounded-[1.5rem] border border-cyan-200/10 p-3 sm:p-4"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 45%, rgba(30,64,175,.22), transparent 60%), linear-gradient(145deg, #080d24, #101638 60%, #080d24)',
              }}
            >
              <div className="flex items-center justify-between gap-2 px-2 py-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300">
                    Live learning zone
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Our Solar System
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-slate-300">
                  ORBIT VIEW
                </span>
              </div>

              <div className="relative min-h-[250px] overflow-hidden rounded-2xl sm:min-h-[320px]">
                <div
                  className="absolute inset-0"
                  aria-hidden="true"
                  style={{
                    backgroundImage:
                      'radial-gradient(2px 2px at 15% 25%, #fff 50%, transparent 100%), radial-gradient(1px 1px at 70% 18%, #bae6fd 50%, transparent 100%), radial-gradient(2px 2px at 85% 75%, #fff 50%, transparent 100%), radial-gradient(1px 1px at 30% 80%, #fff 50%, transparent 100%), radial-gradient(1px 1px at 55% 60%, #fff 50%, transparent 100%)',
                  }}
                />

                <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10 sm:h-64 sm:w-64" />
                <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/15 sm:h-48 sm:w-48" />

                <div
                  className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-32 sm:w-32"
                  aria-label="Illustration of a glowing star"
                  role="img"
                  style={{
                    background:
                      'radial-gradient(circle at 35% 30%, #fff7c2, #fbbf24 24%, #f97316 54%, #7c2d12 78%)',
                    boxShadow:
                      '0 0 35px rgba(251,191,36,.45), 0 0 85px rgba(249,115,22,.2)',
                  }}
                />

                <div className="absolute left-[14%] top-[24%] text-2xl sm:text-3xl">
                  🪐
                </div>
                <div className="absolute right-[14%] top-[23%] text-xl sm:text-2xl">
                  🌍
                </div>
                <div className="absolute bottom-[20%] right-[23%] text-lg sm:text-xl">
                  🌑
                </div>
                <div className="absolute bottom-[18%] left-[22%] text-sm text-cyan-100">
                  ✦
                </div>

                <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 backdrop-blur">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">
                    Mission status
                  </p>
                  <p className="mt-1 text-xs font-bold text-emerald-300">
                    Ready for launch
                  </p>
                </div>
              </div>

              <p className="px-2 pb-2 pt-3 text-center text-xs leading-5 text-slate-400">
                Explore the real orbital model below. The artwork above is
                decorative and not a scale-accurate map.
              </p>

              <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-2 sm:p-3">
                <OrbitView compact selectedId={null} />
                <Link
                  to="/explore"
                  className="mt-2 block rounded-full border border-cyan-300/20 py-2 text-center text-sm font-bold text-cyan-200 transition hover:bg-cyan-300/10"
                >
                  Open interactive Solar System →
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute -right-2 top-12 hidden rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-xl sm:block">
            <p className="text-xs text-slate-400">The universe is</p>
            <p className="text-lg font-black text-white">Full of wonders ✨</p>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-4 sm:p-6">
          {[
            ['8', 'Major planets'],
            ['∞', 'Questions to explore'],
            ['01', 'Curiosity required'],
            ['FREE', 'Start learning'],
          ].map(([number, label]) => (
            <div key={label} className="p-3 text-center">
              <p className="text-2xl font-black text-cyan-200 sm:text-3xl">
                {number}
              </p>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LEARNING ZONES */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Choose your adventure"
          title="Your universe. Your discoveries."
          description="Learn by exploring, experimenting, asking questions, and putting your space knowledge to the test."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {learningZones.map((zone, index) => (
            <Link
              key={zone.title}
              to={zone.to}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${zone.color} bg-slate-900/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/40 hover:shadow-xl hover:shadow-cyan-950/30`}
            >
              <div className="mb-6 flex items-start justify-between">
                <span className="text-4xl" aria-hidden="true">
                  {zone.icon}
                </span>
                <span className="text-sm text-slate-500">
                  0{index + 1}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white">
                {zone.title}
              </h3>
              <p className="mt-2 min-h-[84px] text-sm leading-6 text-slate-300">
                {zone.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-[10px] font-extrabold tracking-widest text-cyan-200">
                  {zone.tag}
                </span>
                <span className="transition group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DISCOVER SPACE */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The universe, captured"
          title="Discover the extraordinary."
          description="Find real astronomical imagery and explore the wonders captured by space telescopes and robotic explorers."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {discoveries.map((item, index) => (
            <Link
              key={item.title}
              to={`/gallery?q=${encodeURIComponent(item.query)}`}
              className="group relative flex min-h-48 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-5 transition hover:border-violet-300/40 hover:bg-slate-900"
            >
              <div
                className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl transition group-hover:opacity-60"
                aria-hidden="true"
                style={{
                  background:
                    index % 2 === 0 ? '#0891b2' : '#7c3aed',
                }}
              />
              <div className="relative">
                <span className="text-3xl" aria-hidden="true">
                  {item.icon}
                </span>
                <p className="mt-5 text-lg font-extrabold text-white">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
              </div>
              <p className="relative mt-5 text-sm font-bold text-cyan-200">
                Explore discovery <span aria-hidden="true">↗</span>
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-5">
          <Link to="/gallery" className="btn-ghost">
            Browse Space Gallery →
          </Link>
        </div>
      </section>

      {/* QUIZ FEATURE */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[2rem] border border-indigo-300/20 p-7 sm:p-10 lg:p-12"
          style={{
            background:
              'radial-gradient(ellipse at 100% 0%, rgba(139,92,246,.28), transparent 45%), radial-gradient(ellipse at 0% 100%, rgba(34,211,238,.15), transparent 50%), linear-gradient(125deg, #111633, #101b3c 55%, #17143b)',
          }}
        >
          <div className="relative z-10 grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-cyan-200">
                Train your cosmic brain
              </p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Ready for the space quiz?
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Test what you know about planets, stars, galaxies, and
                space exploration. Learn something new with every question.
              </p>
              <p className="mt-4 text-sm font-semibold text-emerald-300">
                ✓ Free to start · ✓ Learn while you play
              </p>
            </div>

            <Link
              to="/quiz"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-amber-300 px-7 py-3 font-extrabold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-200"
            >
              Enter Quiz Arena →
            </Link>
          </div>

          <span
            className="pointer-events-none absolute -bottom-12 right-10 text-9xl opacity-10"
            aria-hidden="true"
          >
            🚀
          </span>
        </div>
      </section>

      {/* FREE FIRST / PREMIUM LATER */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.06] p-6 sm:p-8">
            <span className="inline-flex rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-xs font-extrabold text-emerald-200">
              OPEN FOR EVERYONE
            </span>
            <h2 className="mt-4 text-2xl font-black text-white">
              Start your journey for free.
            </h2>
            <p className="mt-3 leading-7 text-slate-300">
              Explore available learning activities, browse the gallery,
              and build your curiosity without needing to buy a course.
            </p>
            <Link to="/explore" className="mt-5 inline-flex font-bold text-emerald-200 hover:text-emerald-100">
              Begin exploring →
            </Link>
          </div>

          <div className="rounded-3xl border border-violet-300/20 bg-violet-300/[0.06] p-6 sm:p-8">
            <span className="inline-flex rounded-full border border-violet-200/20 bg-violet-300/10 px-3 py-1 text-xs font-extrabold text-violet-200">
              FUTURE EXPANSION
            </span>
            <h2 className="mt-4 text-2xl font-black text-white">
              Deeper space courses.
            </h2>
            <p className="mt-3 leading-7 text-slate-300">
              Structured lessons and advanced courses can be added as a
              future premium offering, while free discovery remains at the heart
              of SpaceVerse Academy.
            </p>
            <p className="mt-5 text-sm font-semibold text-violet-200">
              Premium courses are not available for purchase yet.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/20 px-4 py-8 text-center">
        <Link to="/" className="text-lg font-black text-white">
          🪐 SpaceVerse Academy
        </Link>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
          Inspiring the next generation of explorers, scientists, and
          stargazers—one question at a time.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-5 text-sm text-slate-300">
          <Link to="/explore" className="hover:text-cyan-200">Explore</Link>
          <Link to="/quiz" className="hover:text-cyan-200">Quiz</Link>
          <Link to="/what-if" className="hover:text-cyan-200">What If?</Link>
          <Link to="/gallery" className="hover:text-cyan-200">Gallery</Link>
          <Link to="/credits" className="hover:text-cyan-200">About</Link>
        </div>
        <p className="mt-5 text-xs text-slate-500">
          Keep looking up. The universe is waiting.
        </p>
      </footer>
    </div>
  );
}
