

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
        padding: "96px 0",
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

      </div>
    </section>
  );
}
