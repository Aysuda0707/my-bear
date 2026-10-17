"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

/** Exact song details required by the brief. */
export const SONG = {
  title: "İYİ Kİ DOĞDUN",
  artist: "EFLUNE",
  appleMusicUrl:
    "https://music.apple.com/de/album/i-yi-ki-do%C4%9Fdun/6797857158?i=6797857159",
  /** Apple Music embed (iframe) for the same track. */
  embedUrl:
    "https://embed.music.apple.com/de/album/i-yi-ki-do%C4%9Fdun/6797857158?i=6797857159",
  /** iTunes track id used to look up the official 30s preview. */
  itunesTrackId: "6797857159",
} as const;

export interface MusicPlayerHandle {
  /**
   * Attempt to start playback. MUST be called synchronously from within a user
   * gesture (e.g. the gift click) so the browser allows it.
   */
  play: () => void;
}

interface MusicPlayerProps {
  /** Whether the visitor has interacted with the gift (reveals the controls). */
  enabled: boolean;
}

type PreviewState = "idle" | "loading" | "ready" | "unavailable";

/**
 * Music controls for the birthday song.
 *
 * Two complementary, fully legitimate playback paths are offered:
 *  1. The official **iTunes / Apple Music 30-second preview** (an audio stream
 *     served by Apple's public iTunes Search API) with a native play/pause
 *     control. This is the primary in-page player.
 *  2. The **official Apple Music web player** embed for the full track.
 *
 * Autoplay strategy: the `<audio>` element is mounted immediately (before the
 * gift is opened) and the preview URL is fetched eagerly. When the visitor
 * clicks the gift, `play()` is invoked synchronously inside that gesture, which
 * is what browsers require to permit audible playback.
 *
 * We never download, extract or rehost the copyrighted track, and we never
 * claim the music is playing when it is not. A visible fallback link always
 * opens the exact song in Apple Music.
 */
