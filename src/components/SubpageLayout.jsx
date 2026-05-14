import { Link } from "react-router-dom";
import OceanAtmosphere from "../OceanAtmosphere";
import { useScrollY } from "../hooks/useScrollY";
import { useTheme } from "../context/ThemeContext";
import { SITE } from "../siteConfig";

export default function SubpageLayout({ children }) {
  const scrollY = useScrollY();
  const { theme, toggleTheme } = useTheme();
  const oceanOp = theme === "light" ? 0.4 : 1;
  const bg = theme === "light" ? "#e8f4fc" : "#020814";
  const text = theme === "light" ? "#0f172a" : "#e2e8f0";
  const navBg = theme === "light" ? "rgba(248,250,252,0.92)" : "rgba(6,11,20,0.9)";
  const navBorder = theme === "light" ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.06)";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "'Space Mono', monospace", position: "relative", overflowX: "hidden" }}>
      <OceanAtmosphere scrollY={scrollY} overlayOpacity={oceanOp} />
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 max(24px, 4vw)",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: navBg,
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${navBorder}`,
        }}
      >
        <Link
          to="/"
          style={{
            color: "#5eead4",
            textDecoration: "none",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: 3,
          }}
        >
          {SITE.name}
        </Link>
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Link to="/blog" style={{ color: theme === "light" ? "#475569" : "#94a3b8", textDecoration: "none", fontSize: 11, letterSpacing: 2 }}>
            Blog
          </Link>
          <Link to="/uses" style={{ color: theme === "light" ? "#475569" : "#94a3b8", textDecoration: "none", fontSize: 11, letterSpacing: 2 }}>
            Uses
          </Link>
          <a href={SITE.resumePath} download style={{ color: theme === "light" ? "#475569" : "#94a3b8", textDecoration: "none", fontSize: 11, letterSpacing: 2 }}>
            Résumé
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              background: "transparent",
              border: "1px solid rgba(94,234,212,0.45)",
              color: "#5eead4",
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontFamily: "inherit",
            }}
          >
            {theme === "dark" ? "Day" : "Night"}
          </button>
        </div>
      </nav>
      <div style={{ position: "relative", zIndex: 1, paddingTop: 80 }}>{children}</div>
    </div>
  );
}
