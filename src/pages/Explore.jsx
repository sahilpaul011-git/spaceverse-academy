
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrbitView from '../components/OrbitView';
import PlanetArt from '../components/PlanetArt';
import { ALL_BODIES, PLANETS, getBody, fmt } from '../data/planets';

function Fact({ label, children }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <dt className="text-xs font-bold uppercase tracking-wider text-cyan-300">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-relaxed text-white">{children}</dd>
    </div>
  );
}

export default function Explore() {
  const [selected, setSelected] = useState(null);
  const body = selected ? getBody(selected) : null;
  const planets = PLANETS.filter((p) => !p.dwarf);
  const dwarfs = PLANETS.filter((p) => p.dwarf);

  useEffect(() => {
    if (!body) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelected(null);
    };

    const previousOverflow = document.body.style.overflow;
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selected, body]);

  const choose = (value) => {
    setSelected(
      typeof value === 'string' ? value : value?.id || null
    );
  };

  const planetButton = (planet) => (
    <button
      key={planet.id}
      type="button"
      onClick={() => choose(planet.id)}
      aria-pressed={selected === planet.id}
      className={`min-h-11 rounded-full border px-3 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${
        selected === planet.id
          ? 'border-yellow-300 bg-yellow-300 text-slate-950'
          : 'border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10'
      }`}
    >
      {planet.name}
    </button>
  );

  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">
          Mission zone 01
        </p>
        <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
          Explore the Solar System
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Tap a planet to open its animated Planet Dossier, full of
          fascinating facts and cosmic discoveries.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="card">
          <OrbitView
            selectedId={selected}
            onSelect={choose}
          />
        </div>

        <aside className="card flex flex-col justify-center" aria-live="polite">
          {body ? (
            <>
              <div className="flex items-center gap-4">
                <PlanetArt body={body} className="h-24 w-24 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                    Selected world
                  </p>
                  <h2 className="text-2xl font-extrabold">{body.name}</h2>
                  <p className="text-sm text-slate-300">{body.type}</p>
                </div>
              </div>

              <p className="mt-3 leading-relaxed">{body.kid}</p>

              <button
                type="button"
                className="btn-primary mt-4 self-start"
                onClick={() => choose(body.id)}
              >
                Open animated dossier ↗
              </button>
            </>
          ) : (
            <>
              <div className="text-5xl" aria-hidden="true">🪐</div>
              <h2 className="mt-3 text-xl font-extrabold">
                Your discovery starts here
              </h2>
              <p className="mt-2 text-slate-300">
                Tap any planet in the orbit or choose one below to
                explore its details.
              </p>
            </>
          )}
        </aside>
      </div>

      <section className="card" aria-label="Choose a planet">
        <h2 className="mb-3 font-extrabold">Choose a world</h2>
        <div className="flex flex-wrap gap-2">
          {planetButton(ALL_BODIES[0])}
          {planets.map(planetButton)}
        </div>

        <h3 className="mb-2 mt-4 font-bold text-violet-400">
          Dwarf planets
        </h3>
        <div className="flex flex-wrap gap-2">
          {dwarfs.map(planetButton)}
        </div>
      </section>

      {body && (
        <div
          className="planet-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <section
            className="planet-modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="planet-modal-title"
          >
            <div className="planet-modal-stars" aria-hidden="true">
              <span>✦</span>
              <span>·</span>
              <span>✧</span>
              <span>·</span>
              <span>✦</span>
            </div>

            <button
              type="button"
              className="planet-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close planet details"
            >
              ✕
            </button>

            <div className="planet-modal-hero">
              <div className="planet-modal-art">
                <PlanetArt
                  body={body}
                  className="h-36 w-36 sm:h-44 sm:w-44"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyan-300">
                  SpaceVerse field guide
                </p>
                <h2
                  id="planet-modal-title"
                  className="mt-1 text-3xl font-black sm:text-4xl"
                >
                  {body.name}
                </h2>
                <span className="mt-2 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                  {body.type}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-slate-200">
                  {body.kid}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Fact label="Diameter">
                {fmt(body.diameterKm)} km
              </Fact>
              <Fact label="Distance from Sun">
                {body.distanceMkm
                  ? `${fmt(body.distanceMkm)} million km average`
                  : body.distance}
              </Fact>
              <Fact label="Length of year">{body.year}</Fact>
              <Fact label="Length of day">{body.day}</Fact>
              <Fact label="Temperature">{body.temperature}</Fact>
              <Fact label="Moons">{body.moons}</Fact>
            </div>

            <div className="mt-4 rounded-2xl border border-violet-300/20 bg-violet-400/[0.07] p-4">
              <p className="text-xs font-extrabold uppercase tracking-wider text-violet-200">
                Atmosphere scan
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-100">
                {body.atmosphere}
              </p>
            </div>

            <div className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4">
              <p className="text-xs font-extrabold uppercase tracking-wider text-amber-200">
                Explorer's log
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-100">
                {body.discovery}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to={`/planet/${body.id}`}
                className="btn-primary"
                onClick={() => setSelected(null)}
              >
                Full planet profile ↗
              </Link>

              <button
                type="button"
                className="btn-ghost"
                onClick={() => setSelected(null)}
              >
                Back to the stars
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  const index = ALL_BODIES.findIndex(
                    (item) => item.id === body.id
                  );
                  const next = ALL_BODIES[
                    (index + 1) % ALL_BODIES.length
                  ];
                  setSelected(next.id);
                }}
              >
                Discover next world →
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Science note: distances and temperatures are approximate.
              The orbital diagram is simplified for learning.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
