import { Link } from "react-router-dom";
import SubpageLayout from "../components/SubpageLayout";
import { useSEO } from "../hooks/useSEO";
import { USES_STACK } from "../data/content";

export default function UsesPage() {
  useSEO({
    title: "Uses — Dev Folio",
    description: "Hardware, software, and day-to-day tools.",
    path: "/uses",
  });

  const section = (title, items) => (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, letterSpacing: 4, color: "#5eead4", marginBottom: 20, textTransform: "uppercase" }}>{title}</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((it) => (
          <li key={it.name} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontWeight: 700, color: "inherit", marginBottom: 4 }}>{it.name}</div>
            {it.note && <div style={{ fontSize: 12, color: "#64748b" }}>{it.note}</div>}
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <SubpageLayout>
      <main style={{ padding: "40px max(40px, 8vw) 80px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: "#5eead4", marginBottom: 12 }}>/USES</p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px,5vw,40px)", fontWeight: 800, marginBottom: 16, lineHeight: 1.15 }}>
          Tools & setup
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8, marginBottom: 40 }}>
          What I actually use to ship. Swap in your gear — this page is meant to be personal, not performative.
        </p>
        {section("Hardware", USES_STACK.hardware)}
        {section("Software", USES_STACK.software)}
        <section>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, letterSpacing: 4, color: "#5eead4", marginBottom: 20, textTransform: "uppercase" }}>This site</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {USES_STACK.stack.map((s) => (
              <span key={s} style={{ fontSize: 11, padding: "6px 14px", border: "1px solid rgba(94,234,212,0.25)", borderRadius: 2, color: "#94a3b8" }}>
                {s}
              </span>
            ))}
          </div>
        </section>
        <p style={{ marginTop: 48 }}>
          <Link to="/" style={{ color: "#5eead4", fontSize: 12 }}>
            ← Back home
          </Link>
        </p>
      </main>
    </SubpageLayout>
  );
}
