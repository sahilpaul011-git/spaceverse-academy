
 // Simple original illustration. Always labelled as an illustration, never a photo.
export default function PlanetArt({ body, className = 'h-40 w-40' }) {
  const id = `pa-${body.id}`;

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={`Cartoon illustration of ${body.name}`}
    >
      <defs>
        <radialGradient id={id} cx="35%" cy="30%">
          <stop offset="0" stopColor="#fff" stopOpacity=".6" />
          <stop offset=".4" stopColor={body.color} />
          <stop offset="1" stopColor="#000" stopOpacity=".5" />
        </radialGradient>
      </defs>

      {body.rings && (
        <ellipse
          cx="60"
          cy="60"
          rx="55"
          ry="14"
          fill="none"
          stroke="#e3c98b"
          strokeWidth="5"
          transform="rotate(-18 60 60)"
          opacity=".8"
        />
      )}

      <circle
        cx="60"
        cy="60"
        r={body.id === 'sun' ? 40 : 34}
        fill={`url(#${id})`}
      />
    </svg>
  );
}
