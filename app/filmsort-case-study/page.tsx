import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "FilmSort Case Study",
  description:
    "An in-depth look at the architecture, challenges, and solutions behind the offline-first Android media organizer built by Cole Sustain Timmy.",
};

export default function FilmSortCaseStudy() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff", padding: "80px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", marginBottom: "32px", display: "inline-block" }}>
          ← Back to Portfolio
        </Link>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.05em" }}>
          FilmSort: Technical Case Study
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "1.1rem", marginBottom: "32px", lineHeight: 1.6 }}>
          An in-depth look at the architecture, challenges, and solutions behind the offline-first Android media organizer.
        </p>

        {/* Banner */}
        <div style={{ marginBottom: "48px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Image
            src="/filmsortpj_banner.png"
            alt="FilmSort app banner"
            width={800}
            height={400}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Screenshots row */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
            App Screenshots
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
            {[
              { src: "/filmsort-register-profile.jpg", alt: "Register and profile select screen" },
              { src: "/filmsort-videoplayer.png",      alt: "Video player screen" },
              { src: "/Screenshot_20260809-135424.jpg", alt: "FilmSort screenshot — library view" },
              { src: "/Screenshot_20260809-135437.jpg", alt: "FilmSort screenshot — movie detail" },
              { src: "/Screenshot_20260809-135503.jpg", alt: "FilmSort screenshot — scanner" },
              { src: "/Screenshot_20260829-001544.jpg", alt: "FilmSort screenshot — watch party" },
            ].map(({ src, alt }) => (
              <div key={src} style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "#111" }}>
                <Image
                  src={src}
                  alt={alt}
                  width={360}
                  height={640}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Architecture */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
            The Architecture
          </h2>
          <p style={{ color: "#d4d4d8", lineHeight: 1.7, marginBottom: "16px" }}>
            FilmSort was built using React Native and Expo SDK 54 to target Android devices natively. The core philosophy was "offline-first". When a user adds a folder of chaotic video files, the app needs to operate quickly without relying on a constant internet connection.
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "24px", color: "#d4d4d8", lineHeight: 1.7 }}>
            <li><strong>Local File System:</strong> Direct integration with Android's MediaStore API to scan directories efficiently.</li>
            <li><strong>Local Database:</strong> SQLite for fast indexing and querying of the library on-device.</li>
            <li><strong>AI Metadata Parsing:</strong> A custom fallback mechanism that uses an LLM to parse heavily obfuscated filenames (e.g., "[SubsPlease] Anime Title - 12 (1080p).mkv") into structured Search Queries for TMDB.</li>
          </ul>
        </section>

        {/* Data Flow Diagram */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
            Data Flow
          </h2>
          <p style={{ color: "#d4d4d8", lineHeight: 1.7, marginBottom: "20px" }}>
            Every file added to the library passes through a multi-stage pipeline before it becomes a rich, poster-backed media card. Network calls only happen when needed — the cache and local regex catch the majority of cases.
          </p>
          <pre style={{
            backgroundColor: "#0d0d0d",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "24px",
            overflowX: "auto",
            fontSize: "0.8rem",
            lineHeight: 1.7,
            color: "#a1f5a1",
            fontFamily: "'Fira Code', 'Courier New', monospace",
          }}>{`
┌──────────────────────────────────────────────────────────────┐
│                     USER ADDS FOLDER                         │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│         Android MediaStore API  (expo-media-library)         │
│         Scans directory → returns raw LocalFile[]            │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   PARSING PIPELINE                           │
│                                                              │
│  1. AsyncStorage Cache ──── HIT? ──► Return cached data      │
│          │                                                   │
│          MISS                                                │
│          │                                                   │
│          ▼                                                   │
│  2. Local Regex Parser                                       │
│     confidence ≥ 0.8? ──► YES ──► Use parsed result         │
│          │                                                   │
│          NO (< 0.8)                                          │
│          │                                                   │
│          ▼                                                   │
│  3. Gemini AI Batch (up to 60 filenames/call)                │
│     gemma-4-31b-it → structured JSON {title, year, type}    │
│     Fails? ──► Fallback to local regex result               │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│             CLOUDFLARE WORKER PROXY  (edge)                  │
│                                                              │
│  • Verifies Firebase ID Token (RS256 / Web Crypto API)       │
│  • Routes to TMDB Search API  ──► returns metadata           │
│  • Routes to Gemini API       ──► uses key pool rotation     │
│  • Routes to OpenSubtitles    ──► subtitle proxy             │
│  • TMDB keys / Gemini keys NEVER leave the Worker            │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   LOCAL STORAGE  (on-device)                 │
│                                                              │
│  SQLite / AsyncStorage                                       │
│  • MediaItem  (title, poster path, type, genres…)            │
│  • WatchProgress (position, duration, completedAt)           │
│  • Cached poster thumbnails  (expo-file-system)              │
└─────────────────────────┬────────────────────────────────────┘
                          │
                ┌─────────┴──────────┐
                │  Online?           │  Offline?
                ▼                   ▼
┌───────────────────────┐  ┌────────────────────────┐
│  Firestore Cloud Sync │  │  Serve from local cache │
│  (Pro tier)           │  │  Posters from disk      │
│  fire-and-forget      │  │  Full UI, no spinner    │
│  last-write-wins      │  └────────────────────────┘
└───────────────────────┘
`}</pre>
        </section>

        {/* Tech Decisions */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
            Tech Decisions
          </h2>

          {/* React Native vs Kotlin */}
          <div style={{ marginBottom: "32px", padding: "20px", background: "#0d0d0d", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "10px", color: "#e50914" }}>
              React Native over Native Kotlin
            </h3>
            <p style={{ color: "#d4d4d8", lineHeight: 1.7, marginBottom: "10px" }}>
              Kotlin (Jetpack Compose) was tempting — it's the official Android stack and gives the most control over platform APIs. But FilmSort's real complexity lives in state management, async pipelines, and UI composition, not in pixel-level rendering tricks. React Native with Expo SDK 54 gave me:
            </p>
            <ul style={{ listStyleType: "none", paddingLeft: 0, color: "#d4d4d8", lineHeight: 1.9 }}>
              {[
                ["NativeWind (Tailwind)", "Utility-first styling that maps 1:1 with the web portfolio's design language — no context-switching between styling systems."],
                ["Expo managed workflow", "MediaStore, file system, notifications, video playback, and casting — all accessible through well-maintained Expo modules without writing a single line of Java."],
                ["TypeScript across the full stack", "Shared types between the React Native app and the Cloudflare Worker proxy meant zero type drift between the client payload shape and the server handler."],
                ["Faster iteration", "Expo Go and EAS Build let me validate UI changes and APK behaviour in minutes, not after a full Gradle compile cycle."],
              ].map(([label, desc]) => (
                <li key={label as string} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ color: "#e50914", fontWeight: 700, flexShrink: 0 }}>▸</span>
                  <span><strong>{label}</strong> — {desc}</span>
                </li>
              ))}
            </ul>
            <p style={{ color: "#a1a1aa", lineHeight: 1.7, marginTop: "10px", fontSize: "0.92rem" }}>
              The trade-off: React Native's bridge adds overhead for very high-frequency native events. The MediaStore scan is handled in a single batched call to limit bridge crossings, keeping the initial scan fast even for libraries of 1,000+ files.
            </p>
          </div>

          {/* SQLite vs Cloud DB */}
          <div style={{ padding: "20px", background: "#0d0d0d", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "10px", color: "#e50914" }}>
              SQLite over a Cloud Database
            </h3>
            <p style={{ color: "#d4d4d8", lineHeight: 1.7, marginBottom: "10px" }}>
              The app's #1 constraint is <em>offline-first</em>. A cloud-only database like PlanetScale or a raw Firestore collection would make every library query dependent on connectivity. SQLite on-device means:
            </p>
            <ul style={{ listStyleType: "none", paddingLeft: 0, color: "#d4d4d8", lineHeight: 1.9 }}>
              {[
                ["Zero-latency reads", "Querying 500 items from a local SQLite table takes ~2 ms. A round-trip to any remote DB adds 80–300 ms minimum — unacceptable for smooth scroll performance in a library grid."],
                ["Full functionality in airplane mode", "Scans, searches, filtering, watch progress tracking, and collections all work completely offline. The user experience doesn't degrade without signal."],
                ["Firestore as a sync layer, not a source of truth", "Pro users get Firestore cloud backup, but it's fire-and-forget: the app writes to SQLite first, then replicates to Firestore asynchronously. If the sync fails, a pending flag queues the retry on next launch."],
                ["Cost predictability", "SQLite is free per user. Firestore at scale bills per read/write. By keeping the hot path on-device, Firestore operations only fire for backup and watch-party coordination — keeping cloud costs near zero for free-tier users."],
              ].map(([label, desc]) => (
                <li key={label as string} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ color: "#e50914", fontWeight: 700, flexShrink: 0 }}>▸</span>
                  <span><strong>{label}</strong> — {desc}</span>
                </li>
              ))}
            </ul>
            <p style={{ color: "#a1a1aa", lineHeight: 1.7, marginTop: "10px", fontSize: "0.92rem" }}>
              The trade-off: multi-device sync requires explicit conflict resolution. FilmSort uses a last-write-wins strategy via <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "4px" }}>updatedAt</code> timestamps — simple, auditable, and sufficient for personal media libraries.
            </p>
          </div>
        </section>

        {/* Challenges */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
            Key Challenges & Solutions
          </h2>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "8px", color: "#e50914" }}>
              Challenge 1: Messy Naming Conventions
            </h3>
            <p style={{ color: "#d4d4d8", lineHeight: 1.7 }}>
              Video files from the internet lack standardized naming. Regex matching failed for about 40% of the files due to inconsistent season/episode numbering and release group tags.
            </p>
            <p style={{ color: "#d4d4d8", lineHeight: 1.7, marginTop: "8px" }}>
              <strong>Solution:</strong> I developed a hybrid pipeline. Fast regex patterns run first. If they fail to extract a clean title and episode, the filename is batched and sent to a lightweight prompt on an AI service. The AI returns a JSON structure which is then queried against TMDB to fetch exact metadata. This improved match accuracy to over 97%.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "8px", color: "#e50914" }}>
              Challenge 2: Offline Image Caching
            </h3>
            <p style={{ color: "#d4d4d8", lineHeight: 1.7 }}>
              Fetching high-resolution posters from TMDB works fine online, but an offline app needs instant access.
            </p>
            <p style={{ color: "#d4d4d8", lineHeight: 1.7, marginTop: "8px" }}>
              <strong>Solution:</strong> Implemented a background worker that downloads standard-resolution thumbnails to the app's local storage directory during the initial sync. The UI gracefully falls back to these local assets when airplane mode is on.
            </p>
          </div>
        </section>

        {/* Why it's Private */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
            Why it&apos;s Private
          </h2>
          <p style={{ color: "#d4d4d8", lineHeight: 1.7 }}>
            The source code for FilmSort is currently kept private as it contains proprietary scraping algorithms and AI prompts that are currently being refined for a potential public release on the Google Play Store. However, I am happy to do a live code walkthrough during an interview!
          </p>
        </section>

        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between" }}>
          <Link href="/#contact" style={{ display: "inline-block", padding: "12px 24px", backgroundColor: "#e50914", color: "#ffffff", textDecoration: "none", borderRadius: "8px", fontWeight: 600 }}>
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
