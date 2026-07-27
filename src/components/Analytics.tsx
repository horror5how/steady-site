"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, startAnalytics } from "@/lib/analytics";

/* Mounted once in the root layout. Boots PostHog for visitors who already
   consented, and again the moment someone accepts the banner. */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    startAnalytics();
    window.addEventListener(CONSENT_EVENT, startAnalytics);
    return () => window.removeEventListener(CONSENT_EVENT, startAnalytics);
  }, []);

  // App Router navigations are client-side, so re-arm on route change for
  // anyone who consented mid-visit. posthog's own history listener handles
  // the pageview itself.
  useEffect(() => {
    startAnalytics();
  }, [pathname]);

  return null;
}
