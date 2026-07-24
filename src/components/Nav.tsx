"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Mic, MapIcon, Shield, Chart, Heart } from "./icons";

const products = [
  { name: "Voice Mapping", desc: "Say the loop out loud, watch it take shape", Icon: MapIcon, href: "/#map" },
  { name: "Guided Practice", desc: "Gentle 15-minute sessions, by voice", Icon: Mic, href: "/#practice" },
  { name: "Progress", desc: "Watch the loop lose its grip", Icon: Chart, href: "/#progress" },
  { name: "Safety & Privacy", desc: "You consent to everything. Your data is yours.", Icon: Shield, href: "/#safety" },
  { name: "For Therapists", desc: "Steady alongside real therapy", Icon: Heart, href: "/therapists" },
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
      {/* Promo bar */}
      <div
        className={`flex items-center justify-center gap-3 border-b border-black/5 bg-white/80 px-4 text-[13px] text-ink-soft backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "max-h-0 overflow-hidden opacity-0" : "max-h-12 py-2.5 opacity-100"
        }`}
      >
        <span>Free to start. Your first conversation takes ten minutes.</span>
        <a
          href="/signup"
          className="btn-mint inline-flex items-center gap-1 px-3 py-1 font-medium"
        >
          Say hello <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      {/* Nav bar */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "border-b border-black/5 bg-cream/85 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
          <div className="flex items-center gap-9">
            <a href="/" className="wordmark text-[15px] text-ink">
              Steady
            </a>
            <div
              className="hidden items-center gap-7 text-[15px] md:flex"
              onMouseLeave={() => setOpen(false)}
            >
              <div className="relative" onMouseEnter={() => setOpen(true)}>
                <button className="flex items-center gap-1 text-ink/80 transition hover:text-ink">
                  Product <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <div
                  className={`absolute left-1/2 top-full w-[370px] -translate-x-1/2 pt-4 transition-[opacity,transform] duration-[180ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${
                    open
                      ? "pointer-events-auto scale-100 opacity-100"
                      : "pointer-events-none scale-[0.96] opacity-0"
                  }`}
                  style={{ transformOrigin: "top center" }}
                >
                    <div className="glass-light rounded-2xl p-2">
                      {products.map(({ name, desc, Icon, href }) => (
                        <a
                          key={name}
                          href={href}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-black/5"
                        >
                          <span className="grid h-9 w-9 place-items-center rounded-lg bg-sage/10 text-sage">
                            <Icon className="h-[18px] w-[18px]" />
                          </span>
                          <span>
                            <span className="block text-[14px] font-medium text-ink">{name}</span>
                            <span className="block text-[12.5px] text-ink-soft">{desc}</span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
              </div>
              {[
                { label: "How it works", href: "/know-more" },
                { label: "Pricing", href: "/pricing" },
                { label: "FAQ", href: "/faq" },
                { label: "Blog", href: "/blog" },
                { label: "Therapists", href: "/therapists" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-ink/80 transition hover:text-ink"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5 text-[15px]">
            <a
              href="/login"
              className="hidden text-ink/80 transition hover:text-ink sm:inline"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="btn-dark inline-flex items-center rounded-full px-4 py-2 text-[14px] font-semibold"
            >
              Start free
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
