import { NextRequest, NextResponse } from "next/server";
import { openaiFetch } from "@/lib/hero-limit";

export const dynamic = "force-dynamic";

// The homepage intro is a locked script, spoken in the platform's Cedar voice via the
// speech API — slow, warm, mature, deeply present. The realtime model never speaks it,
// so there is no improvisation, no paraphrasing and no stammer.
const MODEL = "gpt-4o-mini-tts";
const VOICE = process.env.HERO_SAY_VOICE || "cedar";
const INSTRUCTIONS = [
  "You are Steady. Read the text exactly as written, word for word, never add, drop, or paraphrase anything.",
  "Voice: a warm, mature, calm and caring man. Emotionally present and genuinely kind.",
  "Pace: natural conversational speed, easy and confident. A brief natural pause at full stops, nothing drawn out. Never sound like a machine reading text.",
  "Let gentle feeling colour the words, especially the empathetic lines. British English.",
].join(" ");

function originAllowed(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  if (!origin) return true;
  return /beingsteady\.com|steady-site.*\.vercel\.app|localhost|127\.0\.0\.1/.test(origin);
}

export async function POST(req: NextRequest) {
  if (!originAllowed(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const text = String(body?.text || "").trim().slice(0, 1400);
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
      speed: 1.02,
      instructions: INSTRUCTIONS,
    }),
  });
  if (!upstream || !upstream.ok) {
    if (upstream) console.error("hero-say tts failed", upstream.status, (await upstream.text()).slice(0, 200));
    return NextResponse.json({ error: "tts_failed" }, { status: 502 });
  }
  const audio = await upstream.arrayBuffer();
  return new NextResponse(audio, {
    status: 200,
    headers: { "content-type": "audio/mpeg", "cache-control": "no-store" },
  });
}
