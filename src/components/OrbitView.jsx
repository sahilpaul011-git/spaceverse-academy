
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
  mercury: 4,
  venus: 5,
  earth: 6,
  mars: 4.5,
  jupiter: 9,
  saturn: 8,
  uranus: 6,
  neptune: 6,
};

const ORBIT_COLORS = [
  '#94a3b8', '#d6a36b', '#60a5fa', '#34d399',
  '#fb923c', '#e879f9', '#facc15', '#67e8f9',
];

function planetId(planet) {
  return String(planet.id || planet.name || '').toLowerCase();
}

function planetName(planet) {
  return planet.name || planet.id || 'Planet';
}

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
    if (!playing) return undefined;

    let frame;
    let previous = 0;

    const animate = (timestamp) => {
      if (previous) {
        const delta = Math.min(timestamp - previous, 50);
        setTime((value) => value + delta * 0.000025 * speed);
      }
      previous = timestamp;
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [playing, speed]);

  const planets = PLANETS.filter(
    (planet) => !planet.dwarf && SIZES[planetId(planet)]
  );

  const scale = compact ? 0.78 : zoom;
  const selected = selectedPlanet ?? selectedId;

  return (
    <section className="w-full min-w-0">
      <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-3xl border border-indigo-100/20 bg-slate-950 p-2 shadow-xl sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-2">
          <div>
            <h2 className="text-lg font-extrabold text-white sm:text-xl">
              Solar System Orbit
            </h2>
            <p className="text-xs text-slate-300">
              Explore the eight planets
            </p>
          </div>
          {!compact && (
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">
              {playing ? 'Orbiting' : 'Paused'}
            </span>
          )}
        </div>

        <svg
          viewBox="0 0 500 500"
          role="img"
          aria-label="Interactive solar system with textured planets"
          className="block h-auto w-full"
        >
          <defs>
            <radialGradient id="spaceverse-sun">
              <stop offset="0%" stopColor="#fff7ad" />
              <stop offset="45%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#f97316" />
            </radialGradient>

            <radialGradient id="spaceverse-background">
              <stop offset="0%" stopColor="#172554" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            <filter id="spaceverse-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {Object.entries(TEXTURES).map(([id, filename]) => (
              <pattern
                key={id}
                id={`texture-${id}`}
                patternUnits="userSpaceOnUse"
                x="-12"
                y="-12"
                width="24"
                height="24"
              >
                <image
                  href={`${import.meta.env.BASE_URL}textures/${filename}`}
                  x="-12"
                  y="-12"
                  width="24"
                  height="24"
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            ))}
          </defs>

          <rect
            width="500"
            height="500"
            rx="22"
            fill="url(#spaceverse-background)"
          />

          {Array.from({ length: 110 }, (_, i) => (
            <circle
              key={i}
              cx={(i * 73 + 19) % 490 + 5}
              cy={(i * 137 + 31) % 490 + 5}
              r={i % 8 === 0 ? 1.7 : 0.8}
              fill="white"
              opacity={i % 3 === 0 ? 0.85 : 0.4}
            />
          ))}

          <g transform={`translate(250 250) scale(${scale})`}>
            {planets.map((planet, index) => {
              const id = planetId(planet);
              const radius = 22 + (index + 1) * 24;
              const angle = time / Math.sqrt(index + 1) + index * 0.72;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const size = SIZES[id];
              const isSelected =
                selected === planet.id ||
                selected === id ||
                selected === planetName(planet);

              return (
                <g key={id}>
                  <circle
                    cx="0"
                    cy="0"
                    r={radius}
                    fill="none"
                    stroke={ORBIT_COLORS[index]}
                    strokeWidth="0.7"
                    strokeDasharray="3 5"
                    opacity="0.5"
                  />

                  <g
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer"
                    aria-label={`Select ${planetName(planet)}`}
                    onClick={() => onSelect?.(planet.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onSelect?.(planet.id);
                      }
                    }}
                  >
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r={size + 4}
                        fill="none"
                        stroke="white"
                        strokeWidth="1.4"
                      />
                    )}

                    {id === 'saturn' && (
                      <ellipse
                        cx={x}
                        cy={y}
                        rx={size + 5}
                        ry={size + 1.5}
                        fill="none"
                        stroke="#e7d2a3"
                        strokeWidth="2"
                        transform={`rotate(-20 ${x} ${y})`}
                      />
                    )}

                    <circle
                      cx={x}
                      cy={y}
                      r={size}
                      fill={`url(#texture-${id})`}
                      stroke="#ffffff"
                      strokeOpacity="0.6"
                      strokeWidth="0.8"
                    />

                    <circle
                      cx={x}
                      cy={y}
                      r={size}
                      fill="url(#spaceverse-background)"
                      opacity="0.12"
                    />

                    {id === 'uranus' && (
                      <ellipse
                        cx={x}
                        cy={y}
                        rx={size + 3}
                        ry={size * 0.4}
                        fill="none"
                        stroke="#a5f3fc"
                        strokeWidth="1"
                        transform={`rotate(75 ${x} ${y})`}
                      />
                    )}

                    {showLabels && !compact && (
                      <text
                        x={x}
                        y={y - size - 7}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill="white"
                        stroke="#020617"
                        strokeWidth="2.5"
                        paintOrder="stroke"
                      >
                        {planetName(planet)}
                      </text>
                    )}
                  </g>
                </g>
              );
            })}

            <circle
              r="22"
              fill="#f97316"
              opacity="0.22"
              filter="url(#spaceverse-glow)"
            />
            <circle
              r="15"
              fill="url(#spaceverse-sun)"
              filter="url(#spaceverse-glow)"
            />
            <text
              y="35"
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="#fde68a"
            >
              SUN
            </text>
          </g>
        </svg>

        {!compact && (
          <div className="space-y-3 px-2 pb-3 pt-1 sm:px-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white"
                onClick={() => setPlaying((v) => !v)}
              >
                {playing ? 'Pause' : 'Play'}
              </button>

              <button
                type="button"
                className="rounded-full border border-slate-600 px-3 py-2 text-sm text-white"
                onClick={() => setZoom((v) => Math.max(0.65, v - 0.15))}
              >
                Zoom −
              </button>

              <span className="text-sm font-semibold text-white">
                {zoom.toFixed(2)}×
              </span>

              <button
                type="button"
                className="rounded-full border border-slate-600 px-3 py-2 text-sm text-white"
                onClick={() => setZoom((v) => Math.min(1.4, v + 0.15))}
              >
                Zoom +
              </button>

              <button
                type="button"
                aria-pressed={showLabels}
                className="rounded-full border border-cyan-400/60 px-3 py-2 text-sm text-cyan-100"
                onClick={() => setShowLabels((v) => !v)}
              >
                {showLabels ? 'Hide Labels' : 'Show Labels'}
              </button>

              <button
                type="button"
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
              <div className="mb-1 flex items-center justify-between text-xs text-slate-200">
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
                onChange={(event) => setSpeed(Number(event.target.value))}
                className="w-full accent-indigo-400"
              />
            </div>

            <p className="text-center text-xs leading-relaxed text-slate-300">
              Tap a planet to select it. Orbital distances and speeds are
              simplified for learning and are not to scale.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
