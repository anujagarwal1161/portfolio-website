import { Link, useParams } from "react-router-dom";
import SubpageLayout from "../components/SubpageLayout";
import { useSEO } from "../hooks/useSEO";
import { BLOG_POSTS } from "../data/content";

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useSEO({
    title: post ? `${post.title} — Dev Folio` : "Post — Dev Folio",
    description: post?.excerpt || "",
    path: post ? `/blog/${post.slug}` : "/blog",
  });

  if (!post) {
    return (
      <SubpageLayout>
        <main style={{ padding: "80px max(40px, 8vw)" }}>
          <p>Post not found.</p>
          <Link to="/blog" style={{ color: "#5eead4" }}>← Blog</Link>
        </main>
      </SubpageLayout>
    );
  }

  const paragraphs = post.body.split(/\n\n+/);

  return (
    <SubpageLayout>
      <article style={{ padding: "40px max(40px, 8vw) 100px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: "#5eead4", marginBottom: 12 }}>
          <Link to="/blog" style={{ color: "#5eead4", textDecoration: "none" }}>/BLOG</Link>
        </p>
        <time style={{ fontSize: 12, color: "#64748b" }}>{post.date}</time>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px,4vw,36px)", fontWeight: 800, margin: "12px 0 24px", lineHeight: 1.2 }}>
          {post.title}
        </h1>
        {paragraphs.map((para, i) => (
          <p key={i} style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.85, marginBottom: 20 }}>
            {para.trim()}
          </p>
        ))}
        <p style={{ marginTop: 48 }}>
          <Link to="/blog" style={{ color: "#5eead4", fontSize: 12 }}>
            ← All posts
          </Link>
        </p>
      </article>
    </SubpageLayout>
  );
}