const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(
  function MusicPlayer({ enabled }, ref) {
    const [previewState, setPreviewState] = useState<PreviewState>("idle");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showEmbed, setShowEmbed] = useState(false);
    const [embedLoaded, setEmbedLoaded] = useState(false);
    const [autoplayBlocked, setAutoplayBlocked] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const pendingPlay = useRef(false);

    // Reveal the visible controls once the visitor has interacted with the gift.
    useEffect(() => {
      if (enabled) setShowEmbed(true);
    }, [enabled]);

    // Eagerly look up the official iTunes preview URL (before any interaction),
    // so the audio is ready the instant the gift is clicked.
    useEffect(() => {
      if (previewUrl || previewState === "loading") return;

      let cancelled = false;
      setPreviewState("loading");

      const lookupUrl = `https://itunes.apple.com/lookup?id=${SONG.itunesTrackId}&entity=song`;

      fetch(lookupUrl)
        .then((res) => res.json())
        .then((data: { results?: Array<{ previewUrl?: string }> }) => {
          if (cancelled) return;
          const url = data?.results?.[0]?.previewUrl;
          if (url) {
            setPreviewUrl(url);
            setPreviewState("ready");
          } else {
            setPreviewState("unavailable");
          }
        })
        .catch(() => {
          if (!cancelled) setPreviewState("unavailable");
        });

      return () => {
        cancelled = true;
      };
    }, [previewUrl, previewState]);

    const startPlayback = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setAutoplayBlocked(true);
        });
    }, []);

    // Imperative handle: called synchronously from the gift click gesture.
    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          const audio = audioRef.current;
          if (!audio) return;
          // If the source is already loaded, play right now (within the gesture).
          if (audio.readyState >= 2 || audio.currentSrc) {
            startPlayback();
          } else {
            // Otherwise remember the intent and play as soon as it can.
            pendingPlay.current = true;
          }
        },
      }),
      [startPlayback]
    );

    // If a play was requested before the source was ready, fire it as soon as
    // the audio can play through.
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      const onCanPlay = () => {
        if (pendingPlay.current) {
          pendingPlay.current = false;
          startPlayback();
        }
      };
      audio.addEventListener("canplay", onCanPlay);
      return () => audio.removeEventListener("canplay", onCanPlay);
    }, [startPlayback]);

    const togglePreview = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) {
        startPlayback();
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }, [startPlayback]);

    return (
      <section
        aria-label="Birthday song player"
        className="pointer-events-auto w-full max-w-md rounded-3xl border border-white/70 bg-white/70 p-4 shadow-[0_12px_30px_rgba(201,182,255,0.25)] backdrop-blur-md"
      >
        {/* The audio element is always mounted so it is ready for the gesture. */}
        {previewUrl && (
          <audio
            ref={audioRef}
            src={previewUrl}
            preload="auto"
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
        )}

        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-petal to-lilac text-lg shadow-inner"
          >
            🎵
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-cocoaDark">
              {SONG.title}
            </p>
            <p className="truncate text-xs text-cocoa/80">{SONG.artist}</p>
          </div>
          <a
            href={SONG.appleMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-gradient-to-br from-rose to-lilac px-3 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
            aria-label={`Open ${SONG.title} by ${SONG.artist} in Apple Music`}
          >
            Open in Apple Music
          </a>
        </div>

        {enabled && (
          <div className="mt-3">
            {/* Primary: official iTunes 30s preview with native play/pause */}
            {previewState === "ready" && previewUrl && (
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-2">
                <button
                  type="button"
                  onClick={togglePreview}
                  aria-label={
                    isPlaying
                      ? `Pause ${SONG.title} preview`
                      : `Play ${SONG.title} preview`
                  }
                  aria-pressed={isPlaying}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose to-lilac text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                      <rect x="6" y="5" width="4" height="14" rx="1.4" fill="currentColor" />
                      <rect x="14" y="5" width="4" height="14" rx="1.4" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                    </svg>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-cocoaDark">
                    Official 30s preview
                  </p>
                  <p className="text-[11px] text-cocoa/70">
                    {isPlaying
                      ? "Now playing… 🎶"
                      : autoplayBlocked
                        ? "Tap play to start the music"
                        : "Starting…"}
                  </p>
                </div>
              </div>
            )}

            {previewState === "loading" && (
              <div className="flex h-[52px] items-center justify-center rounded-2xl bg-white/60 text-xs text-cocoa/70">
                Loading preview…
              </div>
            )}

            {previewState === "unavailable" && (
              <p className="rounded-2xl bg-white/60 p-3 text-center text-[11px] text-cocoa/70">
                The 30s preview is unavailable right now — use the Apple Music
                player below or the button above.
              </p>
            )}

            {/* Secondary: official Apple Music web player embed */}
            {showEmbed && (
              <div className="mt-3">
                <div className="apple-music-embed relative overflow-hidden rounded-2xl">
                  {!embedLoaded && (
                    <div className="flex h-[175px] items-center justify-center rounded-2xl bg-white/60 text-xs text-cocoa/70">
                      Loading Apple Music player…
                    </div>
                  )}
                  <iframe
                    title={`${SONG.title} — ${SONG.artist} on Apple Music`}
                    src={SONG.embedUrl}
                    height="175"
                    allow="autoplay *; encrypted-media *; clipboard-write"
                    sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                    loading="lazy"
                    onLoad={() => setEmbedLoaded(true)}
                    className={embedLoaded ? "block" : "absolute inset-0 opacity-0"}
                  />
                </div>
                <p className="mt-2 text-center text-[11px] leading-snug text-cocoa/70">
                  Full song playback is handled by the official Apple Music
                  player. If it does not start automatically, use the play button
                  above or open the song in Apple Music.
                </p>
              </div>
            )}
          </div>
        )}

        {!enabled && (
          <p className="mt-3 text-center text-[11px] text-cocoa/70">
            Open the gift to reveal the birthday song 🎁
          </p>
        )}
      </section>
    );
  }
);

export default MusicPlayer;
