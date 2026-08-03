import { NextResponse, type NextRequest } from "next/server";
import { EVENT_MAP, SELF_EVENTS } from "@/lib/meta";

/* Server half of the Meta pixel — the Conversions API.
 *
 * The browser pixel is blocked for a large share of real traffic (ad blockers,
 * Safari, iOS). This route sends the same event server-side with the same
 * event_id so Meta collapses the pair into one, and we keep the event when the
 * pixel never fires. Without it, retargeting audiences quietly miss the people
 * most worth reaching.
 *
 * This is a public endpoint, so it trusts nothing the browser sends beyond a
 * fixed allowlist of event names and properties: the client cannot invent an
 * event, attach a property, or set its own IP.
 */

const PIXEL_ID = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const TOKEN = process.env.META_CAPI_TOKEN || "";
const TEST_CODE = process.env.META_TEST_EVENT_CODE || "";
const GRAPH_VERSION = "v23.0";

const ALLOWED_EVENTS = new Set<string>([...Object.values(EVENT_MAP), ...SELF_EVENTS]);
const ALLOWED_PROPS = new Set(["variant", "source", "visit_count", "engagement_score", "trigger"]);
const MAX_BODY = 4_000;

export async function GET() {
  // Configuration check only — never echoes the token itself.
  return NextResponse.json({ pixel: Boolean(PIXEL_ID), capi: Boolean(TOKEN), test_mode: Boolean(TEST_CODE) });
}

export async function POST(req: NextRequest) {
  if (!PIXEL_ID || !TOKEN) return new NextResponse(null, { status: 204 });
  // Our own visits stay out of the ad audiences too, not just out of PostHog.
  if (req.cookies.get("steady_notrack")?.value === "1") return new NextResponse(null, { status: 204 });

  const raw = await req.text();
  if (raw.length > MAX_BODY) return new NextResponse(null, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const name = typeof body.event_name === "string" ? body.event_name : "";
  if (!ALLOWED_EVENTS.has(name)) return new NextResponse(null, { status: 400 });

  const eventId = typeof body.event_id === "string" ? body.event_id.slice(0, 64) : "";
  const sourceUrl = typeof body.event_source_url === "string" ? body.event_source_url.slice(0, 500) : undefined;

  const custom: Record<string, unknown> = {};
  const incoming = (body.custom_data ?? {}) as Record<string, unknown>;
  for (const [key, value] of Object.entries(incoming)) {
    if (ALLOWED_PROPS.has(key) && (typeof value === "string" || typeof value === "number")) {
      custom[key] = typeof value === "string" ? value.slice(0, 100) : value;
    }
  }

  // Match quality comes from these three. We deliberately send no email, no
  // name, and no user id: this is a mental-health product, and an identifier
  // next to a "tried the voice feature" event is exactly the join Meta should
  // never be handed.
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const userData: Record<string, unknown> = {
    client_user_agent: req.headers.get("user-agent") ?? "",
    ...(ip && { client_ip_address: ip }),
    ...(req.cookies.get("_fbp") && { fbp: req.cookies.get("_fbp")!.value }),
    ...(req.cookies.get("_fbc") && { fbc: req.cookies.get("_fbc")!.value }),
  };

  const payload = {
    data: [
      {
        event_name: name,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        ...(eventId && { event_id: eventId }),
        ...(sourceUrl && { event_source_url: sourceUrl }),
        user_data: userData,
        ...(Object.keys(custom).length && { custom_data: custom }),
      },
    ],
    ...(TEST_CODE && { test_event_code: TEST_CODE }),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`,
      { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) },
    );
    if (!res.ok) {
      // Meta's error body names the bad field, which is the only way to debug a
      // rejected event — but it never reaches the browser.
      console.error("[meta-capi]", res.status, (await res.text()).slice(0, 300));
      return new NextResponse(null, { status: 202 });
    }
  } catch (error) {
    console.error("[meta-capi] relay failed", error);
    return new NextResponse(null, { status: 202 });
  }

  return new NextResponse(null, { status: 204 });
}
