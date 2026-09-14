"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ph } from "@/lib/analytics";
import { PREFILL_KEY, type Variant } from "@/lib/landing";

/* The ad landing page.
 *
 * Rules this page is built to, all of them deliberate:
 *   one goal, one primary action, no navigation, no exits
 *   the whole offer inside the first screen, form included
 *   the advert plays behind the whole page, so it is never "watch this then read that"
 *   air between every block, so the film is visible and nothing reads as a wall
 *   48px tap targets, everything reachable in the bottom two thirds
 *   email first — the nine-question screen still happens, just after
 *   short words, short sentences, no jargon
 *
 * Nothing here claims a user count, a rating or a testimonial. There aren't
 * any yet, and inventing them on a mental health page is not a trade worth
 * making.
 */

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

type FormProps = {
  variant: Variant;
  place: "hero" | "close" | "bar";
};

function LeadForm({ variant, place }: FormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const started = useRef(false);

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

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className="flex flex-col gap-2.5">
        <label htmlFor={`email-${place}`} className="sr-only">
          Your email address
        </label>
        <input
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
          className="h-[52px] w-full rounded-2xl border border-white/25 bg-white/10 px-4 text-[16px] text-white outline-none backdrop-blur-sm transition placeholder:text-white/45 focus:border-white/60 focus:bg-white/16 focus:ring-4 focus:ring-white/15"
        />
        {/* The one solid thing on the page. Everything else is see-through, so
            the button is the only element that cannot be looked past. */}
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-[52px] w-full items-center justify-center rounded-2xl bg-white px-6 text-[16px] font-semibold text-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)] transition active:scale-[0.97] disabled:opacity-60"
        >
          {sending ? "One moment…" : variant.formCta ?? variant.cta}
        </button>
      </div>
      {error ? (
        <p id={`email-error-${place}`} role="alert" className="mt-2 text-[13.5px] text-[#a3402f]">
          {error}
        </p>
      ) : null}
    </form>
  );
}

function Chips() {
  return (
    <ul className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[12.5px] font-medium">
      {["Free", "No card", "About 2 minutes"].map((chip) => (
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
 * It is the 40-second film cut to a phone shape, silent, and re-encoded down
 * from 21MB to 1.7MB. First paint is a 4KB poster so the page is readable
 * before a single frame of video arrives; the film fades in afterwards and
 * never on Reduce Motion or Data Saver. Fixed rather than scrolled, so it
 * keeps playing behind every section instead of leaving after the hero.
 */
function AdvertBackdrop() {
  const [motionOk, setMotionOk] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduce || conn?.saveData) return;
    const t = setTimeout(() => setMotionOk(true), 250);
    return () => clearTimeout(t);
  }, []);

  // The autoplay attribute is not a guarantee. iOS Low Power Mode and a few
  // desktop policies refuse it outright even for a muted, inline video. Ask
  // once, and if the answer is no, start on the first thing the visitor does.
  useEffect(() => {
    const video = videoRef.current;
    if (!motionOk || !video) return;
    const events = ["pointerdown", "touchstart", "click", "keydown", "scroll"] as const;
    const kick = () => {
      void video.play().catch(() => {
        /* still refused — the next gesture gets another go */
      });
    };
    const bind = () => events.forEach((e) => window.addEventListener(e, kick, { passive: true }));
    const unbind = () => events.forEach((e) => window.removeEventListener(e, kick));

    // Listeners stay bound until the video is genuinely playing, rather than
    // firing once and giving up: a browser can refuse the first gesture too.
    video.addEventListener("playing", unbind);
    void video.play().catch(bind);
    return () => {
      unbind();
      video.removeEventListener("playing", unbind);
    };
  }, [motionOk]);

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
          // Fades in on `playing`, not on `canplay`: if autoplay is refused the
          // page keeps the soft poster rather than showing a frozen frame.
          onPlaying={() => setReady(true)}
          // Lifted a touch. The advert was graded for a full-bleed screen with
          // nothing on top of it; under a scrim the mid-tones go to mud.
          style={{ filter: "brightness(1.12) saturate(1.18) contrast(1.04)" }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}
      {/* One light scrim only. Every block of text carries its own dark panel,
          so the page behind it does not need to be blacked out — and blacking
          it out is what hides the film. Just enough to keep the white header
          and the hero type off raw footage. */}
      <div className="absolute inset-0 bg-[#0e1013]/38" />
    </div>
  );
}

/** A block of content floating over the film, with air above and below it.
 *
 * Deliberately see-through. The film has to stay visible through every box on
 * the page, so the panel leans on a light blur for legibility rather than on
 * opacity — blur separates the type from the footage without hiding it. */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border border-white/18 bg-[#0e1013]/40 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_24px_70px_-30px_rgba(0,0,0,0.9)] backdrop-blur-lg sm:p-8">
      {children}
    </div>
  );
}

