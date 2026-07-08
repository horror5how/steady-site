"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!localStorage.getItem("sh-cookie")) setShow(true);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    localStorage.setItem("sh-cookie", "1");
    setShow(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-black/10 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-[640px]">
          <p className="text-[14px] font-semibold text-ink">We use cookies</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
            We use essential cookies to make this site work. With your consent, we may also use
            non-essential cookies to improve your experience and analyze how you use the site.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            onClick={dismiss}
            className="text-[13px] font-medium text-ink-soft underline-offset-2 transition hover:text-ink hover:underline"
          >
            Cookie Settings
          </button>
          <button
            onClick={dismiss}
            className="rounded-full border border-ink/15 px-4 py-2 text-[13px] font-semibold text-ink transition hover:bg-ink/5"
          >
            Reject all
          </button>
          <button
            onClick={dismiss}
            className="btn-dark px-4 py-2 text-[13px] font-semibold"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
