import { LinkedIn, XLogo, TikTok, Instagram } from "./icons";

// TODO(hayat): confirm the exact registered company name + number for the fine print.
const TERMS = "https://steady-erp-voice-fresh.vercel.app/legal/terms.html";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Voice Mapping", href: "/#map" },
      { label: "Guided Practice", href: "/#practice" },
      { label: "Progress", href: "/#progress" },
      { label: "Safety & Privacy", href: "/#safety" },
      { label: "How it works", href: "/know-more" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "The loop library", href: "/help" },
      { label: "Why it works", href: "/evidence" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
      { label: "Find a therapist", href: "/therapists" },
      { label: "Crisis resources", href: "/therapists#crisis" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: TERMS },
      { label: "Privacy Promise", href: "/privacy" },
      { label: "Medical Disclaimer", href: "/faq#disclaimer" },
    ],
  },
];

const socials = [
  { Icon: LinkedIn, label: "LinkedIn" },
  { Icon: XLogo, label: "X" },
  { Icon: TikTok, label: "TikTok" },
  { Icon: Instagram, label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest text-white">
      <div className="mx-auto max-w-[1200px] px-5 pt-20">
        <div className="grid gap-12 pb-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <span className="wordmark text-[16px]">Steady</span>
            <p className="mt-4 max-w-[280px] text-[14px] leading-relaxed text-white/60">
              The warm voice companion for looping thoughts, OCD, Pure O, and rumination.
              Talk it out. Let it pass. Get your life back.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/8 text-white/70 transition hover:bg-white/15 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[14px] text-white/70 transition hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-[13px] leading-relaxed text-white/60">
          Steady is a self-guided practice companion. It is not a medical device, a
          therapist, a diagnosis, or a crisis service, and it doesn&rsquo;t replace
          professional care. If you&rsquo;re in crisis or thinking about harming yourself,
          please reach real help now: call or text <span className="text-white/85">988</span>{" "}
          (US), <span className="text-white/85">999</span> (UK), or your local emergency
          number. You matter.
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 py-8 mt-8 text-[13px] text-white/45 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} Steady. Made with care for busy minds.
            <br />
            <span className="text-white/35">
              Steady is an invite-only research trial operated by Beyond Elevation Ltd,
              registered in England and Wales. Contact hayat@beyondelevation.com.
            </span>
          </span>
          <span className="flex gap-5">
            <a href="/privacy" className="transition hover:text-white">Privacy</a>
            <a href={TERMS} className="transition hover:text-white">Terms</a>
          </span>
        </div>
      </div>

      {/* giant wordmark */}
      <div className="pointer-events-none select-none overflow-hidden px-2">
        <div
          className="wordmark whitespace-nowrap text-center font-semibold leading-none text-white/[0.05]"
          style={{ fontSize: "clamp(64px, 18vw, 280px)", letterSpacing: "0.06em" }}
        >
          Steady
        </div>
      </div>
    </footer>
  );
}
