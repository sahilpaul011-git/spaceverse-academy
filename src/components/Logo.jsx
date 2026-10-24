
export default function Logo({ className = 'h-9' }) {
  return (
    <span className="inline-flex items-center gap-2 font-display font-extrabold text-white">
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        <circle cx="20" cy="20" r="11" fill="url(#lg)" />

        <ellipse
          cx="20"
          cy="20"
          rx="19"
          ry="6.5"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2.5"
          transform="rotate(-20 20 20)"
        />

        <circle cx="34" cy="10" r="2.2" fill="#fbbf24" />
      </svg>

      <span className="leading-tight">
        SpaceVerse
        <span className="block text-xs font-bold tracking-widest text-cyan-300">
          ACADEMY
        </span>
      </span>
    </span>
  );
}
