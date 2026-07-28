"use client";

import posthog from "posthog-js";
import { analyticsAllowed } from "@/components/CookieBanner";

// The project token is a public, write-only client key (like a GA measurement
// ID) — it cannot read data back out. Env override lets us point a preview
// deployment at a different project without a code change.
const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_CDKFjeVGfuEEid74UGx5CNwNFaqaijF8b6e9A6QhLruM";
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export const CONSENT_EVENT = "steady-consent-changed";

let started = false;
let replayBlocked = false;

/* Boot PostHog once, and only behind cookie consent. Safe to call repeatedly:
   every entry point calls it, and the first one that passes the gate wins. */
export function startAnalytics(): void {
  if (started || typeof window === "undefined") return;
  if (!analyticsAllowed()) return;
  started = true;
  try {
    posthog.init(KEY, {
      api_host: HOST,
      persistence: "localStorage+cookie",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      // JS errors on the marketing site land in PostHog rather than a second
      // vendor; the product uses Sentry, where alerting actually matters.
      capture_exceptions: true,
      // Replay is the point of this — but never record what someone typed, and
      // never record a page that called stopReplay() (see below).
      disable_session_recording: replayBlocked,
      session_recording: { maskAllInputs: true },
      // Reuse the id the hand-rolled beacon already created, so returning
      // visitors don't split into two people mid-funnel.
      bootstrap: { distinctID: legacyId() || undefined },
    });
    posthog.register({ app: "marketing" });
  } catch {
    /* analytics must never break the page */
  }
}

function legacyId(): string | null {
  try {
    return localStorage.getItem("steady-hero-id");
  } catch {
    return null;
  }
}

/* Fire-and-forget capture. Never blocks, never throws. */
export function ph(event: string, props: Record<string, unknown> = {}): void {
  if (!started) startAnalytics();
  if (!started) return;
  try {
    posthog.capture(event, props);
  } catch {
    /* ignore */
  }
}

/* Stop replay for this page only, leaving event capture alone. The invite flow
   answers with buttons, which maskAllInputs does not cover — a recording there
   would hold clinical answers. Safe to call before init: the flag makes the
   next startAnalytics() boot without recording. */
export function stopReplay(): void {
  replayBlocked = true;
  if (!started) return;
  try {
    posthog.stopSessionRecording();
  } catch {
    /* ignore */
  }
}

/* Called by the cookie banner the moment someone accepts, so the very first
   session is measured instead of only their second visit. */
export function onConsentAccepted(): void {
  startAnalytics();
  try {
    window.dispatchEvent(new Event(CONSENT_EVENT));
  } catch {
    /* ignore */
  }
}

/* Reject-all, or a later withdrawal: stop recording and drop the cookies. */
export function stopAnalytics(): void {
  if (!started) return;
  try {
    posthog.stopSessionRecording();
    posthog.opt_out_capturing();
    posthog.reset(true);
  } catch {
    /* ignore */
  }
  started = false;
}
