import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.STEADY_TEST_URL || "http://localhost:3018";
const out = process.env.STEADY_TEST_OUTPUT || "/tmp/steady-sky-qa";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
await context.addInitScript(() =>
  localStorage.setItem("sh-cookie", "rejected"),
);
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
let requests = 0;
// No model calls, recordings, sign-ups or analytics are made by this test.
await page.route("**/api/hero-session", (r) => {
  requests++;
  return r.fulfill({ json: { ok: true } });
});
await page.route("**/api/hero-chat", (r) =>
  r.fulfill({ json: { reply: "Taster integration test response." } }),
);
await page.route("**/api/hero-say*", (r) => r.abort());
await page.route("**/hero-audio/**", (r) => r.fulfill({ status: 204 }));
try {
  assert.equal((await page.goto(base)).status(), 200);
  await page.locator("h1").filter({ hasText: "A calm voice." }).waitFor();
  await page.waitForTimeout(1600);
  assert.equal(
    requests,
    0,
    "Homepage must not boot voice before a user opens the taster",
  );
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page
    .getByRole("button", { name: "Pause animation", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Play animation", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.screenshot({ path: `${out}/desktop-hero.png` });
  const links = await page
    .locator("a[href]")
    .evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute("href")))]);
  for (const href of links.filter((h) => h.startsWith("#")))
    assert.equal(await page.locator(href).count(), 1, `Missing ${href}`);
  assert(links.includes("/invite"));
  const faq = page
    .locator("details")
    .filter({ hasText: "How do I get a place?" });
  await faq.locator("summary").click();
  assert.equal(await faq.getAttribute("open"), "");
  await faq.locator("summary").click();
  assert.equal(await faq.getAttribute("open"), null);
  await page.getByRole("button", { name: "Meet Steady", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  await page
    .getByRole("button", { name: "I'd rather type", exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "I'd rather type", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Message to Steady" })
    .fill("Interface test");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await page
    .getByText("Taster integration test response.", { exact: true })
    .waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached" });
  await page.waitForFunction(() => document.body.style.overflow === "");
  assert.equal(
    await page
      .getByRole("button", { name: "Meet Steady", exact: true })
      .evaluate((e) => e === document.activeElement),
    true,
    "Dialog must restore focus",
  );
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => scrollTo(0, 0));
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Overflow at ${width}`,
    );
    await page.screenshot({
      path: `${out}/width-${width}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Features", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Open menu" })
      .getAttribute("aria-expanded"),
    "false",
  );
  assert.equal(new URL(page.url()).hash, "#features");
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator("[class*=scribble]")
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  for (const path of [
    "/invite",
    "/login",
    "/know-more",
    "/privacy",
    "/faq",
    "/help",
    "/blog",
    "/therapists",
  ]) {
    const response = await context.request.get(new URL(path, base).href);
    assert.equal(response.status(), 200, `${path} must load`);
  }
  await page.goto(new URL("/invite", base).href);
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Stop the same thought looping", exact: true })
    .waitFor();
  assert.deepEqual(errors, []);
  await writeFile(
    `${out}/results.json`,
    JSON.stringify(
      {
        pass: true,
        base,
        checks: [
          "homepage",
          "four viewport widths",
          "pause",
          "anchors",
          "FAQ",
          "mobile menu",
          "reduced motion",
          "taster text integration (mocked)",
          "dialog close and focus",
          "eight routes",
          "application entry",
        ],
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS: homepage, 320/390/768/1440 layouts, animation controls, navigation, FAQ, reduced motion, mocked taster integration, dialog focus, application entry and linked routes.",
  );
} finally {
  await browser.close();
}
