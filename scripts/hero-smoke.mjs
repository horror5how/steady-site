import { chromium } from "playwright";

const b = await chromium.launch({
  args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"],
});
const ctx = await b.newContext({ permissions: ["microphone"] });
const p = await ctx.newPage();
p.on("console", (m) => { if (m.type() === "error") console.log("console error:", m.text().slice(0, 200)); });

await p.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await p.waitForFunction(() => window.__steadyHero?.phase === "ready", null, { timeout: 20000 });

const t0 = Date.now();
await p.getByRole("button", { name: "Allow microphone" }).click();
await p.waitForFunction(() => (window.__steadyHero?.lines || []).some((l) => l.who === "steady" && l.text.length > 3), null, { timeout: 25000 });
console.log(`greeting first words: +${Date.now() - t0}ms after click`);

// wait for the greeting to finish speaking
await p.waitForFunction(() => !window.__steadyHero.wave.speaking, null, { timeout: 40000 });

await p.evaluate(() => window.__steadyHero.advance("My name is Sam"));
await p.waitForFunction(() => window.__steadyHero.lines.filter((l) => l.who === "steady").length >= 2, null, { timeout: 20000 });
await p.waitForFunction(() => !window.__steadyHero.wave.speaking, null, { timeout: 60000 });

// sample whether a voice is actually audible, every 50ms, for the whole turn
await p.evaluate(() => {
  window.__samples = [];
  window.__t1 = performance.now();
  window.__poll = setInterval(() => window.__samples.push([Math.round(performance.now() - window.__t1), window.__steadyHero.wave.speaking]), 50);
});
const t1 = Date.now();
await p.evaluate(() => window.__steadyHero.advance("I keep replaying an argument from work at two in the morning"));
await p.waitForFunction(() => window.__steadyHero.lines.filter((l) => l.who === "steady").length >= 3, null, { timeout: 20000 });
console.log(`holding line appears: +${Date.now() - t1}ms after the visitor stops talking`);
await p.waitForFunction(() => window.__steadyHero.lines.filter((l) => l.who === "steady").length >= 4, null, { timeout: 60000 });
console.log(`live reply starts:   +${Date.now() - t1}ms`);

await p.waitForFunction(() => window.__steadyHero.wave.speaking, null, { timeout: 20000 });
const gaps = await p.evaluate(() => {
  clearInterval(window.__poll);
  const s = window.__samples;
  const out = [];
  let start = null;
  for (const [t, sp] of s) {
    if (!sp && start === null) start = t;
    if (sp && start !== null) { out.push([start, t - start]); start = null; }
  }
  return out;
});
console.log("silent gaps during the turn (start ms, length ms):", JSON.stringify(gaps));
console.log(JSON.stringify(await p.evaluate(() => window.__steadyHero.lines), null, 1));
await b.close();
