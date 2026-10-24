
import { Link } from 'react-router-dom';
import OrbitView from '../components/OrbitView';

const planned = [
  ['Quiz Arena', 'Multiple choice, true/false and matching quizzes with XP.'],
  ['Learn', 'Beginner to advanced lessons on stars, galaxies, rockets and more.'],
  ['Missions & Space Passport', 'Complete missions and collect planet stamps and badges.'],
  ['Premium courses', 'Optional parent-managed paid courses.'],
];

const discoveries = [
  ['Pillars of Creation', 'Webb Hubble Pillars of Creation'],
  ['Apollo 11', 'Apollo 11 Moon landing'],
  ["Saturn's rings", 'Saturn Cassini rings'],
  ['Mars rover selfies', 'Curiosity rover self portrait'],
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="grid items-center gap-6 md:grid-cols-2">
        <div>
          <p className="font-bold uppercase tracking-widest text-cyan-300">
            Welcome, space cadet
          </p>

          <h1 className="mt-2 text-4xl font-extrabold leading-tight md:text-5xl">
            Explore the Solar System, one planet at a time.
          </h1>

          <p className="mt-3 text-lg text-slate-200">
            Tap a planet, watch the orbits, and discover real photos from NASA.
            No sign-up needed, no ads, no chat with strangers.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/explore" className="btn-primary">
              🚀 Start exploring
            </Link>
            <Link to="/gallery" className="btn-ghost">
              See real space photos
            </Link>
          </div>
        </div>

        <div className="card">
          <OrbitView compact selectedId={null} />
          <p className="text-center text-xs text-cyan-300">
            Preview, not to scale.{' '}
            <Link to="/explore" className="underline">
              Open the full explorer
            </Link>
          </p>
        </div>
      </section>

      <section aria-labelledby="disc">
        <h2 id="disc" className="mb-3 text-2xl font-extrabold">
          Featured discoveries
        </h2>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {discoveries.map(([label, q]) => (
            <li key={label}>
              <Link
                to={`/gallery?q=${encodeURIComponent(q)}`}
                className="card block h-full font-bold hover:border-cyan-400"
              >
                🔭 {label}
                <span className="mt-1 block text-sm font-normal text-slate-300">
                  Search NASA's image library
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      
<section
  aria-labelledby="quiz-arena"
  className="mx-auto my-10 max-w-6xl px-4"
>
  <div className="overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-950 via-indigo-800 to-purple-800 p-6 text-white shadow-xl sm:p-10">
    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
      <div className="max-w-xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-cyan-300">
          🚀 Daily space challenge
        </p>

        <h2
          id="quiz-arena"
          className="text-3xl font-extrabold sm:text-4xl"
        >
          Enter Quiz Arena!
        </h2>

        <p className="mt-3 leading-7 text-indigo-100">
          Test your space knowledge with five questions, discover
          amazing facts, and challenge yourself every day.
        </p>

        <p className="mt-3 text-sm text-indigo-200">
          Free to play • Kids-friendly • Learn while having fun
        </p>
      </div>

      <Link
        to="/quiz"
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-yellow-300 px-6 py-3 font-extrabold text-indigo-950 transition hover:bg-yellow-200"
      >
        Play Quiz Now →
      </Link>
    </div>
  </div>
</section>
      
        <h2 id="next" className="mb-1 text-2xl font-extrabold">
          Coming next
        </h2>

        <p className="mb-3 text-sm text-slate-300">
          These features are planned and <strong>not built yet</strong>, so
          they are not clickable.
        </p>

        <ul className="grid gap-3 sm:grid-cols-2">
          {planned.map(([title, description]) => (
            <li key={title} className="card opacity-80">
              <span className="mb-1 inline-block rounded-full bg-violet-500/30 px-2 py-0.5 text-xs font-bold">
                Planned
              </span>
              <h3 className="font-bold">{title}</h3>
              <p className="text-sm text-slate-300">{description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
                }
   
