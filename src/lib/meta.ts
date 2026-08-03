/* Meta pixel + Conversions API, for Facebook and Instagram retargeting.
 *
 * Two rules shape this file, and both are deliberate:
 *
 * 1. Nothing clinical ever reaches Meta. Steady is a mental-health product, so
 *    only the events in EVENT_MAP below are forwarded and only the properties
 *    in SAFE_PROPS ride along. Anything an invite answer, a mapped loop, or a
 *    transcript could touch is not on either list, and adding it is a decision
 *    someone has to make on purpose rather than by forgetting to exclude it.
 *
 * 2. Every event is sent twice — once from the browser (pixel) and once from
 *    our server (Conversions API) with the same eventID, so Meta dedupes them
 *    and we still get the event when an ad blocker or Safari kills the pixel.
 *    That redundancy is the whole reason a pixel alone is no longer enough.
 *
 * The whole file no-ops until NEXT_PUBLIC_META_PIXEL_ID is set, so it is safe
 * to ship before the ad account exists.
 */

import { analyticsAllowed } from "@/components/CookieBanner";
import { isInternal } from "@/lib/notrack";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/* Steady event -> Meta event. Anything absent is never forwarded, which is the
   safe default for a product where most signals are clinical. Standard Meta
   names (Lead, ViewContent) unlock optimisation; custom names are for
   audience building only, which is what the retargeting tiers need. */
export const EVENT_MAP: Record<string, string> = {
  mic_clicked: "VoiceMicClicked",
  voice_started: "VoiceStarted",
  voice_completed: "VoiceCompleted",
  text_message: "VoiceTextEngaged",
  type_clicked: "VoiceTypeClicked",
  cta_click: "CtaClick",
  invite_submitted: "Lead",
};

/* Meta events this app is allowed to send that do not come from a Steady
   event — page-level signals raised by this file itself. */
export const SELF_EVENTS = ["PageView", "ViewContent", "RepeatVisitor", "HighIntentVisitor"] as const;

/* Non-clinical properties only. `variant` is the hero A/B arm, `source` is
   which surface fired it. Everything else is dropped before it leaves. */
const SAFE_PROPS = ["variant", "source"];

/* How much of a signal each action is. The score rides along on every event so
   audiences can be built on "engaged this much" rather than "did one thing",
   and so value-based lookalikes have something to rank on. */
const SCORES: Record<string, number> = {
  mic_clicked: 2,
  voice_started: 3,
  voice_completed: 5,
  text_message: 2,
  type_clicked: 1,
  cta_click: 3,
  invite_submitted: 10,
};

const VISITS_KEY = "steady-visits";
const LAST_SEEN_KEY = "steady-last-seen";
const SCORE_KEY = "steady-engagement";
const SESSION_GAP_MS = 30 * 60 * 1000; // A new visit, not a new page view.
const HIGH_INTENT_SCORE = 8;

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string };
declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let started = false;

export function metaEnabled(): boolean {
  return Boolean(PIXEL_ID);
}

/* ---------- visit + engagement state (browser only) ---------- */

function num(key: string): number {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}

function setNum(key: string, value: number): void {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    /* ignore */
  }
}

/* Counts this visit if the last activity was long enough ago to be a separate
   trip to the site, then returns the running total. */
function countVisit(): number {
  const now = Date.now();
  const last = num(LAST_SEEN_KEY);
  let visits = num(VISITS_KEY);
  if (!last || now - last > SESSION_GAP_MS) {
    visits += 1;
    setNum(VISITS_KEY, visits);
  }
  setNum(LAST_SEEN_KEY, now);
  return visits;
}

export function engagementScore(): number {
  return num(SCORE_KEY);
}

export function visitCount(): number {
  return num(VISITS_KEY);
}

/* ---------- sending ---------- */

function eventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

/* The server half of every event. Fire-and-forget: a failed relay must never
   surface to the visitor, and keepalive lets it survive the page unloading on
   a click-through. */
function relay(name: string, id: string, custom: Record<string, unknown>): void {
  try {
    void fetch("/api/meta", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event_name: name,
        event_id: id,
        event_source_url: window.location.href,
        custom_data: custom,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

function send(name: string, custom: Record<string, unknown> = {}, standard = false): void {
  if (!started) return;
  const id = eventId();
  const payload = { ...custom, visit_count: visitCount(), engagement_score: engagementScore() };
  try {
    window.fbq?.(standard ? "track" : "trackCustom", name, payload, { eventID: id });
  } catch {
    /* pixel blocked — the relay below is exactly why we still get the event */
  }
  relay(name, id, payload);
}

const STANDARD = new Set(["PageView", "ViewContent", "Lead", "CompleteRegistration", "Contact"]);

/* Mirrors a Steady analytics event into Meta, if it is on the allowlist.
   Called from the single ph() choke point in analytics.ts, so every current
   and future event on the site passes through here by default. */
export function metaMirror(event: string, props: Record<string, unknown> = {}): void {
  const name = EVENT_MAP[event];
  if (!name || !started) return;

  const score = SCORES[event] || 0;
  if (score) {
    const total = engagementScore() + score;
    setNum(SCORE_KEY, total);
    // Crossing the line from "looked" to "actually tried it" is the signal
    // worth bidding on, so it gets its own event rather than only a property.
    if (total >= HIGH_INTENT_SCORE && total - score < HIGH_INTENT_SCORE) {
      send("HighIntentVisitor", { trigger: event });
    }
  }

  const safe: Record<string, unknown> = {};
  for (const key of SAFE_PROPS) if (key in props) safe[key] = props[key];
  send(name, safe, STANDARD.has(name));
}

/* ---------- boot ---------- */

function injectPixel(): void {
  if (window.fbq) return;
  // Meta's own snippet, typed and trimmed. It stubs fbq so calls made before
  // the script lands are queued rather than lost.
  const stub: Fbq = function (...args: unknown[]) {
    stub.queue?.push(args);
  } as Fbq;
  stub.queue = [];
  stub.version = "2.0";
  stub.loaded = true;
  window.fbq = stub;
  window._fbq = stub;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
}

/* Safe to call repeatedly — every entry point calls it and the first one that
   passes the gates wins. */
export function startMeta(): void {
  if (started || typeof window === "undefined") return;
  if (!PIXEL_ID) return;
  if (isInternal()) return;
  if (!analyticsAllowed()) return;

  try {
    injectPixel();
    window.fbq?.("init", PIXEL_ID);
    started = true;

    const visits = countVisit();
    send("PageView", {}, true);
    // Rule one, straight from the brief: a second visit means real interest, so
    // it becomes its own event rather than something to infer later.
    if (visits >= 2) send("RepeatVisitor", { visit_count: visits });
  } catch {
    /* analytics must never break the page */
  }
}

/* Client-side route change: Meta has no history listener of its own. */
export function metaPageView(): void {
  if (!started) return;
  send("PageView", {}, true);
}

export function stopMeta(): void {
  started = false;
}
