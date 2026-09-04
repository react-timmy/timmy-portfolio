import { Link } from "react-router-dom";

const SCREENSHOTS = [
  { src: "/filmsortpj_banner.png",            alt: "FilmSort banner",   wide: true },
  { src: "/Screenshot_20260809-135424.jpg",   alt: "Library view"                 },
  { src: "/Screenshot_20260809-135437.jpg",   alt: "Movie detail screen"          },
  { src: "/Screenshot_20260809-135503.jpg",   alt: "File scanner"                 },
  { src: "/Screenshot_20260829-001544.jpg",   alt: "Watch party screen"           },
];

// Desktop: wide diagram with full labels
const DATA_FLOW_DESKTOP = `
┌──────────────────────────────────────────────────────────────────┐
│                       USER ADDS A FOLDER                         │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│          Android MediaStore API  (expo-media-library)            │
│          Scans directory  →  returns raw LocalFile[]             │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                        PARSING PIPELINE                          │
│                                                                  │
│  1.  AsyncStorage cache ───── HIT? ──────► return cached data   │
│               │                                                  │
│              MISS                                                │
│               │                                                  │
│               ▼                                                  │
│  2.  Local Regex Parser                                          │
│      confidence ≥ 0.8? ──► YES ──────────► use parsed result   │
│               │                                                  │
│              NO  (ambiguous filename)                            │
│               │                                                  │
│               ▼                                                  │
│  3.  Gemini AI  (batch ≤ 60 filenames / call)                   │
│      gemma-4-31b-it  →  JSON { title, year, type }             │
│      Fails? ──► fallback to local regex result                  │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│               CLOUDFLARE WORKER PROXY  (edge)                    │
│                                                                  │
│  • Verifies Firebase ID token  (RS256 / Web Crypto API)          │
│  • TMDB Search API       ──►  poster + full metadata             │
│  • Gemini API            ──►  rotates across free key pool       │
│  • OpenSubtitles         ──►  subtitle proxy                     │
│  API keys are never bundled in the APK                           │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                   LOCAL STORAGE  (on-device)                     │
│                                                                  │
│  SQLite / AsyncStorage                                           │
│  • MediaItem      (title, poster path, genres, type …)           │
│  • WatchProgress  (position, duration, completedAt)              │
│  • Poster thumbnails cached to disk  (expo-file-system)          │
└────────────────┬───────────────────────────┬─────────────────────┘
                 │                           │
          Online?                        Offline?
                 │                           │
                 ▼                           ▼
┌──────────────────────────┐    ┌──────────────────────────────┐
│   Firestore Cloud Sync   │    │   Serve from local cache     │
│   (Pro tier)             │    │   Posters loaded from disk   │
│   fire-and-forget write  │    │   Full UI · zero spinners    │
│   last-write-wins sync   │    └──────────────────────────────┘
└──────────────────────────┘
`;



const TECH_DECISIONS = [
  {
    title: "React Native over Native Kotlin",
    color: "#e50914",
    body: "Kotlin (Jetpack Compose) is the official Android stack and gives maximum platform control. But FilmSort's complexity lives in state management, async pipelines, and UI composition — not pixel-level rendering. React Native + Expo SDK 54 won on four counts:",
    points: [
      ["NativeWind (Tailwind)", "Utility-first styling that matches the web portfolio's design language. No context-switching between two styling systems."],
      ["Expo managed workflow", "MediaStore, file system, notifications, video playback, and casting are all accessible through maintained Expo modules — without writing a single line of Java."],
      ["TypeScript end-to-end", "Shared types between the RN app and the Cloudflare Worker proxy meant zero type drift between the client payload shape and the server handler."],
      ["Faster iteration", "Expo Go and EAS Build let me validate UI changes and APK behaviour in minutes, not after a full Gradle compile cycle."],
    ],
    tradeoff: "React Native's bridge adds overhead for very high-frequency native events. The MediaStore scan runs as a single batched call to minimise bridge crossings — keeping initial scans fast even across 1,000+ file libraries.",
  },
  {
    title: "SQLite over a Cloud Database",
    color: "#e50914",
    body: "The app's #1 constraint is offline-first. A cloud-only database (PlanetScale, raw Firestore) makes every library query dependent on connectivity. SQLite on-device means:",
    points: [
      ["Zero-latency reads", "Querying 500 items from a local SQLite table takes ~2 ms. A remote DB round-trip adds 80–300 ms minimum — unacceptable for smooth scroll performance in a library grid."],
      ["Full offline functionality", "Scans, search, filtering, watch progress, and collections all work in airplane mode. The experience never degrades without signal."],
      ["Firestore as a sync layer, not a source of truth", "Pro users get cloud backup, but it's fire-and-forget: the app writes to SQLite first, then replicates to Firestore asynchronously. A pending flag queues retries on next launch."],
      ["Predictable costs", "SQLite is free per user. Firestore bills per read/write. Keeping the hot path on-device means Firestore operations only fire for backup and watch-party coordination — near-zero cloud costs on the free tier."],
    ],
    tradeoff: "Multi-device sync requires explicit conflict resolution. FilmSort uses last-write-wins via updatedAt timestamps — simple, auditable, and sufficient for a personal media library.",
  },
];

