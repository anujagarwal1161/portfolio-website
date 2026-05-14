/** Replace with your real links before shipping. */
export const SITE = {
  name: "Anuj Agarwal",
  title: "Anuj Agarwal — Software Engineer",
  description:
    "Senior software engineer: distributed systems, AI infrastructure, and high-performance web. Open to senior roles and technical partnerships.",
  /** Replace YOUR_DOMAIN in public/sitemap.xml when you deploy. */
  canonicalExample: "https://YOUR_DOMAIN",
  ogImage: "/og-image-placeholder.svg",
  timezone: "UTC−5 (US Eastern) · typical reply within 24h",
  calendlyUrl: "https://calendly.com/your-username/30min",
  /** Appends embed=true for iframe; override with full URL if needed */
  get calendlyEmbedUrl() {
    const u = this.calendlyUrl;
    return u.includes("?") ? `${u}&embed=true` : `${u}?embed=true`;
  },
  resumePath: "/resume.pdf",
  githubUser: "anujagarwal1161/",
  linkedInPath: "https://www.linkedin.com/in/anujagarwal900/",
  featuredReadmeUrl: "https://github.com/anujagarwal/featured-project",
  /** Set REACT_APP_PLAUSIBLE_DOMAIN=mydomain.com to load Plausible analytics */
  plausibleDomain: process.env.REACT_APP_PLAUSIBLE_DOMAIN || "",
};
