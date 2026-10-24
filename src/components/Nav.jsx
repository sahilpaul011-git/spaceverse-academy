
import { NavLink } from 'react-router-dom';

const links = [
  ['/', 'Home'],
  ['/explore', 'Explore'],
  ['/quiz', 'Quiz Arena'],
  ['/missions', 'Missions'],
  ['/cosmic-lab', 'Cosmic Lab'],
  ['/what-if', 'What If?'],
  ['/gallery', 'Gallery'],
  ['/credits', 'About'],
];

export default function Nav() {
  return (
    <header className="sv-nav">
      <nav className="sv-nav-inner" aria-label="Main navigation">
        <NavLink to="/" end className="sv-nav-brand">
          <span className="sv-nav-symbol" aria-hidden="true">✳</span>
          <span>
            SPACEVERSE
            <small>ACADEMY</small>
          </span>
        </NavLink>

        <div className="sv-nav-links">
          {links.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `sv-nav-link${isActive ? ' is-active' : ''}`
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
