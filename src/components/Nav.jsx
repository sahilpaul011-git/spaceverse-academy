
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo';

const links = [
  ['/', 'Home'],
  ['/explore', 'Solar System'],
  ['/gallery', 'Space Gallery'],
  ['/credits', 'Credits & About'],
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  const cls = ({ isActive }) =>
    `block rounded-full px-4 py-2 font-bold ${
      isActive
        ? 'bg-violet-500 text-white'
        : 'text-cyan-300 hover:bg-white/10'
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-space-950/90 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-sun focus:p-2 focus:text-black"
      >
        Skip to content
      </a>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Link to="/" aria-label="SpaceVerse Academy home">
          <Logo />
        </Link>

        <button
          className="btn-ghost md:hidden"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <nav
          id="menu"
          aria-label="Main"
          className={`${
            open ? 'block' : 'hidden'
          } absolute left-0 right-0 top-full bg-space-950 p-3 md:static md:block md:bg-transparent md:p-0`}
        >
          <ul className="flex flex-col gap-1 md:flex-row">
            {links.map(([to, label]) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={cls}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
