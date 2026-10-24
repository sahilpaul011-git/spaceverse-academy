
import { NavLink } from 'react-router-dom';

const links = [
  ['/', 'Home'],
  ['/explore', 'Solar System'],
  ['/quiz', 'Quiz Arena'],
  ['/missions', 'Missions'],
  ['/cosmic-lab', 'Cosmic Lab'],
  ['/what-if', 'What If?'],
  ['/gallery', 'Space Gallery'],
  ['/credits', 'Credits & About'],
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-indigo-100 bg-white/95 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3"
      >
        <NavLink to="/" className="flex items-center gap-2 font-extrabold text-indigo-700">
          <span className="text-2xl" aria-hidden="true">🪐</span>
          <span>SpaceVerse Academy</span>
        </NavLink>

        <div className="flex flex-wrap items-center gap-2">
          {links.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
              }
