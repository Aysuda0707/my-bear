# My Bear 🧸 | A Little Birthday Surprise

A cozy, animated birthday surprise web app. A fluffy girl teddy bear presents a
gift box, opens it with a sparkle burst, and reveals a birthday cake with a
sweet Azerbaijani message and the birthday song.

Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS**. No database,
auth, or backend required — it is a fully static, client-side experience.

---

## ✨ Features

- **Genuinely animated teddy bear** — drawn as inline SVG and animated with CSS
  keyframes: it blinks (with natural, irregular timing), breathes, sways, waves,
  tilts its head, and reacts happily.
- **Scene One — The Gift:** the bear presents a clickable gift box with the
  prompt `Görəsən, içində nə var? 🎁✨`.
- **Scene Two — Opening:** the lid lifts and rotates away, a confetti/sparkle
  burst fires, and the scene transitions smoothly. Repeated clicks are guarded
  so the animation can never break.
- **Scene Three — Birthday:** a pastel cake with flickering candles appears, the
  bear reacts happily, and the message
  `Doğum günün mübarək! Yeni yaşın sənə bol-bol sevinc, gülüş və gözəl xatirələr gətirsin! 🎀`
  fades in.
- **Music:** the official **iTunes 30-second preview** of
  **İYİ Kİ DOĞDUN — EFLUNE** plays in-page with a native play/pause control,
  alongside the embedded **Apple Music web player** for the full track. Both are
  revealed after the gift interaction, with a clear fallback button that opens
  the exact song in Apple Music.
- **Accessible & responsive:** works on mobile and desktop, respects
  `prefers-reduced-motion`, and includes ARIA labels on interactive controls.

---

## 🎬 Animation technique

The character is **not a static image**. It is a hand-authored **inline SVG**
whose parts (head, arms, body, eyes, bow) are grouped and animated with **CSS
keyframe animations** defined in [`tailwind.config.ts`](tailwind.config.ts:1)
(`breathe`, `sway`, `wave`, `blink`, `twinkle`, `flicker`, `popIn`, `fadeUp`).

- Each animated group uses `transform-box: fill-box` so transforms pivot around
  the correct part (e.g. the waving arm rotates at the shoulder).
- Blinking is driven by React state with randomized intervals for a natural
  feel, and is disabled under reduced-motion.
- Scene transitions are handled by a small React state machine
  (`gift → opening → birthday`) in
  [`components/BirthdayExperience.tsx`](components/BirthdayExperience.tsx:1),
  with timers that are cleaned up on unmount.

This keeps everything lightweight (no heavy animation libraries, no video, no
large image assets) and fully crisp at any screen size.

---

## 🎵 How the music works

Two complementary, fully legitimate playback paths are offered:

1. **iTunes 30-second preview (primary, in-page).** On interaction, the app
   queries Apple's public **iTunes Search API**
   (`https://itunes.apple.com/lookup?id=6797857159&entity=song`) and plays the
   returned official `previewUrl` through a native `<audio>` element with a
   play/pause button. This is a stream served by Apple — nothing is downloaded,
   extracted, or rehosted.
2. **Apple Music web player (full track).** The official embed
   (`https://embed.music.apple.com/...`) is mounted for the complete song.

- Both players are only mounted **after** the visitor interacts with the gift,
  which satisfies browser autoplay policies and keeps the initial scene calm.
- The app **never** claims the music is playing when it is not; the play/pause
  state reflects the real `<audio>` element state.
- A visible **"Open in Apple Music"** button always links to the exact song:
  <https://music.apple.com/de/album/i-yi-ki-do%C4%9Fdun/6797857158?i=6797857159>

---

## 🚀 Local setup

Requires **Node.js 18.17+**.

```bash
cd my-bear
npm install
npm run dev
```

Open <http://localhost:3000>.

### Production build

```bash
npm run build
npm run start
```

The production build has been verified to pass (compiled successfully, types
checked, static pages generated).

---

## ▲ Deploy to Vercel

### Option A — Dashboard (recommended)

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Go to <https://vercel.com/new> and import the repository.
3. Set **Root Directory** to `my-bear` (if the repo root is the parent folder).
4. Vercel auto-detects Next.js — keep the default build settings
   (`npm run build`, output handled automatically).
5. Click **Deploy**.

### Option B — Vercel CLI

```bash
npm i -g vercel
cd my-bear
vercel        # preview deployment
vercel --prod # production deployment
```

No environment variables are required.

---

## 📁 Project structure

```
my-bear/
├─ app/
│  ├─ globals.css        # pastel theme, background, reduced-motion rules
│  ├─ layout.tsx         # metadata, title, lang="az"
│  └─ page.tsx           # renders the experience
├─ components/
│  ├─ BirthdayExperience.tsx  # scene state machine + layout
│  ├─ TeddyBear.tsx           # animated SVG bear
│  ├─ GiftBox.tsx             # clickable, openable gift box
│  ├─ Cake.tsx                # birthday cake with candles
│  ├─ Confetti.tsx            # confetti / sparkle burst
│  └─ MusicPlayer.tsx         # Apple Music embed + fallback link
├─ tailwind.config.ts    # pastel palette + keyframe animations
├─ next.config.mjs
├─ postcss.config.mjs
└─ tsconfig.json
```

---

## 📝 Notes

- Browser title: **My Bear 🧸 | A Little Birthday Surprise**.
- Azerbaijani text is rendered with `lang="az"` and correct diacritics
  (`ə`, `ü`, `ö`, `ğ`, `ş`, `ç`, `ı`).
- Reduced-motion users get a calm, near-static version of the scene.
