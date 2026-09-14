"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ph } from "@/lib/analytics";
import { PREFILL_KEY, VARIANTS, type Variant } from "@/lib/landing";

/* The ad landing page.
 *
 * Rules this page is built to, all of them deliberate:
 *   one goal, one primary action, no navigation, no exits
 *   the offer inside the first screen, the form one tap behind a button
 *   the advert plays behind the whole page, so it is never "watch this then read that"
 *   air between every block, every block see-through, so the film stays visible
 *   48px tap targets, everything reachable in the bottom two thirds
 *   email first — the nine-question screen still happens, just after
 *   short words, short sentences, no jargon
 *
 * No invented users, ratings or testimonials. The proof on this page is the
 * method, the founder, a real count when there is one, and the product
 * itself: a transcript you can read and a taster you can talk to.
 */

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

// The one solid colour on the page. It is the warm mid-tone of the mark, and
// nothing else on the page is allowed to be it.
const CTA = "bg-[#f59e4a] text-[#1c1408] shadow-[0_10px_30px_-12px_rgba(245,158,74,0.7)]";

/* The taster is the homepage's voice hero, borrowed whole. It is 800 lines
   and its own audio pool, so it loads only once the reader scrolls to it. */
const VoiceHero = dynamic(() => import("./VoiceHero"), { ssr: false });

type FormProps = {
  variant: Variant;
  place: "hero" | "close";
  /** Two-step: the field is hidden behind the button until the first tap. */
  twoStep?: boolean;
};

function LeadForm({ variant, place, twoStep = false }: FormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(!twoStep);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const started = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const valid = EMAIL.test(email.trim());

  const reveal = () => {
    ph("landing_cta_tap", { variant: variant.key, ad: variant.ad, place: `${place}_reveal` });
    setOpen(true);
    // Focus after the field has rendered, so the keyboard comes up on the tap.
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const onChange = (value: string) => {
    setEmail(value);
    if (error) setError("");
    if (!started.current && value.length > 2) {
      started.current = true;
      ph("landing_form_start", { variant: variant.key, ad: variant.ad, place });
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL.test(value)) {
      setError("That email doesn’t look right — check it and try again.");
      return;
    }
    setSending(true);
    ph("landing_cta_tap", { variant: variant.key, ad: variant.ad, place });

    // The lead is saved before the questions start, so a drop-out at question
    // six is still someone we can write to. A failure here must not block the
    // application itself, so it is logged and the visitor moves on regardless.
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value,
          variant: variant.key,
          ad: variant.ad,
          source: typeof window === "undefined" ? "" : window.location.search.slice(0, 200),
        }),
      });
    } catch {
      /* offline or blocked — the application flow is still the real gate */
    }

    try {
      sessionStorage.setItem(PREFILL_KEY, value);
    } catch {
      /* storage blocked — /invite will just ask for the email again */
    }

    ph("landing_lead", { variant: variant.key, ad: variant.ad, place });
    router.push("/invite");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={reveal}
        className={`${CTA} inline-flex h-[56px] w-full items-center justify-center rounded-2xl px-6 text-[17px] font-semibold transition active:scale-[0.97]`}
      >
        {variant.formCta ?? variant.cta}
      </button>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="w-full">
      {twoStep ? (
        <p className="mb-3 text-[15px] leading-snug text-white/85">
          Then Steady says hello, and you say what is going round.
        </p>
      ) : null}
      <div className="flex flex-col gap-2.5">
        <label htmlFor={`email-${place}`} className="sr-only">
          Your email address
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            id={`email-${place}`}
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="go"
            spellCheck={false}
            placeholder="you@email.com"
            value={email}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `email-error-${place}` : undefined}
            className="h-[54px] w-full rounded-2xl border border-white/25 bg-white/10 pl-4 pr-12 text-[16px] text-white outline-none backdrop-blur-sm transition placeholder:text-white/45 focus:border-white/60 focus:bg-white/16 focus:ring-4 focus:ring-white/15"
          />
          {/* A tick that appears the moment the address is real. Feedback
              before the button, so the button is never a guess. */}
          <span
            aria-hidden
            className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
              valid ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5 text-[#f59e4a]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10.5l4 4 8-9" />
            </svg>
          </span>
        </div>
        <button
          type="submit"
          disabled={sending}
          className={`${CTA} inline-flex h-[56px] w-full items-center justify-center rounded-2xl px-6 text-[17px] font-semibold transition active:scale-[0.97] disabled:opacity-60`}
        >
          {sending ? "One moment…" : variant.formCta ?? variant.cta}
        </button>
      </div>
      {error ? (
        <p id={`email-error-${place}`} role="alert" className="mt-2 text-[13.5px] text-[#ffb4a6]">
          {error}
        </p>
      ) : null}
      <p className="mt-3 flex items-center gap-1.5 text-[12.5px] text-white/60">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        Encrypted. Your email, and nothing else. We never sell it. We never pass it on.
      </p>
    </form>
  );
}

