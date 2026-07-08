"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { ArrowRight, Check, Mic, MapIcon, Shield, Chart } from "./icons";

type Feature = {
  id: string;
  tab: string;
  accent: string;
  Icon: (p: { className?: string }) => React.ReactElement;
  title: string;
  body: string;
  bullets: string[];
  after: { src: string; alt: string; chip: string };
  before: { src: string; alt: string; chip: string };
};

const features: Feature[] = [
  {
    id: "map",
    tab: "Map",
    accent: "#3e7a5e",
    Icon: MapIcon,
    title: "Talk it out. See your loop clearly.",
    body: "You talk. Steady listens and asks good questions. Bit by bit, the mess in your head becomes a simple map: what sets the loop off, what it makes you do, and where to start.",
    bullets: [
      "Just talking — no forms, no typing",
      "Your triggers and habits, laid out simply",
      "A plan that starts easy",
    ],
    after: {
      src: "/photos/kitchen-mapping.jpg",
      alt: "A woman talking things through with Steady over coffee",
      chip: "After: “Oh. It finally makes sense.”",
    },
    before: {
      src: "/photos/googling-night.jpg",
      alt: "A man googling his worry late at night",
      chip: "Before",
    },
  },
  {
    id: "practice",
    tab: "Practice",
    accent: "#dd8f58",
    Icon: Mic,
    title: "Practice letting the thought pass",
    body: "Short 15-minute sessions with a kind voice guiding you. You face the thought, skip the checking, and feel the worry fade on its own. That's the skill that changes everything.",
    bullets: [
      "You choose what to practice. You say when.",
      "Pause or stop anytime, with one word",
      "Most people feel a shift within weeks",
    ],
    after: {
      src: "/photos/calm-breath.jpg",
      alt: "A man breathing out slowly, calm and relieved",
      chip: "After: the wave passed",
    },
    before: {
      src: "/photos/checking-door.jpg",
      alt: "A woman stuck checking the front door again",
      chip: "Before",
    },
  },
  {
    id: "progress",
    tab: "Progress",
    accent: "#4f7db3",
    Icon: Chart,
    title: "See yourself getting better",
    body: "Every session adds to a simple progress picture. Watch your anxiety peaks shrink week by week. Proof beats hope.",
    bullets: [
      "Anxiety peaks drop: 8 → 5 → 3",
      "Milestones in plain words",
      "Export everything, anytime",
    ],
    after: {
      src: "/photos/proud-progress.jpg",
      alt: "A woman smiling at her progress on her phone",
      chip: "After: “I can see it working”",
    },
    before: {
      src: "/photos/tired-morning.jpg",
      alt: "Someone exhausted after another sleepless night",
      chip: "Before",
    },
  },
  {
    id: "safety",
    tab: "Care",
    accent: "#8a7a5c",
    Icon: Shield,
    title: "Kind. Honest. Private.",
    body: "Steady never starts anything without your okay. It won't feed the loop with quick “you're fine” answers — it helps you stop needing them. Your talks aren't recorded. Your data is yours.",
    bullets: [
      "Nothing starts without your spoken yes",
      "Points you to real humans if you're in crisis",
      "Export or delete your data anytime",
    ],
    after: {
      src: "/photos/friends-laughing.jpg",
      alt: "Two friends laughing together outside",
      chip: "Life, back on",
    },
    before: {
      src: "/photos/woman-headphones-couch.jpg",
      alt: "A woman relaxed on the couch, talking with Steady",
      chip: "Safe at home",
    },
  },
];

function PhotoPair({ f }: { f: Feature }) {
  return (
    <div className="relative pb-10 pl-10">
      <div className="photo-card relative aspect-[4/3]">
        <img src={f.after.src} alt={f.after.alt} loading="lazy" />
        <span className="glass absolute right-4 top-4 rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-ink">
          {f.after.chip}
        </span>
      </div>
      <div className="photo-card tilt-l absolute bottom-0 left-0 w-[42%] border-4 border-white">
        <div className="relative aspect-square">
          <img src={f.before.src} alt={f.before.alt} loading="lazy" />
          <span className="absolute bottom-2 left-2 rounded-full bg-white/85 px-2.5 py-0.5 text-[11.5px] font-semibold text-ink">
            {f.before.chip}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Suite() {
  const [active, setActive] = useState("map");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    features.forEach((f) => {
      const el = document.getElementById(f.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <section id="suite" className="bg-cream">
      <div className="mx-auto max-w-[1200px] px-5 pt-24 pb-10 text-center">
        <Reveal>
          <h2 className="text-[34px] font-semibold tracking-[-0.02em] text-ink md:text-[44px]">
            How Steady helps
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-[16px] text-ink-soft">
            Four simple steps. One friendly voice. Real change.
          </p>
        </Reveal>
      </div>

      {/* sticky tabs */}
      <div className="sticky top-16 z-30 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-2 px-5 py-3">
          {features.map((f) => (
            <a
              key={f.id}
              href={`#${f.id}`}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition ${
                active === f.id
                  ? "bg-sage text-white shadow-[0_8px_20px_-8px_rgba(62,122,94,0.6)]"
                  : "bg-white text-ink-soft shadow-sm hover:text-ink"
              }`}
            >
              <f.Icon className="h-4 w-4" /> {f.tab}
            </a>
          ))}
        </div>
      </div>

      {/* feature rows */}
      <div className="mx-auto max-w-[1200px] space-y-20 px-5 py-16 md:space-y-28 md:py-20">
        {features.map((f, idx) => (
          <div
            key={f.id}
            id={f.id}
            className="grid scroll-mt-32 items-center gap-12 md:grid-cols-2 md:gap-16"
          >
            {/* copy */}
            <Reveal>
              <div className={`max-w-[440px] ${idx % 2 ? "md:order-2 md:justify-self-end" : ""}`}>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-semibold"
                  style={{ background: `${f.accent}1a`, color: f.accent }}
                >
                  <f.Icon className="h-4 w-4" /> {f.tab}
                </div>
                <h3 className="mt-4 text-[28px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink md:text-[34px]">
                  {f.title}
                </h3>
                <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">{f.body}</p>
                <ul className="mt-5 space-y-3">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[15px] text-ink">
                      <span
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                        style={{ background: `${f.accent}1f`, color: f.accent }}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <a
                  href="/know-more"
                  className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold transition hover:gap-2.5"
                  style={{ color: f.accent }}
                >
                  See how it works <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>

            {/* before/after photos */}
            <Reveal delay={80}>
              <div className={idx % 2 ? "md:order-1" : ""}>
                <PhotoPair f={f} />
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
