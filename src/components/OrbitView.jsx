import { useEffect, useMemo, useRef, useState } from 'react';
import { PLANETS } from '../data/planets';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const C = 300;
const R0 = 52;
const STEP = 29;

export default function OrbitView({
  selectedId,
  onSelect,
  compact = false,
}) {
  const [playing, setPlaying] = useState(() => !prefersReduced());
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [t, setT] = useState(0);

  const raf = useRef(0);
  const lastFrame = useRef(0);
  const lastPaint = useRef(0);

  useEffect(() => {
    if (!playing) return undefined;

    lastFrame.current = 0;
    lastPaint.current = 0;

    const tick = (now) => {
      if (!lastFrame.current) {
        lastFrame.current = now;
        lastPaint.current = now;
      }

      if (now - lastPaint.current > 33) {
        setT((v) => v + ((now - lastFrame.current) / 1000) * speed);
        lastFrame.current = now;
        lastPaint.current = now;
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf.current);
  }, [playing, speed]);

  const bodies = useMemo(
    () =>
      PLANETS.map((p, i) => ({
        ...p,
        r: R0 + i * STEP,
        phase: i * 1.7,
      })),
    []
  );

  const pos = (b) => {
    const a = b.phase + (t * 0.9) / Math.sqrt(b.yearDays / 88);

    return [
      C + b.r * Math.cos(a),
      C + b.r * Math.sin(a),
    ];
  };

  const sel = bodies.find((b) => b.id === selectedId);
  const [cx, cy] = zoom > 1 && sel ? pos(sel) : [C, C];
  const size = 600 / zoom;
  const vb = `${cx - size / 2} ${cy - size / 2} ${size} ${size}`;

  const key = (fn) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div>
      <svg
        viewBox={vb}
        className="mx-auto aspect-square w-full max-w-[640px] touch-manipulation"
        role="group"
        aria-label="Solar System orbit diagram, not to scale. Tab through the planets or use the planet buttons."
      > <defs>
  {bodies.map((b) => (
    <radialGradient
      key={`${b.id}-surface`}
      id={`planet-${b.id}`}
      cx="30%"
      cy="25%"
      r="75%"
    >
      <stop offset="0%" stopColor="#ffffff" stopOpacity=".95" />
      <stop offset="18%" stopColor={b.color} />
      <stop offset="72%" stopColor={b.color} />
      <stop offset="100%" stopColor="#020617" stopOpacity=".95" />
    </radialGradient>
  ))}
  <radialGradient id="sun-glow">
    <stop offset="0%" stopColor="#fff7c2" />
    <stop offset="55%" stopColor="#fbbf24" />
    <stop offset="100%" stopColor="#ea580c" />
  </radialGradient>
</defs>
        {bodies.map((b) => (
          <circle
            key={`${b.id}-orbit`}
            cx={C}
            cy={C}
            r={b.r}
            fill="none"
            stroke="#8aa0ff"
            strokeOpacity={b.dwarf ? 0.35 : 0.22}
            strokeDasharray={b.dwarf ? '4 5' : undefined}
            strokeWidth={b.id === selectedId ? 2 : 1}
          />
        ))}

        <g
          onClick={() => onSelect?.('sun')}
          onKeyDown={key(() => onSelect?.('sun'))}
          tabIndex={0}
          role="button"
          aria-label="Sun, star"
          style={{ cursor: 'pointer' }}
        >
          <circle
            cx={C}
            cy={C}
            r={30}
            fill="#fbbf24"
            opacity=".25"
          />
          <circle cx={C} cy={C} r={22} fill="#fbbf24" />
        </g>

        {bodies.map((b) => {
          const [x, y] = pos(b);
          const active = b.id === selectedId;

          return (
            <g
              key={b.id}
              tabIndex={0}
              role="button"
              aria-label={`${b.name}, ${b.type}`}
              aria-pressed={active}
              onClick={() => onSelect?.(b.id)}
              onKeyDown={key(() => onSelect?.(b.id))}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={x}
                cy={y}
                r={Math.max(15, b.size + 8) / (zoom > 1 ? zoom * 0.7 : 1)}
                fill="transparent"
              />

              {b.rings && (
                <ellipse
                  cx={x}
                  cy={y}
                  rx={b.size * 1.9}
                  ry={b.size * 0.55}
                  fill="none"
                  stroke="#e3c98b"
                  strokeWidth="2"
                  transform={`rotate(-20 ${x} ${y})`}
                />
              )}

              <circle
                cx={x}
                cy={y}
                r={b.size}
                fill={b.color}
                stroke={active ? '#fbbf24' : 'none'}
                strokeWidth="2.5"
              />

              {!compact && (active || zoom > 1.5 || b.r < 200) && (
                <text
                  x={x}
                  y={y - b.size - 5}
                  textAnchor="middle"
                  fontSize={11 / (zoom > 1 ? Math.sqrt(zoom) : 1)}
                  fill="#fff"
                  stroke="#070a22"
                  strokeWidth="3"
                  paintOrder="stroke"
                >
                  {b.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {!compact && (
        <>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              className="btn-primary"
              onClick={() => setPlaying((p) => !p)}
              aria-pressed={playing}
            >
              {playing ? '⏸ Pause' : '▶ Play'}
            </button>

            <button
              className="btn-ghost"
              onClick={() =>
                setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))
              }
              aria-label="Zoom out"
            >
              －
            </button>

            <span
              className="min-w-[3.5rem] text-center text-sm"
              aria-live="polite"
            >
              {zoom.toFixed(1)}×
            </span>

            <button
              className="btn-ghost"
              onClick={() =>
                setZoom((z) => Math.min(4, +(z + 0.5).toFixed(1)))
              }
              aria-label="Zoom in"
            >
              ＋
            </button>

            <button
              className="btn-ghost"
              onClick={() => {
                setZoom(1);
                setSpeed(1);
                setT(0);
                onSelect?.(null);
              }}
            >
              Reset
            </button>
          </div>

          <label className="mx-auto mt-3 flex max-w-sm items-center gap-3 text-sm">
            Speed
            <input
              type="range"
              min="0.25"
              max="4"
              step="0.25"
              value={speed}
              onChange={(e) => setSpeed(+e.target.value)}
              className="w-full accent-violet-500"
              aria-valuetext={`${speed} times`}
            />
            <span className="w-10">{speed}×</span>
          </label>

          <p className="mt-2 text-center text-xs text-cyan-300">
            Not to scale: real orbits are far more spread out, planet
            sizes are exaggerated, and orbit speeds are sped up and
            compressed. Zoom centres on the selected planet.
          </p>
        </>
      )}
    </div>
  );
    }
      
