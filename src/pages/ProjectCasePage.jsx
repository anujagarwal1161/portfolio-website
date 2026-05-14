import { Link, useParams } from "react-router-dom";
import SubpageLayout from "../components/SubpageLayout";
import { useSEO } from "../hooks/useSEO";
import { PROJECTS } from "../data/content";

export default function ProjectCasePage() {
  const { slug } = useParams();
  const project = PROJECTS.find((p) => p.slug === slug);
  const cs = project?.caseStudy;

  useSEO({
    title: project ? `${project.title} — Case study` : "Project — Dev Folio",
    description: project?.desc || "",
    path: project ? `/projects/${project.slug}` : "/projects",
  });

  if (!project || !cs) {
    return (
      <SubpageLayout>
        <main style={{ padding: "80px max(40px, 8vw)" }}>
          <p style={{ marginBottom: 16 }}>Project not found.</p>
          <Link to="/#projects" style={{ color: "#5eead4" }}>← Projects</Link>
        </main>
      </SubpageLayout>
    );
  }

  return (
    <SubpageLayout>
      <article style={{ padding: "40px max(40px, 8vw) 100px", maxWidth: 800, margin: "0 auto" }}>
        <p style={{ fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>
          <Link to="/" style={{ color: "#5eead4", textDecoration: "none" }}>HOME</Link>
          <span style={{ color: "#475569", margin: "0 8px" }}>/</span>
          <span style={{ color: project.color }}>{project.tag}</span>
        </p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px,5vw,44px)", fontWeight: 800, marginBottom: 8, color: "inherit" }}>
          {project.title}
        </h1>
        <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 8 }}>{cs.headline}</p>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 40 }}>{project.year}</p>

        <div
          style={{
            height: 200,
            borderRadius: 8,
            marginBottom: 40,
            background: `linear-gradient(135deg, ${project.color}22, rgba(15,23,42,0.8))`,
            border: `1px solid ${project.color}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748b",
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Screenshot / diagram placeholder
        </div>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, letterSpacing: 3, color: "#5eead4", marginBottom: 12, textTransform: "uppercase" }}>Problem</h2>
          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8 }}>{cs.problem}</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, letterSpacing: 3, color: "#5eead4", marginBottom: 12, textTransform: "uppercase" }}>Approach</h2>
          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8 }}>{cs.approach}</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, letterSpacing: 3, color: "#5eead4", marginBottom: 12, textTransform: "uppercase" }}>Results</h2>
          <ul style={{ margin: 0, paddingLeft: 20, color: "#94a3b8", lineHeight: 1.9 }}>
            {cs.metrics.map((m) => (
              <li key={m} style={{ marginBottom: 8 }}>{m}</li>
            ))}
          </ul>
        </section>
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, letterSpacing: 3, color: "#5eead4", marginBottom: 12, textTransform: "uppercase" }}>Architecture</h2>
          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8 }}>{cs.architecture}</p>
        </section>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
          {project.stack.map((s) => (
            <span key={s} style={{ fontSize: 11, padding: "5px 12px", border: `1px solid ${project.color}40`, color: project.color, borderRadius: 2 }}>
              {s}
            </span>
          ))}
        </div>
        <Link to="/#projects" style={{ color: "#5eead4", fontSize: 13 }}>
          ← All projects
        </Link>
      </article>
    </SubpageLayout>
  );
}
