import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Explore", path: "/explore" },
  { label: "Missions", path: "/missions" },
  { label: "Cosmic Lab", path: "/cosmic-lab" },
  { label: "What If?", path: "/what-if" },
  { label: "Gallery", path: "/gallery" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sv-nav">
      <Link
        to="/"
        className="sv-brand"
        aria-label="SpaceVerse Academy home"
        onClick={closeMenu}
      >
        <span className="sv-brand-icon">✦</span>
        <span>
          SPACEVERSE
          <small>ACADEMY</small>
        </span>
      </Link>

      <button
        className="sv-nav-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "×" : "☰"}
      </button>

      <nav
        className={`sv-nav-links ${menuOpen ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {item.label}
          </NavLink>
        ))}

        <NavLink
          className="sv-nav-cta"
          to="/quiz"
          onClick={closeMenu}
        >
          Take a Quiz ↗
        </NavLink>
      </nav>
    </header>
  );
}