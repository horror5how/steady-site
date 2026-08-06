#!/usr/bin/env node
/* Bakes the fixed hero lines (greeting + thinking fillers) into static mp3s so they
   play with zero API latency. Run once after editing src/lib/hero-audio.json:
     OPENAI_API_KEY=... node scripts/gen-hero-audio.mjs
   Commit the resulting public/hero-audio/*.mp3 files. */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cfg = JSON.parse(readFileSync(join(root, "src/lib/hero-audio.json"), "utf8"));
const outDir = join(root, "public/hero-audio");
const key = process.env.OPENAI_API_KEY;

if (!key) {
  console.error("OPENAI_API_KEY is required");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

for (const clip of cfg.clips) {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: cfg.voice,
      input: clip.text,
      response_format: "mp3",
      speed: cfg.speed,
      instructions: cfg.instructions,
    }),
  });
  if (!res.ok) {
    console.error(`${clip.file}: ${res.status} ${(await res.text()).slice(0, 200)}`);
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(outDir, `${clip.file}.mp3`), buf);
  console.log(`${clip.file}.mp3  ${(buf.length / 1024).toFixed(0)}kB`);
}
