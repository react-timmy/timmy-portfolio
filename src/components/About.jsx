

function XLogo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function About() {
  return (
    <section
      id="about"
      style={{
        background: "#000000",
        padding: "48px 0",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>

        {/* Bio */}
        <h2
          style={{
            color: "#ffffff",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: -0.5,
            lineHeight: 1.3,
            marginBottom: 20,
          }}
        >
          About Me
        </h2>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#a1a1aa", marginBottom: 16 }}>
          I build <span style={{ color: "#ffffff", fontWeight: 600 }}> web</span> and{" "}
          <span style={{ color: "#ffffff", fontWeight: 600 }}>mobile</span> apps, write my thoughts on  {" "}
          <span style={{ color: "#ffffff", fontWeight: 600 }}>dev and web3</span> related topics on <XLogo size={14} />, and write contexts for AI Images. Full-stack by day, curious about everything else by night.
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#a1a1aa", marginBottom: 16 }}>
          I take your idea from concept to a <span style={{ color: "#ffffff", fontWeight: 700 }}>live, working product</span> – web, mobile, or AI-powered. Fast.
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#a1a1aa", marginBottom: 16 }}>
          My stack is React, React Native, Node.js, TypeScript, and whatever AI API gets the job
          done. I work end-to-end – design unique UI's – and I move fast because my workflow is
          terminal-first / IDE and AI-assisted.
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#a1a1aa" }}>
        It's not work if i have fun building it.
        </p>

        <blockquote style={{ marginTop: 20, fontStyle: 'italic', color: '#a1a1aa', borderLeft: '3px solid rgba(180, 0, 235, 0.2)', paddingLeft: 12 }}>
          always works → build in private, ship in public.
        </blockquote>

        <div style={{ marginTop: 32, display: "flex", gap: "16px" }}>
          <a
            href="https://docs.google.com/document/d/11YPc0iZDkAPnVsTcmnwcRGjGZD3MTgGq/edit?usp=sharing&ouid=116564858074555128815&rtpof=true&sd=true"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
          >
            <svg style={{ marginRight: 8 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            View Resume
          </a>
          <a
            href="/My_Resume.docx"
            download="Cole Timmy's Resume.docx"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              color: "#000000",
              padding: "10px 20px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg style={{ marginRight: 8 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Resume
          </a>
        </div>

      </div>
    </section>
  );
}
