import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6 text-center">
      {/* Terminal block */}
      <div className="terminal mb-8 w-full max-w-xs text-left text-sm">
        <div>
          <span className="prompt">$ </span>
          <span className="text-[#F8FAFC]">navigate /404</span>
        </div>
        <div className="output mt-1">→ route not found</div>
        <div className="output text-[#EF4444]">Error: 404</div>
      </div>

      <h1 className="text-6xl font-bold text-[#F8FAFC]">404</h1>
      <p className="mt-3 text-[#94A3B8]">This page doesn&apos;t exist.</p>

      <Link
        to="/"
        className="btn-primary mt-8"
      >
        Back to home
      </Link>
    </div>
  );
}
