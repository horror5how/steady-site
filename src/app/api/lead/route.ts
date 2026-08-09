import { createCipheriv, randomBytes } from "node:crypto";
import { put } from "@vercel/blob";

/* Email-first capture for the ad landing page.
 *
 * The full application at /invite is nine questions and a safety screen, and
 * that stays exactly as it is — nobody gets into the trial without it. This
 * route exists so that somebody who taps an ad, gives their email and then
 * drops out at question six is still a lead we can write back to, instead of
 * nothing at all.
 *
 * ponytail: same sealed-blob pattern as /api/invite. No DB, no new dependency.
 */

// An email paired with an OCD-themed ad is health-adjacent data, so it is
// sealed at rest exactly like a full application.
function seal(plaintext: string): string {
  const key = process.env.INVITE_ENCRYPTION_KEY;
  if (!key || !/^[0-9a-f]{64}$/i.test(key)) {
    throw new Error("INVITE_ENCRYPTION_KEY missing or not 32-byte hex");
  }
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
  const raw = String(value ?? "");
  let out = "";
  for (const ch of raw) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 32 && code !== 127) out += ch;
  }
  return out.trim().slice(0, max);
}

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = clean(body.email, 160).toLowerCase();
  if (!EMAIL.test(email)) {
    return Response.json({ ok: false, error: "That email doesn't look right." }, { status: 400 });
  }

  const record = {
    email,
    variant: clean(body.variant, 40),
    ad: clean(body.ad, 40),
    // Ad platform click ids, so a lead can be tied back to the creative that
    // produced it without any of it living in a URL the visitor can see.
    source: clean(body.source, 200),
    stage: "email_captured",
    receivedAt: new Date().toISOString(),
    country: (request.headers.get("x-vercel-ip-country") || "").toUpperCase(),
  };

  try {
    await put(`landing-leads/${Date.now()}.json`, seal(JSON.stringify(record)), {
      access: "public",
      addRandomSuffix: true,
      contentType: "application/json",
    });
  } catch {
    return Response.json(
      { ok: false, error: "We couldn't save that. Try again in a moment." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
