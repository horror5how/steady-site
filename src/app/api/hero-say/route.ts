import { NextRequest, NextResponse } from "next/server";
import { openaiFetch } from "@/lib/hero-limit";
import cfg from "@/lib/hero-audio.json";

export const dynamic = "force-dynamic";

// The homepage intro is spoken in the platform's Cedar voice via the speech API —
// slow, warm, mature, deeply present. The realtime model never speaks it, so there is
// no improvisation, no paraphrasing and no stammer.
// This is a GET so the <audio> element can stream it: the first words play while the
// rest of the sentence is still being generated, instead of waiting for a whole file.
const MODEL = "gpt-4o-mini-tts";
const VOICE = process.env.HERO_SAY_VOICE || cfg.voice;

function originAllowed(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  if (!origin) return true;
  return /beingsteady\.com|steady-site.*\.vercel\.app|localhost|127\.0\.0\.1/.test(origin);
}

async function speak(req: NextRequest, text: string) {
  if (!originAllowed(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!text) return NextResponse.json({ error: "empty" }, { status: 400 });

  const upstream = await openaiFetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    timeoutMs: 20000,
    body: JSON.stringify({
      model: MODEL,
      voice: VOICE,
      input: text,
      response_format: "mp3",
      speed: cfg.speed,
      instructions: cfg.instructions,
    }),
  });
  if (!upstream?.ok || !upstream.body) {
    if (upstream) console.error("hero-say tts failed", upstream.status, (await upstream.text()).slice(0, 200));
    return NextResponse.json({ error: "tts_failed" }, { status: 502 });
  }
  // pipe the audio through as it arrives — do not buffer the whole file first
  return new NextResponse(upstream.body, {
    status: 200,
    headers: { "content-type": "audio/mpeg", "cache-control": "no-store" },
  });
}

export async function GET(req: NextRequest) {
  return speak(req, (req.nextUrl.searchParams.get("t") || "").trim().slice(0, 1400));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return speak(req, String(body?.text || "").trim().slice(0, 1400));
}
