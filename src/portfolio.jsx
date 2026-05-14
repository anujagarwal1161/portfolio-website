// ── Portfolio v2 — Full animation upgrade ──
// New additions vs v1:
//   • Canvas particle network with connecting lines
//   • Matrix rain canvas overlay
//   • Typing text animation (cycles through specializations)
//   • Animated number counters in hero stats
//   • Custom dual-ring animated logo in nav
//   • Nav link animated underline on hover
//   • Cursor dot + glow (two-layer)
//   • Skill bar shine sweep after fill
//   • Skill bar neon glow on hover
//   • Project card corner accent brackets
//   • Project card dual scanning borders (top + left)
//   • Click ripple effect on project cards
//   • Contact links slide-right on hover
//   • Section labels with animated scan reveal
//   • Three ambient orb layers
//   • Scroll-triggered counter animation
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import OceanAtmosphere from "./OceanAtmosphere";
import { useScrollY } from "./hooks/useScrollY";
import { useTheme } from "./context/ThemeContext";
import { useSEO } from "./hooks/useSEO";
import { SITE } from "./siteConfig";
import { SKILLS, PROJECTS, TIMELINE, IMPACT_LINES, TESTIMONIALS } from "./data/content";
import { hapticTap } from "./utils/haptic";

const NAV_LINKS = ["About", "Skills", "Projects", "Contact"];

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

/** Per-character 3D “roll” reveal (rotateX). */
function RollingLine({ text, className = "", style = {}, charDelay = 0.045, baseDelay = 0, color }) {
  const chars = [...text];
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        perspective: 800,
        lineHeight: 1.05,
        ...style,
      }}
    >
      {chars.map((ch, i) => (
        <span
          key={`${i}-${ch}`}
          style={{
            display: ch === " " ? "inline" : "inline-block",
            color: color || undefined,
            animation: "rollInChar 0.75s cubic-bezier(0.22, 1, 0.36, 1) both",
            animationDelay: `${baseDelay + i * charDelay}s`,
            transformOrigin: "50% 100%",
          }}
        >
          {ch === " " ? "\u00a0" : ch}
        </span>
      ))}
    </span>
  );
}

/** Rolling line only after the block enters the viewport (so recruiters see it play). */
function RollingLineReveal({ text, reducedMotion, charDelay = 0.05, baseDelay = 0, color, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, 0.12);
  if (reducedMotion) {
    return (
      <span ref={ref} className={className} style={{ color, ...style }}>
        {text}
      </span>
    );
  }
  return (
    <span ref={ref} className={className} style={style}>
      {inView ? (
        <RollingLine text={text} charDelay={charDelay} baseDelay={baseDelay} color={color} />
      ) : (
        <span style={{ opacity: 0, userSelect: "none" }} aria-hidden="true">
          {text}
        </span>
      )}
    </span>
  );
}

/** Words pop in with a slight 3D roll — great for taglines and blurbs. */
function WordStagger({ text, reducedMotion, wordDelay = 0.035, baseDelay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, 0.08);
  const parts = text.split(/(\s+)/);
  return (
    <span ref={ref} style={{ ...style, lineHeight: 1.65 }}>
      {parts.map((part, i) => (
        <span
          key={i}
          style={{
            display: part.trim() === "" ? "inline" : "inline-block",
            marginRight: part === " " ? 0 : undefined,
            animation: reducedMotion || !inView ? "none" : "wordPop 0.62s cubic-bezier(0.22, 1, 0.36, 1) both",
            animationDelay: reducedMotion ? 0 : `${baseDelay + i * wordDelay}s`,
            transformOrigin: "50% 100%",
          }}
        >
          {part}
        </span>
      ))}
    </span>
  );
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

/** Cyberpunk-style decode into final string when in view. */
function ScrambleReveal({ text, reducedMotion, durationMs = 900, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, 0.12);
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (reducedMotion || !inView) {
      setOut(text);
      return;
    }
    const len = text.length;
    const steps = Math.max(12, Math.floor(durationMs / 40));
    let step = 0;
    const id = setInterval(() => {
      step++;
      const progress = step / steps;
      let s = "";
      for (let i = 0; i < len; i++) {
        const ch = text[i];
        if (ch === " " || ch === "\n") {
          s += ch;
          continue;
        }
        if (i / len < progress - 0.08) s += ch;
        else s += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      setOut(s);
      if (step >= steps) {
        clearInterval(id);
        setOut(text);
      }
    }, 40);
    return () => clearInterval(id);
  }, [inView, text, durationMs, reducedMotion]);

  return (
    <span ref={ref} className={className} style={style}>
      {out}
    </span>
  );
}

