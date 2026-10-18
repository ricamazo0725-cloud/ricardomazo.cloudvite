"use client";

import { useEffect, useRef } from "react";

// Fondo del hero: nodos que se conectan entre sí y hacia el cursor, más un
// halo ámbar que sigue al mouse. Se pausa cuando el hero sale de pantalla.
export default function NetworkCanvas({ containerRef }) {
  const canvasRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = containerRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let pts = [];
    const mouse = { x: -9999, y: -9999 };
    const D = 140 * dpr;

    const resize = () => {
      const r = host.getBoundingClientRect();
      w = canvas.width = r.width * dpr;
      h = canvas.height = r.height * dpr;
      const n = mobile ? 28 : 70;
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35 * dpr,
        vy: (Math.random() - 0.5) * 0.35 * dpr,
        amber: Math.random() < 0.15,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
        }
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      ctx.lineWidth = dpr;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < D) {
            ctx.strokeStyle = `hsla(178,58%,52%,${(1 - d / D) * 0.25})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < D * 1.4) {
          ctx.strokeStyle = `hsla(38,96%,56%,${(1 - dm / (D * 1.4)) * 0.6})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = a.amber ? "hsl(38,96%,56%)" : "hsla(210,24%,94%,.5)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, (a.amber ? 2.6 : 1.6) * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let raf = 0;
    let visible = true;
    let tick = 0;
    const loop = () => {
      tick++;
      if (visible && (!mobile || tick % 2 === 0)) draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) * dpr;
      mouse.y = (e.clientY - r.top) * dpr;
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX - r.left}px`;
        glowRef.current.style.top = `${e.clientY - r.top}px`;
      }
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);

    resize();
    window.addEventListener("resize", resize);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    if (reduced) draw();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [containerRef]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <div ref={glowRef} className="hero-glow" aria-hidden="true" />
    </>
  );
}
