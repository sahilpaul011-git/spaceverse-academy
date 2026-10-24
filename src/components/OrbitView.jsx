
import { useEffect, useState } from 'react';
import { PLANETS } from '../data/planets';

const TEXTURES = {
  mercury: '2k_mercury.jpg',
  venus: '2k_venus_surface.jpg',
  earth: '2k_earth_daymap.jpg',
  mars: '2k_mars.jpg',
  jupiter: '2k_jupiter.jpg',
  saturn: '2k_saturn.jpg',
  uranus: '2k_uranus.jpg',
  neptune: '2k_neptune.jpg',
};

const SIZES = {
  mercury: 13, venus: 15, earth: 17, mars: 14,
  jupiter: 25, saturn: 23, uranus: 18, neptune: 18,
};

const ORBIT_COLORS = [
  '#94a3b8', '#d6a36b', '#60a5fa', '#34d399',
  '#fb923c', '#e879f9', '#facc15', '#67e8f9',
];

const idOf = p => String(p.id || p.name || '').toLowerCase();
const nameOf = p => p.name || p.id || 'Planet';
const textureOf = id =>
  `${import.meta.env.BASE_URL}textures/${TEXTURES[id]}`;

export default function OrbitView({
  compact = false,
  onSelect,
  selectedPlanet = null,
  selectedId = null,
}) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    if (!playing) return;

    let frame;
    let previous = 0;

    const animate = now => {
      if (previous) {
        const delta = Math.min(now - previous, 50);
        setTime(value => value + delta * 0.000025 * speed);
      }
      previous = now;
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [playing, speed]);

  const planets = PLANETS.filter(
    p => !p.dwarf && SIZES[idOf(p)]
  );
  const selected = selectedPlanet ?? selectedId;
  const scale = compact ? 0.78 : zoom;

  return (
    <section className="w-full min-w-0">
      <div className="mx-auto w-full max-w-[620px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-3 sm:p-4">
        <header className="flex items-center justify-between gap-2 px-2 py-2">
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Solar System Orbit
            </h2>
            <p className="text-xs text-slate-400">
              Explore the eight planets
            </p>
          </div>
          {!compact && (
            <span className="text-xs text-cyan-200">
              {playing ? 'Orbiting' : 'Paused'}
            </span>
          )}
        </header>

        <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_45%,#14244b,#050a18_65%,#010208)]">
          {Array.from({ length: 100 }, (_, i) => (
            <span
              key={i}
              className="pointer-events-none absolute rounded-full bg-white"
              style={{
                left: `${(i * 73 + 19) % 98}%`,
                top: `${(i * 137 + 31) % 98}%`,
                width: i % 9 === 0 ? 3 : 1.5,
                height: i % 9 === 0 ? 3 : 1.5,
                opacity: i % 3 === 0 ? 0.8 : 0.35,
              }}
            />
          ))}

          <div
            className="absolute inset-0"
            style={{ transform: `scale(${scale})` }}
          >
            {planets.map((planet, index) => {
              const id = idOf(planet);
              const orbit = 5.5 + (index + 1) * 5.25;
              const angle =
                time / Math.sqrt(index + 1) + index * 0.72;
              const x = 50 + Math.cos(angle) * orbit;
              const y = 50 + Math.sin(angle) * orbit;
              const size = SIZES[id];
              const isSelected =
                selected === planet.id ||
                selected === id ||
                selected === nameOf(planet);

              return (
                <div key={id}>
                  <div
                    className="pointer-events-none absolute rounded-full border"
                    style={{
                      width: `${orbit * 2}%`,
                      height: `${orbit * 2}%`,
                      left: `${50 - orbit}%`,
                      top: `${50 - orbit}%`,
                      borderColor: ORBIT_COLORS[index],
                      opacity: 0.45,
                    }}
                  />

                  <button
                    type="button"
                    aria-label={`Select ${nameOf(planet)}`}
                    title={nameOf(planet)}
                    onClick={() => onSelect?.(planet.id)}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: size * 2,
                      height: size * 2,
                      backgroundColor: '#334155',
                      backgroundImage: `url("${textureOf(id)}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: isSelected
                        ? '2px solid white'
                        : '1px solid #ffffff70',
                      boxShadow:
                        `inset -${size / 2}px -${size / 4}px ${size / 2}px #000c, ` +
                        `inset ${size / 5}px -${size / 6}px ${size / 3}px #ffffff30, ` +
                        '0 0 12px #60a5fa25',
                    }}
                  >
                    {id === 'saturn' && (
                      <span
                        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[65%] w-[170%] -translate-x-1/2 -translate-y-1/2 rotate-[-20deg] rounded-[50%] border-[3px] border-amber-100/70"
                      />
                    )}
                  </button>

                  {showLabels && !compact && (
                    <span
                      className="pointer-events-none absolute z-20 -translate-x-1/2 rounded bg-slate-950/80 px-1.5 py-0.5 text-[10px] font-bold text-white"
                      style={{
                        left: `${x}%`,
                        top: `${y + size / 1.7}%`,
                      }}
                    >
                      {nameOf(planet)}
                    </span>
                  )}
                </div>
              );
            })}

            <div
              className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%,#fff9c2,#ffd447 35%,#f97316 72%,#9a3412)',
                boxShadow:
                  '0 0 18px 7px #f59e0b66, 0 0 45px 12px #f9731625',
              }}
              aria-label="Sun"
            />
          </div>
        </div>

        {!compact && (
          <div className="space-y-3 px-2 pb-2 pt-4">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white"
                onClick={() => setPlaying(v => !v)}
              >
                {playing ? 'Pause' : 'Play'}
              </button>

              <button
                className="rounded-full border border-slate-600 px-3 py-2 text-sm text-white"
                onClick={() => setZoom(v => Math.max(0.65, v - 0.15))}
              >
                Zoom −
              </button>

              <span className="py-2 text-sm text-white">
                {zoom.toFixed(2)}×
              </span>

              <button
                className="rounded-full border border-slate-600 px-3 py-2 text-sm text-white"
                onClick={() => setZoom(v => Math.min(1.2, v + 0.15))}
              >
                Zoom +
              </button>

              <button
                className="rounded-full border border-cyan-400/60 px-3 py-2 text-sm text-cyan-100"
                onClick={() => setShowLabels(v => !v)}
              >
                {showLabels ? 'Hide Labels' : 'Show Labels'}
              </button>

              <button
                className="rounded-full border border-slate-600 px-3 py-2 text-sm text-white"
                onClick={() => {
                  setZoom(1);
                  setSpeed(1);
                  setTime(0);
                  setPlaying(true);
                  setShowLabels(true);
                  onSelect?.(null);
                }}
              >
                Reset
              </button>
            </div>

            <div className="mx-auto max-w-xs">
              <div className="mb-1 flex justify-between text-xs text-slate-300">
                <label htmlFor="orbit-speed">Orbit speed</label>
                <span>{speed.toFixed(1)}×</span>
              </div>
              <input
                id="orbit-speed"
                type="range"
                min="0.2"
                max="2"
                step="0.1"
                value={speed}
                onChange={e => setSpeed(Number(e.target.value))}
                className="w-full accent-indigo-400"
              />
            </div>

            <p className="text-center text-xs text-slate-400">
              Planet sizes, orbital distances and speeds are simplified.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
