import { createDecipheriv } from "node:crypto";
import { list } from "@vercel/blob";

/* The variant dashboard, as one page.
 *
 * Which headline is winning, week by week. Opens the sealed lead records, so
 * it is gated on a key that lives only in Vercel and is never linked from the
 * site. Counts only; no email is ever rendered.
 *
 *   /api/landing-stats?key=…
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function open(sealed: string): string | null {
  const key = process.env.INVITE_ENCRYPTION_KEY;
  if (!key) return null;
  try {
    const box = JSON.parse(sealed) as { iv: string; tag: string; data: string };
    const d = createDecipheriv("aes-256-gcm", Buffer.from(key, "hex"), Buffer.from(box.iv, "base64"));
    d.setAuthTag(Buffer.from(box.tag, "base64"));
    return Buffer.concat([d.update(Buffer.from(box.data, "base64")), d.final()]).toString("utf8");
  } catch {
    return null;
  }
}

type Lead = { variant?: string; receivedAt?: string; source?: string; country?: string };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const expected = process.env.LANDING_STATS_KEY;
  if (!expected || url.searchParams.get("key") !== expected) {
    return new Response("Not found", { status: 404 });
  }

  const leads: Lead[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "landing-leads/", cursor, limit: 1000 });
    for (const blob of page.blobs) {
      const res = await fetch(blob.url);
      if (!res.ok) continue;
      const plain = open(await res.text());
      if (!plain) continue;
      try {
        leads.push(JSON.parse(plain) as Lead);
      } catch {
        /* a record we cannot read is a record we do not count */
      }
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const byVariant = new Map<string, number>();
  const byWeek = new Map<string, Map<string, number>>();
  const byCountry = new Map<string, number>();
  const withRef = leads.filter((l) => /[?&]ref=/.test(l.source ?? "")).length;
  for (const l of leads) {
    const v = l.variant || "unknown";
    byVariant.set(v, (byVariant.get(v) ?? 0) + 1);
    const d = l.receivedAt ? new Date(l.receivedAt) : new Date(0);
    const monday = new Date(d);
    monday.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
    const wk = monday.toISOString().slice(0, 10);
    if (!byWeek.has(wk)) byWeek.set(wk, new Map());
    const row = byWeek.get(wk)!;
    row.set(v, (row.get(v) ?? 0) + 1);
    const c = l.country || "—";
    byCountry.set(c, (byCountry.get(c) ?? 0) + 1);
  }
  const variants = [...byVariant.keys()].sort();
  const weeks = [...byWeek.keys()].sort().reverse();

  const esc = (s: string) => s.replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[ch]!);
  const td = (s: string | number) => `<td>${esc(String(s))}</td>`;

  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Landing leads</title>
<style>
body{font:15px/1.5 -apple-system,system-ui,sans-serif;margin:0;padding:24px;background:#f6f7f8;color:#23282c}
h1{font-size:22px;margin:0 0 4px}h2{font-size:15px;margin:28px 0 8px;text-transform:uppercase;letter-spacing:.08em;color:#6d757b}
table{border-collapse:collapse;background:#fff;border:1px solid #e6e8ea}td,th{padding:8px 12px;border-bottom:1px solid #e6e8ea;text-align:left;font-variant-numeric:tabular-nums}th{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#6d757b}
.big{font-size:40px;font-weight:600;letter-spacing:-.02em}
</style>
<h1>beingsteady.com/landing — leads</h1>
<p style="color:#6d757b;margin:0">Email captures from the ad page. Counts only. Generated ${esc(new Date().toISOString().slice(0, 16).replace("T", " "))} UTC.</p>
<p class="big">${leads.length}</p>
<p style="margin-top:-12px;color:#6d757b">${withRef} came through a referral link.</p>
<h2>By variant</h2>
<table><tr><th>Variant</th><th>Leads</th><th>Share</th></tr>
${variants.map((v) => `<tr>${td(v)}${td(byVariant.get(v)!)}${td(leads.length ? Math.round((byVariant.get(v)! / leads.length) * 100) + "%" : "—")}</tr>`).join("")}
</table>
<h2>By week (Mondays, UTC)</h2>
<table><tr><th>Week</th>${variants.map((v) => `<th>${esc(v)}</th>`).join("")}<th>Total</th></tr>
${weeks.map((wk) => { const row = byWeek.get(wk)!; const total = [...row.values()].reduce((a, b) => a + b, 0); return `<tr>${td(wk)}${variants.map((v) => td(row.get(v) ?? 0)).join("")}${td(total)}</tr>`; }).join("")}
</table>
<h2>By country</h2>
<table><tr><th>Country</th><th>Leads</th></tr>
${[...byCountry.entries()].sort((a, b) => b[1] - a[1]).map(([c, n]) => `<tr>${td(c)}${td(n)}</tr>`).join("")}
</table>
<p style="margin-top:32px;color:#6d757b;font-size:13px">Variants: checker · reassurance · night · pureo · watching. One above-the-fold change a week; this page is where you read the result.</p>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
