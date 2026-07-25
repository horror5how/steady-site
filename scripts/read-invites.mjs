// Read the invite applications. They are sealed at rest, so this is the only way in.
//   node --env-file=.env.local scripts/read-invites.mjs
// Needs BLOB_READ_WRITE_TOKEN and INVITE_ENCRYPTION_KEY (same key the API sealed with —
// rotate it and older applications become unreadable).
import { createDecipheriv } from "node:crypto";
import { list } from "@vercel/blob";

const key = process.env.INVITE_ENCRYPTION_KEY;
if (!key || !/^[0-9a-f]{64}$/i.test(key)) {
  console.error("INVITE_ENCRYPTION_KEY missing or not 32-byte hex");
  process.exit(1);
}

function open(raw) {
  const env = JSON.parse(raw);
  const d = createDecipheriv("aes-256-gcm", Buffer.from(key, "hex"), Buffer.from(env.iv, "base64"));
  d.setAuthTag(Buffer.from(env.tag, "base64"));
  return JSON.parse(Buffer.concat([d.update(Buffer.from(env.data, "base64")), d.final()]).toString("utf8"));
}

const { blobs } = await list({ prefix: "invite-applications/" });
const rows = [];
for (const blob of blobs) {
  try {
    rows.push(open(await (await fetch(blob.url)).text()));
  } catch (error) {
    console.error(`could not open ${blob.pathname}: ${error.message}`);
  }
}

rows.sort((a, b) => String(a.receivedAt).localeCompare(String(b.receivedAt)));
console.log(`${rows.length} application(s)\n`);
for (const r of rows) {
  console.log(`${r.receivedAt}  ${r.name} <${r.email}>  ${r.city ? r.city + ", " : ""}${r.state}`);
  if (r.about) console.log(`    "${r.about.replace(/\s+/g, " ").slice(0, 300)}"`);
}
