/* Guards the one thing that must never drift: what Steady hands to Meta.
 *
 * Every event on this site flows through a single ph() call, so adding a line
 * to EVENT_MAP is enough to start shipping that event to Facebook. On a
 * mental-health product that is a one-line mistake with a regulator attached,
 * so the allowlist is pinned here and a new entry fails the build until
 * somebody approves it on purpose.
 *
 * Run: node scripts/check-meta.mjs
 */

import { readFileSync } from "node:fs";

const client = readFileSync(new URL("../src/lib/meta.ts", import.meta.url), "utf8");
const server = readFileSync(new URL("../src/app/api/meta/route.ts", import.meta.url), "utf8");

/* Approved on 2026-08-03: hero-taster engagement and the invite conversion.
   Nothing here can carry an answer, a transcript, or a mapped loop. */
const APPROVED_EVENTS = [
  "mic_clicked",
  "voice_started",
  "voice_completed",
  "text_message",
  "type_clicked",
  "cta_click",
  "invite_submitted",
];

const APPROVED_PROPS = ["variant", "source", "visit_count", "engagement_score", "trigger"];

// Each of these is a single literal declaration with no semicolon inside it,
// so "up to the next semicolon" is the whole thing.
function block(source, name) {
  const start = source.indexOf(name);
  if (start === -1) throw new Error(`${name} not found — did the file get restructured?`);
  const end = source.indexOf(";", start);
  return source.slice(start, end === -1 ? undefined : end);
}

const fail = [];

// The declaration, not the mention of it in the file header comment.
const mapped = [...block(client, "export const EVENT_MAP").matchAll(/^\s*([a-z_]+):/gm)].map((m) => m[1]);
for (const event of mapped) {
  if (!APPROVED_EVENTS.includes(event)) {
    fail.push(`EVENT_MAP forwards "${event}" to Meta, which is not on the approved list.`);
  }
}
if (mapped.length === 0) fail.push("EVENT_MAP parsed as empty — the check is not actually checking anything.");

const safeProps = [...block(client, "const SAFE_PROPS").matchAll(/"([a-z_]+)"/g)].map((m) => m[1]);
const allowedProps = [...block(server, "ALLOWED_PROPS").matchAll(/"([a-z_]+)"/g)].map((m) => m[1]);
for (const prop of [...safeProps, ...allowedProps]) {
  if (!APPROVED_PROPS.includes(prop)) fail.push(`Property "${prop}" is sent to Meta but is not approved.`);
}
// The server is the last gate: anything the client sends it must also accept,
// or events die silently in production with a 400 nobody sees.
for (const prop of safeProps) {
  if (!allowedProps.includes(prop)) fail.push(`Client sends "${prop}" but the CAPI route drops it.`);
}

if (fail.length) {
  console.error("check-meta FAILED\n" + fail.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log(`check-meta OK — ${mapped.length} approved events, ${allowedProps.length} approved properties`);