function Chips() {
  return (
    <ul className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[12.5px] font-medium">
      {["Free", "No card", "About 2 minutes", "Tonight"].map((chip) => (
        <li
          key={chip}
          className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-white/85"
        >
          {chip}
        </li>
      ))}
    </ul>
  );
}

/* The advert, behind everything.
 *
 * It is the 40-second film cut to a phone shape and re-encoded down from
 * 21MB to 2MB, with its voice-over kept so it can be turned on. First paint is
 * a small poster so the page is readable before a frame arrives; the film
 * fades in once it is actually playing, and never on Reduce Motion or Data
 * Saver. Fixed rather than scrolled, so it keeps running behind every section.
 */
function AdvertBackdrop({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) {
  const [motionOk, setMotionOk] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduce || conn?.saveData) return;
    const t = setTimeout(() => setMotionOk(true), 250);
    return () => clearTimeout(t);
  }, []);

  // The autoplay attribute is not a guarantee. iOS Low Power Mode and a few
  // desktop policies refuse it outright even for a muted, inline video. Keep
  // asking on every gesture until it is genuinely playing.
  useEffect(() => {
    const video = videoRef.current;
    if (!motionOk || !video) return;
    const events = ["pointerdown", "touchstart", "click", "keydown", "scroll"] as const;
    const kick = () => {
      void video.play().catch(() => {});
    };
    const bind = () => events.forEach((e) => window.addEventListener(e, kick, { passive: true }));
    const unbind = () => events.forEach((e) => window.removeEventListener(e, kick));
    video.addEventListener("playing", unbind);
    void video.play().catch(bind);
    return () => {
      unbind();
      video.removeEventListener("playing", unbind);
    };
  }, [motionOk, videoRef]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#14161a]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/landing/advert-poster.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px]"
      />
      {motionOk ? (
        <video
          ref={videoRef}
          src="/landing/advert-bg.mp4"
          poster="/landing/advert-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setReady(true)}
          // Lifted a touch: the advert was graded for a full-bleed screen with
          // nothing on top of it, and under a scrim the mid-tones go to mud.
          style={{ filter: "brightness(1.12) saturate(1.18) contrast(1.04)" }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}
      {/* One light scrim only. Every block of text carries its own panel. */}
      <div className="absolute inset-0 bg-[#0e1013]/38" />
    </div>
  );
}

/** A block of content floating over the film, with air above and below it.
 *  Deliberately see-through: the panel leans on blur for legibility rather
 *  than on opacity, so the film stays visible through it. */
function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[28px] border border-white/18 bg-[#0e1013]/44 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_24px_70px_-30px_rgba(0,0,0,0.9)] backdrop-blur-lg sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/55">{children}</p>
  );
}

/* The four loops a visitor can pick on the page. Ad five ("watching") is for
   someone applying on another person's behalf and is not offered as a choice. */
const CHOICES = ["checker", "reassurance", "night", "pureo"] as const;

