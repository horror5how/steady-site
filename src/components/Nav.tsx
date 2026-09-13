"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "./icons";

/* The same nav the homepage wears, so the inner pages stop looking like a
   different company. One wordmark, four links, log in, one button. The old
   promo bar ("the first million places are open") is gone: places are applied
   for and chosen, and nothing on the site says otherwise. */

const links = [
  { label: "How it works", href: "/know-more" },
  { label: "Why it works", href: "/evidence" },
  { label: "FAQ", href: "/faq" },
  { label: "For therapists", href: "/therapists" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-300 ${
          scrolled ? "border-b border-black/5 bg-white/85 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
          <a
            href="/"
            aria-label="Steady home"
            className="inline-flex items-center gap-2 text-[19px] font-semibold tracking-[-0.03em] text-ink"
          >
            {/* the same mark the homepage wears (commit 07027e7), not a second brand */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/steady-mark.webp" alt="" width={24} height={24} />
            steady
          </a>

          <div className="hidden items-center gap-7 text-[14px] md:flex">
            {links.map((l) => (
              <a key={l.label} href={l.href} className="text-ink/75 transition hover:text-ink">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[14px]">
            <a href="/login" className="hidden text-ink/75 transition hover:text-ink sm:inline">
              Log in
            </a>
            <a
              href="/invite"
              className="btn-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold"
            >
              Apply
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white text-ink md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen(!open)}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {open ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </nav>
        {open && (
          <nav
            id="site-menu"
            aria-label="Mobile navigation"
            className="border-t border-black/5 bg-white px-5 py-3 md:hidden"
            onClick={() => setOpen(false)}
          >
            {[...links, { label: "Log in", href: "/login" }].map((l) => (
              <a key={l.label} href={l.href} className="block py-3 text-[15px] text-ink">
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