function CountUpNumber({ target, suffix = "", active, reducedMotion, delay = 0 }) {
  const [n, setN] = useState(reducedMotion ? target : 0);

  useEffect(() => {
    if (!active) {
      setN(reducedMotion ? target : 0);
      return;
    }
    if (reducedMotion) {
      setN(target);
      return;
    }
    setN(0);
    const startAt = performance.now() + delay * 1000;
    const dur = 1000;
    let raf = 0;
    const tick = (now) => {
      if (now < startAt) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min((now - startAt) / dur, 1);
      const eased = 1 - (1 - t) ** 2.8;
      setN(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, reducedMotion, delay]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}

/** Auto 360°-style rotation + mouse parallax on a browser mock “site”. */
function WebsiteShowcase360({ reducedMotion }) {
  const rootRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ rx: 0, ry: 0 });
  const [autoTilt, setAutoTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    let id = 0;
    const loop = () => {
      if (!hover) {
        const t = performance.now();
        setAutoTilt({
          rx: Math.sin(t / 2600) * 7,
          ry: (t * 0.0175) % 360,
        });
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [reducedMotion, hover]);

  const onMove = (e) => {
    const el = rootRef.current;
    if (!el || reducedMotion) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    setMouseTilt({ rx: -y * 18, ry: x * 32 });
  };

  const rx = reducedMotion ? 4 : hover ? mouseTilt.rx : autoTilt.rx;
  const ry = reducedMotion ? -18 : hover ? mouseTilt.ry : autoTilt.ry;

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setMouseTilt({ rx: 0, ry: 0 }); }}
      onMouseMove={onMove}
      style={{
        width: "100%",
        maxWidth: 520,
        minHeight: 340,
        margin: "0 auto",
        perspective: 1300,
        cursor: hover ? "grab" : "default",
      }}
    >
      <div
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`,
          transition: hover ? "transform 0.12s ease-out" : "transform 0.35s ease-out",
          willChange: "transform",
        }}
      >
        <div
          style={{
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid rgba(94,234,212,0.35)",
            boxShadow: `
              0 4px 0 rgba(0,0,0,0.35),
              0 25px 60px rgba(0,40,80,0.45),
              0 0 40px rgba(0,255,231,0.12),
              inset 0 1px 0 rgba(255,255,255,0.08)
            `,
            background: "linear-gradient(165deg, rgba(15,25,40,0.95) 0%, rgba(6,12,24,0.98) 100%)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.15) 100%)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.85 }} />
              ))}
            </div>
            <div
              style={{
                flex: 1,
                fontSize: 10,
                color: "#64748b",
                padding: "5px 10px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.06)",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: 0.5,
              }}
            >
              <span style={{ color: "#5eead4" }}>https://anujcodes.netlify.app/</span>
            </div>
          </div>
          <div style={{ padding: 14, minHeight: 260, position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(0,200,220,0.12), transparent 55%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#e2e8f0" }}>Ship faster</span>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: 2,
                  color: "#5eead4",
                  padding: "4px 10px",
                  border: "1px solid rgba(94,234,212,0.35)",
                  borderRadius: 4,
                }}
              >
                LIVE
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div style={{ height: 72, borderRadius: 8, background: "linear-gradient(135deg, rgba(0,255,231,0.15), rgba(191,0,255,0.1))", border: "1px solid rgba(255,255,255,0.06)" }} />
              <div style={{ height: 72, borderRadius: 8, background: "linear-gradient(225deg, rgba(59,130,246,0.2), rgba(0,255,200,0.08))", border: "1px solid rgba(255,255,255,0.06)" }} />
            </div>
            <div style={{ height: 10, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 8, width: "72%" }} />
            <div style={{ height: 10, borderRadius: 4, background: "rgba(255,255,255,0.04)", marginBottom: 8, width: "88%" }} />
            <div style={{ height: 10, borderRadius: 4, background: "rgba(255,255,255,0.04)", width: "54%" }} />
            <div
              style={{
                marginTop: 16,
                height: 56,
                borderRadius: 8,
                background: "linear-gradient(90deg, rgba(0,255,231,0.08), rgba(0,80,120,0.2), rgba(191,0,255,0.08))",
                border: "1px solid rgba(94,234,212,0.15)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.03) 6px, rgba(255,255,255,0.03) 7px)",
                  opacity: 0.5,
                }}
              />
            </div>
          </div>
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "78%",
            width: "72%",
            height: 24,
            transform: "translateX(-50%) translateZ(-80px) rotateX(90deg)",
            background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
            filter: "blur(12px)",
            pointerEvents: "none",
          }}
        />
      </div>
      {!reducedMotion && (
        <p
          style={{
            textAlign: "center",
            fontSize: 9,
            letterSpacing: 3,
            color: "#475569",
            marginTop: 16,
            textTransform: "uppercase",
          }}
        >
          Move cursor · auto orbit
        </p>
      )}
    </div>
  );
}

function TechMarquee({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-wrap" style={{ marginTop: 28, marginBottom: 8 }}>
      <div className="marquee-track">
        {doubled.map((t, i) => (
          <span key={`${t}-${i}`} className="marquee-item">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function RevealBlock({ children, delay = 0, variant = "tilt" }) {
  const ref = useRef(null);
  const inView = useInView(ref, 0.12);
  const hidden =
    variant === "slideLeft"
      ? "perspective(1200px) rotateY(-14deg) translateX(-48px) scale(0.98)"
      : variant === "slideRight"
        ? "perspective(1200px) rotateY(14deg) translateX(48px) scale(0.98)"
        : "perspective(1200px) rotateX(12deg) translateY(42px) scale(0.985)";
  const shown =
    variant === "slideLeft" || variant === "slideRight"
      ? "perspective(1200px) rotateY(0deg) translateX(0) scale(1)"
      : "perspective(1200px) rotateX(0deg) translateY(0) scale(1)";
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? shown : hidden,
        transition: `opacity 0.95s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.95s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        transformOrigin: "50% 0%",
      }}
    >
      {children}
    </div>
  );
}

