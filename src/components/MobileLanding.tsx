"use client";

import { useEffect, useRef, useState } from "react";
import { ph } from "@/lib/analytics";
import type { Variant } from "@/lib/landing";

const INVITE = "/invite";

const STEPS = [
  { t: "Say it out loud", d: "The thought that keeps coming back. No typing." },
  { t: "Steady draws the loop", d: "What set it off, the thought, the thing you do about it." },
  { t: "Let it pass", d: "Practise doing nothing about it. Ten minutes, your speed." },
];

const FAQ = [
  {
    q: "Is this therapy?",
    a: "No. Steady is a practice companion you use on your own. It uses the practice therapists use, and it sits fine next to real therapy.",
  },
  {
    q: "Will it make it worse?",
    a: "It never pushes. You set the speed and can stop mid-sentence. Letting a thought sit is uncomfortable for a minute, not dangerous.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. No card, no trial that turns into a bill. Answer nine questions and you're in.",
  },
  {
    q: "What happens to what I say?",
    a: "We never sell it and never pass it on. The full detail is on the privacy page, in plain English.",
  },
];

export default function MobileLanding({ variant }: { variant: Variant }) {
  const heroCta = useRef<HTMLAnchorElement>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    ph("mobile_view", { variant: variant.key, ad: variant.ad });
    const el = heroCta.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [variant.key, variant.ad]);

  const tap = (place: string) => ph("mobile_cta_tap", { variant: variant.key, ad: variant.ad, place });

  return (
    <main className="mx-auto min-h-screen max-w-[480px] bg-white text-ink">
      {/* hero: everything needed to decide sits above the fold */}
      <section className="relative">
        <div className="relative h-[42svh] min-h-[260px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={variant.image}
            alt={variant.imageAlt}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-white" />
          <a href="/" className="absolute left-5 top-4 text-[17px] font-semibold tracking-tight text-white drop-shadow">
            steady
          </a>
        </div>

        <div className="-mt-10 relative px-5">
          <p className="text-[14px] leading-snug text-ink-soft">{variant.mirror}</p>
          <h1 className="mt-3 text-balance text-[30px] font-semibold leading-[1.1] tracking-[-0.025em]">
            {variant.headline}
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
            A warm voice you talk to when a thought won&rsquo;t stop looping. Ten minutes, out loud, tonight.
          </p>

          <a
            ref={heroCta}
            href={INVITE}
            onClick={() => tap("hero")}
            className="btn-dark mt-6 flex min-h-[56px] w-full items-center justify-center rounded-full text-[17px] font-semibold"
          >
            Apply for a place, free
          </a>
          <p className="mt-3 text-center text-[13px] text-ink-soft">
            9 questions · 2 minutes · no card · adults 18+
          </p>
        </div>
      </section>

      {/* how it works */}
      <section className="mt-14 px-5">
        <h2 className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink-soft/80">How it works</h2>
        <ol className="mt-5 space-y-5">
          {STEPS.map((s, i) => (
            <li key={s.t} className="flex gap-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-[13px] font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-[16px] font-semibold">{s.t}</p>
                <p className="mt-0.5 text-[15px] leading-relaxed text-ink-soft">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* what a minute sounds like */}
      <section className="mt-14 px-5">
        <h2 className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink-soft/80">What it sounds like</h2>
        <div className="mt-5 space-y-3 text-[15px] leading-relaxed">
          <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-cream-2 px-4 py-3">
            It&rsquo;s the door again. I know I locked it. I can feel myself getting up.
          </p>
          <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-ink px-4 py-3 text-white">
            Stay where you are for a second. Tell me what the thought says will happen if you don&rsquo;t check.
          </p>
        </div>
        <p className="mt-3 text-[13px] text-ink-soft">
          An example. Steady never reassures you, so the loop has nothing to feed on.
        </p>
      </section>

      {/* for / not for */}
      <section className="mt-14 px-5">
        <div className="rounded-2xl border border-line p-5">
          <p className="text-[15px] font-semibold">For you if</p>
          <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
            you check, ask, search or argue with the same thought, and it comes back anyway.
          </p>
          <p className="mt-4 text-[15px] font-semibold">Not for</p>
          <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
            a crisis. Steady is not therapy, not medical care and not an emergency service.
          </p>
        </div>
      </section>

      {/* objections */}
      <section className="mt-14 px-5">
        <h2 className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink-soft/80">Questions</h2>
        <div className="mt-3 divide-y divide-line border-y border-line">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="group"
              onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && ph("mobile_faq_open", { q: f.q })}
            >
              <summary className="flex min-h-[54px] cursor-pointer list-none items-center justify-between gap-3 text-[15.5px] font-medium">
                {f.q}
                <span className="text-ink-soft transition group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="pb-4 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* close */}
      <section className="mt-14 px-5 pb-32 text-center">
        <h2 className="text-balance text-[26px] font-semibold leading-tight tracking-[-0.02em]">
          Back in the room, tonight.
        </h2>
        <a
          href={INVITE}
          onClick={() => tap("bottom")}
          className="btn-dark mt-6 flex min-h-[56px] w-full items-center justify-center rounded-full text-[17px] font-semibold"
        >
          Apply for a place, free
        </a>
        <p className="mt-8 text-[12.5px] leading-relaxed text-ink-soft">
          If tonight is worse than a loop, call someone now: 988 in the US, 999 in the UK, or your local
          emergency number.
        </p>
        <p className="mt-4 text-[12px] text-ink-soft/80">
          Beyond Elevation Ltd · <a href="/privacy" className="underline">Privacy</a>
        </p>
      </section>

      {/* sticky bar once the hero button scrolls away */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!showBar}
      >
        <a
          href={INVITE}
          tabIndex={showBar ? 0 : -1}
          onClick={() => tap("sticky")}
          className="btn-dark mx-auto flex min-h-[52px] max-w-[440px] items-center justify-center rounded-full text-[16px] font-semibold"
        >
          Apply for a place, free
        </a>
      </div>
    </main>
  );
}
