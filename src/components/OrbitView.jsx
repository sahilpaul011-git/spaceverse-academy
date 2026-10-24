
import { useEffect, useState } from 'react';
import { PLANETS } from '../data/planets';

const ORBIT_COLORS = [
  '#94a3b8',
  '#d6a36b',
  '#60a5fa',
  '#34d399',
  '#fb923c',
  '#e879f9',
  '#facc15',
  '#67e8f9',
];

const PLANET_COLORS = {
  mercury: '#a8a29e',
  venus: '#fbbf24',
  earth: '#38bdf8',
  mars: '#fb7185',
  jupiter: '#d6a36b',
  saturn: '#facc15',
  uranus: '#67e8f9',
  neptune: '#818cf8',
};

const PLANET_SIZES = {
  mercury: 4,
  venus: 6,
  earth: 7,
  mars: 5,
  jupiter: 12,
  saturn: 10,
  uranus: 8,
  neptune: 8,
};

function getPlanetId(planet) {
  return String(planet.id || planet.name || '').toLowerCase();
}

function getPlanetName(planet) {
  return planet.name || planet.id || 'Planet';
}

export default function OrbitView({
  compact = false,
  onSelect,
  selectedPlanet = null,
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

  const center = 250;
  const baseOrbit = 22;
  const orbitGap = 24;
  const orbitScale = compact ? 0.78 : zoom;
  const planets = PLANETS.filter(
    (planet) => !planet.dwarf && PLANET_SIZES[getPlanetId(planet)]
  );

  return (
    <section className="w-full min-w-0">
      <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-3xl border border-indigo-100 bg-slate-950 p-2 shadow-xl sm:p-4">
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
          aria-label="Interactive solar system showing the Sun and eight planets"
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
          </defs>

          <rect
            x="0"
            y="0"
            width="500"
            height="500"
            rx="22"
            fill="url(#spaceverse-background)"
          />

          {Array.from({ length: 85 }, (_, index) => (
            <circle
              key={`star-${index}`}
              cx={(index * 73 + 19) % 490 + 5}
              cy={(index * 137 + 31) % 490 + 5}
              r={index % 8 === 0 ? 1.7 : 0.8}
              fill="#ffffff"
              opacity={index % 3 === 0 ? 0.85 : 0.4}
            />
          ))}

          <g transform={`translate(${center} ${center}) scale(${orbitScale})`}>
            {planets.map((planet, index) => {
              const id = getPlanetId(planet);
              const orbitRadius = baseOrbit + (index + 1) * orbitGap;
              const orbitAngle =
                time / Math.sqrt(index + 1) + index * 0.72;
              const x = Math.cos(orbitAngle) * orbitRadius;
              const y = Math.sin(orbitAngle) * orbitRadius;
              const planetSize = PLANET_SIZES[id];
              const color = PLANET_COLORS[id] || ORBIT_COLORS[index];
              const isSelected =
                selectedPlanet === planet.id ||
                selectedPlanet === id ||
                selectedPlanet === getPlanetName(planet);

              return (
                <g key={id}>
                  <circle
                    cx="0"
                    cy="0"
                    r={orbitRadius}
                    fill="none"
                    stroke={ORBIT_COLORS[index]}
                    strokeWidth="0.7"
                    strokeDasharray="3 5"
                    opacity="0.5"
                  />

                  <g
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${getPlanetName(planet)}`}
                    onClick={() => onSelect?.(planet)}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Enter' ||
                        event.key === ' '
                      ) {
                        event.preventDefault();
                        onSelect?.(planet);
                      }
                    }}
                  >
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r={planetSize + 5}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        opacity="0.9"
                      />
                    )}

                    <circle
                      cx={x}
                      cy={y}
                      r={planetSize + 3}
                      fill={color}
                      opacity="0.14"
                    />

                    {id === 'saturn' && (
                      <ellipse
                        cx={x}
                        cy={y}
                        rx={planetSize + 7}
                        ry={planetSize + 2}
                        fill="none"
                        stroke="#fef3c7"
                        strokeWidth="2.5"
                        transform={`rotate(-20 ${x} ${y})`}
                      />
                    )}

                    <circle
                      cx={x}
                      cy={y}
                      r={planetSize}
                      fill={color}
                      stroke="#ffffff"
                      strokeOpacity="0.45"
                      strokeWidth="0.8"
                    />

                    {id === 'earth' && (
                      <circle
                        cx={x - 2}
                        cy={y - 1}
                        r={planetSize * 0.38}
                        fill="#22c55e"
                      />
                    )}

                    {id === 'uranus' && (
                      <ellipse
                        cx={x}
                        cy={y}
                        rx={planetSize + 3}
                        ry={planetSize * 0.45}
                        fill="none"
                        stroke="#a5f3fc"
                        strokeWidth="1.2"
                        transform={`rotate(75 ${x} ${y})`}
                      />
                    )}

                    {showLabels && !compact && (
                      <text
                        x={x}
                        y={y - planetSize - 7}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill="#ffffff"
                        stroke="#020617"
                        strokeWidth="2.5"
                        paintOrder="stroke"
                      >
                        {getPlanetName(planet)}
                      </text>
                    )}
                  </g>
                </g>
              );
            })}

            <circle
              cx="0"
              cy="0"
              r="22"
              fill="#f97316"
              opacity="0.18"
              filter="url(#spaceverse-glow)"
            />

            <circle
              cx="0"
              cy="0"
              r="15"
              fill="url(#spaceverse-sun)"
              filter="url(#spaceverse-glow)"
            />

            <text
              x="0"
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
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500"
                onClick={() => setPlaying((value) => !value)}
              >
                {playing ? 'Pause' : 'Play'}
              </button>

              <button
                type="button"
                className="rounded-full border border-slate-600 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                onClick={() => setZoom((value) => Math.max(0.65, value - 0.15))}
              >
                Zoom −
              </button>

              <span className="min-w-12 text-center text-sm font-semibold text-white">
                {zoom.toFixed(2)}×
              </span>

              <button
                type="button"
                className="rounded-full border border-slate-600 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                onClick={() => setZoom((value) => Math.min(1.4, value + 0.15))}
              >
                Zoom +
              </button>

              <button
                type="button"
                aria-pressed={showLabels}
                className="rounded-full border border-cyan-400/60 px-3 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-900/40"
                onClick={() => setShowLabels((value) => !value)}
              >
                {showLabels ? 'Hide Labels' : 'Show Labels'}
              </button>

              <button
                type="button"
                className="rounded-full border border-slate-600 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
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
              Tap a planet to select it. Uranus and Neptune labels are
              available using the Show/Hide Labels control.
              Planet positions and speeds are simplified for learning.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