function SkillBar({ name, level, category, delay, reducedMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      style={{
        marginBottom: 20,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0) rotateX(0deg)" : "translateX(-28px) rotateX(8deg)",
        transformOrigin: "0% 50%",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        perspective: 800,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "#a0aec0", fontFamily: "'Space Mono', monospace" }}>
          <span style={{ color: "#00ffe7", marginRight: 8 }}>▸</span>
          {inView ? (
            reducedMotion ? name : <RollingLine text={name} charDelay={0.028} baseDelay={delay + 0.05} />
          ) : (
            <span style={{ opacity: 0 }}>{name}</span>
          )}
        </span>
        <span style={{ fontSize: 12, color: "#4a5568", fontFamily: "'Space Mono', monospace" }}>
          <CountUpNumber target={level} suffix="%" active={inView} reducedMotion={reducedMotion} delay={delay + 0.15} />
        </span>
      </div>
      <div style={{ height: 2, background: "#0d1117", borderRadius: 2, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, #00ffe720)", animation: "scanline 2s linear infinite" }} />
        <div style={{
          height: "100%", background: `linear-gradient(90deg, #00ffe7, #bf00ff)`,
          width: inView ? `${level}%` : "0%",
          transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${delay + 0.2}s`,
          boxShadow: "0 0 8px #00ffe780",
          borderRadius: 2,
        }} />
      </div>
    </div>
  );
}

function ProjectCard({ project, index, reducedMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const showRoll = inView && !reducedMotion;

  const onCardMove = (e) => {
    if (reducedMotion) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    setTilt({ rx: -y * 9, ry: x * 11 });
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s`,
        perspective: reducedMotion ? "none" : "1000px",
        position: "relative",
      }}
    >
      <Link
        to={`/projects/${project.slug}`}
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
        onClick={hapticTap}
      >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ rx: 0, ry: 0 }); }}
        onMouseMove={onCardMove}
        style={{
          transform: reducedMotion
            ? "none"
            : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.18s ease-out, border 0.3s, background 0.3s, box-shadow 0.3s",
          background: hovered ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
          border: `1px solid ${hovered ? project.color + "60" : "#ffffff12"}`,
          borderRadius: 2,
          padding: "28px 28px 24px",
          cursor: "pointer",
          boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.35), 0 0 24px ${project.color}20, inset 0 0 40px ${project.color}05` : "0 8px 24px rgba(0,0,0,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {hovered && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`, animation: "slideRight 1.5s linear infinite" }} />}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: project.color, fontFamily: "'Space Mono', monospace", letterSpacing: 3, marginBottom: 8, textTransform: "uppercase" }}>
              {showRoll ? (
                <RollingLine text={project.tag} charDelay={0.04} baseDelay={index * 0.08 + 0.1} />
              ) : (
                project.tag
              )}
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Syne', sans-serif", margin: 0, lineHeight: 1.15 }}>
              {showRoll ? (
                <RollingLine text={project.title} charDelay={0.045} baseDelay={index * 0.08 + 0.22} />
              ) : (
                project.title
              )}
            </h3>
          </div>
          <span style={{ fontSize: 11, color: "#4a5568", fontFamily: "'Space Mono', monospace" }}>
            {showRoll ? <RollingLine text={project.year} charDelay={0.07} baseDelay={index * 0.08 + 0.35} /> : project.year}
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#718096", lineHeight: 1.7, margin: "0 0 20px", fontFamily: "'Space Mono', monospace" }}>
          <WordStagger text={project.desc} reducedMotion={reducedMotion} wordDelay={0.025} baseDelay={index * 0.06 + 0.2} />
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {project.stack.map((s, j) => (
            <span
              key={s}
              style={{
                fontSize: 10,
                padding: "4px 11px",
                border: `1px solid ${project.color}35`,
                color: project.color,
                borderRadius: 2,
                fontFamily: "'Space Mono', monospace",
                letterSpacing: 1,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0) rotateX(0deg)" : "translateY(14px) rotateX(42deg)",
                transition: `opacity 0.45s ease ${j * 0.07 + 0.4}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${j * 0.07 + 0.4}s`,
                transformOrigin: "50% 100%",
              }}
            >
              {s}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 10, letterSpacing: 2, color: project.color, marginTop: 16, marginBottom: 0, opacity: 0.85 }}>
          View Project →
        </p>
      </div>
      </Link>
    </div>
  );
}

function SectionLabel({ label, reducedMotion }) {
  const lineRef = useRef(null);
  const lineInView = useInView(lineRef, 0.05);
  return (
    <div ref={lineRef} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", textShadow: "0 0 20px rgba(0, 200, 200, 0.25)", flexShrink: 0 }}>
        <RollingLineReveal text={label} reducedMotion={reducedMotion} charDelay={0.055} baseDelay={0} color="#5eead4" />
      </span>
      <div
        style={{
          flex: 1,
          height: 2,
          borderRadius: 1,
          background: "rgba(255,255,255,0.06)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="section-label-shine"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent, rgba(94,234,212,0.85), rgba(0,255,231,0.5), transparent)",
            transform: lineInView ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s",
          }}
        />
      </div>
    </div>
  );
}

