"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ph } from "@/lib/analytics";
import { PREFILL_KEY, type Variant } from "@/lib/landing";

/* The ad landing page.
 *
 * Rules this page is built to, all of them deliberate:
 *   one goal, one primary action, no navigation, no exits
 *   the whole offer inside the first screen, form included
 *   a sticky call to action once the hero is behind you
 *   48px tap targets, everything reachable in the bottom two thirds
 *   email first — the nine-question screen still happens, just after
 *   four screens of scroll, not thirteen
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
          className="h-[52px] w-full rounded-2xl border border-ink/12 bg-white px-4 text-[16px] text-ink shadow-[0_1px_2px_rgba(35,40,44,0.04)] outline-none transition placeholder:text-ink-soft/70 focus:border-ink/35 focus:ring-4 focus:ring-ink/8"
        />
        <button
          type="submit"
          disabled={sending}
          className="btn-dark inline-flex h-[52px] w-full items-center justify-center rounded-2xl px-6 text-[16px] font-semibold disabled:opacity-60"
        >
          {sending ? "One moment…" : variant.cta}
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
    <ul className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[12.5px] font-medium text-ink-soft">
      {["Free", "No card", "About 2 minutes"].map((chip) => (
        <li key={chip} className="rounded-full bg-mint/70 px-2.5 py-1 text-ink/80">
          {chip}
        </li>
      ))}
    </ul>
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

  // Sticky bar appears once the hero is behind you, so it never competes with
  // the form that is already on screen.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting),
      { rootMargin: "-120px 0px 0px 0px" },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Scroll depth, quarter by quarter, reported once each.
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = Math.round((window.scrollY / max) * 100);
      for (const mark of [25, 50, 75, 100]) {
        if (pct >= mark && depth.current < mark) {
          depth.current = mark;
          ph("landing_scroll", { variant: variant.key, depth: mark });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    <div className="min-h-[100dvh] bg-cream text-ink">
      {/* Header: wordmark and one button. No navigation on a paid landing page —
          every link here is an exit, and exits are what the ad paid for. */}
      <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-line/70 bg-cream/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[560px] items-center justify-between px-4">
          <span className="text-[15px] font-bold tracking-[0.22em] text-ink">STEADY</span>
          <button
            type="button"
            onClick={() => toForm("header")}
            className="h-9 rounded-full border border-ink/15 px-3.5 text-[13px] font-semibold text-ink transition active:scale-[0.97]"
          >
            {variant.forSomeoneElse ? "Have a look" : "Get my invite"}
          </button>
        </div>
      </header>

      {/* ---------- 1. Hero. Offer, proof of who it is for, and the form. ---------- */}
      <section
        ref={heroRef}
        id="apply"
        className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden pt-14"
      >
        <Image
          src={variant.image}
          alt={variant.imageAlt}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 640px) 100vw, 560px"
          className="object-cover object-center"
        />
        {/* Scrim: the type sits on the bottom half, so the image is darkened
            from the bottom up rather than flattened everywhere. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,20,22,0.95)_0%,rgba(18,20,22,0.9)_38%,rgba(18,20,22,0.45)_62%,rgba(18,20,22,0.15)_100%)]"
        />

        <div className="absolute inset-x-0 top-14 z-10 px-4 pt-4">
          <div className="mx-auto max-w-[560px]">
            {/* The ad's persistent overlay line, carried onto the page. It sits
                on the bright top third, so it needs its own ground. */}
            <p className="inline-block rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
              {variant.overlay}
            </p>
          </div>
        </div>

        {/* Bottom padding clears the consent strip, so the age and safety line
            is never the thing hidden underneath it. */}
        <div className="relative z-10 mx-auto w-full max-w-[560px] px-4 pb-[calc(4.75rem+env(safe-area-inset-bottom))]">
          <h1 className="text-balance text-[clamp(1.9rem,8.2vw,2.6rem)] font-bold leading-[1.06] tracking-[-0.03em] text-white">
            {variant.headline}
          </h1>
          <p className="mt-3 max-w-[34ch] text-[15.5px] leading-[1.5] text-white/80">{variant.sub}</p>

          {variant.forSomeoneElse ? (
            <div className="mt-5">
              <button
                type="button"
                onClick={share}
                className="inline-flex h-[52px] w-full items-center justify-center rounded-2xl bg-white px-6 text-[16px] font-semibold text-ink transition active:scale-[0.99]"
              >
                {shared ? "Link copied — send it when you’re ready" : "Send it to them"}
              </button>
              <p className="mt-2.5 text-[13px] text-white/65">
                Or have a look yourself first. Put your email in and you’ll see exactly what they
                would.
              </p>
            </div>
          ) : null}

          <div className="mt-4 rounded-3xl bg-white/95 p-3.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm">
            <LeadForm variant={variant} place="hero" />
            <div className="mt-3 flex flex-col gap-2">
              <Chips />
              <p className="text-[12px] leading-snug text-ink-soft">
                Your email, and nothing else on this screen. We never sell it and we never pass it
                on.
              </p>
            </div>
          </div>

          <p className="mt-3 text-[11.5px] leading-snug text-white/55">
            An invite-only research trial for adults 18 and over. Steady is not therapy, not medical
            care and not a crisis service.
          </p>
        </div>
      </section>

      {/* ---------- 2. The mechanism, named and shown. ---------- */}
      <section className="mx-auto w-full max-w-[560px] px-4 py-14">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-sage">
          The mechanism
        </p>
        <h2 className="mt-2 text-balance text-[clamp(1.5rem,6.4vw,1.95rem)] font-bold leading-[1.12] tracking-[-0.025em]">
          It isn’t you. It’s a loop, and a loop can be drawn.
        </h2>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
          You say it out loud. Steady draws the Loop Map with you: the trigger, the thought, and the
          habit that keeps it alive. Once it is on paper it stops feeling like it is you.
        </p>

        <ol className="mt-7 flex flex-col">
          {variant.loop.map((step, index) => {
            const last = index === variant.loop.length - 1;
            return (
              <li key={step.label} className="relative flex gap-3.5 pb-5 last:pb-0">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                      last ? "bg-ink text-white" : "bg-mint text-ink"
                    }`}
                  >
                    {last ? "✓" : index + 1}
                  </span>
                  {last ? null : <span aria-hidden className="mt-1 w-px flex-1 bg-line" />}
                </div>
                <div className="pb-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-[16px] font-semibold leading-snug text-ink">
                    {step.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 rounded-2xl bg-cream-2 p-4 text-[14.5px] leading-relaxed text-ink-soft">
          The practice underneath is the one therapists have used for forty years. Steady does not
          invent a method. It gives you somewhere to do it at 3am, out loud, at your own pace.
        </p>
      </section>

      {/* ---------- 3. What actually happens, and who it is not for. ---------- */}
      <section className="border-y border-line bg-white/60">
        <div className="mx-auto w-full max-w-[560px] px-4 py-14">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-sage">
            What happens
          </p>
          <h2 className="mt-2 text-balance text-[clamp(1.5rem,6.4vw,1.95rem)] font-bold leading-[1.12] tracking-[-0.025em]">
            Ten minutes from now, it could be out of your head.
          </h2>

          <div className="mt-7 flex flex-col gap-5">
            {[
              {
                t: "You talk. It listens.",
                d: "No forms, no typing, no blank box. You say what is looping and a warm voice answers.",
              },
              {
                t: "The loop gets drawn.",
                d: "Trigger, thought, habit. Named out loud, so you can see the shape of it instead of living inside it.",
              },
              {
                t: "You practise letting it pass.",
                d: "Short, gentle sessions built on exposure practice. Always your pace, always your consent, never a push.",
              },
            ].map((item) => (
              <div key={item.t} className="border-l-2 border-mint pl-4">
                <p className="text-[16.5px] font-semibold leading-snug">{item.t}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{item.d}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 rounded-2xl border border-line bg-cream p-4 text-[14.5px] leading-relaxed text-ink">
            <span className="font-semibold">Who this is not for. </span>
            {variant.exclusion}
          </p>
        </div>
      </section>

      {/* ---------- 4. The three things people actually ask before they apply. ---------- */}
      <section className="mx-auto w-full max-w-[560px] px-4 py-14">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-sage">
          Before you put your email in
        </p>
        <h2 className="mt-2 text-balance text-[clamp(1.5rem,6.4vw,1.95rem)] font-bold leading-[1.12] tracking-[-0.025em]">
          The three questions everybody has.
        </h2>

        <div className="mt-6 flex flex-col gap-2.5">
          {[
            {
              q: "Is this therapy?",
              a: "No. Steady is a self-guided practice companion, not a therapist, not a diagnosis and not a crisis service. It uses the same exposure practice therapists use, and it works well alongside real therapy. It does not replace it.",
            },
            {
              q: "What happens to my voice?",
              a: "Your voice is processed by OpenAI to power the conversation, and the one-minute taster is not saved. Nothing you say is sold or passed on, ever. The full detail is on our privacy page, in plain English.",
            },
            {
              q: "What does it cost?",
              a: "Nothing. There is no card, no trial that turns into a bill, and no waiting list to pay your way past. It is an invite-only research trial and we are taking a small first group.",
            },
          ].map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-line bg-white/70 px-4 open:bg-white"
              onToggle={(e) =>
                (e.currentTarget as HTMLDetailsElement).open
                  ? ph("landing_faq_open", { variant: variant.key, q: item.q })
                  : undefined
              }
            >
              <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 text-[15.5px] font-semibold marker:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="shrink-0 text-[20px] font-normal leading-none text-ink-soft transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-4 pr-6 text-[14.5px] leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- 5. Close. ---------- */}
      <section className="bg-ink px-4 py-14 text-white">
        <div className="mx-auto w-full max-w-[560px]">
          <h2 className="text-balance text-[clamp(1.6rem,7vw,2.1rem)] font-bold leading-[1.08] tracking-[-0.028em]">
            {variant.forSomeoneElse
              ? "You can’t do this one for her. You can put it in front of her."
              : "Say hello, say what’s looping, and see what it’s like."}
          </h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-white/70">
            Free, no card, adults 18 and over. We are taking a small first group, so the invite is
            an application rather than a sign-up.
          </p>

          <div className="mt-6 rounded-3xl bg-white p-3.5">
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

          <p className="mt-8 border-t border-white/15 pt-5 text-[12.5px] leading-relaxed text-white/50">
            Steady is a self-guided practice companion. It is not a medical device, a therapist, a
            diagnosis or a crisis service. If you are in crisis or thinking about harming yourself,
            please reach real help now: call or text <strong className="text-white/75">988</strong>{" "}
            in the US, <strong className="text-white/75">999</strong> in the UK, or your local
            emergency number.
          </p>
          <p className="mt-4 text-[12px] text-white/40">
            Operated by Beyond Elevation Ltd, registered in England and Wales.{" "}
            <a href="/privacy" className="underline underline-offset-2">
              Privacy
            </a>{" "}
            ·{" "}
            <a href="/terms" className="underline underline-offset-2">
              Terms
            </a>
          </p>
        </div>
      </section>

      {/* ---------- Sticky action, once the hero is gone. ---------- */}
      <div
        style={{ bottom: "var(--consent-h, 0px)" }}
        className={`fixed inset-x-0 z-50 border-t border-line bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-300 ${
          showBar ? "translate-y-0" : "translate-y-[130%]"
        }`}
      >
        <div className="mx-auto flex max-w-[560px] items-center gap-3 px-4 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold leading-tight">
              {variant.forSomeoneElse ? "Put it in front of her" : "Free. No card. About 2 minutes."}
            </p>
            <p className="truncate text-[12px] leading-tight text-ink-soft">
              Invite-only research trial
            </p>
          </div>
          <button
            type="button"
            onClick={() => toForm("sticky_bar")}
            className="btn-dark inline-flex h-12 shrink-0 items-center justify-center rounded-2xl px-5 text-[15px] font-semibold"
          >
            {variant.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
