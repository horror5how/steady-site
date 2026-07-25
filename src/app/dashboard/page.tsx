"use client";

// beingsteady.com/dashboard hosts the Steady product on-domain via a full-bleed
// iframe. The product runs from its own origin (assets, /api, mic all same-origin
// to itself); the product allows framing from beingsteady.com via CSP frame-ancestors.
// The #member hash tells the product this is a signed-up member (not the public
// taster) so it runs the get-to-know onboarding, greeting them by name.
// ponytail: iframe until the product moves into this repo/domain for real.
import { useEffect, useState } from "react";

const PRODUCT = "https://steady-erp-voice-fresh.vercel.app/";

export default function Dashboard() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let name = "";
    try {
      name = localStorage.getItem("steady-user-name") || localStorage.getItem("steady-signup-name") || "";
    } catch {}
    setSrc(`${PRODUCT}#member=1${name ? `&name=${encodeURIComponent(name)}` : ""}`);
  }, []);

  if (!src) return null;
  return (
    <iframe
      src={src}
      title="Steady"
      allow="microphone; camera; autoplay; clipboard-write"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
}
