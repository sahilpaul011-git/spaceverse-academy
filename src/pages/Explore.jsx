import { useState } from 'react';
import { Link } from 'react-router-dom';
import OrbitView from '../components/OrbitView';
import PlanetArt from '../components/PlanetArt';
import { ALL_BODIES, PLANETS, getBody, fmt } from '../data/planets';

export default function Explore() {
  const [selected, setSelected] = useState(null);
  const body = selected ? getBody(selected) : null;
  const planets = PLANETS.filter((p) => !p.dwarf);
  const dwarfs = PLANETS.filter((p) => p.dwarf);

  const btn = (b) => (
    <button
      key={b.id}
      onClick={() => setSelected(b.id)}
      aria-pressed={selected === b.id}
      className={`rounded-full border px-3 py-2 text-sm font-bold ${
        selected === b.id
          ? 'border-sun bg-sun text-space-950'
          : 'border-cyan-400/50 text-cyan-300'
      }`}
    >
      {b.name}
    </button>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold">
        Explore the Solar System
      </h1>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="card">
          <OrbitView
            selectedId={selected}
            onSelect={setSelected}
          />
        </div>

        <aside className="card" aria-live="polite">
          {body ? (
            <>
              <div className="flex items-center gap-4">
                <PlanetArt
                  body={body}
                  className="h-24 w-24 shrink-0"
                />

                <div>
                  <h2 className="text-2xl font-extrabold">
                    {body.name}
                  </h2>
                  <p
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${
                      body.dwarf ? 'bg-violet-500' : 'bg-volt'
                    }`}
                  >
                    {body.type}
                  </p>
                </div>
              </div>

              <p className="mt-3">{body.kid}</p>

              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                <dt className="font-bold text-cyan-300">Diameter</dt>
                <dd>{fmt(body.diameterKm)} km</dd>

                <dt className="font-bold text-cyan-300">From the Sun</dt>
                <dd>
                  {body.distanceMkm
                    ? `${fmt(body.distanceMkm)} million km (average)`
                    : body.distance}
                </dd>

                <dt className="font-bold text-cyan-300">Year</dt>
                <dd>{body.year}</dd>
              </dl>

              <Link
                to={`/planet/${body.id}`}
                className="btn-primary mt-4 inline-block"
              >
                Full {body.name} profile
              </Link>
            </>
          ) : (
            <p>
              Tap a planet in the diagram, or pick one below, to
              learn about it.
            </p>
          )}
        </aside>
      </div>

      <section className="card" aria-label="Choose a body">
        <h2 className="mb-2 font-extrabold">Choose a world</h2>

        <div className="flex flex-wrap gap-2">
          {btn(ALL_BODIES[0])}
          {planets.map(btn)}
        </div>

        <h3 className="mb-2 mt-4 font-bold text-violet-400">
          Dwarf planet (not one of the eight planets)
        </h3>

        <div className="flex flex-wrap gap-2">
          {dwarfs.map(btn)}
        </div>
      </section>
    </div>
  );
}
