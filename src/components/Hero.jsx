import { useState, useEffect, useLayoutEffect, useRef } from "react";

const AVATAR = "https://pbs.twimg.com/profile_images/1990929564474773504/HkT4wInV_400x400.jpg";

const ROLES = [
  "Mobile UI Designer",
  "Mobile App Builder",
  "Full-Stack Engineer",
  "Content Creator",
];

const PROOF = [
  { icon: "⬡", text: "FilmSort — offline-first Android app", color: "#a78bfa" },
  { icon: "◈", text: "Shipped production ready apps",        color: "#a78bfa" },
  { icon: "▶", text: "Client sites within requested time",   color: "#a78bfa" },
  { icon: "✦", text: "Writer on X -> @_devTimmy",            color: "#a78bfa" },
];

const QUICK_STATS = [
  { value: "3+",  label: "Years",    color: "#a78bfa" },
  { value: "10+", label: "Projects", color: "#a78bfa" },
  { value: "5★",  label: "Rated",    color: "#a78bfa" },
  { value: "24h", label: "Response", color: "#a78bfa" },
];

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const [roleIdx, setRoleIdx]     = useState(0);
  const [typedRole, setTypedRole] = useState("");
  const [proofIdx, setProofIdx]   = useState(0);
  const [proofVis, setProofVis]   = useState(true);
  const avatarRef = useRef(null);
  const avatarVisualRef = useRef(null);

  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  /* Type and rotate the role text. */
  useEffect(() => {
    if (!isMounted) return;
    const role = ROLES[roleIdx];

    if (typedRole.length < role.length) {
      const timer = setTimeout(() => {
        setTypedRole(role.slice(0, typedRole.length + 1));
      }, 58);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setTypedRole("");
      setRoleIdx(index => (index + 1) % ROLES.length);
    }, 2200);
    return () => clearTimeout(timer);
  }, [isMounted, roleIdx, typedRole]);

  /* Rotate proof */
  useEffect(() => {
    const t = setInterval(() => {
      setProofVis(false);
      setTimeout(() => { setProofIdx(i => (i + 1) % PROOF.length); setProofVis(true); }, 260);
    }, 3400);
    return () => clearInterval(t);
  }, []);

  /* Publish hero avatar rect so Navbar can pick it up */
  useLayoutEffect(() => {
    const publish = () => {
      const el = avatarRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      window.__heroAvatarRect = {
        cx: r.left + r.width / 2,
        cy: r.top  + r.height / 2,
        size: r.width,
      };
    };
    publish();
    window.addEventListener("resize", publish);
    return () => window.removeEventListener("resize", publish);
  }, []);

  /* Fade avatar out as user scrolls — starts fading after 40px, gone by 160px. */
  useLayoutEffect(() => {
    let raf = null;

    const applyAvatarScroll = () => {
      raf = null;
      const el = avatarVisualRef.current;
      if (!el) return;

      const y = window.scrollY;
      const opacity = Math.max(0, 1 - (y - 40) / 120);
      el.style.opacity = String(opacity);
      el.style.transform = `translate3d(0, 0, 0) scale(${0.85 + 0.15 * opacity})`;
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(applyAvatarScroll);
    };

    applyAvatarScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const proof = PROOF[proofIdx];

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#000000",
      }}
    >
      {/* ── Background layers ─────────────────────────────────────────── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,56,180,0.12) 0%, transparent 70%)",
      }} />
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 340,
        background: "radial-gradient(ellipse 55% 45% at 8% -8%, rgba(139,92,246,0.09) 0%, transparent 70%)",
      }} />
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, #000000 0%, #000 12%, transparent 55%)",
      }} />
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 0%, black 40%, transparent 100%)",
      }} />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div style={{
        position: "relative", zIndex: 10,
        width: "100%", maxWidth: 720,
        margin: "0 auto",
        padding: "120px 24px 100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>

        {/* ── Avatar (source element) ──────────────────────────────────── */}
        {/* id="hero-avatar-anchor" lets Navbar measure its initial position */}
        <div
          id="hero-avatar-anchor"
          ref={avatarRef}
          className="anim-fade-up d-1"
          style={{
            position: "relative",
            marginBottom: 24,
          }}
        >
          <div
            ref={avatarVisualRef}
            className="hero-avatar-visual"
            style={{
              position: "relative",
              transform: "translate3d(0, 0, 0) scale(1)",
              transformOrigin: "center",
            }}
          >
            {/* Breathing signal ring */}
            <div className="hero-avatar-ring" style={{
              position: "absolute", inset: -4,
              borderRadius: "50%",
              background: "conic-gradient(from 0deg, #8b5cf6 0%, #8b5cf600 40%, #8b5cf600 60%, #8b5cf6 100%)",
              opacity: 0.45,
              willChange: isMounted ? "transform, opacity" : "auto",
              animation: isMounted ? "ringBreathe 3.6s ease-in-out infinite" : "none",
            }} />
            {/* Photo */}
            <div style={{
              position: "relative",
              width: 100, height: 100,
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,0.1)",
            }}>
              <img
                src={AVATAR}
                alt="Cole Timmy"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
            {/* Heartbeat green dot */}
            <div style={{
              position: "absolute", bottom: 3, right: 3,
              width: 22, height: 22,
              borderRadius: "50%",
              background: "#000",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2.5px solid #000",
            }}>
              <div style={{
                position: "relative",
                width: 12, height: 12,
                borderRadius: "50%",
                background: "#4ade80",
                boxShadow: "0 0 10px #4ade80bb",
              }}>
                <span
                  className="status-ripple"
                  aria-hidden
                  style={{ animationPlayState: isMounted ? "running" : "paused" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Handle only (Available pill removed) ────────────────────── */}
        <div className="anim-fade-up d-1" style={{
          display: "flex", alignItems: "center", gap: 10,
          marginBottom: 20, flexWrap: "wrap", justifyContent: "center",
        }}>
          <a
            href="https://x.com/_devTimmy"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 700, color: "#71717a",
              textDecoration: "none", letterSpacing: 0.2,
              transition: "color 150ms ease",
            }}
            onMouseEnter={e => { (e.currentTarget).style.color = "#ffffff"; }}
            onMouseLeave={e => { (e.currentTarget).style.color = "#71717a"; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            @_devTimmy
          </a>
        </div>

        {/* ── Headline ─────────────────────────────────────────────────── */}
        <h1 className="anim-fade-up d-2" style={{
          color: "#ffffff", lineHeight: 1.0,
          marginBottom: 12,
          fontSize: "clamp(2.6rem, 8vw, 4.25rem)",
        }}>
          I&apos;m Cole Timmy
        </h1>

        {/* ── Animated role ─────────────────────────────────────────────── */}
        <div className="anim-fade-up d-2" style={{
          display: "inline-flex", alignItems: "baseline", justifyContent: "center", gap: "0.35em",
          marginBottom: 24, height: 36,
          maxWidth: "100%",
        }}>
          {/* static "a " prefix */}
          <span style={{
            fontSize: "clamp(1.0rem, 3vw, 1.375rem)",
            fontWeight: 900, letterSpacing: "-0.025em",
            color: "#ffffff",
            flexShrink: 0,
          }}>
            a
          </span>
          <span style={{
            fontSize: "clamp(1.0rem, 3vw, 1.375rem)",
            fontWeight: 900, letterSpacing: "-0.025em",
            color: "#8b5cf6",
            display: "inline-block",
            whiteSpace: "nowrap",
          }} className="hero-role-text">
            {typedRole || "\u00a0"}
            <span className="hero-role-caret" aria-hidden />
          </span>
        </div>


        {/* ── CTAs ─────────────────────────────────────────────────────── */}
        <div className="anim-fade-up d-4" style={{
          display: "flex", gap: 10, flexWrap: "wrap",
          justifyContent: "center", marginBottom: 40,
        }}>
          <a href="#projects" className="btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
            See my work
          </a>
          <a href="#contact" className="btn-glass">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Let&apos;s build something
          </a>
        </div>

        {/* ── Quick stats ──────────────────────────────────────────────── */}
        <div className="anim-fade-up d-4" style={{
          display: "flex", gap: 0,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, overflow: "hidden",
          marginBottom: 36, width: "100%", maxWidth: 440,
        }}>
          {QUICK_STATS.map(({ value, label, color }, i) => (
            <div key={label} style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "14px 8px",
              borderRight: i < QUICK_STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <span style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)", fontWeight: 900, color, letterSpacing: -0.5 }}>{value}</span>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#3f3f46", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* ── Proof ticker ─────────────────────────────────────────────── */}
        <div className="anim-fade-up d-5 hero-proof-ticker" style={{
          display: "flex", alignItems: "center", gap: 10,
          marginBottom: 36, height: 28,
          maxWidth: "100%",
          overflow: "hidden",
        }}>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#27272a" }}>
            Recent
          </span>
          <span style={{ width: 1, height: 14, background: "#27272a" }} />
          <div className="hero-proof-content" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            opacity: proofVis ? 1 : 0,
            transform: proofVis ? "translate3d(0, 0, 0)" : "translate3d(0, 6px, 0)",
            transition: "opacity 260ms ease, transform 260ms ease",
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            minWidth: 0,
          }}>
            <span style={{ fontSize: 12, color: proof.color }}>{proof.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#71717a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{proof.text}</span>
          </div>
        </div>
      </div>

      {/* ── Scroll cue ───────────────────────────────────────────────────── */}
      <a
        href="#projects"
        aria-label="Scroll to projects"
        className="hero-scroll-cue"
        style={{
          position: "absolute", bottom: 36, left: "50%", transform: "translate3d(-50%, 0, 0)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
          fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase",
          color: "#27272a", textDecoration: "none", transition: "color 150ms ease", zIndex: 10,
          animation: "scrollFloat 2s ease-in-out infinite",
        }}
        onMouseEnter={e => { (e.currentTarget).style.color = "#52525b"; }}
        onMouseLeave={e => { (e.currentTarget).style.color = "#27272a"; }}
      >
        scroll
        <div style={{ width: 1, height: 18, background: "linear-gradient(to bottom, #3f3f46, transparent)" }} />
      </a>

      <style>{`
        @keyframes ringBreathe {
          0%, 100% { opacity: 0.24; transform: translate3d(0, 0, 0) scale(0.96); }
          50%       { opacity: 0.58; transform: translate3d(0, 0, 0) scale(1.04); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1);    opacity: 1;    }
          14%       { transform: translate3d(0, 0, 0) scale(1.35); opacity: 1;    }
          28%       { transform: translate3d(0, 0, 0) scale(1);    opacity: 1;    }
          42%       { transform: translate3d(0, 0, 0) scale(1.2);  opacity: 0.85; }
          70%       { transform: translate3d(0, 0, 0) scale(1);    opacity: 1;    }
        }
        .status-ripple {
          position: absolute;
          inset: -2px;
          border: 1px solid #4ade80;
          border-radius: 50%;
          pointer-events: none;
          animation: statusRipple 2.4s ease-out infinite;
        }
        .hero-avatar-visual,
        .hero-avatar-ring,
        .hero-proof-content,
        .hero-role-text,
        .hero-role-caret,
        .hero-scroll-cue,
        .status-ripple {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        .hero-avatar-visual,
        .hero-proof-content,
        .hero-role-text,
        .hero-role-caret,
        .hero-scroll-cue {
          will-change: transform, opacity;
        }
        .hero-role-caret {
          display: inline-block;
          width: 2px;
          height: 0.9em;
          margin-left: 3px;
          border-radius: 2px;
          background: #8b5cf6;
          opacity: 0.95;
          transform: translate3d(0, 0.12em, 0);
          animation: caretPulse 1.15s ease-in-out infinite;
        }
        @keyframes statusRipple {
          0%   { transform: translate3d(0, 0, 0) scale(1); opacity: 0.7; }
          70%  { transform: translate3d(0, 0, 0) scale(2.4); opacity: 0; }
          100% { transform: translate3d(0, 0, 0) scale(2.4); opacity: 0; }
        }
        @keyframes statusRippleSoft {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1.35); opacity: 0.25; }
          50%      { transform: translate3d(0, 0, 0) scale(1.35); opacity: 0.75; }
        }
        @keyframes caretPulse {
          0%, 100% { opacity: 0.28; transform: translate3d(0, 0.12em, 0); }
          50%      { opacity: 0.95; transform: translate3d(0, 0.12em, 0); }
        }
        @keyframes scrollFloat {
          0%, 100% { transform: translate3d(-50%, 0, 0); }
          50%       { transform: translate3d(-50%, -8px, 0); }
        }
        @media (max-width: 767px) {
          #hero > div { padding-top: 100px !important; padding-bottom: 80px !important; }
          .hero-avatar-ring {
            animation: ringBreathe 4.1s ease-in-out infinite !important;
            opacity: 0.34 !important;
          }
          .status-ripple {
            animation: statusRippleSoft 2.4s ease-in-out infinite !important;
            transform: translate3d(0, 0, 0) scale(1.35) !important;
          }
          .hero-role-caret {
            animation: caretPulse 1.35s ease-in-out infinite !important;
            transform: translate3d(0, 0.12em, 0) !important;
            will-change: opacity;
          }
          .hero-proof-ticker {
            justify-content: center;
            width: 100%;
          }
          .hero-proof-content {
            transform: translate3d(0, 0, 0) !important;
            transition: opacity 300ms ease !important;
            will-change: opacity;
          }
          .hero-scroll-cue {
            animation: none !important;
            transform: translate3d(-50%, 0, 0) !important;
          }
        }
      `}</style>
    </section>
  );
}
