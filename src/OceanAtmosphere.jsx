import { useEffect, useRef } from "react";

/**
 * Full-viewport canvas: deep-ocean ambience — soft god rays, caustic bands,
 * rising bubbles, drifting plankton, bioluminescent pulses. Respects
 * prefers-reduced-motion (static gradient only).
 */
export default function OceanAtmosphere({ scrollY = 0, overlayOpacity = 1 }) {
  const canvasRef = useRef(null);
  const scrollRef = useRef(0);
  const reducedRef = useRef(false);

  scrollRef.current = scrollY;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;

    const bubbles = [];
    const sparks = [];
    const plankton = [];

    const initLife = () => {
      bubbles.length = 0;
      sparks.length = 0;
      plankton.length = 0;
      const bubbleDiv = w < 768 ? 28000 : 18000;
      const nB = Math.floor((w * h) / bubbleDiv);
      for (let i = 0; i < nB; i++) {
        bubbles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.2 + 0.4,
          vy: Math.random() * 0.35 + 0.12,
          phase: Math.random() * Math.PI * 2,
          wx: Math.random() * 0.012 + 0.004,
        });
      }
      const nS = Math.floor((w * h) / (w < 768 ? 120000 : 90000));
      for (let i = 0; i < nS; i++) {
        sparks.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.8 + 0.5,
          pulse: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.008,
        });
      }
      const nP = Math.floor((w * h) / (w < 768 ? 65000 : 45000));
      for (let i = 0; i < nP; i++) {
        plankton.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.12,
          len: Math.random() * 12 + 4,
          opacity: Math.random() * 0.15 + 0.05,
        });
      }
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initLife();
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;

    const drawCaustics = (depthFactor) => {
      const layers = 5;
      for (let i = 0; i < layers; i++) {
        const yOff = (t * (8 + i * 2) + i * 120) % (h * 1.5) - h * 0.25;
        const alpha = (0.018 + i * 0.006) * (1 - depthFactor * 0.35);
        const grad = ctx.createLinearGradient(0, yOff, w, yOff + h * 0.4);
        grad.addColorStop(0, "rgba(0, 180, 220, 0)");
        grad.addColorStop(0.35, `rgba(64, 224, 208, ${alpha * 0.9})`);
        grad.addColorStop(0.5, `rgba(0, 120, 180, ${alpha * 0.5})`);
        grad.addColorStop(1, "rgba(0, 60, 100, 0)");
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.translate(
          Math.sin(t * 0.12 + i) * 12 * (1 - depthFactor * 0.5),
          0
        );
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let x = 0; x <= w; x += 24) {
          const wave =
            Math.sin(x * 0.008 + t * 0.8 + i * 1.2) * 18 +
            Math.sin(x * 0.015 - t * 0.5 + i) * 10;
          ctx.lineTo(x, yOff + wave);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    };

    const drawGodRays = (depthFactor) => {
      const cx = w * 0.5 + Math.sin(t * 0.07) * w * 0.08;
      const rays = 7;
      ctx.save();
      ctx.globalCompositeOperation = "soft-light";
      for (let r = 0; r < rays; r++) {
        const angle = (-0.35 + (r / Math.max(1, rays - 1)) * 0.7) * Math.PI * 0.35;
        const grad = ctx.createRadialGradient(cx, -80, 0, cx, h * 0.5, h * 1.2);
        grad.addColorStop(
          0,
          `rgba(180, 250, 255, ${0.06 * (1 - depthFactor * 0.6)})`
        );
        grad.addColorStop(
          0.45,
          `rgba(0, 140, 200, ${0.02 * (1 - depthFactor)})`
        );
        grad.addColorStop(1, "rgba(0, 20, 40, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx, -100);
        ctx.lineTo(cx + Math.tan(angle) * h * 1.5, h * 1.2);
        ctx.lineTo(cx - Math.tan(angle) * h * 0.3, h * 1.2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    };

    const tick = () => {
      const scroll = scrollRef.current;
      const depth = Math.min(scroll / (h * 1.2 || 1), 1);
      const depthFactor = depth * 0.9;

      if (reducedRef.current) {
        ctx.clearRect(0, 0, w, h);
        const df = depth * 0.85;
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(
          0,
          `rgb(${8 + df * 4}, ${45 + df * 15}, ${72 + df * 20})`
        );
        bg.addColorStop(
          0.45,
          `rgb(${4 + df * 8}, ${22 + df * 10}, ${48 + df * 12})`
        );
        bg.addColorStop(
          1,
          `rgb(${2 + df * 10}, ${8 + df * 6}, ${22 + df * 8})`
        );
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
        raf = requestAnimationFrame(tick);
        return;
      }

      t += 0.016;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(
        0,
        `rgb(${6 + depthFactor * 6}, ${32 + depthFactor * 28}, ${58 + depthFactor * 35})`
      );
      bg.addColorStop(
        0.42,
        `rgb(${3 + depthFactor * 10}, ${14 + depthFactor * 18}, ${36 + depthFactor * 22})`
      );
      bg.addColorStop(
        1,
        `rgb(${1 + depthFactor * 12}, ${4 + depthFactor * 10}, ${14 + depthFactor * 12})`
      );
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      drawGodRays(depthFactor);
      drawCaustics(depthFactor);

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const p of plankton) {
        p.x += p.vx + Math.sin(t * 0.5 + p.y * 0.01) * 0.08;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
        ctx.strokeStyle = `rgba(120, 230, 255, ${p.opacity * (1 - depthFactor * 0.5)})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.len * 0.3, p.y + p.len);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const b of bubbles) {
        b.y -= b.vy * (1 + depthFactor * 0.4);
        b.phase += b.wx;
        b.x += Math.sin(b.phase) * 0.35;
        if (b.y < -10) {
          b.y = h + Math.random() * 40;
          b.x = Math.random() * w;
        }
        const a = 0.12 * (1 - depthFactor * 0.45) * (0.7 + Math.sin(b.phase) * 0.3);
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 2);
        g.addColorStop(0, `rgba(200, 255, 255, ${a})`);
        g.addColorStop(1, "rgba(100, 200, 255, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const s of sparks) {
        s.pulse += s.speed;
        const pulse = 0.35 + Math.sin(s.pulse) * 0.35;
        const a = pulse * 0.45 * (1 - depthFactor * 0.55);
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        g.addColorStop(0, `rgba(0, 255, 220, ${a})`);
        g.addColorStop(0.4, `rgba(100, 200, 255, ${a * 0.35})`);
        g.addColorStop(1, "rgba(0, 80, 120, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => {
      reducedRef.current = mq.matches;
    };
    mq.addEventListener("change", onMq);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: overlayOpacity,
      }}
    />
  );
}
