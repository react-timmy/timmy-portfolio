"use client";

import { featuredProjects } from "../lib/projects";
import { useState, useEffect, useRef } from "react";

const CATEGORY = {
  mobile:        { color: "#a78bfa", bg: "rgba(139,92,246,0.10)", label: "Mobile"     },
  web:           { color: "#a78bfa", bg: "rgba(139,92,246,0.10)", label: "Web"        },
  "ai-tool":     { color: "#a78bfa", bg: "rgba(139,92,246,0.10)", label: "AI Tool"    },
  "client-work": { color: "#a78bfa", bg: "rgba(139,92,246,0.10)", label: "Client"     },
  community:     { color: "#a78bfa", bg: "rgba(139,92,246,0.10)", label: "Community"  },
  experiment:    { color: "#a78bfa", bg: "rgba(139,92,246,0.10)", label: "Experiment" },
} as const;

function getCat(category: string) {
  return CATEGORY[category as keyof typeof CATEGORY] ?? { color: "#a1a1aa", bg: "rgba(161,161,170,0.12)", label: category };
}

/* Projects that have a real cover photo — render as actual <img> */
const COVER_IMAGES: Record<string, string | string[]> = {
  filmsort:        "/filmsortpj_banner.png",
  shazam:          "/shazambanner.png",
  buildoors:       "/buildoorsbanner.png",
  "bless-network": [
    "/blessnetworkpj_bannercarousel1.jpg",
    "/blessnetworkbannercarousel2.jpg",
  ],
};

/* Fallback gradient for projects without a photo */
const COVER_GRADIENTS: Record<string, string> = {
  "web3-community": "linear-gradient(135deg, #0d0019 0%, #1a003d 50%, #2d006b 100%)",
};

/* Auto-advancing carousel for covers with multiple images */
function CoverCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (idx: number) => {
    if (idx === active) return;
    setFading(true);
    setTimeout(() => {
      setActive(idx);
      setFading(false);
    }, 300);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goTo((active + 1) % images.length);
    }, 3200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, images.length]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[active]}
        alt={alt}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: fading ? 0 : 1,
          transition: "opacity 300ms ease",
        }}
      />
      {/* Dot indicators — top-right */}
      <div style={{
        position: "absolute", top: 10, right: 10,
        display: "flex", gap: 5, zIndex: 2,
      }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); goTo(i); }}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === active ? 16 : 5,
              height: 5,
              borderRadius: 3,
              border: "none",
              cursor: "pointer",
              padding: 0,
              background: i === active ? "#ffffff" : "rgba(255,255,255,0.35)",
              transition: "width 250ms ease, background 250ms ease",
            }}
          />
        ))}
      </div>
    </>
  );
}

