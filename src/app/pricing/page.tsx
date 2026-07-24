import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Check, Sparkle } from "@/components/icons";

export const metadata: Metadata = {
  title: "Steady Pricing: Free to Start, Cancel Anytime",
  description:
    "Start talking to Steady free, no card required. The full practice costs less than a coffee a week — and far less than the loop is already costing you.",
};

const tiers = [
  {
    name: "First Steps",
    price: "Free",
    period: "forever",
    tagline: "Meet Steady. Map your first loop.",
    features: [
      "Voice mapping to start your personal map",
      "3 guided voice sessions",
      "Your practice ladder, drafted",
      "Progress view",
      "Export your data anytime",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Steady",
    price: "£14",
    period: "per month",
    tagline: "The full practice, whenever the loop hits.",
    features: [
      "Unlimited voice conversations",
      "Unlimited 15-minute guided practices",
      "Full progress: trends, milestones, wins",
      "A living map that grows as you do",
      "Session debriefs saved to your account",
      "First access to new voices & features",
    ],
    cta: "Start free, upgrade in-app",
    highlight: true,
  },
  {
    name: "Steady Annual",
    price: "£119",
    period: "per year",
    tagline: "Two months free. Commit to you.",
    features: [
      "Everything in Steady",
      "2 months free vs monthly",
      "Lock your price",
      "Support an independent, careful product",
    ],
    cta: "Go annual",
    highlight: false,
  },
];

const faqs = [
  {
    q: "Why is there a free tier?",
    a: "Because you should hear Steady's voice and feel a real conversation before paying a penny. And because mapping alone genuinely helps. No card required.",
  },
  {
    q: "How does this compare to therapy prices?",
    a: "A single specialist ERP session typically runs £80 to £150 — and worth every penny if you can access it (see our therapists page). Steady isn't a therapist replacement; it's unlimited practice for less than one session a year, so cost is never the reason you don't practice.",
  },
  {
    q: "Can I cancel?",
    a: "Anytime, one click, keep access until your period ends, take your data with you. No retention tricks — that would be pretty ironic for this product.",
  },
  {
    q: "Is my payment info tied to my mental-health data?",
    a: "No. Billing runs separately from your map and session history. Your story stays yours.",
  },
];

export default function Pricing() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHero
          kicker="Pricing"
          title={
            <>
              Less than a coffee a week.{" "}
              <br className="hidden sm:block" />
              Cheaper than the loop.
            </>
          }
          sub="The loop already costs you sleep, focus, and joy. Steady starts free. The full practice costs less than one takeaway a month."
          photo="/photos/woman-laugh-portrait.jpg"
          photoAlt="A woman laughing freely"
        />

        {/* Tiers */}
        <section className="bg-cream">
          <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-20">
            <div className="grid items-stretch gap-6 md:grid-cols-3">
              {tiers.map((t, i) => (
                <Reveal key={t.name} delay={i * 70}>
                  <div
                    className={`relative flex h-full flex-col rounded-3xl p-8 ${
                      t.highlight
                        ? "bg-sage text-white shadow-[0_40px_90px_-30px_rgba(62,122,94,0.55)]"
                        : "border border-line bg-white text-ink"
                    }`}
                  >
                    {t.highlight && (
                      <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-peach-deep px-3.5 py-1 text-[12px] font-semibold text-white shadow">
                        <Sparkle className="h-3 w-3" /> Most chosen
                      </span>
                    )}
                    <h2
                      className={`text-[15px] font-semibold uppercase tracking-[0.14em] ${
                        t.highlight ? "text-sage-soft" : "text-ink/50"
                      }`}
                    >
                      {t.name}
                    </h2>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-[44px] font-semibold tracking-[-0.02em]">{t.price}</span>
                      <span className={`text-[14px] ${t.highlight ? "text-white/70" : "text-ink-soft"}`}>
                        {t.period}
                      </span>
                    </div>
                    <p className={`mt-2 text-[15px] ${t.highlight ? "text-white/85" : "text-ink-soft"}`}>
                      {t.tagline}
                    </p>
                    <ul className="mt-6 flex-1 space-y-3">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-[14.5px]">
                          <span
                            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                              t.highlight ? "bg-white/20 text-white" : "bg-sage/12 text-sage"
                            }`}
                          >
                            <Check className="h-3 w-3" />
                          </span>
                          <span className={t.highlight ? "text-white/95" : "text-ink"}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="/signup"
                      className={`mt-8 inline-flex items-center justify-center px-5 py-3 text-[15px] font-semibold ${
                        t.highlight ? "btn-light" : "btn-dark"
                      }`}
                    >
                      {t.cta}
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <p className="mx-auto mt-10 max-w-[640px] text-center text-[13.5px] leading-relaxed text-ink-soft">
                Steady is a self-guided practice companion, not therapy, and the price
                reflects that. If you can access professional ERP therapy, take it — Steady
                will be here between the sessions, and at 2am.
              </p>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-cream-2/70">
          <div className="mx-auto max-w-[840px] px-5 py-16 md:py-20">
            <Reveal>
              <h2 className="text-center text-[32px] font-semibold tracking-[-0.02em] text-ink md:text-[40px]">
                Fair questions
              </h2>
            </Reveal>
            <div className="mt-10 space-y-3">
              {faqs.map((f, i) => (
                <Reveal key={f.q} delay={i * 40}>
                  <details className="group rounded-2xl border border-line bg-white p-1">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 text-[16.5px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span className="text-[20px] font-normal text-sage transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="px-5 pb-5 text-[15.5px] leading-relaxed text-ink-soft">{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
