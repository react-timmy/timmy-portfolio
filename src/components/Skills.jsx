/* Skills — styled like FilmSort LibraryView filter tab + type-pill system */

const GROUPS = [
  { label: "Languages",  skills: ["JavaScript", "TypeScript", "HTML", "CSS", "SQL"] },
  { label: "Frontend",   skills: ["React", "Next.js", "Vite", "Tailwind CSS"] },
  { label: "Backend",    skills: ["Node.js", "Express", "REST APIs", "MERN"] },
  { label: "Mobile",     skills: ["React Native", "Expo", "EAS Build", "Android"] },
  { label: "Databases",  skills: ["MongoDB", "PostgreSQL", "Supabase", "Firebase"] },
  { label: "AI & APIs",  skills: ["Gemini API", "OpenRouter", "NVIDIA AI", "TMDB API"] },
  { label: "Deployment", skills: ["Vercel", "Railway", "GitHub Actions", "EAS"] },
  { label: "Workflow",   skills: ["Git", "Terminal-first", "Termux", "Linux Mint", "AI CLIs"] },
];

export default function Skills() {
  return (
    <section
      id="skills"
      style={{
        background: "#0b0b0b",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "96px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ marginBottom: 48 }}>
          <span className="section-label">Skills</span>
          <h2 style={{ color: "#ffffff" }}>Stack &amp; Tools</h2>
          <p style={{ marginTop: 10, maxWidth: 480, color: "#a1a1aa", fontSize: 16 }}>
            Everything I reach for to ship production-ready web, mobile, and AI products.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {GROUPS.map(({ label, skills }) => (
            <div
              key={label}
              className="card"
              style={{ padding: "18px 18px 16px" }}
            >
              {/* Category header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div
                  style={{
                    width: 18,
                    height: 4,
                    borderRadius: 2,
                    background: "#8b5cf6",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#a78bfa",
                  }}
                >
                  {label}
                </span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {skills.map(skill => (
                  <span
                    key={skill}
                    style={{
                      padding: "4px 9px",
                      borderRadius: 9999,
                      fontSize: 10,
                      fontWeight: 700,
                      background: "rgba(139,92,246,0.07)",
                      border: "1px solid rgba(139,92,246,0.15)",
                      color: "#a1a1aa",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
