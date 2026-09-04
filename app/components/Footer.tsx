"use client";

import { useEffect, useState } from "react";

const NAV_COLS = [
  {
    heading: "Site",
    links: [
      { label: "Projects",  href: "#projects"  },
      { label: "FilmSort",  href: "#filmsort"  },
      { label: "About",     href: "#about"     },
      { label: "Skills",    href: "#skills"    },
      { label: "Community", href: "#community" },
      { label: "Contact",   href: "#contact"   },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "X / Twitter", href: "https://x.com/_devTimmy"          },
      { label: "GitHub",      href: "https://github.com/react-timmy"   },
      { label: "LinkedIn",    href: "https://www.linkedin.com/in/devtimmy/" },
      { label: "Email",       href: "mailto:solodevtimmy@gmail.com"   },
    ],
  },
];

const SOCIAL = [
  {
    href: "https://github.com/react-timmy", label: "GitHub",
    svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>,
  },
  {
    href: "https://x.com/_devTimmy", label: "X",
    svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    href: "https://www.linkedin.com/in/devtimmy", label: "LinkedIn",
    svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM7.5 19h-2.5v-9h2.5v9zM6.25 8.71c-.8 0-1.45-.65-1.45-1.46 0-.8.65-1.45 1.45-1.45s1.45.65 1.45 1.45c0 .81-.65 1.46-1.45 1.46zM21 19h-2.5v-4.5c0-1.07-.02-2.44-1.49-2.44-1.49 0-1.72 1.16-1.72 2.36V19H13v-9h2.4v1.23h.03c.33-.63 1.13-1.29 2.33-1.29 2.49 0 2.95 1.64 2.95 3.77V19z"/></svg>,
  },
  {
    href: "mailto:solodevtimmy@gmail.com", label: "Email",
    svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  },
];

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  return (
    <footer style={{ background: "#000000", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 20px 32px" }}>

        {/* ── Top: brand + nav cols ─────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px 32px",
        }} className="sm:grid-cols-4">

          {/* Brand col — span 2 */}
          <div className="col-span-2">
            <div style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 35, fontWeight: 900, color: "#ffffff", letterSpacing: -0.5 }}>Timmy</p>
            </div>

            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#3f3f46", maxWidth: 300, marginBottom: 8 }}>
              Full-stack AI developer building practical web and mobile products from concept to production.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 8 }}>
              {SOCIAL.map(({ href, label, svg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={href.startsWith("mailto") ? undefined : "noreferrer"}
                  style={{
                    width: 36, height: 36, borderRadius: 9999,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#52525b", textDecoration: "none",
                    transition: "all 150ms ease",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(255,255,255,0.09)";
                    el.style.color = "#a1a1aa";
                    el.style.borderColor = "rgba(255,255,255,0.14)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(255,255,255,0.04)";
                    el.style.color = "#52525b";
                    el.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          {NAV_COLS.map(({ heading, links }) => (
            <div key={heading}>
              <p style={{
                fontSize: 10, fontWeight: 800,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#27272a", marginBottom: 16,
              }}>
                {heading}
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer" : undefined}
                      style={{ fontSize: 13, fontWeight: 600, color: "#3f3f46", textDecoration: "none", transition: "color 150ms ease" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#a1a1aa"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#3f3f46"; }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────── */}
        <div style={{
          marginTop: 48, paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: 8,
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#1c1c1e" }}>
            © {year ?? ''} Timmy · All rights reserved.
          </p>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#1c1c1e" }}>
            Built with Next.js · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