export default function FilmsortCaseStudy() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff", padding: "80px 20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Back link */}
        <Link
          to="/"
          style={{
            color: "#a1a1aa", textDecoration: "none", marginBottom: 32,
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 600, transition: "color 150ms ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#ffffff"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#a1a1aa"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to Portfolio
        </Link>

        {/* Header */}
        <div style={{ marginTop: 32, marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#e50914", background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.2)",
              borderRadius: 6, padding: "3px 9px",
            }}>Flagship Project</span>
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#a1a1aa", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6, padding: "3px 9px",
            }}>2026 · Android</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 16, lineHeight: 1.1 }}>
            FilmSort: Technical Case Study
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: 16, lineHeight: 1.7, maxWidth: 600 }}>
            An in-depth look at the architecture, challenges, and solutions behind the offline-first Android media organizer.
          </p>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 48 }} />

        {/* ── Screenshots ── */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 20, letterSpacing: "-0.03em" }}>
            App Screenshots
          </h2>

          {/* Banner — full width */}
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 12 }}>
            <img
              src={SCREENSHOTS[0].src}
              alt={SCREENSHOTS[0].alt}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          {/* Grid — remaining shots */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
            gap: 10,
          }}>
            {SCREENSHOTS.slice(1).map(({ src, alt }) => (
              <div key={src} style={{
                borderRadius: 10, overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0a0a0a",
              }}>
                <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            ))}
          </div>
        </section>

        {/* ── Architecture ── */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 20, letterSpacing: "-0.03em" }}>
            The Architecture
          </h2>
          <p style={{ color: "#d4d4d8", lineHeight: 1.8, marginBottom: 16, fontSize: 15 }}>
            FilmSort was built using React Native and Expo SDK 54 to target Android devices natively. The core philosophy was{" "}
            <strong style={{ color: "#ffffff" }}>"offline-first"</strong>. When a user adds a folder of chaotic video files, the app needs to operate quickly without relying on a constant internet connection.
          </p>
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12, padding: "20px 24px",
          }}>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { title: "Local File System", desc: "Direct integration with Android's MediaStore API to scan directories efficiently." },
                { title: "Local Database",    desc: "SQLite for fast indexing and querying of the library on-device." },
                { title: "AI Metadata Parsing", desc: 'A custom fallback mechanism that uses an LLM to parse heavily obfuscated filenames (e.g. "[SubsPlease] Anime Title - 12 (1080p).mkv") into structured search queries for TMDB.' },
              ].map(({ title, desc }) => (
                <li key={title} style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e50914", flexShrink: 0, marginTop: 7 }} />
                  <p style={{ color: "#d4d4d8", lineHeight: 1.7, fontSize: 14 }}>
                    <strong style={{ color: "#ffffff" }}>{title}:</strong> {desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Data Flow ── */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 12, letterSpacing: "-0.03em" }}>
            Data Flow
          </h2>
          <p style={{ color: "#a1a1aa", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Every file passes through a multi-stage pipeline before becoming a poster-backed media card. Network calls only fire when the cache and local regex can't resolve a match.
          </p>

          <div style={{
            background: "#080808",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 12,
            padding: "24px 20px",
            display: "flex",
            justifyContent: "center",
            overflowX: "auto",
          }}>
            <pre style={{
              margin: 0,
              fontSize: "0.72rem",
              lineHeight: 1.75,
              color: "#86efac",
              fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
            }}>
              {DATA_FLOW_DESKTOP}
            </pre>
          </div>
        </section>

        {/* ── Tech Decisions ── */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 20, letterSpacing: "-0.03em" }}>
            Tech Decisions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {TECH_DECISIONS.map(({ title, body, points, tradeoff }) => (
              <div key={title} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, padding: "24px",
              }}>
                {/* Title */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 3, height: 20, background: "#e50914", borderRadius: 2, flexShrink: 0 }} />
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>{title}</h3>
                </div>

                {/* Body */}
                <p style={{ color: "#a1a1aa", fontSize: 14, lineHeight: 1.75, marginBottom: 16 }}>{body}</p>

                {/* Points */}
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {points.map(([label, desc]) => (
                    <li key={label} style={{ display: "flex", gap: 10, fontSize: 14 }}>
                      <span style={{ color: "#e50914", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>▸</span>
                      <span style={{ color: "#d4d4d8", lineHeight: 1.7 }}>
                        <strong style={{ color: "#ffffff" }}>{label}</strong> — {desc}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Trade-off */}
                <div style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: 14,
                  display: "flex", gap: 10, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525b", flexShrink: 0, marginTop: 2 }}>Trade-off</span>
                  <p style={{ color: "#71717a", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{tradeoff}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Challenges ── */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 20, letterSpacing: "-0.03em" }}>
            Key Challenges &amp; Solutions
          </h2>

          {/* Challenge 1 */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12, padding: "24px", marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f87171", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525b" }}>Challenge 1</span>
            </div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 10, color: "#ffffff" }}>Messy Naming Conventions</h3>
            <p style={{ color: "#a1a1aa", lineHeight: 1.7, marginBottom: 12, fontSize: 14 }}>
              Video files from the internet lack standardised naming. Regex matching failed for about 40% of files due to inconsistent season/episode numbering and release group tags.
            </p>
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 12 }} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", flexShrink: 0, marginTop: 5 }} />
              <p style={{ color: "#d4d4d8", lineHeight: 1.7, fontSize: 14 }}>
                <strong style={{ color: "#ffffff" }}>Solution:</strong> I developed a hybrid pipeline. Fast regex patterns run first. If they fail to extract a clean title and episode, the filename is batched and sent to a lightweight AI prompt. The AI returns a JSON structure which is queried against TMDB. This improved match accuracy to over{" "}
                <strong style={{ color: "#4ade80" }}>97%</strong>.
              </p>
            </div>
          </div>

          {/* Challenge 2 */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12, padding: "24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f87171", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525b" }}>Challenge 2</span>
            </div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 10, color: "#ffffff" }}>Offline Image Caching</h3>
            <p style={{ color: "#a1a1aa", lineHeight: 1.7, marginBottom: 12, fontSize: 14 }}>
              Fetching high-resolution posters from TMDB works fine online, but an offline app needs instant access to artwork without a connection.
            </p>
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 12 }} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", flexShrink: 0, marginTop: 5 }} />
              <p style={{ color: "#d4d4d8", lineHeight: 1.7, fontSize: 14 }}>
                <strong style={{ color: "#ffffff" }}>Solution:</strong> Implemented a background worker that downloads standard-resolution thumbnails to the app's local storage during the initial sync. The UI gracefully falls back to these local assets when airplane mode is on.
              </p>
            </div>
          </div>
        </section>

        {/* ── Why Private ── */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 20, letterSpacing: "-0.03em" }}>
            Why it&apos;s Private
          </h2>
          <p style={{ color: "#d4d4d8", lineHeight: 1.8, fontSize: 15 }}>
            The source code is currently private — it contains proprietary AI prompts and matching algorithms being refined for a potential Play Store release. That said, I'm happy to do a{" "}
            <strong style={{ color: "#ffffff" }}>live code walkthrough</strong> during an interview.
          </p>
        </section>

        {/* Footer CTA */}
        <div style={{
          paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between",
        }}>
          <p style={{ fontSize: 13, color: "#52525b" }}>Interested in the full walkthrough?</p>
          <Link
            to="/#contact"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "10px 20px", background: "#e50914", color: "#ffffff",
              textDecoration: "none", borderRadius: 8, fontWeight: 700, fontSize: 13,
              transition: "opacity 150ms ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
            Get in Touch
          </Link>
        </div>

      </div>
    </div>
  );
}
