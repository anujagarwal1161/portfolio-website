import { Link } from "react-router-dom";
import SubpageLayout from "../components/SubpageLayout";
import { useSEO } from "../hooks/useSEO";

export default function NotFoundPage() {
  useSEO({
    title: "404 — Dev Folio",
    description: "Page not found.",
    path: "/404",
  });

  return (
    <SubpageLayout>
      <main style={{ padding: "120px max(40px, 8vw)", textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(48px,12vw,96px)", fontWeight: 800, color: "#5eead4", marginBottom: 16, lineHeight: 1 }}>
          404
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", marginBottom: 32, lineHeight: 1.6 }}>
          This route is not deployed in this universe. The home page still has all the good stuff.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "14px 28px",
            border: "1px solid rgba(94,234,212,0.5)",
            color: "#5eead4",
            textDecoration: "none",
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Beam me home
        </Link>
      </main>
    </SubpageLayout>
  );
}
