import { createDecipheriv, createCipheriv, randomBytes, timingSafeEqual } from "node:crypto";
import { list, put } from "@vercel/blob";

// Operator-only review of invite applications. Reached by the Steady intel
// dashboard, which proxies server-side so the key never reaches a browser.
// Applications are sealed at rest; this is the only thing that opens them.

type Application = {
  name: string;
  email: string;
  state: string;
  city?: string;
  about?: string;
  status?: string;
  riskFlags?: Record<string, boolean>;
  receivedAt?: string;
  reviewedAt?: string;
  consentVersion?: string;
};

function keyOk(request: Request): boolean {
  const expected = process.env.STEADY_REVIEW_KEY || "";
  const supplied = new URL(request.url).searchParams.get("key") || request.headers.get("x-steady-review-key") || "";
  if (!expected || expected.length !== supplied.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
}

function cryptoKey(): Buffer {
  const key = process.env.INVITE_ENCRYPTION_KEY;
  if (!key || !/^[0-9a-f]{64}$/i.test(key)) throw new Error("INVITE_ENCRYPTION_KEY missing or not 32-byte hex");
  return Buffer.from(key, "hex");
}

function open(raw: string): Application {
  const env = JSON.parse(raw);
  const decipher = createDecipheriv("aes-256-gcm", cryptoKey(), Buffer.from(env.iv, "base64"));
  decipher.setAuthTag(Buffer.from(env.tag, "base64"));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(env.data, "base64")), decipher.final()]).toString("utf8"));
}

function seal(value: unknown): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", cryptoKey(), iv);
  const sealed = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return JSON.stringify({
    v: 1,
    alg: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: sealed.toString("base64"),
  });
}

export async function GET(request: Request) {
  if (!keyOk(request)) return Response.json({ error: "Not found." }, { status: 404 });
  const { blobs } = await list({ prefix: "invite-applications/" });
  const applications = [];
  for (const blob of blobs) {
    try {
      const record = open(await (await fetch(blob.url, { cache: "no-store" })).text());
      applications.push({ ...record, id: blob.pathname, url: blob.url, status: record.status || "pending" });
    } catch {
      applications.push({ id: blob.pathname, url: blob.url, status: "unreadable", name: "", email: "", state: "" });
    }
  }
  applications.sort((a, b) => String(b.receivedAt || "").localeCompare(String(a.receivedAt || "")));
  return Response.json(
    {
      applications,
      counts: {
        total: applications.length,
        pending: applications.filter((a) => a.status === "pending").length,
        approved: applications.filter((a) => a.status === "approved").length,
        declined: applications.filter((a) => a.status === "declined").length,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!keyOk(request)) return Response.json({ error: "Not found." }, { status: 404 });
  const body = await request.json().catch(() => null);
  const id = String(body?.id || "");
  const action = String(body?.action || "");
  if (!id || !["approve", "decline"].includes(action)) {
    return Response.json({ error: "Unknown review action." }, { status: 400 });
  }

  const { blobs } = await list({ prefix: "invite-applications/" });
  const target = blobs.find((blob) => blob.pathname === id);
  if (!target) return Response.json({ error: "Application not found." }, { status: 404 });

  const record = open(await (await fetch(target.url, { cache: "no-store" })).text());
  const updated = {
    ...record,
    status: action === "approve" ? "approved" : "declined",
    reviewedAt: new Date().toISOString(),
  };

  // Same pathname, overwrite in place — the id already carries its random suffix.
  await put(id, seal(updated), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });

  return Response.json({ ok: true, status: updated.status }, { headers: { "Cache-Control": "no-store" } });
}
