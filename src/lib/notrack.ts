/* One place decides whether a browser is ours rather than a visitor's, because
   both PostHog and the Meta pixel have to agree — an internal visit that lands
   in a retargeting audience costs money as well as skewing the funnel. */

export const NOTRACK_KEY = "steady-notrack";
export const NOTRACK_COOKIE = "steady_notrack";

/* Marked three ways, any of which sticks: the middleware cookie for
   INTERNAL_IPS, a one-time ?notrack=1, and the developer bypass button. */
export function isInternal(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (new URLSearchParams(window.location.search).has("notrack")) {
      localStorage.setItem(NOTRACK_KEY, "1");
    }
    if (localStorage.getItem(NOTRACK_KEY) === "1") return true;
  } catch {
    /* storage blocked — the cookie path still works */
  }
  return document.cookie.includes(`${NOTRACK_COOKIE}=1`);
}

export function markNotTracked(): void {
  try {
    localStorage.setItem(NOTRACK_KEY, "1");
  } catch {
    /* ignore */
  }
}
