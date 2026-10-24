
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

      <section aria-labelledby="next">
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
   