export default function Landing({ variant: initial }: { variant: Variant }) {
  const [variant, setVariant] = useState(initial);
  const [stage, setStage] = useState(0);
  const [shared, setShared] = useState(false);
  const [sound, setSound] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const loopRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const depth = useRef(0);

  useEffect(() => {
    ph("landing_view", { variant: initial.key, ad: initial.ad });
  }, [initial]);

  // A true count or nothing. The route returns null below its floor.
  useEffect(() => {
    fetch("/api/landing-count")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { week?: number | null } | null) => {
        if (d && typeof d.week === "number") setCount(d.week);
      })
      .catch(() => {});
  }, []);

  // The sticky bar appears once the hero is behind you, and its line changes
  // with what the reader has just been through. Driven off scroll position
  // rather than an observer: the hero is sized in dvh, which moves every time
  // a mobile browser collapses its address bar.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const hero = heroRef.current?.offsetHeight ?? window.innerHeight;
      const loopEnd = (loopRef.current?.offsetTop ?? 0) + (loopRef.current?.offsetHeight ?? 0);
      const faqEnd = (faqRef.current?.offsetTop ?? 0) + (faqRef.current?.offsetHeight ?? 0);
      const mid = y + window.innerHeight * 0.6;
      setStage(y <= hero * 0.85 ? 0 : mid > faqEnd ? 3 : mid > loopEnd ? 2 : 1);

      const max = document.body.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = Math.round((y / max) * 100);
      for (const mark of [25, 50, 75, 100]) {
        if (pct >= mark && depth.current < mark) {
          depth.current = mark;
          ph("landing_scroll", { variant: variant.key, depth: mark });
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [variant]);

  const toForm = useCallback((place: string) => {
    ph("landing_cta_tap", { variant: variant.key, ad: variant.ad, place });
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [variant]);

  const choose = useCallback((key: (typeof CHOICES)[number]) => {
    setVariant(VARIANTS[key]);
    ph("landing_loop_pick", { variant: key });
  }, []);

  const toggleSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const next = !sound;
    v.muted = !next;
    if (next) {
      v.currentTime = 0;
      void v.play().catch(() => {});
      ph("landing_sound_on", { variant: variant.key });
    }
    setSound(next);
  }, [sound, variant]);

  // Ad 5 is written to the person watching, and the ask is to pass it on
  // rather than to sign up. Share first, apply second.
  const share = useCallback(async () => {
    const url = `${window.location.origin}/landing?ad=pureo`;
    ph("landing_share", { variant: variant.key });
    try {
      if (navigator.share) {
        await navigator.share({ title: "Steady", text: "A warm voice for looping thoughts.", url });
        setShared(true);
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
    } catch {
      /* dismissed the share sheet — nothing to report */
    }
  }, [variant]);

  const barLine = [
    "",
    "Tonight, when it starts.",
    "That is the loop. Here is the way out.",
    "Nothing left to ask. Nine questions and you are in.",
  ][stage];

  return (
    <div className="landing-dark relative min-h-[100dvh] text-white">
      <AdvertBackdrop videoRef={videoRef} />

      {/* Header: wordmark and one button. No navigation on a paid landing page —
          every link here is an exit, and exits are what the ad paid for. */}
      <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-white/12 bg-[#0e1013]/45 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1040px] items-center justify-between px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <span className="wordmark-lockup text-[17px] text-white">
            <img src="/brand/steady-mark.webp" alt="" width={26} height={26} />
            Steady
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={sound}
              aria-label={sound ? "Turn the film's sound off" : "Turn the film's sound on"}
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/25 px-3.5 text-[13px] font-semibold text-white transition active:scale-[0.97]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                {sound ? (
                  <>
                    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                  </>
                ) : (
                  <path d="M22 9l-6 6M16 9l6 6" />
                )}
              </svg>
              {sound ? "Sound on" : "Sound"}
            </button>
            <button
              type="button"
              onClick={() => toForm("header")}
              className="h-11 rounded-full border border-white/25 px-4 text-[13.5px] font-semibold text-white transition active:scale-[0.97]"
            >
              {variant.forSomeoneElse ? "Have a look" : variant.cta}
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {/* ---------- 1. Hero. The film, then the offer, then one button. ---------- */}
        <section
          ref={heroRef}
          id="apply"
          className="relative flex min-h-[100dvh] flex-col px-4 pt-14"
        >
          {/* A clear band of nothing but film before a single word arrives. */}
          <div aria-hidden className="min-h-[6dvh] flex-1 lg:min-h-[10dvh]" />

          {/* The hero type sits straight on the film, so it gets its own scrim
              from the bottom up. Everything below the hero is on a panel. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 top-[16dvh] bg-[linear-gradient(to_top,rgba(10,12,15,0.92)_0%,rgba(10,12,15,0.8)_45%,rgba(10,12,15,0.3)_78%,rgba(10,12,15,0)_100%)]"
          />

          <div className="relative mx-auto w-full max-w-[560px] pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:grid lg:max-w-[1040px] lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-14">
            <div>
              <p className="rise inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                Science-backed technology
              </p>

              {/* The mirror line: the sentence the reader could have said. It
                  changes with the loop they pick. */}
              <p className="rise rise-1 mt-5 max-w-[34ch] text-[16.5px] leading-[1.45] text-white/80">
                {variant.mirror}
              </p>

              <h1 className="rise rise-1 mt-3 text-balance text-[clamp(1.85rem,7.8vw,2.6rem)] font-bold leading-[1.06] tracking-[-0.032em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.6)] lg:text-[3rem]">
                Steady is the first all-voice AI companion for people with looping thoughts.
              </h1>

              <p className="rise rise-2 mt-4 max-w-[32ch] text-[18px] leading-[1.5] text-white/90">
                Ten minutes a day, out loud. You let the thought come, and you let it go past. Then
                you are back in the room.
              </p>

              <p className="rise rise-2 mt-3 text-[18px] font-semibold leading-[1.35] text-white">
                The thought is not the problem. The check is.
              </p>

              {/* Pick your loop. The tap rewrites the mirror line, the loop map
                  and the exclusion below. A small commitment, and the page
                  becomes theirs. */}
              {!variant.forSomeoneElse ? (
                <div className="rise rise-3 mt-5">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/55">
                    Which one is yours?
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {CHOICES.map((key) => {
                      const v = VARIANTS[key];
                      const on = v.key === variant.key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => choose(key)}
                          aria-pressed={on}
                          className={`h-9 rounded-full border px-3.5 text-[13.5px] font-semibold transition active:scale-[0.97] ${
                            on
                              ? "border-white bg-white text-ink"
                              : "border-white/25 bg-white/10 text-white/90 backdrop-blur-sm"
                          }`}
                        >
                          {v.chip}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="lg:pb-2">
              {variant.forSomeoneElse ? (
                <div className="mt-8 lg:mt-0">
                  <button
                    type="button"
                    onClick={share}
                    className={`${CTA} inline-flex h-[56px] w-full items-center justify-center rounded-2xl px-6 text-[17px] font-semibold transition active:scale-[0.97]`}
                  >
                    {shared ? "Link copied — send it when you’re ready" : "Send it to them"}
                  </button>
                  <p className="mt-2.5 text-[13.5px] text-white/65">
                    Or look yourself first. Put your email in and you will see what they would.
                  </p>
                </div>
              ) : null}

              <div className="rise rise-4 mt-5 rounded-3xl border border-white/18 bg-[#0e1013]/44 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_24px_70px_-28px_rgba(0,0,0,0.9)] backdrop-blur-lg lg:mt-0">
                <LeadForm variant={variant} place="hero" twoStep={!variant.forSomeoneElse} />
                <div className="mt-4 flex flex-col gap-2.5">
                  <Chips />
                  {count !== null ? (
                    <p className="text-[13px] text-white/70">
                      <span className="font-semibold text-white">{count}</span>{" "}
                      {count === 1 ? "person" : "people"} started this week.
                    </p>
                  ) : null}
                </div>
              </div>

              <p className="mt-6 text-[12px] leading-snug text-white/55">
                For adults 18 and over. Nine short questions and you are in. Steady is not therapy,
                not medical care, and not a crisis service. {variant.exclusion}
              </p>
            </div>
          </div>
        </section>

        {/* ---------- 2. What a looping thought actually is. ---------- */}
        <section className="mx-auto w-full max-w-[560px] px-4 py-24">
          <Panel>
            <Eyebrow>What is a looping thought</Eyebrow>

            <div className="mt-6 flex flex-col gap-5 text-[19px] leading-[1.5] text-white/85">
              <p>A thought turns up. You did not ask for it.</p>
              <p>You try to make it go away. Check the door. Ask again. Look it up one more time.</p>
              <p>It goes quiet for a minute.</p>
              <p>Then it comes back, louder.</p>
            </div>

            <p className="mt-8 border-t border-white/12 pt-6 text-[20px] font-semibold leading-[1.35] text-white">
              That is a loop. And a loop is a thing that happens to you. It is not who you are.
            </p>

            <p className="mt-5 text-[17px] leading-[1.5] text-white/70">
              How many nights this week?
            </p>
          </Panel>
        </section>

        {/* ---------- 3. What the first minute sounds like. ----------
            The product is a voice. This is the only place on the page the
            reader gets to read it. An example exchange, not a recording of a
            real person, and it says so. */}
        <section className="mx-auto w-full max-w-[560px] px-4 pb-24">
          <Panel>
            <Eyebrow>What the first minute sounds like</Eyebrow>

            <div className="mt-6 flex flex-col gap-4">
              {[
                { who: "you", t: "It’s the door again. I know I locked it. I can feel myself getting up." },
                { who: "steady", t: "Stay where you are for a second. You know it is locked. Tell me what the thought says will happen if you don’t check." },
                { who: "you", t: "That I’ll wake up and the house will be open." },
                { who: "steady", t: "Okay. Let that sentence sit there. We are not going to argue with it, and we are not going to check. Just notice it is there, and that you are still on the sofa. That is the whole thing." },
              ].map((line, i) =>
                line.who === "you" ? (
                  <p
                    key={i}
                    className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-[15.5px] leading-relaxed text-ink"
                  >
                    {line.t}
                  </p>
                ) : (
                  <p
                    key={i}
                    className="mr-auto w-fit max-w-[90%] rounded-2xl rounded-bl-md border border-white/15 bg-white/[0.07] px-4 py-2.5 text-[15.5px] leading-relaxed text-white/90"
                  >
                    <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f59e4a]">
                      Steady
                    </span>
                    {line.t}
                  </p>
                ),
              )}
            </div>

            <p className="mt-6 text-[13.5px] leading-relaxed text-white/55">
              An example of a first exchange. Steady never reassures you. It will not tell you the
              door is locked.
            </p>
          </Panel>
        </section>

        {/* ---------- 4. Hear it before you give anything. ----------
            The homepage's taster, in a light window over the film. The reader
            talks; Steady answers in its own voice. No email first. */}
        <section className="mx-auto w-full max-w-[720px] px-4 pb-24">
          <div className="mb-5 px-2">
            <Eyebrow>Hear it first</Eyebrow>
            <h2 className="mt-3 text-balance text-[clamp(1.55rem,6.6vw,2rem)] font-bold leading-[1.12] tracking-[-0.025em]">
              Say one sentence. Hear Steady answer.
            </h2>
            <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-white/70">
              One minute, nothing saved, no email. Then decide.
            </p>
          </div>
          <div className="overflow-hidden rounded-[28px] border border-white/20 bg-cream text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] [&_section]:min-h-0 [&_section]:px-5 [&_section]:pb-8 [&_section]:pt-8 sm:[&_section]:pt-10">
            <VoiceHero compact />
          </div>
        </section>

        {/* ---------- 5. How the loop gets drawn. ---------- */}
        <section ref={loopRef} className="mx-auto w-full max-w-[560px] px-4 pb-24">
          <Panel>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-3 text-balance text-[clamp(1.55rem,6.6vw,2rem)] font-bold leading-[1.12] tracking-[-0.025em]">
              It is not you. It is a loop. And a loop can be drawn.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-white/70">
              You say it out loud. Steady draws the loop with you. What set it off. The thought.
              The thing you do to make the thought stop. Once it is drawn, it stops feeling like
              it is you, and you can be back in the room.
            </p>

            <ol className="mt-8 flex flex-col">
              {variant.loop.map((step, index) => {
                const last = index === variant.loop.length - 1;
                return (
                  <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span
                        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                          last ? "bg-white text-ink" : "bg-white/15 text-white"
                        }`}
                      >
                        {last ? "✓" : index + 1}
                      </span>
                      {last ? null : <span aria-hidden className="mt-1 w-px flex-1 bg-white/20" />}
                    </div>
                    <div className="pb-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                        {step.label}
                      </p>
                      <p className="mt-1 text-[16.5px] font-semibold leading-snug text-white">
                        {step.text}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <p className="mt-2 border-t border-white/12 pt-5 text-[15px] leading-relaxed text-white/65">
              Therapists have used this practice for forty years. Steady did not invent it. It
              gives you somewhere to do it at 3am, out loud, at your own speed.
            </p>
          </Panel>
        </section>

        {/* ---------- 6. What actually happens. ---------- */}
        <section className="mx-auto w-full max-w-[560px] px-4 pb-24">
          <Panel>
            <Eyebrow>What happens</Eyebrow>
            <h2 className="mt-3 text-balance text-[clamp(1.55rem,6.6vw,2rem)] font-bold leading-[1.12] tracking-[-0.025em]">
              Ten minutes from now it could be out of your head.
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-white/70">
              Ten minutes, out loud, with the first all-voice AI companion built for looping
              thoughts. No typing. No forms. No waiting room.
            </p>

            <div className="mt-8 flex flex-col gap-6">
              {[
                {
                  t: "You talk. It listens.",
                  d: "No typing. No blank box staring back. You say what is going round and a warm voice answers.",
                },
                {
                  t: "The loop gets drawn.",
                  d: "What set it off. The thought. The thing you do about it. Said out loud, so you can see the shape of it instead of living inside it.",
                },
                {
                  t: "You practise letting it pass.",
                  d: "You let the thought sit there and you do nothing about it. Nothing happens. That is the whole trick. Therapists have a name for it, and it is the method they trust most. Always your speed. Never a push.",
                },
              ].map((item) => (
                <div key={item.t} className="border-l-2 border-white/30 pl-4">
                  <p className="text-[17px] font-semibold leading-snug">{item.t}</p>
                  <p className="mt-1.5 text-[15.5px] leading-relaxed text-white/70">{item.d}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-[15px] leading-relaxed text-white/80">
              <span className="font-semibold text-white">Who this is not for. </span>
              {variant.exclusion}
            </p>
          </Panel>
        </section>

        {/* ---------- 7. Why it exists. ---------- */}
        <section className="mx-auto w-full max-w-[560px] px-4 pb-24">
          <Panel>
            <div className="flex items-start gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/landing/hayat.jpg"
                alt="Hayat Amin, who built Steady"
                width={72}
                height={96}
                loading="lazy"
                className="h-[96px] w-[72px] shrink-0 rounded-2xl object-cover object-top"
              />
              <div>
                <Eyebrow>Why it exists</Eyebrow>
                <p className="mt-3 text-[17px] leading-[1.5] text-white/90">
                  I built Steady because the loop does not keep office hours, and the people who
                  have it should not have to wait for one.
                </p>
                <p className="mt-3 text-[13.5px] text-white/55">Hayat Amin, founder</p>
              </div>
            </div>
          </Panel>
        </section>

        {/* ---------- 8. The four things people ask before they apply. ---------- */}
        <section ref={faqRef} className="mx-auto w-full max-w-[560px] px-4 pb-24">
          <Panel>
            <Eyebrow>Before you put your email in</Eyebrow>
            <h2 className="mt-3 text-balance text-[clamp(1.55rem,6.6vw,2rem)] font-bold leading-[1.12] tracking-[-0.025em]">
              The four questions everybody has.
            </h2>

            <div className="mt-7 flex flex-col gap-3">
              {[
                {
                  q: "Will it make it worse?",
                  a: "We will never push you. You set the speed, you can stop mid-sentence, and Steady will never make you do anything you have not said yes to out loud. If a session does not feel right, you say so and it stops. Letting a thought sit there is uncomfortable for a minute. It is not dangerous, and it is the thing that works.",
                },
                {
                  q: "Is this therapy?",
                  a: "No, and we will never pretend it is. Steady is a practice companion you use on your own. It uses the same practice therapists use, and it sits well next to real therapy. It does not replace it, and we will tell you so every time it matters.",
                },
                {
                  q: "What happens to my voice?",
                  a: "We will never sell it and we will never pass it on. Your voice goes to OpenAI so the conversation can work, and the one-minute taster is never saved. The full detail is on our privacy page, in plain English.",
                },
                {
                  q: "What does it cost?",
                  a: "We will never charge you for this. No card, no trial that turns into a bill, no queue you can pay to skip. Answer the nine questions and you are in. If your answers show Steady is the wrong place for you right now, we will say so and point you somewhere better.",
                },
              ].map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-white/12 bg-white/[0.05] px-4 transition-colors hover:border-white/20 hover:bg-white/[0.08] open:border-white/20 open:bg-white/[0.09]"
                  onToggle={(e) =>
                    (e.currentTarget as HTMLDetailsElement).open
                      ? ph("landing_faq_open", { variant: variant.key, q: item.q })
                      : undefined
                  }
                >
                  <summary className="flex min-h-[54px] cursor-pointer list-none items-center justify-between gap-3 text-[15.5px] font-semibold marker:hidden">
                    {item.q}
                    <span
                      aria-hidden
                      className="shrink-0 text-[20px] font-normal leading-none text-white/50 transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-4 pr-6 text-[15px] leading-relaxed text-white/70">{item.a}</p>
                </details>
              ))}
            </div>
          </Panel>
        </section>

        {/* ---------- 9. Close. ---------- */}
        <section className="mx-auto w-full max-w-[560px] px-4 pb-28">
          <Panel>
            <h2 className="text-balance text-[clamp(1.65rem,7.2vw,2.2rem)] font-bold leading-[1.08] tracking-[-0.028em]">
              {variant.forSomeoneElse
                ? "You cannot do this one for her. You can put it in front of her."
                : "Back in the room, tonight."}
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-white/70">
              Free. No card. Adults 18 and over. Nine short questions, about two minutes, and you
              are in.
            </p>

            <div className="mt-7 rounded-3xl border border-white/18 bg-white/[0.07] p-4 backdrop-blur-md">
              <LeadForm variant={variant} place="close" />
              <div className="mt-3">
                <Chips />
              </div>
            </div>

            {variant.forSomeoneElse ? (
              <button
                type="button"
                onClick={share}
                className="mt-3 inline-flex h-[52px] w-full items-center justify-center rounded-2xl border border-white/25 px-6 text-[15.5px] font-semibold text-white transition active:scale-[0.99]"
              >
                {shared ? "Link copied" : "Send them the link instead"}
              </button>
            ) : null}

            <p className="mt-9 border-t border-white/15 pt-6 text-[14px] leading-relaxed text-white/65">
              If tonight is worse than a loop, please do not use an app. Call someone now:{" "}
              <strong className="text-white/90">988</strong> in the US,{" "}
              <strong className="text-white/90">999</strong> in the UK, or your local emergency
              number. Steady is a practice companion, not a medical device, a therapist, a
              diagnosis or a crisis service.
            </p>
            <p className="mt-4 text-[12px] text-white/40">
              Beyond Elevation Ltd, registered in England and Wales.{" "}
              <a href="/privacy" className="underline underline-offset-2">
                Privacy
              </a>{" "}
              ·{" "}
              <a href="/terms" className="underline underline-offset-2">
                Terms
              </a>
            </p>
          </Panel>
        </section>
      </div>

      {/* ---------- Sticky action, once the hero is gone. ---------- */}
      {stage > 0 ? (
        <div
          style={{ bottom: "var(--consent-h, 0px)" }}
          className="rise fixed inset-x-0 z-50 border-t border-white/15 bg-[#0e1013]/62 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl"
        >
          <div className="mx-auto flex max-w-[560px] items-center gap-3 px-4 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold leading-tight text-white">
                {variant.forSomeoneElse ? "Put it in front of her" : barLine}
              </p>
              <p className="truncate text-[12px] leading-tight text-white/60">
                Free. No card. About 2 minutes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => (variant.forSomeoneElse ? share() : toForm("sticky_bar"))}
              className={`${CTA} inline-flex h-12 shrink-0 items-center justify-center rounded-2xl px-5 text-[15px] font-semibold transition active:scale-[0.97]`}
            >
              {variant.forSomeoneElse && shared ? "Link copied" : variant.cta}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