export default function Projects() {
  return (
    <section id="projects" style={{ background: "#000000", padding: "64px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <span className="section-label">Work</span>
          <h2 style={{ color: "#ffffff", marginBottom: 8 }}>Featured Projects</h2>
          <p style={{ color: "#71717a", fontSize: 15, maxWidth: 420 }}>
            Projects and products I built and shipped.
          </p>
        </div>

        {/* Grid wrapper — adds fade edges on mobile auto-scroll */}
        <div className="projects-grid-wrapper">
          {/* Grid — horizontal scroll on mobile, 2 col on tablet, 3 on desktop */}
          <div className="projects-grid">
          {featuredProjects.map((p, i) => {
            const cat = getCat(p.category);
            const coverImgRaw = COVER_IMAGES[p.id];
            const coverImgs: string[] | null = coverImgRaw
              ? Array.isArray(coverImgRaw) ? coverImgRaw : [coverImgRaw]
              : null;
            const coverBg = coverImgs
              ? "#0d0d0d"
              : (COVER_GRADIENTS[p.id] ?? "linear-gradient(135deg, #111 0%, #1c1c1c 100%)");

            return (
              <article
                key={p.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "#0d0d0d",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease",
                  animationDelay: `${i * 60}ms`,
                  minWidth: "calc(100vw - 40px)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${cat.color}40`;
                  el.style.transform = "translateY(-3px)";
                  el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.7), 0 0 40px ${cat.color}15`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* ── Cover ───────────────────────────────────────────── */}
                <div style={{ position: "relative", width: "100%", paddingTop: "52%", background: coverBg, overflow: "hidden" }}>

                  {/* Real cover photo / carousel */}
                  {coverImgs && (
                    coverImgs.length > 1
                      ? <CoverCarousel images={coverImgs} alt={p.title} />
                      : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={coverImgs[0]}
                          alt={p.title}
                          style={{
                            position: "absolute", inset: 0,
                            width: "100%", height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      )
                  )}

                  {/* Bottom gradient fade into card body */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
                    background: "linear-gradient(to bottom, transparent, #0d0d0d)",
                  }} />

                  {/* Category chip — bottom-left, inside cover */}
                  <div style={{
                    position: "absolute", bottom: 10, left: 12,
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "3px 9px",
                    borderRadius: 6,
                    background: cat.bg,
                    border: `1px solid ${cat.color}30`,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: cat.color, flexShrink: 0, display: "block" }} />
                    <span style={{ fontSize: 9, fontWeight: 800, color: cat.color, letterSpacing: 0.8, textTransform: "uppercase" }}>
                      {cat.label}
                    </span>
                  </div>

                  {/* Year — bottom-right */}
                  <div style={{ position: "absolute", bottom: 10, right: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 0.5 }}>{p.year}</span>
                  </div>
                </div>

                {/* ── Body ────────────────────────────────────────────── */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 14px 12px", gap: 10 }}>

                  {/* Title + subtitle */}
                  <div>
                    <h3 style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#ffffff",
                      letterSpacing: -0.2,
                      lineHeight: 1.2,
                      marginBottom: 3,
                    }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: 10, fontWeight: 500, color: "#52525b", letterSpacing: 0.1, lineHeight: 1.3 }}>
                      {p.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 11, lineHeight: 1.6, color: "#71717a", flex: 1 }}>
                    {p.summary}
                  </p>

                  {/* Tech pills */}
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {p.techStack.slice(0, 3).map(t => (
                      <span
                        key={t}
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: 0.3,
                          textTransform: "uppercase",
                          color: "#71717a",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: 5,
                          padding: "2px 7px",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

                  {/* Action row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      color: "#3f3f46",
                    }}>
                      {p.role}
                    </span>

                    {p.liveUrl ? (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "5px 12px",
                          borderRadius: 7,
                          background: "#ffffff",
                          color: "#000000",
                          fontSize: 10,
                          fontWeight: 800,
                          textDecoration: "none",
                          letterSpacing: 0.2,
                          transition: "opacity 150ms",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
                      >
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        {p.category === "mobile" ? "Download" : "Visit"}
                      </a>
                    ) : (
                      <span
                        role="button"
                        aria-disabled="true"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "6px 12px",
                          borderRadius: 7,
                          background: "rgba(255,255,255,0.04)",
                          color: "#9ca3af",
                          fontSize: 10,
                          fontWeight: 800,
                          textDecoration: "none",
                          letterSpacing: 0.2,
                          border: "1px solid rgba(255,255,255,0.04)",
                          cursor: "not-allowed",
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "#9ca3af" }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {p.category === "mobile" ? "Download" : "Visit"}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {/* Credentials Card */}
          <article
            style={{
              display: "flex",
              flexDirection: "column",
              borderRadius: 16,
              overflow: "hidden",
              background: "#0d0d0d",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease",
              animationDelay: `${featuredProjects.length * 60}ms`,
              minWidth: "calc(100vw - 40px)",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = `rgba(180, 0, 235, 0.4)`;
              el.style.transform = "translateY(-3px)";
              el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(180, 0, 235, 0.15)`;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.08)";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
            }}
          >
            {/* ── Cover ───────────────────────────────────────────── */}
            <div style={{ position: "relative", width: "100%", paddingTop: "52%", background: "linear-gradient(135deg, #1f0033 0%, #0d0019 100%)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cole-sustain-work-smarter-with-ai-badge.png"
                alt="Work Smarter with AI Canva Badge"
                style={{
                  position: "absolute",
                  height: "80%",
                  width: "auto",
                  objectFit: "contain",
                  top: "10%",
                  left: "50%",
                  transform: "translateX(-50%)"
                }}
              />

              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
                background: "linear-gradient(to bottom, transparent, #0d0d0d)",
              }} />

              {/* Category chip */}
              <div style={{
                position: "absolute", bottom: 10, left: 12,
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 9px",
                borderRadius: 6,
                background: "rgba(180, 0, 235, 0.1)",
                border: `1px solid rgba(180, 0, 235, 0.3)`,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#b400eb", flexShrink: 0, display: "block" }} />
                <span style={{ fontSize: 9, fontWeight: 800, color: "#b400eb", letterSpacing: 0.8, textTransform: "uppercase" }}>
                  Credentials
                </span>
              </div>

              <div style={{ position: "absolute", bottom: 10, right: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 0.5 }}>Present</span>
              </div>
            </div>

            {/* ── Body ────────────────────────────────────────────── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 14px 12px", gap: 10 }}>
              <div>
                <h3 style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: -0.2,
                  lineHeight: 1.2,
                  marginBottom: 3,
                }}>
                  Certifications & Resume
                </h3>
                <p style={{ fontSize: 10, fontWeight: 500, color: "#52525b", letterSpacing: 0.1, lineHeight: 1.3 }}>
                  My qualifications and professional experience
                </p>
              </div>

              <p style={{ fontSize: 11, lineHeight: 1.6, color: "#71717a", flex: 1 }}>
                View my verified Canva certification and download my latest resume to see my full work history and skills.
              </p>

              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 0.3,
                    textTransform: "uppercase",
                    color: "#71717a",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 5,
                    padding: "2px 7px",
                  }}
                >
                  AI Tools
                </span>
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <a
                  href="/cole-sustain-work-smarter-with-ai-certificate.pdf"
                  download="Cole_Timmy_Certificate.pdf"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "#b400eb",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
                >
                  Download Certificate
                </a>

                <a
                  href="/cole-sustain-work-smarter-with-ai-certificate.pdf"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 12px",
                    borderRadius: 7,
                    background: "#ffffff",
                    color: "#000000",
                    fontSize: 10,
                    fontWeight: 800,
                    textDecoration: "none",
                    letterSpacing: 0.2,
                    transition: "opacity 150ms",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  View Certificate
                </a>
              </div>
            </div>
          </article>
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
          <a
            href="https://github.com/react-timmy"
            target="_blank"
            rel="noreferrer"
            className="btn-glass"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            More on GitHub
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
