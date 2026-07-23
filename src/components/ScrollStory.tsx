"use client";

import { useEffect, useRef, useState } from "react";
import SteadyPhone from "@/components/SteadyPhone";
import Reveal from "@/components/Reveal";

export type Journey = {
  problem: { photo: string; alt: string; text: string };
  solution: { photo: string; alt: string; text: string };
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function PairCard({
  side,
  photo,
  alt,
  text,
  label,
  dot,
  t,
  depth,
  z,
}: {
  side: "left" | "right";
  photo: string;
  alt: string;
  text: string;
  label: string;
  dot: string;
  t: number; // 0..1 entry progress
  depth: number; // how many layers stacked on top of this one
  z: number;
}) {
  const e = ease(t);
  const dir = side === "left" ? -1 : 1;
  const x = dir * 330 + dir * (1 - e) * 55 * 16; // fly in from off-screen
  const y = -depth * 18;
  const scale = 1 - depth * 0.05;
  const rot = depth === 0 ? 0 : dir * depth * 1.5;
  return (
    <div
      className="absolute left-1/2 top-1/2 w-[340px]"
      style={{
        zIndex: z,
        opacity: e,
        transform: `translate(-50%,-50%) translateX(${x}px) translateY(${y}px) rotate(${rot}deg) scale(${scale})`,
        transition: "transform 0.1s linear, opacity 0.1s linear",
      }}
    >
      <div className="relative h-[320px] overflow-hidden rounded-[2rem] shadow-[0_24px_60px_-30px_rgba(35,40,44,0.45)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={alt} className="h-full w-full object-cover" />
        <span className="glass-panel absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold text-ink">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
          {label}
        </span>
        <div className="glass-panel absolute inset-x-4 bottom-4 rounded-[1.4rem] px-5 py-4">
          <p className="text-[14px] leading-relaxed text-ink">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default function ScrollStory({ journeys }: { journeys: Journey[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        setP(clamp(-rect.top / total));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const steps = journeys.length + 1; // layer 0 = collage cards, then one layer per pair
  const local = (i: number) => clamp(p * steps - i);
  const t0 = local(0);
  // collage sub-stagger: 4 cards fly in one by one inside layer 0
  const tc = (idx: number) => ease(clamp(t0 * 1.6 - idx * 0.2));
  const headerT = ease(clamp(p * steps - 0.75));

  return (
    <>
      {/* ---------- pinned scroll story (desktop) ---------- */}
      <section
        ref={sectionRef}
        className="relative hidden lg:block"
        style={{ height: `${steps * 100 + 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-5">
          {/* header fades in as the first pair arrives */}
          <div
            className="absolute left-1/2 top-24 z-40 w-full max-w-[640px] text-center"
            style={{ opacity: headerT, transform: `translate(-50%, ${(1 - headerT) * 14}px)` }}
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              The loop &rarr; the way out
            </p>
            <h2 className="mt-2 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-ink">
              Before Steady, and after
            </h2>
          </div>

          {/* collage layer — flies in first, one card at a time */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{ opacity: tc(0), transform: `translate(-50%,-50%) translateX(${-500 - (1 - tc(0)) * 400}px)`, zIndex: 5 }}
          >
            <div className="relative w-[190px] overflow-hidden rounded-[2rem] shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/night-loop.jpg" alt="Lying awake at night with looping thoughts" className="h-[300px] w-full object-cover" />
              <span className="glass-panel absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11.5px] font-semibold text-ink">3am loops</span>
            </div>
          </div>
          <div
            className="absolute left-1/2 top-1/2"
            style={{ opacity: tc(1), transform: `translate(-50%,-50%) translateX(${-290 - (1 - tc(1)) * 400}px)`, zIndex: 6 }}
          >
            <div className="flex h-[240px] w-[180px] flex-col justify-between rounded-[2rem] p-5 text-white shadow-lg"
              style={{ background: "linear-gradient(160deg,#454d52 0%,#23282c 100%)" }}>
              <span className="text-[40px] font-bold leading-none tracking-tight">24/7</span>
              <span className="text-[14px] leading-snug text-white/85">There the moment the loop starts. Day or 3am.</span>
            </div>
          </div>
          <div
            className="absolute left-1/2 top-1/2"
            style={{ opacity: tc(2), transform: `translate(-50%,-50%) translateX(${290 + (1 - tc(2)) * 400}px)`, zIndex: 6 }}
          >
            <div className="flex h-[240px] w-[180px] flex-col justify-between rounded-[2rem] border border-line bg-white p-5 shadow-lg">
              <span className="text-[40px] font-bold leading-none tracking-tight text-ink">10 min</span>
              <span className="text-[14px] leading-snug text-ink-soft">Your first conversation. Speaking, not typing.</span>
            </div>
          </div>
          <div
            className="absolute left-1/2 top-1/2"
            style={{ opacity: tc(3), transform: `translate(-50%,-50%) translateX(${500 + (1 - tc(3)) * 400}px)`, zIndex: 5 }}
          >
            <div className="relative w-[190px] overflow-hidden rounded-[2rem] shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/warm-portrait.jpg" alt="Smiling with relief after a Steady session" className="h-[300px] w-full object-cover" />
              <span className="glass-panel absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11.5px] font-semibold text-ink">after a session</span>
            </div>
          </div>

          {/* journey pairs — each stacks in as its own layer */}
          {journeys.map((j, i) => {
            const t = local(i + 1);
            // depth = how many later pairs have already landed on top
            let depth = 0;
            for (let k = i + 1; k < journeys.length; k++) if (local(k + 1) > 0.5) depth++;
            return (
              <div key={i}>
                <PairCard side="left" {...j.problem} label="The loop" dot="#c9a48c" t={t} depth={depth} z={10 + i} />
                <PairCard side="right" {...j.solution} label="With Steady" dot="#9fceb3" t={t} depth={depth} z={10 + i} />
              </div>
            );
          })}

          {/* phone — locked in the centre the whole way through */}
          <div className="relative z-30 w-[300px]">
            <SteadyPhone />
          </div>
        </div>
      </section>

      {/* ---------- mobile / tablet fallback: simple stacked reveals ---------- */}
      <section className="px-5 py-16 lg:hidden">
        <div className="mx-auto max-w-[520px]">
          <div className="mx-auto w-[250px]">
            <SteadyPhone />
          </div>
          <Reveal>
            <p className="mt-14 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              The loop &rarr; the way out
            </p>
            <h2 className="mt-3 text-center text-[32px] font-semibold leading-tight tracking-[-0.02em] text-ink">
              Before Steady, and after
            </h2>
          </Reveal>
          <div className="mt-10 space-y-6">
            {journeys.map((j, i) => (
              <div key={i} className="space-y-5">
                {[{ ...j.problem, label: "The loop", dot: "#c9a48c", from: "left" as const },
                  { ...j.solution, label: "With Steady", dot: "#9fceb3", from: "right" as const }].map((c) => (
                  <Reveal key={c.label + i} from={c.from}>
                    <div className="relative h-[320px] overflow-hidden rounded-[2rem] shadow-[0_24px_60px_-30px_rgba(35,40,44,0.35)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.photo} alt={c.alt} className="h-full w-full object-cover" />
                      <span className="glass-panel absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold text-ink">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.dot }} />
                        {c.label}
                      </span>
                      <div className="glass-panel absolute inset-x-4 bottom-4 rounded-[1.4rem] px-5 py-4">
                        <p className="text-[14px] leading-relaxed text-ink">{c.text}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
