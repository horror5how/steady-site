import { NextResponse, type NextRequest } from "next/server";

// Visits from our own IPs get marked once with a cookie; analytics.ts then never
// boots PostHog for that browser, so our traffic is missing from the funnel
// rather than filtered out of it afterwards.
//
// INTERNAL_IPS is a comma-separated list set in Vercel, not in the repo — home
// and office IPs change, and they are not worth committing.
const INTERNAL_IPS = (process.env.INTERNAL_IPS ?? "")
  .split(",")
  .map((ip) => ip.trim())
  .filter(Boolean);

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (INTERNAL_IPS.length === 0) return res;

  // Vercel puts the real client IP first; everything after it is proxy hops.
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  if (ip && INTERNAL_IPS.includes(ip)) {
    res.cookies.set("steady_notrack", "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