export default function Landing({ variant }: { variant: Variant }) {
  const [showBar, setShowBar] = useState(false);
  const [shared, setShared] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const depth = useRef(0);

  useEffect(() => {
    ph("landing_view", { variant: variant.key, ad: variant.ad });
  }, [variant]);

  // The sticky bar appears once the hero is behind you, so it never covers the
  // form that is already on screen. Driven off scroll position rather than an
  // IntersectionObserver: the hero is sized in dvh, and dvh changes every time
  // a mobile browser collapses its address bar. An observer can miss that and
  // leave the bar sitting on top of the hero CTA. Scroll position cannot.
  //
  // Same listener carries scroll depth, quarter by quarter, reported once each.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const hero = heroRef.current?.offsetHeight ?? window.innerHeight;
      setShowBar(y > hero * 0.85);

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

  return (
    <div className="landing-dark relative min-h-[100dvh] text-white">
      <AdvertBackdrop />

      {/* Header: wordmark and one button. No navigation on a paid landing page —
          every link here is an exit, and exits are what the ad paid for. */}
      <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-white/12 bg-[#0e1013]/45 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[560px] items-center justify-between px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <span className="wordmark-lockup text-[17px] text-white">
            <img src="/brand/steady-mark.webp" alt="" width={26} height={26} />
            Steady
          </span>
          <button
            type="button"
            onClick={() => toForm("header")}
            className="h-11 rounded-full border border-white/25 px-4 text-[13.5px] font-semibold text-white transition active:scale-[0.97]"
          >
            {variant.forSomeoneElse ? "Have a look" : "Get my invite"}
          </button>
        </div>
      </header>

      <div className="relative z-10">
        {/* ---------- 1. Hero. The offer and the form, on the first screen. ---------- */}
        <section
          ref={heroRef}
          id="apply"
          className="relative flex min-h-[100dvh] flex-col px-4 pt-14"
        >
          {/* A clear band of nothing but film at the top of the page, before a
              single word arrives. This is the hero: the advert, playing, with
              room to be seen. */}
          <div aria-hidden className="min-h-[16dvh] flex-1" />

          {/* The hero type sits straight on the film, so it gets its own scrim
              from the bottom up. Everything below the hero is on a panel and
              needs none, which is what leaves the film visible down the page. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 top-[18dvh] bg-[linear-gradient(to_top,rgba(10,12,15,0.92)_0%,rgba(10,12,15,0.8)_45%,rgba(10,12,15,0.3)_78%,rgba(10,12,15,0)_100%)]"
          />

          <div className="relative mx-auto w-full max-w-[560px] pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
            {/* Was the ad's own overlay line, one per variant. Now one fixed
                badge: what the method rests on, said in two words. */}
            <p className="rise inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
              Science-backed technology
            </p>

            {/* The category is the headline now. It is the one sentence that
                says what this is and what nobody else has.
                "bilingual" is deliberately not in here: it is not built yet, and
                a first-in-the-world claim is the worst place to get ahead of the
                product. It goes back in the day the second language ships. */}
            <h1 className="rise rise-1 mt-6 text-balance text-[clamp(2.05rem,8.4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.032em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.6)]">
              Steady is the first all-voice AI companion for people with looping thoughts.
            </h1>

            <p className="rise rise-2 mt-7 max-w-[32ch] text-[19px] leading-[1.55] text-white/90">
              Ten minutes a day, out loud. You let the thought come, and you let it go past. Then
              you are back in the room.
            </p>

            <p className="rise rise-3 mt-6 max-w-[34ch] text-[17px] leading-[1.6] text-white/70">
              {variant.sub}
            </p>

            {variant.forSomeoneElse ? (
              <div className="mt-8">
                <button
                  type="button"
                  onClick={share}
                  className="inline-flex h-[52px] w-full items-center justify-center rounded-2xl bg-white px-6 text-[16px] font-semibold text-ink transition active:scale-[0.99]"
                >
                  {shared ? "Link copied — send it when you’re ready" : "Send it to them"}
                </button>
                <p className="mt-2.5 text-[13.5px] text-white/65">
                  Or look yourself first. Put your email in and you will see what they would.
                </p>
              </div>
            ) : null}

            <div className="rise rise-4 mt-8 rounded-3xl border border-white/18 bg-[#0e1013]/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_24px_70px_-28px_rgba(0,0,0,0.9)] backdrop-blur-lg">
              <LeadForm variant={variant} place="hero" />
              <div className="mt-4 flex flex-col gap-2.5">
                <Chips />
                <p className="text-[12px] leading-snug text-white/60">
                  Your email, and nothing else on this screen. We never sell it. We never pass it
                  on.
                </p>
              </div>
            </div>

            <p className="mt-6 text-[12px] leading-snug text-white/55">
              For adults 18 and over. Nine short questions and you are in. Steady is not therapy,
              not medical care, and not a crisis service.
            </p>
          </div>
        </section>

        {/* ---------- 2. What a looping thought actually is. ----------
            Before any mechanism, any method or any offer: the plain description
            of the thing. If a reader does not recognise themselves here, nothing
            further down the page can save it. Written to be read out loud, one
            short line at a time. */}
        <section className="mx-auto w-full max-w-[560px] px-4 py-24">
          <Panel>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/55">
              What is a looping thought
            </p>

            <div className="mt-6 flex flex-col gap-5 text-[19px] leading-[1.5] text-white/85">
              <p>A thought turns up. You did not ask for it.</p>
              <p>You try to make it go away. Check the door. Ask again. Look it up one more time.</p>
              <p>It goes quiet for a minute.</p>
              <p>Then it comes back, louder.</p>
            </div>

            <p className="mt-8 border-t border-white/12 pt-6 text-[20px] font-semibold leading-[1.35] text-white">
              That is a loop. And a loop is a thing that happens to you. It is not who you are.
            </p>
          </Panel>
        </section>

        {/* ---------- 3. How the loop gets drawn. ---------- */}
        <section className="mx-auto w-full max-w-[560px] px-4 py-24">
          <Panel>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/55">
              How it works
            </p>
            <h2 className="mt-3 text-balance text-[clamp(1.55rem,6.6vw,2rem)] font-bold leading-[1.12] tracking-[-0.025em]">
              It is not you. It is a loop. And a loop can be drawn.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-white/70">
              You say it out loud. Steady draws the loop with you. What set it off. The thought.
              The thing you do to make the thought stop. Once it is drawn, it stops feeling like
              it is you.
            </p>
          </Panel>
        </section>

        {/* The loop itself gets its own screen, with nothing but film around it. */}
        <section className="mx-auto w-full max-w-[560px] px-4 pb-24">
          <Panel>
            <ol className="flex flex-col">
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

        {/* ---------- 4. What actually happens. ---------- */}
        <section className="mx-auto w-full max-w-[560px] px-4 pb-24">
          <Panel>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/55">
              What happens
            </p>
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
                  d: "Short, gentle sessions. You sit with the thought and do nothing about it. Therapists call that exposure. Always your speed. Never a push.",
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

        {/* ---------- 5. The three things people ask before they apply. ---------- */}
        <section className="mx-auto w-full max-w-[560px] px-4 pb-24">
          <Panel>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Before you put your email in
            </p>
            <h2 className="mt-3 text-balance text-[clamp(1.55rem,6.6vw,2rem)] font-bold leading-[1.12] tracking-[-0.025em]">
              The three questions everybody has.
            </h2>

            <div className="mt-7 flex flex-col gap-3">
              {[
                {
                  q: "Is this therapy?",
                  a: "No. Steady is a practice companion you use on your own. It is not a therapist, not a diagnosis, and not a crisis service. It uses the same practice therapists use, and it sits well next to real therapy. It does not replace it.",
                },
                {
                  q: "What happens to my voice?",
                  a: "Your voice goes to OpenAI so the conversation can work. The one-minute taster is not saved. Nothing you say is sold or passed on, ever. The full detail is on our privacy page, in plain English.",
                },
                {
                  q: "What does it cost?",
                  a: "Nothing. No card, no trial that turns into a bill, no queue you can pay to skip. Answer the nine questions and you are in. If your answers show Steady is the wrong place for you right now, we will say so and point you somewhere better.",
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

        {/* ---------- 6. Close. ---------- */}
        <section className="mx-auto w-full max-w-[560px] px-4 pb-28">
          <Panel>
            <h2 className="text-balance text-[clamp(1.65rem,7.2vw,2.2rem)] font-bold leading-[1.08] tracking-[-0.028em]">
              {variant.forSomeoneElse
                ? "You cannot do this one for her. You can put it in front of her."
                : "Say hello. Say what is going round. See what it is like."}
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

            <p className="mt-9 border-t border-white/15 pt-6 text-[13px] leading-relaxed text-white/55">
              Steady is a practice companion you use on your own. It is not a medical device, a
              therapist, a diagnosis or a crisis service. If you are in crisis or thinking about
              hurting yourself, get real help now: call or text{" "}
              <strong className="text-white/80">988</strong> in the US,{" "}
              <strong className="text-white/80">999</strong> in the UK, or your local emergency
              number.
            </p>
            {/* Company identification. Kept small and kept last: it is a legal
                disclosure, not a selling point. */}
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

      {/* ---------- Sticky action, once the hero is gone. ----------
          Unmounted rather than translated off-screen. A transform only hides
          it if it is flush to the bottom, and it is not — it sits on top of
          the consent strip. Hidden means gone. */}
      {showBar ? (
        <div
          style={{ bottom: "var(--consent-h, 0px)" }}
          className="rise fixed inset-x-0 z-50 border-t border-white/15 bg-[#0e1013]/62 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl"
        >
          <div className="mx-auto flex max-w-[560px] items-center gap-3 px-4 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold leading-tight text-white">
                {variant.forSomeoneElse
                  ? "Put it in front of her"
                  : "Free. No card. About 2 minutes."}
              </p>
              <p className="truncate text-[12px] leading-tight text-white/60">
                Nine questions and you’re in
              </p>
            </div>
            <button
              type="button"
              onClick={() => (variant.forSomeoneElse ? share() : toForm("sticky_bar"))}
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-white px-5 text-[15px] font-semibold text-ink transition active:scale-[0.97]"
            >
              {variant.forSomeoneElse && shared ? "Link copied" : variant.cta}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
