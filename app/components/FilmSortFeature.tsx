"use client";

import Image from "next/image";

/* FilmSort flagship section — styled like the DetailsScreen hero */

const SCREENSHOTS = [
  { src: "/Screenshot_20260809-135424.jpg", alt: "FilmSort watch history" },
  { src: "/Screenshot_20260809-135437.jpg", alt: "FilmSort library view" },
  { src: "/Screenshot_20260829-001544.jpg", alt: "FilmSort organized titles" },
  { src: "/Screenshot_20260809-135503.jpg", alt: "Filmsort metadata detail" },
];


export default function FilmSortFeature() {
  return (
    <section
      id="filmsort"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#000000",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Red glow accent */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, #e50914 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "60vw",
          height: "60%",
          background: "radial-gradient(ellipse at left center, rgba(229,9,20,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 20px" }}>

        {/* ── Header row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start" style={{ marginBottom: 48 }}>
          <div>
            <span className="section-label">Flagship Project</span>
            <h2 style={{ color: "#ffffff" }}>FilmSort</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 9999, padding: "4px 10px" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#4ade80"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#4ade80" }}>Built Solo</span>
              </div>
              <span className="badge">2026</span>
              <span className="badge-blue badge">Android</span>
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "#a1a1aa", maxWidth: 480 }}>
              An offline-first Android media organizer built for anime and live-action geeks who download everything.
              Turns a folder of chaotically-named files into a clean, sorted library {"->"} automatically.
            </p>
          </div>

          {/* Tech stack chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignContent: "flex-start" }}>
            {["React Native", "Expo SDK 54", "TypeScript", "API Integration", "Firebase", "AI Native", "Android"].map(t => (
              <span key={t} className="badge" style={{ fontSize: 11 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── Problem / Solution cards ──────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginBottom: 48,
          }}
        >
          <div className="card" style={{ padding: "32px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f87171", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525b" }}>Problem</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "#a1a1aa", margin: 0 }}>
              Downloaded anime files pile up with inconsistent filenames, wrong season numbers,
              and missing metadata. No Android app handled this offline, automatically, and correctly.
            </p>
          </div>

          <div className="card" style={{ padding: "32px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525b" }}>Solution</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "#a1a1aa", margin: 0 }}>
              An Android-native app that scans local storage, parses filenames with my special system prompt, fetches video metadata, and organizes everything into a clean library.
            </p>
          </div>
        </div>

        {/* ── App screenshots ──────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 48,
          }}
          className="filmsort-screenshots"
        >
          {SCREENSHOTS.map((shot, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0a0a0a",
                /* phone-like aspect ratio */
                aspectRatio: "9/19",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              }}
            >
              {/* red top-edge accent on first screenshot */}
              {i === 0 && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 2,
                  background: "linear-gradient(90deg, #e50914, transparent)",
                }} />
              )}
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={85}
              />
            </div>
          ))}
        </div>

        {/* ── Terminal output + footer ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-center" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 36 }}>
          <div className="terminal text-xs">
            <div style={{ marginBottom: 6 }}>
              <span className="prompt">$ </span>
              <span style={{ color: "#d4d4d8" }}>filmsort scan ./Downloads/Videos</span>
            </div>
            <div className="dim">→ 284 files found</div>
            <div className="dim">→ 97% matched via SYSTEM PROMPT</div>
            <div className="dim">→ 3% resolved via AI fallback</div>
            <div className="ok" style={{ marginTop: 8 }}>✓ Library updated — 284 titles</div>
            <div style={{ marginTop: 10 }}>
              <span className="prompt">$ </span>
              <span style={{ color: "#d4d4d8" }}>filmsort stats</span>
            </div>
            <div className="dim">→ internet required at runtime</div>
            <div className="dim">→ turn-off internet</div>
            <div className="ok">✓ Fully offline-capable</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 13, color: "#52525b" }}>
              Repo and Implementation details PRIVATE ·&nbsp;
              <a href="#contact" style={{ color: "#e50914", textDecoration: "none", fontWeight: 700 }}>
                Case study available.
              </a>
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <a href="/filmsort-case-study" className="btn-red" style={{ fontSize: 12 }}>
                Read Case Study
              </a>
              <a href="#projects" className="btn-glass" style={{ fontSize: 12 }}>
                All projects
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
