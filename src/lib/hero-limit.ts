import { createHmac } from "crypto";

// ponytail: best-effort cost guard (in-memory per lambda + signed cookie), not a bank vault.
const SECRET = process.env.HERO_LIMIT_SECRET || (process.env.OPENAI_API_KEY || "steady").slice(-24);
const mem = new Map<string, number>();

export const LIMITS = { voice: 4, chat: 40 } as const;

function day() {
  return new Date().toISOString().slice(0, 10);
}
function sign(s: string) {
  return createHmac("sha256", SECRET).update(s).digest("hex").slice(0, 16);
}

/** Consume one unit of quota. Returns a signed cookie value to persist the count. */
export function takeQuota(kind: keyof typeof LIMITS, ip: string, cookie: string | undefined) {
  const d = day();
  const memKey = `${d}:${ip}:${kind}`;
  let cookieCount = 0;
  if (cookie) {
    const parts = cookie.split(".");
    if (parts.length === 4 && parts[0] === d && parts[1] === kind && sign(parts.slice(0, 3).join(".")) === parts[3]) {
      cookieCount = parseInt(parts[2], 10) || 0;
    }
  }
  const used = Math.max(mem.get(memKey) || 0, cookieCount);
  if (used >= LIMITS[kind]) return { ok: false as const };
  const next = used + 1;
  if (mem.size > 5000) mem.clear();
  mem.set(memKey, next);
  const value = `${d}.${kind}.${next}`;
  return { ok: true as const, cookie: `${value}.${sign(value)}` };
}

export function clientIp(headers: Headers) {
  return (headers.get("x-forwarded-for") || "local").split(",")[0].trim();
}
