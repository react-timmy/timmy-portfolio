"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const AVATAR = "https://pbs.twimg.com/profile_images/1990929564474773504/HkT4wInV_400x400.jpg";

const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "FilmSort", href: "#filmsort" },
  { label: "About",    href: "#about"    },
  { label: "Contact",  href: "#contact"  },
];

const NAV_H           = 64;
const NAV_AVATAR_SIZE = 34;

/* Clamp 0–1 */
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/* Cubic ease-out */
const easeOut  = (t: number) => 1 - Math.pow(1 - t, 3);

/*
  Two scroll phases:
  Phase A  0–80px   : Timmy shrinks 34px → 15px, bg fades in
  Phase B  80–220px : avatar flies from hero → navbar slot
*/
const PHASE_A_END = 80;
const PHASE_B_END = 220;

interface FlyState {
  x: number; y: number; size: number; progress: number;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active,   setActive]   = useState("hero");
  const [year] = useState(() => new Date().getFullYear());

  /* Raw scroll-based 0-1 values */
  const [pA, setPA] = useState(0); // phase A (text shrink)
  const [pB, setPB] = useState(0); // phase B (avatar fly)
  const [fly, setFly] = useState<FlyState | null>(null);
  const [mobileView, setMobileView] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );

  const logoSlotRef  = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number | null>(null);

  /* Recalculate on every scroll frame */
  const update = useCallback(() => {
    const y = window.scrollY;

    const newPA = easeOut(clamp01(y / PHASE_A_END));
    const newPB = easeOut(clamp01((y - PHASE_A_END) / (PHASE_B_END - PHASE_A_END)));

    setPA(newPA);
    setPB(newPB);

    if (window.matchMedia("(max-width: 767px)").matches) {
      setFly(null);
      return;
    }

    /* Flying avatar — only active during phase B */
    const anchor = document.getElementById("hero-avatar-anchor");
    const slot   = logoSlotRef.current;
    if (!anchor || !slot) return;

    const srcRect = anchor.getBoundingClientRect();
    const tgtRect = slot.getBoundingClientRect();

    const srcCX = srcRect.left + srcRect.width  / 2;
    const srcCY = srcRect.top  + srcRect.height / 2;
    const tgtCX = tgtRect.left + tgtRect.width  / 2;
    const tgtCY = tgtRect.top  + tgtRect.height / 2;

    const cx   = srcCX + (tgtCX - srcCX) * newPB;
    const cy   = srcCY + (tgtCY - srcCY) * newPB;
    const size = srcRect.width + (NAV_AVATAR_SIZE - srcRect.width) * newPB;

    setFly({ x: cx - size / 2, y: cy - size / 2, size, progress: newPB });
  }, []);

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => { update(); rafRef.current = null; });
  }, [update]);

  useEffect(() => {
    scheduleUpdate();
    const mq = window.matchMedia("(max-width: 767px)");
    const onMediaChange = () => {
      setMobileView(mq.matches);
      if (mq.matches) setFly(null);
      scheduleUpdate();
    };

    window.addEventListener("scroll",    scheduleUpdate, { passive: true });
    window.addEventListener("touchmove", scheduleUpdate, { passive: true });
    window.addEventListener("resize",    scheduleUpdate, { passive: true });
    mq.addEventListener("change", onMediaChange);
    return () => {
      window.removeEventListener("scroll",    scheduleUpdate);
      window.removeEventListener("touchmove", scheduleUpdate);
      window.removeEventListener("resize",    scheduleUpdate);
      mq.removeEventListener("change", onMediaChange);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleUpdate]);

  /* Active section tracking */
  useEffect(() => {
    const ids = ["hero", "projects", "filmsort", "about", "skills", "community", "contact"];
    const obs = new IntersectionObserver(
      entries => { for (const e of entries) if (e.isIntersecting) setActive(e.target.id); },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  /* Avatar has fully landed in navbar slot */
  const landed = pB > 0.95;

  /* Logo text: 34px at top → 15px once scrolled */
  const nameFontSize = 34 - 19 * pA;
  /* Nav bg fades in during phase A */
  const scrolled = pA > 0.05;

  return (
    <>
      {/* ── Flying avatar clone — visible during phase B, hidden when landed ── */}
      {fly && !mobileView && pB > 0.01 && !landed && (
        <div
          aria-hidden
          style={{
            position: "fixed", top: 0, left: 0, zIndex: 60,
            pointerEvents: "none",
            width: fly.size, height: fly.size,
            willChange: "transform",
            transform: `translate3d(${fly.x}px, ${fly.y}px, 0)`,
          }}
        >
          <div style={{
            width: "100%", height: "100%",
            borderRadius: "50%", overflow: "hidden",
            border: `2px solid rgba(139,92,246,${0.5 * pB})`,
            boxShadow: `0 0 ${14 * pB}px rgba(139,92,246,${0.3 * pB})`,
          }}>
            <img
              src={AVATAR} alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
            />
          </div>
          {/* Green dot */}
          <div style={{
            position: "absolute",
            bottom: fly.size * 0.04, right: fly.size * 0.04,
            width: fly.size * 0.18, height: fly.size * 0.18,
            borderRadius: "50%",
            background: "#000",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `${Math.max(1.5, fly.size * 0.025)}px solid #000`,
          }}>
            <div style={{
              width: "55%", height: "55%", borderRadius: "50%",
              background: "#4ade80",
              boxShadow: `0 0 ${fly.size * 0.08}px #4ade80bb`,
            }} />
          </div>
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="site-header" style={{
        position: "fixed", inset: "0 0 auto", zIndex: 50,
        background:           scrolled ? "rgba(0,0,0,0.90)"                 : "transparent",
        backdropFilter:       scrolled && !mobileView ? "blur(24px)"                       : "none",
        WebkitBackdropFilter: scrolled && !mobileView ? "blur(24px)"                       : "none",
        borderBottom:         scrolled ? "1px solid rgba(255,255,255,0.07)"                : "1px solid transparent",
        boxShadow:            scrolled && !mobileView ? "0 8px 32px rgba(0,0,0,0.6)"       : "none",
        /* Smooth bg transition */
        transition: "background 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          height: NAV_H,
          display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 20px",
        }}>

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <a href="#hero" onClick={close} style={{
            display: "flex", alignItems: "center", gap: 10,
            textDecoration: "none", flexShrink: 0,
          }}>
            {/*
              Avatar slot:
              - Invisible + collapsed at top (pB = 0)
              - Grows + appears as avatar lands (pB → 1)
              - The flying clone fills the visual gap during the journey
            */}
            <div
              ref={logoSlotRef}
              style={{
                position: "relative",
                width: NAV_AVATAR_SIZE,
                height: NAV_AVATAR_SIZE,
                borderRadius: "50%",
                flexShrink: 0,
                /* Fade in only once avatar has landed */
                opacity: landed ? 1 : 0,
                transform: landed ? "scale(1)" : "scale(0.7)",
                transition: "opacity 220ms ease, transform 220ms ease",
              }}
            >
              <img
                src={AVATAR} alt="Timmy"
                style={{
                  width: "100%", height: "100%", borderRadius: "50%",
                  objectFit: "cover", objectPosition: "top center",
                  border: "2px solid rgba(139,92,246,0.5)", display: "block",
                }}
              />
              <span style={{
                position: "absolute", bottom: 0, right: 0,
                width: 9, height: 9, borderRadius: "50%",
                background: "#4ade80",
                border: "2px solid #000",
                boxShadow: "0 0 6px #4ade80aa",
              }} />
            </div>

            {/* Name — large at top, shrinks once user scrolls */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: nameFontSize > 20 ? "-0.04em" : "-0.02em",
                lineHeight: 1,
                /*
                  font-size is driven by scroll (pA).
                  We use a CSS transition only as a soft follow — the JS update
                  is faster than 16ms so it won't overshoot.
                */
                fontSize: `${nameFontSize}px`,
                transition: "font-size 60ms linear, letter-spacing 60ms linear",
                display: "block",
                whiteSpace: "nowrap",
              }}>
                Timmy
              </span>
              {/* @handle fades in under name once avatar landed */}
              <div style={{
                fontSize: 10, fontWeight: 700, color: "#52525b", letterSpacing: 0.3,
                display: "block",
                overflow: "hidden",
                maxHeight: (landed || menuOpen) ? "14px" : "0px",
                opacity: (landed || menuOpen) ? 1 : 0,
                transition: "opacity 220ms ease, max-height 220ms ease",
              }}>
                <div style={{
                  transition: "transform 300ms cubic-bezier(.2,.9,.2,1)",
                  transform: menuOpen ? "translateY(-50%)" : "translateY(0%)",
                  willChange: "transform",
                }}>
                  <div style={{ height: 14, lineHeight: "14px" }}>@_devTimmy</div>
                  <div style={{ height: 14, lineHeight: "14px" }}>Full-stack AI Developer</div>
                </div>
              </div>
            </div>
          </a>

          {/* ── Desktop nav ───────────────────────────────────────────────── */}
          <nav style={{ alignItems: "center", gap: 2 }} className="hidden md:flex">
            {NAV_LINKS.map(({ label, href }) => {
              const id = href.replace("#", "");
              const on = active === id;
              return (
                <a key={href} href={href} style={{
                  position: "relative",
                  padding: "7px 14px", borderRadius: 9999,
                  fontSize: 13, fontWeight: 700, letterSpacing: -0.2,
                  color: on ? "#ffffff" : "#71717a",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                  onMouseEnter={e => { if (!on) (e.currentTarget as HTMLAnchorElement).style.color = "#d4d4d8"; }}
                  onMouseLeave={e => { if (!on) (e.currentTarget as HTMLAnchorElement).style.color = "#71717a"; }}
                >
                  {label}
                  {on && (
                    <span style={{
                      position: "absolute", bottom: 4, left: "50%",
                      transform: "translateX(-50%)",
                      width: 4, height: 4, borderRadius: "50%",
                      background: "#8b5cf6",
                    }} />
                  )}
                </a>
              );
            })}

            <a
              href="https://x.com/_devTimmy"
              target="_blank" rel="noreferrer"
              style={{
                marginLeft: 6,
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 9999,
                fontSize: 12, fontWeight: 800, letterSpacing: -0.1,
                color: "#a1a1aa", textDecoration: "none",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 150ms ease",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "#fff";
                el.style.background = "rgba(255,255,255,0.09)";
                el.style.borderColor = "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "#a1a1aa";
                el.style.background = "rgba(255,255,255,0.05)";
                el.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              @_devTimmy
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg>
            </a>
          </nav>

          {/* ── Mobile menu button ────────────────────────────────────────── */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden"
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: menuOpen ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.05)",
              border: menuOpen ? "1.5px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: menuOpen ? "#a78bfa" : "#a1a1aa",
              cursor: "pointer", flexShrink: 0,
              transition: "all 300ms ease",
            }}
          >
            <svg
              width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              style={{ transition: "transform 300ms ease", transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              {menuOpen ? (
                <>
                  <path d="M6 6l12 12M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M5 8h14" />
                  <path d="M3 12h18" />
                  <path d="M5 16h14" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <div className="site-mobile-drawer md:hidden" style={{
        position: "fixed", inset: 0, zIndex: 40,
        background: "rgba(0,0,0,0.98)",
        backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
        display: "flex", flexDirection: "column",
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? "auto" : "none",
        transition: "opacity 250ms ease",
      }}>
        <div style={{ height: NAV_H + 16, flexShrink: 0 }} />


        <nav style={{ padding: "16px 16px 0", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_LINKS.map(({ label, href }, i) => {
            const on = active === href.replace("#", "");
            return (
              <a key={href} href={href} onClick={close} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 16px", borderRadius: 14,
                fontSize: 22, fontWeight: 900, letterSpacing: -0.5,
                color: on ? "#ffffff" : "#3f3f46",
                background: on ? "rgba(139,92,246,0.08)" : "transparent",
                textDecoration: "none",
                borderLeft: on ? "2px solid #8b5cf6" : "2px solid transparent",
                transition: "all 150ms ease",
                animationDelay: `${i * 40}ms`,
              }}>
                {label}
                {on && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                )}
              </a>
            );
          })}
          <a href="https://x.com/_devTimmy" target="_blank" rel="noreferrer" onClick={close} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "16px 16px", borderRadius: 14,
            fontSize: 22, fontWeight: 900, letterSpacing: -0.5,
            color: "#3f3f46", textDecoration: "none",
            borderLeft: "2px solid transparent",
          }}>
            @_devTimmy
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
          </a>
        </nav>

        <div style={{ padding: "20px 24px 48px" }}>
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 16 }} />
          <p style={{ fontSize: 11, color: "#27272a", fontWeight: 700 }}>
            © {year} Timmy · @_devTimmy
          </p>
        </div>
      </div>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1);    opacity: 1;    }
          14%       { transform: scale(1.35); opacity: 1;    }
          28%       { transform: scale(1);    opacity: 1;    }
          42%       { transform: scale(1.2);  opacity: 0.85; }
          70%       { transform: scale(1);    opacity: 1;    }
        }
      `}</style>
    </>
  );
}
