import { useState } from "react";

const SOCIAL = [
  { label: "X / Twitter", handle: "@_devTimmy",           href: "https://x.com/_devTimmy",          color: "#ffffff" },
  { label: "GitHub",       handle: "@react-timmy",          href: "https://github.com/react-timmy",   color: "#a1a1aa" },
  { label: "Email",        handle: "cs@gmail.com", href: "mailto:colesustain00@gmail.com", color: "#8b5cf6" },
];

const PROJECT_TYPES = ["Web App", "Mobile App", "AI Integration", "Client Website", "Consulting / Review", "Collab / Open Source", "Other"];
const BUDGET_RANGES = ["< $500", "$500 – $1,500", "$1,500 – $5,000", "$5,000+", "Let's discuss"];

/* XLogo inline SVG */
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const ICONS = { "X / Twitter": XIcon, GitHub: GithubIcon, Email: EmailIcon };

const fieldStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  padding: "12px 14px",
  fontSize: 13,
  fontFamily: "inherit",
  color: "#ffffff",
  outline: "none",
  transition: "border-color 150ms ease",
};

export default function Contact() {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [type,    setType]    = useState("");
  const [budget,  setBudget]  = useState("");
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);
  const [focused, setFocused] = useState(null);

  const getBorderColor = (field) =>
    focused === field ? "rgba(139,92,246,0.45)" : "rgba(255,255,255,0.08)";

  function handleSubmit(e) {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact — ${name}${type ? ` · ${type}` : ""}`);
    const body = encodeURIComponent([
      `Message: ${message}`,
      "",
      `Project type: ${type || "—"}`,
      `Budget: ${budget || "—"}`,
      `From: ${name} <${email}>`,
    ].join("\n"));
    window.location.href = `mailto:colesustain00@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section id="contact" style={{ background: "#000000", padding: "96px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span className="section-label">Contact</span>
          <h2 style={{ color: "#ffffff" }}>Let&apos;s work together</h2>
          {/* shown on mobile only — desktop version lives in the sidebar */}
          <p className="contact-header-desc" style={{ marginTop: 10, maxWidth: 480, color: "#a1a1aa", fontSize: 16 }}>
            I read every message and reply within 24 hours. Got a project, collab, or question? 
          </p>
        </div>

        <div className="contact-layout">

          {/* ── Left sidebar — only visible on desktop ── */}
          <div className="contact-sidebar">
            <p style={{ fontSize: 15, lineHeight: 1.75, color: "#a1a1aa", marginBottom: 32 }}>
              I read every message and reply within 24 hours. Got a project, collab, or question? 
            </p>

            {/* Social links stacked */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {SOCIAL.map(({ label, handle, href, color }) => {
                const Icon = ICONS[label];
                return (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel={href.startsWith("mailto") ? undefined : "noreferrer"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 10,
                      textDecoration: "none",
                      transition: "border-color 150ms ease, background 150ms ease",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget;
                      el.style.borderColor = `${color}35`;
                      el.style.background = `${color}08`;
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget;
                      el.style.borderColor = "rgba(255,255,255,0.07)";
                      el.style.background = "rgba(255,255,255,0.03)";
                    }}
                  >
                    <div style={{
                      width: 34, height: 34,
                      borderRadius: 8,
                      background: `${color}12`,
                      border: `1px solid ${color}22`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color,
                      flexShrink: 0,
                    }}>
                      {Icon && <Icon />}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 800, color: "#ffffff", letterSpacing: -0.1 }}>{label}</p>
                      <p style={{ fontSize: 11, color: "#52525b", marginTop: 1 }}>{handle}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Availability terminal */}
            <div className="terminal" style={{ fontSize: 12 }}>
              <div style={{ marginBottom: 8 }}>
                <span className="prompt">$ </span>
                <span style={{ color: "#d4d4d8" }}>timmy --availability</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className="dot-pulse" style={{ background: "#4ade80" }} />
                <span style={{ color: "#4ade80", fontWeight: 700 }}>open · response ~24h</span>
              </div>
              <div className="dim" style={{ paddingLeft: 13 }}>timezone: WAT (UTC+1)</div>
              <div className="dim" style={{ paddingLeft: 13 }}>best: email or X DMs</div>
            </div>
          </div>

          {/* ── Right / main — form ── */}
          <div className="card" style={{ padding: "28px 28px" }}>
            {sent ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "32px 0", textAlign: "center" }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "rgba(139,92,246,0.1)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#ffffff", letterSpacing: -0.4 }}>Mail client opened</h3>
                <p style={{ fontSize: 14, color: "#71717a", maxWidth: 280 }}>
                  Your default mail app should open with the message pre-filled. Thanks for reaching out!
                </p>
                <button onClick={() => setSent(false)} className="btn-glass" style={{ marginTop: 8, fontSize: 12 }}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>

                {/* Name + Email */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#52525b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>
                      Name <span style={{ color: "#e50914" }}>*</span>
                    </label>
                    <input
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      required
                      autoComplete="name"
                      style={{ ...fieldStyle, borderColor: getBorderColor("name") }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#52525b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>
                      Email <span style={{ color: "#e50914" }}>*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="youremail@gmail.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      required
                      autoComplete="email"
                      style={{ ...fieldStyle, borderColor: getBorderColor("email") }}
                    />
                  </div>
                </div>

                {/* Project type + Budget — like LibraryView Sort/Filter row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#52525b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>Project type</label>
                    <div style={{ position: "relative" }}>
                      <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        onFocus={() => setFocused("type")}
                        onBlur={() => setFocused(null)}
                        style={{ ...fieldStyle, borderColor: getBorderColor("type"), appearance: "none", cursor: "pointer" }}
                      >
                        <option value="" disabled>Select type…</option>
                        {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="2.5" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><path d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#52525b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>Budget</label>
                    <div style={{ position: "relative" }}>
                      <select
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        onFocus={() => setFocused("budget")}
                        onBlur={() => setFocused(null)}
                        style={{ ...fieldStyle, borderColor: getBorderColor("budget"), appearance: "none", cursor: "pointer" }}
                      >
                        <option value="" disabled>Select range…</option>
                        {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="2.5" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><path d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#52525b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>
                    Message <span style={{ color: "#e50914" }}>*</span>
                  </label>
                  <textarea
                    placeholder="Tell me about what you're building…"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    rows={5}
                    required
                    style={{ ...fieldStyle, borderColor: getBorderColor("message"), resize: "none" }}
                  />
                </div>

                {/* Send — white primary like MediaCard play button */}
                <button type="submit" className="btn-primary" style={{ justifyContent: "center", marginTop: 4 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  Send Message
                </button>

                {/* Social + availability — mobile only (hidden on desktop via sidebar) */}
                <div className="contact-form-mobile-extras">
                  {/* Social links row — 3 cols inside the form card */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "10px",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    {SOCIAL.map(({ label, handle, href, color }) => {
                      const Icon = ICONS[label];
                      return (
                        <a
                          key={label}
                          href={href}
                          target={href.startsWith("mailto") ? undefined : "_blank"}
                          rel={href.startsWith("mailto") ? undefined : "noreferrer"}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 8,
                            padding: "14px 10px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 10,
                            textDecoration: "none",
                            transition: "border-color 150ms ease, background 150ms ease",
                            width: "100%",
                            boxSizing: "border-box",
                          }}
                          onMouseEnter={e => {
                            const el = e.currentTarget;
                            el.style.borderColor = `${color}35`;
                            el.style.background = `${color}08`;
                          }}
                          onMouseLeave={e => {
                            const el = e.currentTarget;
                            el.style.borderColor = "rgba(255,255,255,0.07)";
                            el.style.background = "rgba(255,255,255,0.03)";
                          }}
                        >
                          <div style={{
                            width: 32, height: 32,
                            borderRadius: 8,
                            background: `${color}12`,
                            border: `1px solid ${color}22`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color,
                          }}>
                            {Icon && <Icon />}
                          </div>
                          <div style={{ textAlign: "center", minWidth: 0, width: "100%" }}>
                            <p style={{ fontSize: 11, fontWeight: 800, color: "#ffffff", letterSpacing: -0.1 }}>{label}</p>
                            <p style={{ fontSize: 10, color: "#52525b", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{handle}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>

                  {/* Availability terminal — inline below social row */}
                  <div className="terminal" style={{ fontSize: 12, marginTop: 10 }}>
                    <div style={{ marginBottom: 8 }}>
                      <span className="prompt">$ </span>
                      <span style={{ color: "#d4d4d8" }}>timmy --availability</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span className="dot-pulse" style={{ background: "#4ade80" }} />
                      <span style={{ color: "#4ade80", fontWeight: 700 }}>open · response ~24h</span>
                    </div>
                    <div className="dim" style={{ paddingLeft: 13 }}>timezone: WAT (UTC+1)</div>
                    <div className="dim" style={{ paddingLeft: 13 }}>best: email or X DMs</div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
