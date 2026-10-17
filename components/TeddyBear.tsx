"use client";

import { useEffect, useRef, useState } from "react";

type Mood = "idle" | "presenting" | "happy" | "dancing";

interface TeddyBearProps {
  /** Visual mood of the bear. */
  mood?: Mood;
  /** Whether the waving arm should animate. */
  waving?: boolean;
  /** Extra class names for the wrapper. */
  className?: string;
}

/**
 * A fully animated, fluffy girl teddy bear drawn as inline SVG.
 *
 * Animation technique: pure CSS keyframe animations applied to SVG groups
 * (transform-box: fill-box so transforms pivot around each part). React state
 * drives the mood (idle / presenting / happy) and the waving arm.
 */
export default function TeddyBear({
  mood = "idle",
  waving = true,
  className = "",
}: TeddyBearProps) {
  const [blinking, setBlinking] = useState(false);
  const blinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Natural, slightly irregular blinking.
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let cancelled = false;

    const scheduleBlink = () => {
      const delay = 2600 + Math.random() * 3200;
      blinkTimer.current = setTimeout(() => {
        if (cancelled) return;
        setBlinking(true);
        setTimeout(() => {
          if (!cancelled) setBlinking(false);
          scheduleBlink();
        }, 150);
      }, delay);
    };

    scheduleBlink();
    return () => {
      cancelled = true;
      if (blinkTimer.current) clearTimeout(blinkTimer.current);
    };
  }, []);

  const happy = mood === "happy" || mood === "dancing";
  const presenting = mood === "presenting";
  const dancing = mood === "dancing";

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 320 360"
        role="img"
        aria-label="A fluffy teddy bear"
        className="h-full w-full overflow-visible drop-shadow-[0_18px_28px_rgba(255,143,184,0.28)]"
      >
        <defs>
          <radialGradient id="furGrad" cx="42%" cy="32%" r="78%">
            <stop offset="0%" stopColor="#fff3f8" />
            <stop offset="55%" stopColor="#ffd9e8" />
            <stop offset="100%" stopColor="#f6bcd4" />
          </radialGradient>
          <radialGradient id="bellyGrad" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#fffaf2" />
            <stop offset="100%" stopColor="#ffe9d6" />
          </radialGradient>
          <radialGradient id="earGrad" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#ffe6f0" />
            <stop offset="100%" stopColor="#f3b6cf" />
          </radialGradient>
          <radialGradient id="muzzleGrad" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#fffdf8" />
            <stop offset="100%" stopColor="#ffeede" />
          </radialGradient>
          <linearGradient id="bowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff9ec4" />
            <stop offset="100%" stopColor="#e07aa8" />
          </linearGradient>
          <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Whole-body breathing + gentle sway (or dancing when happy) */}
        <g
          className={dancing ? "animate-dance" : "animate-breathe"}
          style={{ transformBox: "fill-box", transformOrigin: "50% 90%" }}
        >
          <g
            className={dancing ? "animate-danceHip" : "animate-sway"}
            style={{ transformBox: "fill-box", transformOrigin: "50% 92%" }}
          >
            {/* ---------- Legs ---------- */}
            <g>
              <ellipse cx="112" cy="322" rx="34" ry="26" fill="url(#furGrad)" />
              <ellipse cx="208" cy="322" rx="34" ry="26" fill="url(#furGrad)" />
              <ellipse cx="112" cy="326" rx="17" ry="13" fill="#ffe0ee" />
              <ellipse cx="208" cy="326" rx="17" ry="13" fill="#ffe0ee" />
            </g>

            {/* ---------- Left arm (waving / dancing) ---------- */}
            <g
              className={
                dancing ? "animate-danceArmL" : waving ? "animate-wave" : ""
              }
              style={{
                transformBox: "fill-box",
                transformOrigin: "78% 12%",
                animationDuration: dancing ? "0.9s" : "1.8s",
              }}
            >
              <ellipse
                cx="66"
                cy="212"
                rx="26"
                ry="40"
                fill="url(#furGrad)"
                transform="rotate(18 66 212)"
              />
              <ellipse cx="60" cy="240" rx="15" ry="15" fill="#ffe0ee" />
            </g>

            {/* ---------- Right arm (holds gift / dances) ---------- */}
            <g
              className={dancing ? "animate-danceArmR" : ""}
              style={{
                transformBox: "fill-box",
                transformOrigin: "20% 12%",
                transform: presenting
                  ? "rotate(-6deg) translateY(-4px)"
                  : "rotate(0deg)",
                transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              <ellipse
                cx="254"
                cy="214"
                rx="26"
                ry="40"
                fill="url(#furGrad)"
                transform="rotate(-18 254 214)"
              />
              <ellipse cx="260" cy="242" rx="15" ry="15" fill="#ffe0ee" />
            </g>

            {/* ---------- Body ---------- */}
            <ellipse cx="160" cy="252" rx="86" ry="78" fill="url(#furGrad)" />
            <ellipse cx="160" cy="262" rx="52" ry="52" fill="url(#bellyGrad)" />

            {/* ---------- Head group (nods / tilts / dances) ---------- */}
            <g
              className={dancing ? "animate-danceHead" : ""}
              style={{
                transformBox: "fill-box",
                transformOrigin: "50% 88%",
                transform: happy && !dancing
                  ? "rotate(-3deg) translateY(-3px)"
                  : "rotate(0deg)",
                transition: "transform 0.7s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              {/* Ears */}
              <g>
                <circle cx="92" cy="96" r="34" fill="url(#earGrad)" />
                <circle cx="92" cy="96" r="18" fill="#ffd0e2" />
                <circle cx="228" cy="96" r="34" fill="url(#earGrad)" />
                <circle cx="228" cy="96" r="18" fill="#ffd0e2" />
              </g>

              {/* Head */}
              <ellipse cx="160" cy="140" rx="88" ry="80" fill="url(#furGrad)" />

              {/* Cheeks */}
              <ellipse cx="106" cy="164" rx="20" ry="14" fill="#ffb9d4" opacity="0.6" />
              <ellipse cx="214" cy="164" rx="20" ry="14" fill="#ffb9d4" opacity="0.6" />

              {/* Muzzle */}
              <ellipse cx="160" cy="172" rx="46" ry="36" fill="url(#muzzleGrad)" />

              {/* Eyes */}
              <g
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "50% 50%",
                  transform: blinking ? "scaleY(0.08)" : "scaleY(1)",
                  transition: "transform 0.12s ease-in-out",
                }}
              >
                <ellipse cx="128" cy="140" rx="12" ry="15" fill="#4a2f3a" />
                <ellipse cx="192" cy="140" rx="12" ry="15" fill="#4a2f3a" />
                <circle cx="132" cy="134" r="4.4" fill="#ffffff" />
                <circle cx="196" cy="134" r="4.4" fill="#ffffff" />
                <circle cx="124" cy="146" r="2.2" fill="#ffffff" opacity="0.8" />
                <circle cx="188" cy="146" r="2.2" fill="#ffffff" opacity="0.8" />
              </g>

              {/* Eyebrows (happy) */}
              {happy && (
                <g stroke="#8a5a44" strokeWidth="3" strokeLinecap="round" opacity="0.7">
                  <path d="M116 116 q12 -8 24 -2" fill="none" />
                  <path d="M180 114 q12 -6 24 2" fill="none" />
                </g>
              )}

              {/* Nose */}
              <path
                d="M160 158 q-13 0 -13 9 q0 9 13 9 q13 0 13 -9 q0 -9 -13 -9 z"
                fill="#7a4a5c"
              />
              <ellipse cx="156" cy="163" rx="3.4" ry="2.4" fill="#ffffff" opacity="0.7" />

              {/* Mouth */}
              {happy ? (
                <path
                  d="M160 176 q-16 20 -30 6 M160 176 q16 20 30 6"
                  stroke="#7a4a5c"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                <path
                  d="M160 176 q-14 14 -26 3 M160 176 q14 14 26 3"
                  stroke="#7a4a5c"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
              )}

              {/* Bow on the ear */}
              <g
                filter="url(#softGlow)"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "50% 50%",
                  transform: happy ? "scale(1.08) rotate(-4deg)" : "scale(1)",
                  transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                <path
                  d="M228 66 q-26 -16 -34 4 q-6 16 12 18 q-18 4 -10 20 q8 16 32 -2 z"
                  fill="url(#bowGrad)"
                />
                <path
                  d="M228 66 q26 -16 34 4 q6 16 -12 18 q18 4 10 20 q-8 16 -32 -2 z"
                  fill="url(#bowGrad)"
                />
                <circle cx="228" cy="86" r="9" fill="#ffc2da" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
