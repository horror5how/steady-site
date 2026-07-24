"use client";

import { useEffect } from "react";

// beingsteady.com/dashboard = the Steady product.
// ponytail: the product is still a separate app (steady-erp-voice-fresh),
// so for now this redirects there. Swap for a same-domain proxy/host
// once the product moves under beingsteady.com.
const PRODUCT = "https://steady-erp-voice-fresh.vercel.app/";

export default function Dashboard() {
  useEffect(() => {
    window.location.replace(PRODUCT);
  }, []);

  return (
    <main
      style={{ background: "#f6f3ea" }}
      className="grid min-h-[100dvh] place-items-center px-6 text-center"
    >
      <div>
        <p className="text-[16px] text-ink">Opening Steady…</p>
        <a
          href={PRODUCT}
          className="mt-3 inline-flex items-center rounded-full bg-sage px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#336750]"
        >
          Continue to Steady
        </a>
      </div>
    </main>
  );
}
