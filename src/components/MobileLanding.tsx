"use client";

import { useEffect, useRef, useState } from "react";
import { ph } from "@/lib/analytics";
import type { Variant } from "@/lib/landing";

/* /mobile — the page every ad lands on.
 * One big idea (Hormozi's rule of one): reassurance feeds the loop, so Steady
 * won't give it. Any time of day, never framed as a night-time thing. */

const INVITE = "/invite?from=mobile";
const CTA = "Start my 2-minute check";

const THOUGHTS = [
  "Did I lock the door?",
  "What if I said the wrong thing?",
  "Are my hands really clean?",
  "What if it means something about me?",
];

const VALUE = [
  { k: "Science-backed", d: "Built on ERP, the approach NICE recommends first for adults with OCD.", c: "from-[#ff3d00] to-[#ff8a00]" },
  { k: "Just talk", d: "Voice only. Nothing to type, no forms, no waiting room.", c: "from-[#ff8a00] to-[#ffc400]" },
  { k: "Start today", d: "Two minutes to apply, then you're talking to Steady.", c: "from-[#c86bff] to-[#ff5ea8]" },
  { k: "Free", d: "No card, no trial that turns into a bill.", c: "from-[#7b61ff] to-[#c86bff]" },
];

const STEPS = [
  { t: "Answer 9 quick questions", d: "Two minutes. No call, no email to wait for." },
  { t: "Talk to Steady out loud", d: "Say the thought that keeps coming back. Steady maps the loop with you." },
  { t: "Practise not feeding it", d: "No checking, no asking, no arguing. The thought loses its pull." },
];

