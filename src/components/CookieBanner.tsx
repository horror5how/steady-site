"use client";

import { useEffect, useRef, useState } from "react";

// One key, three states: unset (no analytics yet), "accepted", "rejected".
// analyticsAllowed() is the single gate every analytics call must pass through —
// a Reject button that does nothing is worse than no banner at all.
export const CONSENT_KEY = "sh-cookie";

export function analyticsAllowed(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (!localStorage.getItem(CONSENT_KEY)) setShow(true);
      } catch {
        /* storage blocked — no banner, and analyticsAllowed() stays false */
      }
    }, 900);
    return () => clearTimeout(t);
  }, []);

  // Publish the strip's real height so anything else pinned to the bottom of
  // the screen — the landing page's action bar — can sit on top of it instead
  // of underneath it. Observed rather than measured once: a single reading
  // taken before the stylesheet lands reports the unstyled height, which was
  // 279px against a real 65, and parked the landing page's action bar in the
  // middle of the hero.
  useEffect(() => {
    const root = document.documentElement;
    const el = strip.current;
    if (!show || !el) {
      root.style.setProperty("--consent-h", "0px");
      return;
    }
    const publish = () => root.style.setProperty("--consent-h", `${Math.round(el.offsetHeight)}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty("--consent-h", "0px");
    };
  }, [show]);

  if (!show) return null;

  const choose = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    // Act on the choice immediately: accepting starts measurement for this
    // visit, rejecting tears down anything already running.
    void import("@/lib/analytics").then((m) =>
      value === "accepted" ? m.onConsentAccepted() : m.stopAnalytics(),
    );
    setShow(false);
  };

  // A slim strip, not a block. The old banner was 193px tall on a phone, which
  // is a quarter of the screen sitting on top of the thumb zone before anyone
  // has read a word — measured at 15 to 25% off mobile conversion. Same choice,
  // same wording, one line of it.
  return (
    <div
      ref={strip}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-black/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-2.5">
        <p className="min-w-0 flex-1 text-[12.5px] leading-snug text-ink-soft">
          We measure which buttons get used, only if you say yes.{" "}
          <a href="/privacy" className="underline underline-offset-2">
            How we handle it
          </a>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => choose("rejected")}
            className="h-11 rounded-full border border-ink/15 px-3.5 text-[13px] font-semibold text-ink transition hover:bg-ink/5"
          >
            No
          </button>
          <button
            onClick={() => choose("accepted")}
            className="btn-dark h-11 rounded-full px-4 text-[13px] font-semibold"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
