"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TeddyBear from "./TeddyBear";
import GiftBox from "./GiftBox";
import Cake from "./Cake";
import Confetti from "./Confetti";
import MusicPlayer, { type MusicPlayerHandle } from "./MusicPlayer";

type Scene = "gift" | "opening" | "birthday";

const GIFT_PROMPT = "Görəsən, içində nə var? 🎁✨";
const BIRTHDAY_MESSAGE =
  "Doğum günün mübarək! Yeni yaşın sənə bol-bol sevinc, gülüş və gözəl xatirələr gətirsin! 🎀";

/**
 * Orchestrates the three scenes:
 *  1. gift      — bear presents a clickable gift box
 *  2. opening   — box opens with confetti, then transitions
 *  3. birthday  — cake + message + music
 */
export default function BirthdayExperience() {
  const [scene, setScene] = useState<Scene>("gift");
  const [boxOpen, setBoxOpen] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const musicRef = useRef<MusicPlayerHandle>(null);

  // Clear any pending timers on unmount.
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const handleOpenGift = useCallback(() => {
    // Guard against repeated clicks interrupting the animation.
    setScene((current) => {
      if (current !== "gift") return current;

      setBoxOpen(true);
      setConfetti(true);
      setMusicEnabled(true);

      // Start the music synchronously inside this click gesture — browsers only
      // permit audible autoplay when play() is called from a user gesture. The
      // <audio> element is already mounted (see the always-rendered MusicPlayer
      // below), so this call happens within the gesture window.
      musicRef.current?.play();

      timers.current.push(
        setTimeout(() => setScene("opening"), 250),
        setTimeout(() => setConfetti(false), 2600),
        setTimeout(() => {
          setScene("birthday");
          setShowMessage(true);
        }, 1500)
      );

      return "opening";
    });
  }, []);

  const isBirthday = scene === "birthday";

  return (
    <div className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-4 py-8">
      {/* Decorative background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="blob left-[-6%] top-[8%] h-56 w-56 bg-petal/70" />
        <span className="blob right-[-8%] top-[18%] h-64 w-64 bg-lilac/60" />
        <span className="blob bottom-[-10%] left-[30%] h-72 w-72 bg-mint/60" />
      </div>

      {/* Floating sparkles */}
      <Sparkles />

      <Confetti active={confetti} />

      {/*
        The music player is mounted for the whole experience (not just the
        birthday scene) so its <audio> element exists before the gift is
        clicked. That lets us call play() synchronously inside the click
        gesture, which is what browsers require for audible autoplay.
        It is visually hidden until the birthday scene reveals it.
      */}
      <div
        className={
          isBirthday
            ? "relative z-10 flex w-full justify-center"
            : "pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
        }
        aria-hidden={!isBirthday}
      >
        <MusicPlayer ref={musicRef} enabled={musicEnabled} />
      </div>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6">
        {/* ---------- Scene: Gift ---------- */}
        {!isBirthday && (
          <div className="flex w-full flex-col items-center gap-5">
            <div className="relative flex w-full items-end justify-center">
              {/* Bear */}
              <div className="relative z-10 h-56 w-56 shrink-0 sm:h-72 sm:w-72">
                <TeddyBear
                  mood={boxOpen ? "happy" : "presenting"}
                  waving={!boxOpen}
                  className="h-full w-full"
                />
              </div>

              {/* Gift box held in front of the bear */}
              <div className="-ml-16 mb-2 h-32 w-32 shrink-0 sm:-ml-20 sm:h-40 sm:w-40">
                <GiftBox
                  open={boxOpen}
                  onOpen={handleOpenGift}
                  disabled={boxOpen}
                  className="h-full w-full"
                />
              </div>
            </div>

            <p
              className="animate-fadeUp text-center text-xl font-extrabold text-cocoaDark drop-shadow-sm sm:text-2xl"
              lang="az"
            >
              {GIFT_PROMPT}
            </p>

            {!boxOpen && (
              <p className="animate-pulse text-center text-sm font-semibold text-rose">
                Tap the gift box to open it ✨
              </p>
            )}
          </div>
        )}

        {/* ---------- Scene: Birthday ---------- */}
        {isBirthday && (
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:items-end sm:gap-8">
              {/* Bear dancing happily */}
              <div className="h-44 w-44 shrink-0 sm:h-56 sm:w-56">
                <TeddyBear mood="dancing" waving={false} className="h-full w-full" />
              </div>

              {/* Cake */}
              <div className="animate-popIn h-48 w-48 shrink-0 sm:h-60 sm:w-60">
                <Cake candles={5} className="h-full w-full" />
              </div>
            </div>

            {/* Birthday message */}
            <p
              lang="az"
              className={`max-w-2xl text-center text-lg font-extrabold leading-relaxed text-cocoaDark drop-shadow-sm transition-opacity duration-1000 sm:text-2xl ${
                showMessage ? "animate-fadeUp opacity-100" : "opacity-0"
              }`}
            >
              {BIRTHDAY_MESSAGE}
            </p>

            {/* Music controls are rendered once, above, and revealed here. */}
          </div>
        )}
      </div>
    </div>
  );
}

/** A few tasteful twinkling sparkles scattered around the scene. */
function Sparkles() {
  const sparkles = [
    { top: "12%", left: "12%", size: 18, delay: "0s" },
    { top: "22%", left: "82%", size: 14, delay: "0.6s" },
    { top: "68%", left: "8%", size: 12, delay: "1.1s" },
    { top: "78%", left: "88%", size: 16, delay: "0.3s" },
    { top: "8%", left: "52%", size: 12, delay: "1.5s" },
    { top: "58%", left: "92%", size: 10, delay: "0.9s" },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {sparkles.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        >
          <path
            d="M12 0 l2.6 8.4 L23 12 l-8.4 3.6 L12 24 l-2.6 -8.4 L1 12 l8.4 -3.6 z"
            fill="#fff2b8"
          />
        </svg>
      ))}
    </div>
  );
}