const FAQ = [
  { q: "Is this just ChatGPT?", a: "No. A chatbot will reassure you, and reassurance feeds the loop. Steady runs one structured practice and never reassures." },
  { q: "What does it cost?", a: "Nothing. No card. Answer nine quick questions and you're in." },
  { q: "Is this therapy?", a: "No. Steady is a practice companion you use on your own. It uses the practice therapists use, and sits fine next to real therapy." },
  { q: "Will it make it worse?", a: "It never pushes. You set the speed and can stop mid-sentence. Letting a thought sit is uncomfortable for a minute, not dangerous." },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-in]");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Ticks({ dark = false }: { dark?: boolean }) {
  return (
    <ul className={`mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[13px] ${dark ? "text-white/75" : "text-ink-soft"}`}>
      {["Free", "No card", "2 minutes", "18+ in the US"].map((t) => (
        <li key={t} className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${dark ? "text-[#ffc400]" : "text-[#ff5a1f]"}`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 12 4 4L19 6" /></svg>
          {t}
        </li>
      ))}
    </ul>
  );
}

function Wave({ light = false }: { light?: boolean }) {
  return (
    <span className={`ml-wave ${light ? "light" : ""}`} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ animationDelay: `${i * 0.12}s` }} />)}
    </span>
  );
}

function DemoVideo({ onPlaySound }: { onPlaySound: () => void }) {
  const v = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  // Only load and play once it's near the screen: the hero must paint first.
  useEffect(() => {
    const el = v.current;
    if (!el) return;
    el.muted = true; // React leaves the muted attribute unset, which blocks autoplay
    let inView = false;
    const go = () => { if (inView && el.paused) el.play().catch(() => {}); };
    // First play can land before the file is ready; retry once it can play.
    el.addEventListener("canplay", go);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) { el.preload = "auto"; go(); }
      else el.pause();
    }, { rootMargin: "200px" });
    io.observe(el);
    const retry = setInterval(go, 1000);
    return () => { io.disconnect(); clearInterval(retry); el.removeEventListener("canplay", go); };
  }, []);
  const sound = () => {
    const el = v.current;
    if (!el) return;
    el.muted = !el.muted;
    if (!el.muted) { el.currentTime = 0; el.play().catch(() => {}); onPlaySound(); }
    setMuted(el.muted);
  };
  return (
    <div className="ml-phone relative mx-auto mt-8 w-[240px]" data-in>
      <video
        ref={v}
        src="/landing/demo-no-reassurance.mp4"
        poster="/landing/demo-no-reassurance.jpg"
        muted
        loop
        playsInline
        preload="none"
        className="block aspect-[9/16] w-full rounded-[30px] bg-white object-cover"
      />
      <button
        type="button"
        onClick={sound}
        className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-ink px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-lg"
      >
        {muted ? <Wave light /> : null}
        {muted ? "Tap to hear Steady" : "Mute"}
      </button>
    </div>
  );
}

export default function MobileLanding({ variant }: { variant: Variant }) {
  const heroCta = useRef<HTMLAnchorElement>(null);
  const [showBar, setShowBar] = useState(false);
  const [ti, setTi] = useState(0);
  // The ad's own loop thought opens the cycle, so the page starts where the ad left off.
  const adThought = (variant.loop[1]?.text || "").replace(/[“”"]/g, "");
  const thoughts = [adThought, ...THOUGHTS].filter((t, i, a) => t && a.indexOf(t) === i);
  useReveal();

  useEffect(() => {
    ph("mobile_view", { variant: variant.key, ad: variant.ad });
    const el = heroCta.current;
    if (!el) return;
    let heroGone = false;
    let closeIn = false;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.target === el) heroGone = !e.isIntersecting && e.boundingClientRect.top < 0;
        else closeIn = e.isIntersecting;
      });
      setShowBar(heroGone && !closeIn);
    });
    io.observe(el);
    const close = document.querySelector(".ml-close");
    if (close) io.observe(close);
    return () => io.disconnect();
  }, [variant.key, variant.ad]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setTi((i) => (i + 1) % thoughts.length), 3400);
    return () => clearInterval(t);
  }, [thoughts.length]);

  const tap = (place: string) => ph("mobile_cta_tap", { variant: variant.key, ad: variant.ad, place });

  const cta = (place: string, ref?: React.Ref<HTMLAnchorElement>) => (
    <a ref={ref} href={INVITE} onClick={() => tap(place)} className="ml-cta">
      <span>{CTA}</span>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </a>
  );

  return (
    <main className="ml mx-auto min-h-screen max-w-[520px] overflow-x-hidden bg-white text-ink">
      {/* ---------- hero ---------- */}
      <section className="relative px-5 pb-16 pt-5">
        <div className="ml-glow" aria-hidden />
        <header className="relative flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-[18px] font-semibold tracking-tight">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/steady-mark.webp" alt="" className="h-7 w-7" />
            steady
          </a>
          <span className="rounded-full bg-ink/[0.06] px-3 py-1 text-[12px] font-medium text-ink-soft">AI voice coach</span>
        </header>

        <p className="relative mt-8 inline-flex items-center gap-2 rounded-full border border-[#ff5a1f]/25 bg-[#fff3ec] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#d9480f]">
          <span className="ml-dot" aria-hidden /> Science-backed
        </p>
        <h1 className="relative mt-4 text-[42px] font-semibold leading-[0.98] tracking-[-0.045em]">
          Don&rsquo;t let intrusive thoughts <span className="ml-grad">win.</span>
        </h1>
        <p className="relative mt-4 text-[17px] leading-relaxed text-ink-soft">
          A free AI voice coach that walks you through ERP, the science-backed method for looping thoughts.
          It won&rsquo;t reassure you. It helps you stop needing to.
        </p>

        <div className="relative mt-6">
          {cta("hero", heroCta)}
          <Ticks />
        </div>

        {/* hero visual: the thought gets crossed out, Steady answers */}
        <div className="relative mt-12">
          <div className="overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(35,40,44,.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/man-walk-talking.jpg"
              alt="A man walking in a park in daylight, talking out loud through his earbuds"
              className="aspect-[4/3.6] w-full object-cover object-[62%_center]"
              fetchPriority="high"
            />
          </div>
          <div className="ml-thought absolute -top-5 left-3 max-w-[78%]" aria-live="polite">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">The thought</span>
            <p key={ti} className="ml-strike mt-0.5 text-[16px] font-semibold leading-snug">{thoughts[ti]}</p>
          </div>
          <div className="ml-reply absolute -bottom-6 left-6 right-3">
            <Wave />
            <p className="text-[14.5px] leading-snug">
              <strong className="font-semibold">Steady:</strong>{" "}Notice it. You don&rsquo;t have to answer it.
            </p>
          </div>
        </div>

      </section>

      {/* ---------- the loop ---------- */}
      <section className="bg-ink px-5 py-16 text-white">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#ffc400]" data-in>Why it keeps coming back</p>
        <h2 className="mt-3 text-[34px] font-semibold leading-[1.04] tracking-[-0.03em]" data-in>
          Every check feeds the loop.
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-white/70" data-in>
          The thought shows up. You check, ask or argue with it. It goes quiet for a minute, then comes back
          louder. The relief is what teaches it to return.
        </p>
        <div className="ml-loop mx-auto mt-10" data-in aria-hidden>
          <div className="ml-ring" />
          <span className="ml-node n1">Thought</span>
          <span className="ml-node n2">Anxiety</span>
          <span className="ml-node n3">Check</span>
          <span className="ml-node n4">Relief</span>
          <div className="ml-core">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/steady-mark.webp" alt="" />
          </div>
        </div>
        <p className="mt-10 text-center text-[19px] font-semibold leading-snug" data-in>
          Stop feeding it, and it <span className="ml-grad">loses its grip.</span>
        </p>
      </section>

      {/* ---------- how ---------- */}
      <section className="px-5 py-16">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#d9480f]" data-in>How it works</p>
        <h2 className="mt-3 text-[34px] font-semibold leading-[1.04] tracking-[-0.03em]" data-in>
          Talking to Steady today.
        </h2>
        <ol className="mt-8 space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.t} className="flex gap-4 rounded-3xl bg-[#f7f7f8] p-5" data-in style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="ml-num">{i + 1}</span>
              <div>
                <p className="text-[17px] font-semibold">{s.t}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8" data-in>{cta("how")}</div>
      </section>

      {/* ---------- value ---------- */}
      <section className="bg-[#fff6f0] px-5 py-16">
        <h2 className="text-[34px] font-semibold leading-[1.04] tracking-[-0.03em]" data-in>
          Real help, without the waiting list.
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {VALUE.map((v, i) => (
            <div key={v.k} className="rounded-3xl bg-white p-4 shadow-[0_12px_30px_-20px_rgba(217,72,15,.55)]" data-in style={{ transitionDelay: `${i * 80}ms` }}>
              <span className={`block h-1.5 w-10 rounded-full bg-gradient-to-r ${v.c}`} />
              <p className="mt-4 text-[17px] font-semibold leading-tight">{v.k}</p>
              <p className="mt-1.5 text-[13.5px] leading-snug text-ink-soft">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- sounds like ---------- */}
      <section className="px-5 py-16">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#d9480f]" data-in>What it sounds like</p>
        <h2 className="mt-3 text-[34px] font-semibold leading-[1.04] tracking-[-0.03em]" data-in>
          It won&rsquo;t reassure you. That&rsquo;s the point.
        </h2>
        <DemoVideo onPlaySound={() => ph("mobile_demo_sound", { variant: variant.key })} />
        <p className="mt-4 text-center text-[13px] text-ink-soft">Steady, answering someone who asks for reassurance.</p>
      </section>

      {/* ---------- who + founder ---------- */}
      <section className="px-5 pb-16">
        <div className="grid gap-3" data-in>
          <div className="rounded-3xl bg-[#effaf3] p-5">
            <p className="text-[15px] font-semibold text-[#1e7a46]">For you if</p>
            <p className="mt-1 text-[15px] leading-relaxed">a thought keeps pulling you into checking, asking or arguing, and it comes back anyway.</p>
          </div>
          <div className="rounded-3xl bg-[#f7f7f8] p-5">
            <p className="text-[15px] font-semibold text-ink-soft">Not for</p>
            <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
              anyone in crisis, under 18 or outside the US. Steady is not therapy or medical care. In crisis, call or text{" "}
              <a href="tel:988" className="font-semibold text-ink underline">988</a>.
            </p>
          </div>
        </div>
        <figure className="mt-6 flex items-start gap-4" data-in>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/landing/hayat.jpg" alt="Hayat Amin" className="h-12 w-12 shrink-0 rounded-full object-cover" loading="lazy" />
          <blockquote>
            <p className="text-[15px] leading-relaxed">
              &ldquo;I built Steady because the loop does not keep office hours, and the people who have it should
              not have to wait for one.&rdquo;
            </p>
            <figcaption className="mt-2 text-[13px] text-ink-soft">Hayat Amin, founder</figcaption>
          </blockquote>
        </figure>
      </section>

      {/* ---------- faq ---------- */}
      <section className="bg-[#f7f7f8] px-5 py-14">
        <h2 className="text-[26px] font-semibold tracking-[-0.02em]">Before you start</h2>
        <div className="mt-5 space-y-2">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl bg-white px-4"
              onToggle={(e) => { if ((e.currentTarget as HTMLDetailsElement).open) ph("mobile_faq_open", { q: f.q }); }}
            >
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 text-[15.5px] font-semibold">
                {f.q}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#fff3ec] text-[#d9480f] transition group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="pb-4 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- close ---------- */}
      <section className="ml-close relative overflow-hidden px-5 pb-32 pt-16 text-center text-white">
        <div className="ml-close-ring" aria-hidden />
        <h2 className="relative text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.035em]">
          The thought shows up. It doesn&rsquo;t get to <span className="ml-grad">win.</span>
        </h2>
        <p className="relative mt-4 text-[16px] text-white/75">Free, two minutes, and you start today.</p>
        <div className="relative mt-8">
          {cta("bottom")}
          <Ticks dark />
        </div>
        <p className="relative mt-10 text-[12px] text-white/50">
          Beyond Elevation Ltd · <a href="/privacy" className="underline">Privacy</a>
        </p>
      </section>

      {/* ---------- sticky ---------- */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 transition-transform duration-300 ${
          showBar ? "translate-y-0" : "translate-y-[120%]"
        }`}
        aria-hidden={!showBar}
      >
        <a href={INVITE} tabIndex={showBar ? 0 : -1} onClick={() => tap("sticky")} className="ml-cta mx-auto max-w-[480px]">
          <span>{CTA}</span>
        </a>
      </div>

      <style>{`
        .ml-grad { background: linear-gradient(90deg,#ff3d00,#ff8a00 45%,#c86bff); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .ml-glow { position:absolute; inset:-40px -60px auto; height:440px; pointer-events:none;
          background: radial-gradient(50% 50% at 85% 18%, rgba(255,138,0,.25), transparent 70%), radial-gradient(45% 45% at 5% 40%, rgba(200,107,255,.2), transparent 70%); }
        .ml-dot { width:7px; height:7px; border-radius:99px; background:#ff5a1f; animation: mlPing 1.8s infinite; }
        @keyframes mlPing { 0%{box-shadow:0 0 0 0 rgba(255,90,31,.55)} 80%,100%{box-shadow:0 0 0 9px rgba(255,90,31,0)} }

        .ml-cta { position:relative; display:flex; min-height:60px; width:100%; align-items:center; justify-content:center; gap:10px; border-radius:999px; color:#fff; font-size:17px; font-weight:600;
          background: linear-gradient(90deg,#ff3d00,#ff7a00 50%,#d14fd6); background-size:200% 100%; animation: mlShift 6s ease-in-out infinite;
          box-shadow: 0 14px 34px -12px rgba(255,61,0,.6); transition: transform .2s; }
        .ml-cta:active { transform: scale(.97); }
        @keyframes mlShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

        .ml-thought, .ml-reply { border-radius:20px; background:rgba(255,255,255,.95); backdrop-filter: blur(12px); padding:10px 14px; box-shadow:0 18px 40px -18px rgba(35,40,44,.5); }
        .ml-strike { position:relative; display:inline-block; animation: mlIn .5s cubic-bezier(.23,1,.32,1) both; }
        .ml-strike::after { content:""; position:absolute; left:0; top:55%; height:3px; width:100%; border-radius:2px; background: linear-gradient(90deg,#ff3d00,#c86bff);
          transform-origin:left; transform:scaleX(0); animation: mlLine .6s 1.6s cubic-bezier(.23,1,.32,1) forwards; }
        @keyframes mlIn { from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:none} }
        @keyframes mlLine { to { transform:scaleX(1) } }
        .ml-reply { display:flex; align-items:center; gap:10px; animation: mlFloat 5s ease-in-out infinite; }
        @keyframes mlFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }

        .ml-wave { display:inline-flex; align-items:center; gap:3px; height:22px; flex-shrink:0; }
        .ml-wave i { width:3px; height:100%; border-radius:3px; background: linear-gradient(#ff3d00,#c86bff); animation: mlBar 1s ease-in-out infinite; }
        .ml-wave.light i { background:#fff; }
        @keyframes mlBar { 0%,100%{transform:scaleY(.3)} 50%{transform:scaleY(1)} }

        [data-in] { opacity:0; transform: translateY(18px); transition: opacity .7s cubic-bezier(.19,1,.22,1), transform .7s cubic-bezier(.19,1,.22,1); }
        [data-in].is-in { opacity:1; transform:none; }

        .ml-num { display:grid; place-items:center; flex-shrink:0; width:40px; height:40px; border-radius:14px; color:#fff; font-weight:700; font-size:17px; background: linear-gradient(135deg,#ff3d00,#c86bff); }

        .ml-loop { position:relative; width:260px; height:260px; }
        .ml-ring { position:absolute; inset:22px; border-radius:50%; border:2px dashed rgba(255,255,255,.25); animation: mlSpin 12s linear infinite; }
        .ml-ring::before { content:""; position:absolute; top:-7px; left:50%; width:12px; height:12px; margin-left:-6px; border-radius:50%; background:#ffc400; box-shadow:0 0 18px #ff8a00; }
        @keyframes mlSpin { to { transform: rotate(360deg) } }
        .ml-node { position:absolute; padding:6px 12px; border-radius:999px; background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.2); font-size:13px; font-weight:600; backdrop-filter: blur(6px); }
        .n1 { top:4px; left:50%; transform:translateX(-50%); } .n2 { right:-8px; top:50%; transform:translateY(-50%); }
        .n3 { bottom:4px; left:50%; transform:translateX(-50%); } .n4 { left:-8px; top:50%; transform:translateY(-50%); }
        .ml-core { position:absolute; inset:86px; border-radius:50%; display:grid; place-items:center; background: radial-gradient(circle, rgba(255,138,0,.3), transparent 70%); animation: mlBreathe 4s ease-in-out infinite; }
        .ml-core img { width:56px; height:56px; }
        @keyframes mlBreathe { 0%,100%{transform:scale(.92)} 50%{transform:scale(1.08)} }

        .ml-close { background: radial-gradient(120% 80% at 50% 0%, #3a1a5c 0%, #23282c 62%); }
        .ml-close-ring { position:absolute; left:50%; top:-140px; width:440px; height:440px; margin-left:-220px; border-radius:50%;
          background: conic-gradient(from 0deg, #ff3d00, #ff8a00, #ffc400, #c86bff, #ff3d00); filter: blur(60px); opacity:.4; animation: mlSpin 18s linear infinite; }

        .ml-phone { padding:8px; border-radius:38px; background:#111; box-shadow: 0 40px 70px -30px rgba(255,61,0,.55), 0 0 0 1px rgba(0,0,0,.08); }

        @media (prefers-reduced-motion: reduce) {
          .ml *, .ml *::before, .ml *::after { animation: none !important; }
          .ml-strike::after { transform: scaleX(1); }
          [data-in] { opacity:1; transform:none; transition:none; }
        }
      `}</style>
    </main>
  );
}