function CinematicSection({
  sectionRef,
  reducedMotion,
  children,
  background = "transparent",
  minHeight = "145vh",
  top = 86,
  intensity = 1,
}) {
  const localRef = useRef(null);
  const [motion, setMotion] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    opacity: 1,
    z: 0,
  });

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const update = () => {
      const el = localRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 900;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      const phase = progress * 2 - 1;
      const centerStrength = 1 - Math.min(1, Math.abs(phase));
      setMotion({
        rotateX: -phase * 8 * intensity,
        rotateY: Math.sin(progress * Math.PI * 2) * 2.8 * intensity,
        scale: 0.93 + centerStrength * 0.08,
        opacity: 0.46 + centerStrength * 0.54,
        z: -24 + centerStrength * 62,
      });
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion, intensity]);

  return (
    <section
      ref={(node) => {
        localRef.current = node;
        if (sectionRef) sectionRef.current = node;
      }}
      style={{
        minHeight,
        position: "relative",
        zIndex: 1,
        background,
        padding: "0 max(40px, 8vw)",
        perspective: 1800,
      }}
    >
      <div style={{ position: "sticky", top, paddingTop: 88, paddingBottom: 88 }}>
        <div
          style={{
            transform: reducedMotion
              ? "none"
              : `translateZ(${motion.z}px) rotateX(${motion.rotateX}deg) rotateY(${motion.rotateY}deg) scale(${motion.scale})`,
            transformStyle: "preserve-3d",
            opacity: reducedMotion ? 1 : motion.opacity,
            transition: "transform 0.15s linear, opacity 0.2s linear",
            willChange: "transform, opacity",
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

const MARQUEE_ITEMS = ["React", "TypeScript", "WebGL-ready UI", "Systems", "AI infra", "Edge", "Rust", "PostgreSQL", "Real-time", "Design × Code"];

function HeroStatsStrip({ reducedMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref, 0.15);
  const rows = [
    { target: 2, suffix: "+", label: "YEARS EXP" },
    { target: 20, suffix: "+", label: "PROJECTS" },
    { target: 1, suffix: "", label: "STARTUPS" },
  ];
  return (
    <div ref={ref} style={{ display: "flex", gap: 48, marginTop: 36, flexWrap: "wrap" }}>
      {rows.map((r, i) => (
        <div key={r.label}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#e2e8f0", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            <CountUpNumber target={r.target} suffix={r.suffix} active={inView} reducedMotion={reducedMotion} delay={i * 0.12} />
          </div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#4a5568", marginTop: 4 }}>
            <RollingLineReveal text={r.label} reducedMotion={reducedMotion} charDelay={0.038} baseDelay={i * 0.07 + 0.4} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillPillsRow({ labels, reducedMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref, 0.1);
  return (
    <div ref={ref} style={{ display: "flex", gap: 12, marginTop: 48, flexWrap: "wrap" }}>
      {labels.map((cat, i) => (
        <div
          key={cat}
          style={{
            border: "1px solid rgba(94,234,212,0.2)",
            borderRadius: 2,
            padding: "8px 18px",
            fontSize: 10,
            color: inView ? "#94a3b8" : "#4a5568",
            letterSpacing: 2,
            opacity: reducedMotion ? 1 : inView ? 1 : 0,
            animation: reducedMotion || !inView ? "none" : "skillPillRise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
            animationDelay: `${i * 0.11}s`,
            boxShadow: inView ? "0 0 20px rgba(0,255,231,0.06)" : "none",
            transition: "color 0.3s, box-shadow 0.4s",
          }}
        >
          {cat}
        </div>
      ))}
    </div>
  );
}

export default function Portfolio() {
  const scrollY = useScrollY();
  const reducedMotion = usePrefersReducedMotion();
  const { theme, toggleTheme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useSEO({
    title: SITE.title,
    description: SITE.description,
    path: "/",
    image: SITE.ogImage,
  });

  const oceanOp = theme === "light" ? 0.42 : 1;
  const pageBg = theme === "light" ? "#e8f4fc" : "#020814";
  const pageText = theme === "light" ? "#0f172a" : "#e2e8f0";
  const mutedNav = theme === "light" ? "#64748b" : "#718096";
  const navBarBg = theme === "light" ? "rgba(248,250,252,0.92)" : undefined;

  useEffect(() => {
    const upd = () => {
      const el = document.documentElement;
      const h = el.scrollHeight - el.clientHeight;
      setScrollProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    upd();
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    return () => {
      window.removeEventListener("scroll", upd);
      window.removeEventListener("resize", upd);
    };
  }, []);

  useEffect(() => {
    const onMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const scrollTo = (section) => {
    hapticTap();
    const refs = { About: aboutRef, Skills: skillsRef, Projects: projectsRef, Contact: contactRef };
    refs[section]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = () => {
    if (!formState.name || !formState.email) return;
    setSent(true);
  };

  const navBg = scrollY > 60;
  const viewportH = typeof window !== "undefined" ? window.innerHeight || 900 : 900;
  const depthProgress = Math.min(scrollY / (viewportH * 2.2), 1);
  const pageTiltX = reducedMotion ? 0 : ((mousePos.y / Math.max(viewportH, 1)) - 0.5) * -2.4;
  const pageTiltY = reducedMotion ? 0 : ((mousePos.x / Math.max(typeof window !== "undefined" ? window.innerWidth || 1440 : 1440, 1)) - 0.5) * 3.2;
  const pageTransform = reducedMotion
    ? "none"
    : `perspective(1800px) rotateX(${(pageTiltX + depthProgress * 1.2).toFixed(2)}deg) rotateY(${pageTiltY.toFixed(2)}deg) translateZ(0)`;

  return (
    <div style={{ background: pageBg, minHeight: "100vh", color: pageText, overflowX: "hidden", fontFamily: "'Space Mono', monospace", position: "relative" }}>
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 3,
          width: `${scrollProgress}%`,
          zIndex: 200,
          background: "linear-gradient(90deg, #5eead4, #00ffe7, #a78bfa)",
          pointerEvents: "none",
          transition: "width 0.1s linear",
        }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::selection { background: #00ffe740; }

        @keyframes rollInChar {
          from {
            opacity: 0;
            transform: rotateX(-92deg) translateY(0.4em);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: rotateX(0deg) translateY(0);
            filter: blur(0);
          }
        }

        @keyframes wordPop {
          from {
            opacity: 0;
            transform: translateY(12px) rotateX(-38deg);
            filter: blur(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
            filter: blur(0);
          }
        }

        @keyframes skillPillRise {
          from { opacity: 0; transform: translateY(16px) scale(0.94) rotateX(12deg); }
          to { opacity: 1; transform: translateY(0) scale(1) rotateX(0); }
        }

        @keyframes formBorderFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .form-shell {
          position: relative;
          padding: 2px;
          border-radius: 6px;
          background: linear-gradient(125deg, rgba(94,234,212,0.45), rgba(139,92,246,0.3), rgba(0,255,231,0.25), rgba(94,234,212,0.35));
          background-size: 240% 240%;
          animation: formBorderFlow 8s ease infinite;
        }
        .form-shell-inner {
          background: rgba(4, 10, 20, 0.94);
          border-radius: 4px;
          padding: 24px;
          backdrop-filter: blur(14px);
        }
        @media (prefers-reduced-motion: reduce) {
          .form-shell { animation: none; }
        }

        .hero-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(260px, 0.92fr);
          gap: clamp(32px, 5vw, 72px);
          align-items: center;
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
        }
        @media (max-width: 960px) {
          .hero-layout { grid-template-columns: 1fr; }
        }

        .marquee-wrap {
          overflow: hidden;
          width: 100%;
          mask-image: linear-gradient(90deg, transparent, black 6%, black 94%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, black 6%, black 94%, transparent);
        }
        .marquee-track {
          display: flex;
          gap: 2.75rem;
          width: max-content;
          animation: marqueeDrift 32s linear infinite;
        }
        .marquee-item {
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(94, 234, 212, 0.42);
          white-space: nowrap;
          flex-shrink: 0;
          font-family: 'Space Mono', monospace;
        }
        @keyframes marqueeDrift {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; transform: translateX(0); }
        }
        @keyframes scanline {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.85); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes nodeGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(0,255,231,0.45); }
          50% { box-shadow: 0 0 24px rgba(0,255,231,0.95); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes gridScroll {
          from { background-position: 0 0; }
          to { background-position: 0 60px; }
        }
        @keyframes orb-drift {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes surface-shimmer {
          0%, 100% { opacity: 0.35; transform: translateY(0) scale(1); }
          50% { opacity: 0.65; transform: translateY(-3px) scale(1.01); }
        }
        @keyframes depth-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.85; }
        }
        @keyframes ring-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes ring-breathe {
          0%, 100% { opacity: 0.2; filter: blur(0px); }
          50% { opacity: 0.5; filter: blur(0.5px); }
        }
        .orbital-ring {
          position: fixed;
          left: 50%;
          top: 54%;
          width: min(78vw, 980px);
          height: min(78vw, 980px);
          border-radius: 50%;
          border: 1px solid rgba(94,234,212,0.16);
          pointer-events: none;
          z-index: 0;
          mix-blend-mode: screen;
          animation: ring-spin 38s linear infinite, ring-breathe 7s ease-in-out infinite;
          transform-origin: center;
        }
        .orbital-ring.r2 {
          width: min(58vw, 760px);
          height: min(58vw, 760px);
          border-color: rgba(168,85,247,0.22);
          animation-duration: 24s, 9s;
          animation-direction: reverse, normal;
        }
        .cursor-glow {
          pointer-events: none;
          position: fixed;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,255,231,0.04) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          z-index: 0;
          transition: left 0.1s, top 0.1s;
        }

        .nav-link {
          color: #718096;
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s;
          background: none; border: none;
          font-family: 'Space Mono', monospace;
        }
        .nav-link:hover { color: #00ffe7; }

        .cta-btn {
          background: transparent;
          border: 1px solid #00ffe780;
          color: #00ffe7;
          padding: 12px 28px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 1px;
          position: relative;
          overflow: hidden;
        }
        .cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #00ffe710, transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .cta-btn:hover { border-color: #00ffe7; box-shadow: 0 0 20px #00ffe730; }
        .cta-btn:hover::before { opacity: 1; }

        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid #ffffff15;
          border-radius: 1px;
          padding: 12px 16px;
          color: #e2e8f0;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #00ffe740; }
        .form-input::placeholder { color: #4a5568; }
        textarea.form-input { resize: vertical; min-height: 100px; }

        .form-input-anim {
          transition: border-color 0.2s, box-shadow 0.4s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .form-input-anim:focus {
          box-shadow: 0 0 0 1px rgba(94,234,212,0.28), 0 16px 48px rgba(0,60,100,0.2);
          transform: translateY(-2px);
        }
      `}</style>

      <OceanAtmosphere scrollY={scrollY} overlayOpacity={oceanOp} />

      {/* Cursor glow — cooler underwater bloom */}
      <div className="cursor-glow" style={{ left: mousePos.x, top: mousePos.y, background: "radial-gradient(circle, rgba(64,224,208,0.09) 0%, rgba(0,120,180,0.04) 40%, transparent 72%)" }} />

      {/* Submerged perspective grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(64,224,208,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(64,224,208,0.03) 1px, transparent 1px)`,
        backgroundSize: "56px 56px",
        backgroundPosition: "0 0",
        transform: `perspective(900px) rotateX(62deg) scale(1.15) translateY(${scrollY * 0.04}px)`,
        transformOrigin: "50% 0%",
        opacity: 0.55,
        animation: "gridScroll 14s linear infinite",
        pointerEvents: "none",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 70%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 70%, transparent 100%)",
      }} />

      {/* Caustic-style corner blooms (CSS only, very soft) */}
      <div style={{ position: "fixed", top: "10%", right: "5%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,220,0.07) 0%, rgba(0,80,120,0.02) 45%, transparent 70%)", filter: "blur(48px)", animation: "orb-drift 16s ease-in-out infinite, surface-shimmer 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "12%", left: "-5%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,200,0.05) 0%, transparent 68%)", filter: "blur(56px)", animation: "orb-drift 22s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

      {/* Depth vignette + subtle water tint on content */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 85% 70% at 50% ${28 + scrollY * 0.02}%, transparent 0%, rgba(2, 12, 28, 0.45) 100%)`,
        mixBlendMode: "multiply",
      }} />
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        boxShadow: "inset 0 0 120px rgba(0, 40, 80, 0.35)",
        animation: "depth-pulse 10s ease-in-out infinite",
      }} />
      {!reducedMotion && (
        <>
          <div className="orbital-ring" style={{ top: `${54 + depthProgress * 4}%` }} />
          <div className="orbital-ring r2" style={{ top: `${56 + depthProgress * 3}%` }} />
        </>
      )}

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 max(20px, 4vw)",
        minHeight: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        background: navBg ? (theme === "light" ? navBarBg : "rgba(6,11,20,0.9)") : "transparent",
        backdropFilter: navBg ? "blur(20px)" : "none",
        borderBottom: navBg ? (theme === "light" ? "1px solid rgba(15,23,42,0.08)" : "1px solid rgba(255,255,255,0.04)") : "none",
        transition: "all 0.3s",
      }}>
        <Link to="/" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: 3, color: "#00ffe7", textDecoration: "none" }} onClick={hapticTap}>
          <RollingLineReveal text={SITE.name} reducedMotion={reducedMotion} charDelay={0.07} baseDelay={0.15} />
        </Link>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {NAV_LINKS.map(l => (
            <button key={l} type="button" className="nav-link" onClick={() => scrollTo(l)} style={{ color: theme === "light" ? "#64748b" : undefined }}>{l}</button>
          ))}
          <Link to="/blog" className="nav-link" style={{ color: mutedNav }} onClick={hapticTap}>Blog</Link>
          <Link to="/uses" className="nav-link" style={{ color: mutedNav }} onClick={hapticTap}>Uses</Link>
          <a href={SITE.resumePath} download className="nav-link" style={{ color: mutedNav }} onClick={hapticTap}>Résumé</a>
          <button
            type="button"
            className="nav-link"
            style={{ color: mutedNav, border: "1px solid rgba(94,234,212,0.35)", padding: "4px 10px", borderRadius: 2 }}
            onClick={() => { hapticTap(); toggleTheme(); }}
            aria-label={theme === "dark" ? "Switch to day theme" : "Switch to night theme"}
          >
            {theme === "dark" ? "Day" : "Night"}
          </button>
          <button type="button" className="cta-btn" style={{ padding: "8px 20px" }} onClick={() => scrollTo("Contact")}>
            Hire Me
          </button>
        </div>
      </nav>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          transform: pageTransform,
          transformStyle: "preserve-3d",
          transition: reducedMotion ? "none" : "transform 0.28s ease-out",
          willChange: "transform",
        }}
      >
      {/* HERO */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px max(40px, 8vw) 72px", position: "relative", zIndex: 1 }}>
        <div className="hero-layout">
          <div>
            <div style={{ animation: "fadeSlideUp 0.8s ease 0.1s both" }}>
              <div style={{ fontSize: 11, letterSpacing: 4, color: "#7ee8e0", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, textShadow: "0 0 24px rgba(0, 200, 220, 0.35)", animation: "surface-shimmer 5s ease-in-out infinite" }}>
                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg, #7ee8e0, #00a8c4)", boxShadow: "0 0 12px rgba(0, 255, 240, 0.8), 0 0 28px rgba(0, 180, 220, 0.4)", animation: "pulse-ring 2s infinite" }} />
                <span>AVAILABLE FOR WORK</span>
              </div>
            </div>

            <div style={{ animation: "fadeSlideUp 0.8s ease 0.2s both" }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(38px, 7vw, 82px)", lineHeight: 1.02, marginBottom: 20, letterSpacing: -1 }}>
                <RollingLine text="Software" baseDelay={0.05} charDelay={0.05} /><br />
                <RollingLine text="Engineer" baseDelay={0.45} charDelay={0.055} color="#5eead4" />
                <span style={{ color: "#ffffff20" }}>_</span>
              </h1>
            </div>

            <div style={{ animation: "fadeSlideUp 0.8s ease 0.4s both" }}>
              <p style={{ fontSize: 13, color: "#718096", maxWidth: 480, lineHeight: 1.8, marginBottom: 32 }}>
                I architect and build high-performance systems at the intersection of<br />
                <span style={{ color: "#a0aec0" }}>distributed computing</span>, <span style={{ color: "#a0aec0" }}>AI infrastructure</span>, and <span style={{ color: "#a0aec0" }}>elegant interfaces</span>.
              </p>
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", animation: "fadeSlideUp 0.8s ease 0.5s both" }}>
              <button type="button" className="cta-btn" onClick={() => scrollTo("Projects")}>View Projects</button>
              <button type="button" className="cta-btn" style={{ borderColor: "#ffffff20", color: "#a0aec0" }} onClick={() => scrollTo("About")}>
                My Story
              </button>
            </div>

            <TechMarquee items={MARQUEE_ITEMS} />

            <div style={{ animation: "fadeSlideUp 0.8s ease 0.6s both" }}>
              <HeroStatsStrip reducedMotion={reducedMotion} />
            </div>
          </div>

          <div style={{ animation: "fadeSlideUp 1s ease 0.35s both" }}>
            <WebsiteShowcase360 reducedMotion={reducedMotion} />
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "float 2s ease-in-out infinite" }}>
          <span style={{ fontSize: 9, letterSpacing: 3, color: "#4a5568" }}>SCROLL</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #5eead4, transparent)" }} />
        </div>
      </section>

      {/* ABOUT */}
      <CinematicSection sectionRef={aboutRef} reducedMotion={reducedMotion} minHeight="150vh" intensity={1.1}>
        <SectionLabel label="01 / About" reducedMotion={reducedMotion} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <RevealBlock delay={0} variant="slideLeft">
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: "#e2e8f0", marginBottom: 24, lineHeight: 1.2 }}>
              <RollingLineReveal text="Building systems that" reducedMotion={reducedMotion} charDelay={0.038} baseDelay={0.05} /><br />
              <RollingLineReveal text="scale to infinity" reducedMotion={reducedMotion} charDelay={0.045} baseDelay={0.22} color="#00ffe7" />
            </h2>
            <p style={{ fontSize: 12, color: "#718096", marginBottom: 20 }}>
              <WordStagger
                text="I'm a software engineer with 2+ years of experience building distributed systems, real-time platforms, and AI-powered applications. I thrive in the space between low-level performance engineering and high-level product thinking."
                reducedMotion={reducedMotion}
                wordDelay={0.028}
                baseDelay={0.08}
              />
            </p>
            <p style={{ fontSize: 12, color: "#718096" }}>
              <WordStagger
                text="Currently focused on AI infrastructure — model serving, inference optimization, and the tooling that makes ML actually work in production at scale. When I'm not in the terminal, I'm writing about systems design."
                reducedMotion={reducedMotion}
                wordDelay={0.026}
                baseDelay={0.12}
              />
            </p>
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#5eead4", marginTop: 28, textTransform: "uppercase" }}>
              <ScrambleReveal text="Production · Latency · Craft" reducedMotion={reducedMotion} durationMs={800} />
            </p>
          </RevealBlock>

          {/* Timeline */}
          <RevealBlock delay={0.12} variant="slideRight">
          <div>
            {TIMELINE.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 20, marginBottom: 28, opacity: 0, animation: `fadeSlideUp 0.65s ease ${i * 0.14 + 0.25}s forwards` }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? "#00ffe7" : "#2d3748", border: "1px solid #00ffe7", flexShrink: 0, marginTop: 4, animation: i === 0 && !reducedMotion ? "nodeGlow 2.2s ease-in-out infinite" : "none" }} />
                  {i < TIMELINE.length - 1 && <div style={{ width: 1, flex: 1, background: "linear-gradient(180deg, #00ffe740, #1a2030)", marginTop: 6 }} />}
                </div>
                <div style={{ paddingBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "#00ffe7", letterSpacing: 2, marginBottom: 4 }}>
                    <RollingLineReveal text={item.year} reducedMotion={reducedMotion} charDelay={0.08} baseDelay={i * 0.12} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 2, fontFamily: "'Syne', sans-serif" }}>
                    <RollingLineReveal text={item.role} reducedMotion={reducedMotion} charDelay={0.022} baseDelay={i * 0.12 + 0.08} />
                  </div>
                  <div style={{ fontSize: 10, color: "#64748b", marginBottom: 6, letterSpacing: 1 }}>
                    <RollingLineReveal text={item.company} reducedMotion={reducedMotion} charDelay={0.03} baseDelay={i * 0.12 + 0.18} />
                  </div>
                  <div style={{ fontSize: 11, color: "#718096", lineHeight: 1.65 }}>
                    <WordStagger text={item.desc} reducedMotion={reducedMotion} wordDelay={0.024} baseDelay={i * 0.1 + 0.25} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          </RevealBlock>
        </div>
      </CinematicSection>

      {/* IMPACT + TESTIMONIALS + OPEN SOURCE */}
      <CinematicSection reducedMotion={reducedMotion} minHeight="140vh" intensity={0.95}>
        <SectionLabel label="00 / Impact" reducedMotion={reducedMotion} />
        <RevealBlock delay={0}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px 64px", alignItems: "start" }}>
            <div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 20, color: pageText }}>At a glance</h3>
              <ul style={{ margin: 0, paddingLeft: 18, color: mutedNav, lineHeight: 1.85, fontSize: 13 }}>
                {IMPACT_LINES.map((line) => (
                  <li key={line} style={{ marginBottom: 12 }}>{line}</li>
                ))}
              </ul>
              <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a href={SITE.resumePath} download className="cta-btn" style={{ textDecoration: "none", display: "inline-block" }} onClick={hapticTap}>Download résumé</a>
                <a href={SITE.calendlyUrl} target="_blank" rel="noopener noreferrer" className="cta-btn" style={{ textDecoration: "none", display: "inline-block", borderColor: "#ffffff30", color: mutedNav }} onClick={hapticTap}>Schedule (Calendly)</a>
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 20, color: pageText }}>What people say</h3>
              {TESTIMONIALS.map((t) => (
                <blockquote key={t.name} style={{ margin: "0 0 24px", padding: "20px", border: "1px solid rgba(94,234,212,0.2)", borderRadius: 4, background: theme === "light" ? "rgba(255,255,255,0.5)" : "rgba(0,255,231,0.03)" }}>
                  <p style={{ fontSize: 13, color: mutedNav, lineHeight: 1.75, marginBottom: 12, fontStyle: "italic" }}>“{t.quote}”</p>
                  <footer style={{ fontSize: 11, color: "#5eead4" }}>{t.name} · {t.role}</footer>
                </blockquote>
              ))}
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, marginBottom: 12, color: pageText }}>Activity & talks</h3>
              <div style={{ marginBottom: 16, borderRadius: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                <img
                  src={`https://ghchart.rshah.org/${SITE.githubUser}`}
                  alt={`GitHub contributions for ${SITE.githubUser}`}
                  style={{ width: "100%", display: "block", background: "#0d1117" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                <a href={`https://github.com/${SITE.githubUser}`} target="_blank" rel="noopener noreferrer" style={{ color: "#5eead4" }}>GitHub profile →</a>
              </div>
            </div>
          </div>
        </RevealBlock>
      </CinematicSection>

      {/* SKILLS */}
      <CinematicSection
        sectionRef={skillsRef}
        reducedMotion={reducedMotion}
        minHeight="150vh"
        intensity={1.05}
        background="linear-gradient(180deg, rgba(0,80,100,0.06) 0%, rgba(0,40,70,0.04) 100%)"
      >
        <SectionLabel label="02 / Skills" reducedMotion={reducedMotion} />
        <RevealBlock delay={0} variant="tilt">
          <p style={{ fontSize: 12, color: "#64748b", maxWidth: 640, marginBottom: 36, lineHeight: 1.85 }}>
            <WordStagger
              text="Depth across the stack — from typed frontends and realtime UX to data-heavy backends and resilient deployments. Built to pass code review and survive on-call."
              reducedMotion={reducedMotion}
              wordDelay={0.03}
              baseDelay={0.04}
            />
          </p>
        </RevealBlock>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px" }}>
          {SKILLS.map((sk, i) => (
            <SkillBar key={sk.name} name={sk.name} level={sk.level} category={sk.category} delay={i * 0.08} reducedMotion={reducedMotion} />
          ))}
        </div>

        <SkillPillsRow labels={["Frontend", "Backend", "Database", "DevOps"]} reducedMotion={reducedMotion} />
      </CinematicSection>

      {/* PROJECTS */}
      <CinematicSection sectionRef={projectsRef} reducedMotion={reducedMotion} minHeight="150vh" intensity={1.15}>
        <SectionLabel label="03 / Projects" reducedMotion={reducedMotion} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} index={i} reducedMotion={reducedMotion} />)}
        </div>
      </CinematicSection>

      {/* CONTACT */}
      <CinematicSection sectionRef={contactRef} reducedMotion={reducedMotion} minHeight="145vh" intensity={1.08}>
        <SectionLabel label="04 / Contact" reducedMotion={reducedMotion} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <RevealBlock delay={0} variant="slideLeft">
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: "#e2e8f0", marginBottom: 16, lineHeight: 1.2 }}>
              <RollingLineReveal text="Let's build something" reducedMotion={reducedMotion} charDelay={0.032} baseDelay={0.02} /><br />
              <RollingLineReveal text="remarkable" reducedMotion={reducedMotion} charDelay={0.048} baseDelay={0.2} color="#00ffe7" />
            </h2>
            <p style={{ fontSize: 12, color: "#718096", marginBottom: 40 }}>
              <WordStagger
                text="Open to senior engineering roles, technical co-founder opportunities, and interesting consulting projects. Let's talk."
                reducedMotion={reducedMotion}
                wordDelay={0.032}
                baseDelay={0.06}
              />
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[["⌘", "https://github.com/anujagarwal1161/"], ["◈", "https://www.linkedin.com/in/anujagarwal900/"]].map(([ic, val], idx) => (
                <div
                  key={val}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "transform 0.25s ease, border-color 0.2s",
                    padding: "8px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(10px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <span style={{ color: "#00ffe7", fontSize: 12 }}>{ic}</span>
                  <span style={{ fontSize: 12, color: mutedNav }}>
                    <RollingLineReveal text={val} reducedMotion={reducedMotion} charDelay={0.018} baseDelay={idx * 0.06 + 0.15} />
                  </span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: mutedNav, marginTop: 28, lineHeight: 1.6, letterSpacing: 0.5 }}>
              {SITE.timezone}
            </p>
            <div style={{ marginTop: 20, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(94,234,212,0.25)", minHeight: 380, background: theme === "light" ? "#fff" : "#0a1628" }}>
              <iframe
                title="Schedule a conversation"
                src={SITE.calendlyEmbedUrl}
                style={{ width: "100%", height: 420, border: "none" }}
              />
            </div>
          </RevealBlock>

          <RevealBlock delay={0.1} variant="slideRight">
          <div>
            {sent ? (
              <div className="form-shell">
                <div className="form-shell-inner" style={{ textAlign: "center", padding: "48px 32px" }}>
                  <div style={{ fontSize: 28, marginBottom: 12, animation: reducedMotion ? "none" : "float 2.2s ease-in-out infinite" }}>✓</div>
                  <div style={{ color: "#00ffe7", fontSize: 13, letterSpacing: 2 }}>
                    <RollingLineReveal text="MESSAGE SENT" reducedMotion={reducedMotion} charDelay={0.06} baseDelay={0.05} />
                  </div>
                  <div style={{ color: "#718096", fontSize: 11, marginTop: 10 }}>
                    <WordStagger text="I'll get back to you within 24h." reducedMotion={reducedMotion} wordDelay={0.05} baseDelay={0.2} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="form-shell">
                <div className="form-shell-inner">
                  <div style={{ fontSize: 10, letterSpacing: 3, color: "#5eead4", marginBottom: 18, textTransform: "uppercase" }}>
                    <ScrambleReveal text="Secure channel · Encrypted intent" reducedMotion={reducedMotion} durationMs={750} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <input className="form-input form-input-anim" placeholder="Your name" value={formState.name} onChange={e => setFormState(s => ({ ...s, name: e.target.value }))} />
                    <input className="form-input form-input-anim" placeholder="Email address" type="email" value={formState.email} onChange={e => setFormState(s => ({ ...s, email: e.target.value }))} />
                    <textarea className="form-input form-input-anim" placeholder="Tell me about your project..." value={formState.message} onChange={e => setFormState(s => ({ ...s, message: e.target.value }))} />
                    <button type="button" className="cta-btn" style={{ alignSelf: "flex-start" }} onClick={handleSubmit}>Send Message →</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          </RevealBlock>
        </div>
      </CinematicSection>

      {/* Footer */}
      <footer style={{ padding: "32px max(40px, 8vw)", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1, flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontSize: 10, color: "#475569", letterSpacing: 2 }}>
          <RollingLineReveal text="© 2026 Anuj Agarwal" reducedMotion={reducedMotion} charDelay={0.04} baseDelay={0} />
        </span>
        <span style={{ fontSize: 10, color: "#5eead4", letterSpacing: 3, textTransform: "uppercase" }}>
          <ScrambleReveal text="CRAFTED WITH PRECISION" reducedMotion={reducedMotion} durationMs={1000} />
        </span>
      </footer>
      </div>
    </div>
  );
}