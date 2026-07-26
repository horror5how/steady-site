import { createCipheriv, randomBytes } from "node:crypto";
import { put } from "@vercel/blob";

// Invite applications for the closed research trial.
// ponytail: one append-only blob per application — no DB, no new dependency.
//
// Blocked states: Illinois and Nevada ban AI-delivered mental-health practice
// without a licensed clinician in charge; Washington's My Health My Data Act
// adds a private right of action over consumer health data. We take nobody
// from those three until there is a clinician and counsel in place.
const BLOCKED = new Set(["IL", "NV", "WA"]);

const STATES = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA",
  "ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR",
  "PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
]);

// Vercel Blob URLs are public-but-unguessable. An application can name a mental
// health condition, so the body is sealed at rest and only the holder of
// INVITE_ENCRYPTION_KEY (32-byte hex) can read it back.
function seal(plaintext: string): string {
  const key = process.env.INVITE_ENCRYPTION_KEY;
  if (!key || !/^[0-9a-f]{64}$/i.test(key)) throw new Error("INVITE_ENCRYPTION_KEY missing or not 32-byte hex");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(key, "hex"), iv);
  const sealed = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return JSON.stringify({
    v: 1,
    alg: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: sealed.toString("base64"),
  });
}

function clean(value: unknown, max: number): string {
  // strip control characters only - spaces, hyphens and "+" must survive intact
  const raw = String(value ?? "");
  let out = "";
  for (const ch of raw) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 32 && code !== 127) out += ch;
  }
  return out.trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = clean(body.name, 80);
  const email = clean(body.email, 160).toLowerCase();
  const state = clean(body.state, 2).toUpperCase();
  const city = clean(body.city, 80);
  const about = clean(body.about, 1200);
  const agreed = body.agreed === true;
  // Self-declared safety screen. Not a clinical assessment and never framed as
  // one — it is the door policy for a trial with no clinician on the team.
  const riskFlags = {
    selfHarmOrHarmToOthers: body.riskSelfHarm === true,
    recentCrisisOrHospital: body.riskRecentCrisis === true,
    underCrisisCareNow: body.riskCrisisCare === true,
  };
  const screenedOut = Object.values(riskFlags).some(Boolean);
  const ageBand = clean(body.ageBand, 20);
  const goals = Array.isArray(body.goals) ? body.goals.slice(0, 3).map((g: unknown) => clean(g, 60)) : [];
  const frequency = clean(body.frequency, 60);
  // The flow exits before this, but a direct POST must not get past the age gate.
  if (ageBand === "Under 18") {
    return Response.json(
      {
        ok: false,
        screenedOut: true,
        error:
          "Steady is being tested with adults only for now, so we can't take under-18s yet. If your thoughts are looping and it's hard, please talk to someone who can help: call or text 988, text HOME to 741741, or call 911 in an emergency. iocdf.org/find-help lists therapists who work with young people.",
      },
      { status: 200 },
    );
  }

  if (!name) return Response.json({ ok: false, error: "Please tell us your first name." }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return Response.json({ ok: false, error: "That email doesn't look right." }, { status: 400 });
  }
  if (!STATES.has(state)) return Response.json({ ok: false, error: "Please choose your state." }, { status: 400 });
  if (!agreed) {
    return Response.json(
      { ok: false, error: "We can only accept applications with the confirmation ticked." },
      { status: 400 },
    );
  }

  if (screenedOut) {
    return Response.json(
      {
        ok: false,
        screenedOut: true,
        error:
          "Thank you for being honest — that matters. Steady is an early trial with no clinician on the team, so it is not the right place for you right now, and we would rather say that than take you in. Please talk to someone who can actually help: call or text 988 (Suicide & Crisis Lifeline), text HOME to 741741, or call 911 if you are in immediate danger. For OCD-specialist therapists, iocdf.org/find-help is the best directory there is. We would genuinely be glad to hear from you again once things are steadier.",
      },
      { status: 200 },
    );
  }

  // Self-declared state is the gate. The header is a cross-check, not a substitute:
  // it catches a blocked-state resident who declares somewhere else.
  const headerCountry = (request.headers.get("x-vercel-ip-country") || "").toUpperCase();
  const headerRegion = (request.headers.get("x-vercel-ip-country-region") || "").toUpperCase();

  if (BLOCKED.has(state) || (headerCountry === "US" && BLOCKED.has(headerRegion))) {
    return Response.json(
      {
        ok: false,
        blocked: true,
        error:
          "We can't accept applications from Illinois, Nevada or Washington yet. State law there requires a licensed clinician to oversee AI-guided mental-health practice, and we're not there yet.",
      },
      { status: 403 },
    );
  }

  const record = {
    name,
    email,
    state,
    city,
    about,
    agreedToTerms: true,
    riskFlags,
    ageBand,
    goals,
    frequency,
    status: "pending",
    consentVersion: "2026-07-25-trial-v1",
    receivedAt: new Date().toISOString(),
    headerRegion: headerCountry === "US" ? headerRegion : headerCountry,
  };

  try {
    await put(`invite-applications/${Date.now()}.json`, seal(JSON.stringify(record)), {
      access: "public",
      addRandomSuffix: true,
      contentType: "application/json",
    });
  } catch {
    return Response.json({ ok: false, error: "We couldn't save that. Try again in a moment." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
