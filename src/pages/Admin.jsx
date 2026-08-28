import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#000000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      textAlign: "center",
    }}>
      {/* Terminal block */}
      <div style={{
        background: "#0b0b0b",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "20px 24px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        textAlign: "left",
        width: "100%",
        maxWidth: 340,
        marginBottom: 32,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "#27272a",
          boxShadow: "14px 0 0 #27272a, 28px 0 0 #27272a",
          marginBottom: 14,
        }} />
        <div style={{ marginBottom: 6 }}>
          <span style={{ color: "var(--accent-primary)" }}>$ </span>
          <span style={{ color: "#d4d4d8" }}>navigate /admin</span>
        </div>
        <div style={{ color: "var(--accent-primary)" }}>→ Authentication required</div>
        <div style={{ color: "#52525b", marginTop: 4 }}>→ Phase 3 · Coming soon</div>
      </div>

      <h1 style={{
        fontSize: "clamp(2rem, 5vw, 3rem)",
        fontWeight: 900,
        color: "#ffffff",
        letterSpacing: -0.04,
        marginBottom: 12,
        fontFamily: "Inter, sans-serif",
      }}>
        Admin
      </h1>
      <p style={{
        fontSize: 15,
        color: "#52525b",
        maxWidth: 320,
        lineHeight: 1.7,
        fontFamily: "Inter, sans-serif",
        marginBottom: 28,
      }}>
        The admin dashboard is under construction. Project management, auth, and CMS features arriving in Phase 3.
      </p>

      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 22px",
          borderRadius: 9999,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#a1a1aa",
          textDecoration: "none",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "Inter, sans-serif",
          transition: "all 150ms ease",
        }}
      >
        ← Back to portfolio
      </Link>
    </div>
  );
}
