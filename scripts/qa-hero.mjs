#!/usr/bin/env node
// Hero taster QA: boot→ready, typed flow, mic-grant voice flow (fake mic),
// mic-deny fallback, CTA handoff link. Run: node scripts/qa-hero.mjs [baseUrl]
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3399";
const results = [];
const check = (name, ok, extra = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`);
};

const hero = (page) => page.evaluate(() => ({
  phase: window.__steadyHero?.phase,
  lines: window.__steadyHero?.lines?.map((l) => `${l.who}:${l.text.slice(0, 60)}`),
  wave: window.__steadyHero?.wave,
}));

async function waitPhase(page, phase, ms = 15000) {
  try {
    await page.waitForFunction((p) => window.__steadyHero?.phase === p, phase, { timeout: ms });
    return true;
  } catch {
    return false;
  }
}

// --- run 1: grant mic, full voice flow ---
{
  const browser = await chromium.launch({
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"],
  });
  const ctx = await browser.newContext({ permissions: ["microphone"] });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  check("boot→ready", await waitPhase(page, "ready", 10000), JSON.stringify(await hero(page)));

  await page.getByRole("button", { name: "Allow microphone" }).click();
  const voiceUp = await waitPhase(page, "voice", 20000);
  check("voice connects (fake mic, real OpenAI)", voiceUp, JSON.stringify((await hero(page)).phase));
  if (voiceUp) {
    // greeting transcript should stream in (a 2nd steady line beyond the canned opener)
    const greeted = await page.waitForFunction(
      () => (window.__steadyHero?.lines || []).filter((l) => l.who === "steady").length >= 2,
      undefined, { timeout: 25000 }
    ).then(() => true).catch(() => false);
    check("steady greets (transcript streams)", greeted, JSON.stringify((await hero(page)).lines));
    let maxAmp = 0;
    for (let i = 0; i < 24; i++) {
      maxAmp = Math.max(maxAmp, await page.evaluate(() => window.__steadyHero?.wave?.amp || 0));
      if (maxAmp > 0.15) break;
      await page.waitForTimeout(500);
    }
    check("wave animates while speaking", maxAmp > 0.15, `maxAmp=${maxAmp.toFixed(3)}`);
    await page.getByRole("button", { name: "End", exact: true }).click();
    check("End → done + goodbye", await waitPhase(page, "done", 5000));
    const cta = await page.locator("a", { hasText: "Keep talking with Steady" }).getAttribute("href");
    check("CTA carries #taster handoff", Boolean(cta && cta.includes("#taster=")), (cta || "").slice(0, 60));
  }
  await browser.close();
}

// --- run 2: deny mic → text fallback ---
{
  const browser = await chromium.launch({ args: ["--use-fake-device-for-media-stream"] });
  const ctx = await browser.newContext(); // no mic permission → getUserMedia rejects
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await waitPhase(page, "ready", 10000);
  await page.getByRole("button", { name: "Allow microphone" }).click();
  check("mic denied → text fallback", await waitPhase(page, "text", 10000));

  // typed message gets a real reply
  await page.getByPlaceholder("Chat to Steady here…").fill("Hi, I'm QA. Say hello back.");
  await page.getByRole("button", { name: "Send" }).click();
  const replied = await page.waitForFunction(
    () => {
      const l = window.__steadyHero?.lines || [];
      return l.filter((x) => x.who === "steady").length >= 2;
    },
    undefined, { timeout: 20000 }
  ).then(() => true).catch(() => false);
  check("typed message → real reply", replied, JSON.stringify((await hero(page)).lines?.slice(-2)));
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(failed.length ? `\n${failed.length} FAILED` : "\nALL PASS");
process.exit(failed.length ? 1 : 0);
