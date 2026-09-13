"use client";

import { useEffect, useRef } from "react";
import { startGradient } from "@/lib/steadygradient";
import { STEADY_MASK } from "@/lib/steady-mask";
import { stroke } from "@/lib/stroke";

/* The brand mark, alive: its gradient races when the visitor is spiralling and
   settles as they calm. Reads the shared stroke state every frame. */
export default function Stroke({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = host.current, c = canvas.current;
    if (!el || !c) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const g = startGradient(c, { mode: "vivid", speed: 0.4, still: reduced ? 5.5 : undefined });
    if (!g || reduced) return () => g?.stop();
    let raf = 0, last = performance.now();
    const t0 = last;
    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      const L = stroke.tick(dt);
      const breath = Math.sin(((now - t0) / 1000) * ((2 * Math.PI) / 5)) * 0.02;
      g.setSpeed(0.25 + 1.5 * L);
      el.style.transform = `scale(${(1 + breath + 0.08 * L).toFixed(4)})`;
      el.style.filter = `saturate(${(1 + 0.25 * L).toFixed(3)}) brightness(${(1 + 0.1 * L).toFixed(3)})`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); g.stop(); };
  }, []);
  return (
    <div ref={host} className={className} aria-hidden style={{ position: "relative", aspectRatio: "1", willChange: "transform, filter" }}>
      <div style={{ position: "absolute", inset: "-25%", maskImage: `url(${STEADY_MASK})`, WebkitMaskImage: `url(${STEADY_MASK})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }}>
        <canvas ref={canvas} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>
    </div>
  );
}
