"use client";

interface CakeProps {
  /** Number of candles to render. */
  candles?: number;
  className?: string;
}

/**
 * A cute pastel birthday cake with lit, flickering candles (inline SVG).
 */
export default function Cake({ candles = 5, className = "" }: CakeProps) {
  const candlePositions = Array.from({ length: candles }, (_, i) => {
    const spacing = 120 / (candles + 1);
    return 100 - 60 + spacing * (i + 1);
  });

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label="A birthday cake with lit candles"
        className="h-full w-full overflow-visible drop-shadow-[0_16px_24px_rgba(255,143,184,0.3)]"
      >
        <defs>
          <linearGradient id="cakeBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe9f3" />
            <stop offset="100%" stopColor="#ffc2da" />
          </linearGradient>
          <linearGradient id="cakeTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff6fb" />
            <stop offset="100%" stopColor="#ffd9e8" />
          </linearGradient>
          <linearGradient id="frosting" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e3d7ff" />
            <stop offset="100%" stopColor="#c9b6ff" />
          </linearGradient>
          <radialGradient id="flameGrad" cx="50%" cy="70%" r="60%">
            <stop offset="0%" stopColor="#fff3b0" />
            <stop offset="55%" stopColor="#ffb347" />
            <stop offset="100%" stopColor="#ff7a59" />
          </radialGradient>
        </defs>

        {/* Plate */}
        <ellipse cx="100" cy="176" rx="82" ry="12" fill="#f2e6ff" />

        {/* Bottom tier */}
        <rect x="34" y="120" width="132" height="52" rx="12" fill="url(#cakeBase)" />
        {/* Top tier */}
        <rect x="52" y="86" width="96" height="42" rx="10" fill="url(#cakeTop)" />

        {/* Frosting drips */}
        <path
          d="M34 128 q10 16 20 0 q10 16 20 0 q10 16 20 0 q10 16 20 0 q10 16 20 0 q10 16 20 0 q10 16 12 0 l0 -10 l-132 0 z"
          fill="url(#frosting)"
          opacity="0.95"
        />
        <path
          d="M52 92 q8 14 16 0 q8 14 16 0 q8 14 16 0 q8 14 16 0 q8 14 16 0 q8 14 16 0 l0 -8 l-96 0 z"
          fill="url(#frosting)"
          opacity="0.95"
        />

        {/* Sprinkles */}
        <g opacity="0.9">
          <circle cx="60" cy="150" r="3" fill="#ff8fb8" />
          <circle cx="86" cy="158" r="3" fill="#c9b6ff" />
          <circle cx="112" cy="148" r="3" fill="#8fe3c4" />
          <circle cx="138" cy="158" r="3" fill="#ffd166" />
          <circle cx="72" cy="108" r="2.6" fill="#ff8fb8" />
          <circle cx="100" cy="112" r="2.6" fill="#8fe3c4" />
          <circle cx="128" cy="108" r="2.6" fill="#c9b6ff" />
        </g>

        {/* Candles */}
        {candlePositions.map((x, i) => (
          <g key={i}>
            <rect
              x={x - 3}
              y={62}
              width="6"
              height="26"
              rx="3"
              fill={i % 2 === 0 ? "#ffb3d1" : "#c9b6ff"}
            />
            <rect
              x={x - 3}
              y={62}
              width="6"
              height="26"
              rx="3"
              fill="#ffffff"
              opacity="0.25"
            />
            {/* Flame */}
            <g
              className="animate-flicker"
              style={{
                transformBox: "fill-box",
                transformOrigin: "50% 100%",
                animationDelay: `${i * 0.12}s`,
              }}
            >
              <ellipse cx={x} cy={54} rx="4.6" ry="8" fill="url(#flameGrad)" />
              <ellipse cx={x} cy={56} rx="2.2" ry="4" fill="#fff8d6" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
