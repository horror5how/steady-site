import { createHmac, createHash } from "crypto";
import { list, put } from "@vercel/blob";

// Layer 1 (fast, exact per client): HMAC-signed cookie + per-lambda memory.
// Layer 2 (durable, coarse): daily counter JSON in Vercel Blob — survives lambda
// recycles and cookie-clearing; versioned paths beat blob CDN stale reads.
const SECRET = process.env.HERO_LIMIT_SECRET || (process.env.OPENAI_API_KEY || "steady").slice(-24);
const BLOB_TOKEN = process.env.HERO_BLOB_RW_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
const mem = new Map<string, number>();

export const LIMITS = { voice: 4, chat: 40 } as const;
export const DAILY_BUDGET = {
  voice: Number(process.env.HERO_DAILY_VOICE_BUDGET) || 300,
  chat: Number(process.env.HERO_DAILY_CHAT_BUDGET) || 2000,
} as const;

type Kind = keyof typeof LIMITS;
type DayCounts = { total: { voice: number; chat: number }; ips: Record<string, { voice: number; chat: number }> };

function day() {
  return new Date().toISOString().slice(0, 10);
}
function sign(s: string) {
  return createHmac("sha256", SECRET).update(s).digest("hex").slice(0, 16);
}
function ipHash(ip: string) {
  return createHash("sha256").update(SECRET + ip).digest("hex").slice(0, 12);
}

async function readDurable(d: string): Promise<DayCounts> {
  const empty: DayCounts = { total: { voice: 0, chat: 0 }, ips: {} };
  if (!BLOB_TOKEN) return empty;
  try {
    const { blobs } = await list({ prefix: `hero-quota/${d}/`, token: BLOB_TOKEN, limit: 1000 });
    if (!blobs.length) return empty;
    const latest = blobs.reduce((a, b) => (a.uploadedAt > b.uploadedAt ? a : b));
    const res = await fetch(latest.url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return empty;
    return { ...empty, ...(await res.json()) };
  } catch {
    return empty; // blob down must never block the hero
  }
}

async function writeDurable(d: string, counts: DayCounts) {
  if (!BLOB_TOKEN) return;
  try {
    await put(`hero-quota/${d}/${Date.now()}.json`, JSON.stringify(counts), {
      access: "public",
      token: BLOB_TOKEN,
      addRandomSuffix: false,
      contentType: "application/json",
    });
  } catch {} // best effort
}

/**
 * Consume one unit. Returns:
 *  ok      → proceed (cookie value included)
 *  ip_limit→ this visitor hit their daily cap
 *  budget  → global daily budget exhausted (circuit breaker)
 */
export async function takeQuota(kind: Kind, ip: string, cookie: string | undefined) {
  const d = day();

  // durable global + per-IP backstop
  const durable = await readDurable(d);
  if (durable.total[kind] >= DAILY_BUDGET[kind]) return { verdict: "budget" as const };
  const hash = ipHash(ip);
  const durableIp = durable.ips[hash]?.[kind] || 0;

  // fast local layers
  let cookieCount = 0;
  if (cookie) {
    const parts = cookie.split(".");
    if (parts.length === 4 && parts[0] === d && parts[1] === kind && sign(parts.slice(0, 3).join(".")) === parts[3]) {
      cookieCount = parseInt(parts[2], 10) || 0;
    }
  }
  const memKey = `${d}:${ip}:${kind}`;
  const used = Math.max(mem.get(memKey) || 0, cookieCount, durableIp);
  if (used >= LIMITS[kind]) return { verdict: "ip_limit" as const };

  const next = used + 1;
  if (mem.size > 5000) mem.clear();
  mem.set(memKey, next);
  durable.total[kind] += 1;
  const prev = durable.ips[hash];
  const rec = { voice: prev?.voice || 0, chat: prev?.chat || 0 };
  rec[kind] = next;
  durable.ips[hash] = rec;
  await writeDurable(d, durable);

  const value = `${d}.${kind}.${next}`;
  return { verdict: "ok" as const, cookie: `${value}.${sign(value)}` };
}

export function clientIp(headers: Headers) {
  return (headers.get("x-forwarded-for") || "local").split(",")[0].trim();
}

/** Try each configured OpenAI key in order; retry once per key on 5xx/network. */
export async function openaiFetch(url: string, init: RequestInit & { timeoutMs?: number }) {
  const keys = [process.env.OPENAI_API_KEY, process.env.OPENAI_API_KEY_FALLBACK].filter(Boolean) as string[];
  let last: Response | null = null;
  for (const key of keys) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(url, {
          ...init,
          headers: { ...(init.headers as Record<string, string>), Authorization: `Bearer ${key}` },
          signal: AbortSignal.timeout(init.timeoutMs || 10000),
        });
        if (res.ok) return res;
        last = res;
        if (res.status < 500) return res; // 4xx: retrying won't help
      } catch {
        last = null;
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  return last;
}
