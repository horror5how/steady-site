"use client";

// beingsteady.com/dashboard hands the member over to the Steady product with a
// top-level redirect. It used to embed the product in a cross-origin iframe,
// but the product's session cookie is SameSite=Lax and browsers refuse Lax
// cookies inside a cross-site frame — so every request minted a fresh
// anonymous identity, trial consent landed on one identity while the voice
// session started as another, and the terms gate blocked members forever.
// Top-level, the cookie is first-party and everything holds in every browser.
// The #member hash tells the product this is a signed-up member (not the
// public taster) so it runs the get-to-know onboarding, greeting them by name.
// app.beingsteady.com is same-site with this page (CNAME live 2026-08-07), so
// embedding could return; the top-level redirect stays because it is simpler
// and cookie-proof in every browser.
import { useEffect } from "react";

const PRODUCT = "https://app.beingsteady.com/";

export default function Dashboard() {
  useEffect(() => {
    let name = "";
    try {
      name = localStorage.getItem("steady-user-name") || localStorage.getItem("steady-signup-name") || "";
    } catch {}
    window.location.replace(`${PRODUCT}#member=1${name ? `&name=${encodeURIComponent(name)}` : ""}`);
  }, []);

  return null;
}
