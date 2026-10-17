import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: "#ffd6e8",
        petal: "#ffb3d1",
        rose: "#ff8fb8",
        lavender: "#e3d7ff",
        lilac: "#c9b6ff",
        cream: "#fff7ec",
        mint: "#cdf5e4",
        cocoa: "#8a5a44",
        cocoaDark: "#6b4232",
      },
      fontFamily: {
        rounded: [
          "ui-rounded",
          "Nunito",
          "Quicksand",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1) translateY(0)" },
          "50%": { transform: "scale(1.015) translateY(-4px)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-1.4deg)" },
          "50%": { transform: "rotate(1.4deg)" },
        },
        wave: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-22deg)" },
          "50%": { transform: "rotate(6deg)" },
          "75%": { transform: "rotate(-16deg)" },
        },
        blink: {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.08)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.15", transform: "scale(0.7)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        flicker: {
          "0%, 100%": { transform: "scaleY(1) scaleX(1)", opacity: "1" },
          "50%": { transform: "scaleY(1.12) scaleX(0.94)", opacity: "0.85" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.6) translateY(20px)" },
          "60%": { opacity: "1", transform: "scale(1.06) translateY(0)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        lidOpen: {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "100%": { transform: "translateY(-90px) rotate(-24deg)" },
        },
        confettiFall: {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(720deg)", opacity: "0" },
        },
        dance: {
          "0%, 100%": { transform: "translateY(0) rotate(-4deg)" },
          "25%": { transform: "translateY(-14px) rotate(4deg)" },
          "50%": { transform: "translateY(0) rotate(-4deg)" },
          "75%": { transform: "translateY(-14px) rotate(4deg)" },
        },
        danceArmL: {
          "0%, 100%": { transform: "rotate(-18deg)" },
          "50%": { transform: "rotate(38deg)" },
        },
        danceArmR: {
          "0%, 100%": { transform: "rotate(18deg)" },
          "50%": { transform: "rotate(-38deg)" },
        },
        danceHead: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(6deg)" },
        },
        danceHip: {
          "0%, 100%": { transform: "translateX(-6px) rotate(-2deg)" },
          "50%": { transform: "translateX(6px) rotate(2deg)" },
        },
      },
      animation: {
        breathe: "breathe 4.2s ease-in-out infinite",
        sway: "sway 5.5s ease-in-out infinite",
        wave: "wave 1.6s ease-in-out infinite",
        blink: "blink 5.2s ease-in-out infinite",
        floaty: "floaty 3.6s ease-in-out infinite",
        twinkle: "twinkle 2.8s ease-in-out infinite",
        flicker: "flicker 0.5s ease-in-out infinite",
        popIn: "popIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        fadeUp: "fadeUp 1s ease-out both",
        lidOpen: "lidOpen 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        dance: "dance 0.9s ease-in-out infinite",
        danceArmL: "danceArmL 0.9s ease-in-out infinite",
        danceArmR: "danceArmR 0.9s ease-in-out infinite",
        danceHead: "danceHead 0.9s ease-in-out infinite",
        danceHip: "danceHip 0.9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
