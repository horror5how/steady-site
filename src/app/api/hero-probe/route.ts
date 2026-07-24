import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";

// Vercel Cron watchdog (*/30): probes the live taster + product app.
// Failure → WhatsApp to Hayat via UniPile, deduped to one alert per 2h.
export const dynamic = "force-dynamic";

const SITE = "https://beingsteady.com";
const PRODUCT = "https://steady-erp-voice-fresh.vercel.app";
const ALERT_EVERY_MS = 2 * 60 * 60 * 1000;

async function probe(): Promise<string[]> {
  const fails: string[] = [];
  const get = (url: string, ms = 20000) => fetch(url, { signal: AbortSignal.timeout(ms), cache: "no-store" });

  try {
    const r = await get(SITE);
    if (r.status !== 200) fails.push(`page=${r.status}`);
  } catch { fails.push("page=unreachable"); }

  try {
    const r = await get(`${SITE}/api/hero-session`);
    const j = await r.json();
    if (!j?.ok) fails.push("health=not_ok");
  } catch { fails.push("health=unreachable"); }

  try {
    const r = await fetch(`${SITE}/api/hero-session`, {
      method: "POST",
      headers: { Origin: SITE },
      signal: AbortSignal.timeout(25000),
    });
    const body = await r.text();
    // 429 = per-IP rate limiter fired (the probe hit its own 4/day cap). That means the
    // endpoint is ALIVE and guarding correctly — not an outage. Only a mint that's
    // unreachable / 5xx (dead OpenAI key, crash) is a real failure worth waking Hayat.
    const healthy = r.status === 429 || body.includes('"secret":"ek_') || body.includes('"budget"');
    if (!healthy) fails.push(`mint=${r.status}:${body.slice(0, 80)}`);
  } catch { fails.push("mint=unreachable"); }

  try {
    const r = await get(PRODUCT);
    if (r.status !== 200) fails.push(`product=${r.status}`);
  } catch { fails.push("product=unreachable"); }

  return fails;
}

async function shouldAlert(token: string | undefined): Promise<boolean> {
  if (!token) return true; // no dedup store → always alert rather than stay silent
  try {
    const { blobs } = await list({ prefix: "hero-probe/last-alert", token, limit: 10 });
    if (blobs.length) {
      const latest = blobs.reduce((a, b) => (a.uploadedAt > b.uploadedAt ? a : b));
      const j = await (await fetch(latest.url, { cache: "no-store" })).json();
      if (Date.now() - (j.at || 0) < ALERT_EVERY_MS) return false;
    }
    await put("hero-probe/last-alert.json", JSON.stringify({ at: Date.now() }), {
      access: "public", token, addRandomSuffix: false, contentType: "application/json", allowOverwrite: true,
    });
  } catch {}
  return true;
}

async function whatsapp(text: string) {
  const dsn = (process.env.UNIPILE_DSN || "").replace(/\/$/, "");
  const key = process.env.UNIPILE_API_KEY;
  const chat = process.env.WA_CHAT_ID;
  if (!dsn || !key || !chat) return false;
  const form = new FormData();
  form.append("text", text);
  const r = await fetch(`${dsn}/api/v1/chats/${chat}/messages`, {
    method: "POST",
    headers: { "X-API-KEY": key },
    body: form,
    signal: AbortSignal.timeout(15000),
  }).catch(() => null);
  return Boolean(r?.ok);
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const fails = await probe();
  let alerted = false;
  if (fails.length && (await shouldAlert(process.env.BLOB_READ_WRITE_TOKEN))) {
    alerted = await whatsapp(`🚨 beingsteady.com hero taster problem: ${fails.join(" ")} (hero-probe cron)`);
  }
  return NextResponse.json({ ok: fails.length === 0, fails, alerted });
}
