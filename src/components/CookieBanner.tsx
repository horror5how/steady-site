"use client";

import { useEffect, useState } from "react";

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

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-black/10 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-[640px]">
          <p className="text-[14px] font-semibold text-ink">We use cookies</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
            Essential cookies keep this site working. If you accept, we also measure which pages and
            buttons people use, so we can make it better. Reject and we measure nothing — the site
            works exactly the same. See our{" "}
            <a href="/privacy" className="underline underline-offset-2">
              privacy page
            </a>
            .
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            onClick={() => choose("rejected")}
            className="rounded-full border border-ink/15 px-4 py-2 text-[13px] font-semibold text-ink transition hover:bg-ink/5"
          >
            Reject all
          </button>
          <button
            onClick={() => choose("accepted")}
            className="btn-dark px-4 py-2 text-[13px] font-semibold"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
