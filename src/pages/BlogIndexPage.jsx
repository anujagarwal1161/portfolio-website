import { Link } from "react-router-dom";
import SubpageLayout from "../components/SubpageLayout";
import { useSEO } from "../hooks/useSEO";
import { BLOG_POSTS } from "../data/content";

export default function BlogIndexPage() {
  useSEO({
    title: "Blog — Dev Folio",
    description: "Notes on reliability, inference, and how teams ship.",
    path: "/blog",
  });

  return (
    <SubpageLayout>
      <main style={{ padding: "40px max(40px, 8vw) 80px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: "#5eead4", marginBottom: 12 }}>/BLOG</p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px,5vw,40px)", fontWeight: 800, marginBottom: 16 }}>
          Writing
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8, marginBottom: 48 }}>
          Short posts you can skim between meetings — replace with your own topics anytime.
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {BLOG_POSTS.map((post) => (
            <li key={post.slug} style={{ marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <time style={{ fontSize: 11, color: "#64748b" }}>{post.date}</time>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, margin: "8px 0 10px" }}>
                <Link to={`/blog/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                  {post.title}
                </Link>
              </h2>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, marginBottom: 12 }}>{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} style={{ color: "#5eead4", fontSize: 12 }}>
                Read →
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/" style={{ color: "#5eead4", fontSize: 12 }}>
          ← Back home
        </Link>
      </main>
    </SubpageLayout>
  );
}
