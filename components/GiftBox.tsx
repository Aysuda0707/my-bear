"use client";

interface GiftBoxProps {
  /** Whether the lid has been opened. */
  open: boolean;
  /** Click handler (only active when closed). */
  onOpen?: () => void;
  /** Disable interaction (e.g. during animation). */
  disabled?: boolean;
  className?: string;
}

/**
 * A cute, clickable birthday gift box drawn as inline SVG.
 * The lid lifts and rotates away when `open` becomes true.
 */
export default function GiftBox({
  open,
  onOpen,
  disabled = false,
  className = "",
}: GiftBoxProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={disabled || open}
      aria-label={open ? "Gift box opened" : "Open the birthday gift box"}
      className={`group relative block cursor-pointer border-0 bg-transparent p-0 transition-transform duration-300 focus-visible:outline-none ${
        open ? "cursor-default" : "hover:scale-105 active:scale-95"
      } ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full overflow-visible drop-shadow-[0_14px_20px_rgba(201,182,255,0.45)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd0e4" />
            <stop offset="100%" stopColor="#ff9ec4" />
          </linearGradient>
          <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe3f0" />
            <stop offset="100%" stopColor="#ffb3d1" />
          </linearGradient>
          <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c9b6ff" />
            <stop offset="100%" stopColor="#a98cff" />
          </linearGradient>
        </defs>

        {/* Box body */}
        <rect x="42" y="92" width="116" height="86" rx="12" fill="url(#boxGrad)" />
        {/* Vertical ribbon */}
        <rect x="90" y="92" width="20" height="86" fill="url(#ribbonGrad)" />
        {/* Horizontal ribbon */}
        <rect x="42" y="126" width="116" height="16" fill="url(#ribbonGrad)" opacity="0.9" />

        {/* Lid (animates open) */}
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "50% 100%",
            transform: open
              ? "translateY(-96px) rotate(-26deg)"
              : "translateY(0) rotate(0deg)",
            transition: "transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <rect x="34" y="74" width="132" height="30" rx="10" fill="url(#lidGrad)" />
          <rect x="90" y="74" width="20" height="30" fill="url(#ribbonGrad)" />
          {/* Bow loops */}
          <path
            d="M100 74 q-30 -26 -44 -6 q-10 16 16 18 q-22 6 -12 22 q10 16 40 -12 z"
            fill="url(#ribbonGrad)"
          />
          <path
            d="M100 74 q30 -26 44 -6 q10 16 -16 18 q22 6 12 22 q-10 16 -40 -12 z"
            fill="url(#ribbonGrad)"
          />
          <circle cx="100" cy="76" r="9" fill="#d9ccff" />
        </g>

        {/* Sparkle hint (only when closed) */}
        {!open && (
          <g className="animate-twinkle" style={{ transformBox: "fill-box" }}>
            <path
              d="M168 60 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z"
              fill="#fff6c9"
            />
            <path
              d="M28 52 l2.4 6 6 2.4 -6 2.4 -2.4 6 -2.4 -6 -6 -2.4 6 -2.4 z"
              fill="#fff6c9"
            />
          </g>
        )}
      </svg>

      {/* Pulsing "tap me" ring when closed */}
      {!open && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[28px] ring-4 ring-petal/60 animate-pulse"
        />
      )}
    </button>
  );
}
