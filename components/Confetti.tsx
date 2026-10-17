"use client";

import { useMemo } from "react";

interface ConfettiProps {
  /** When true, the confetti burst is rendered. */
  active: boolean;
  /** Number of pieces. */
  count?: number;
}

const COLORS = ["#ff8fb8", "#c9b6ff", "#8fe3c4", "#ffd166", "#ffb3d1", "#a98cff"];

/**
 * A lightweight confetti / sparkle burst using CSS animations.
 * Pieces are generated once and animated falling down the viewport.
 */
export default function Confetti({ active, count = 60 }: ConfettiProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.4 + Math.random() * 1.8,
        size: 6 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        rounded: Math.random() > 0.5,
        drift: (Math.random() - 0.5) * 120,
      })),
    [count]
  );

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * (p.rounded ? 1 : 1.6)}px`,
            background: p.color,
            borderRadius: p.rounded ? "9999px" : "2px",
            animation: `confettiFall ${p.duration}s linear ${p.delay}s forwards`,
            // custom drift via translate on the X axis through CSS var
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translate3d(0, -10vh, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--drift), 110vh, 0) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
