import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

// ponytail: the trial is free and nothing is for sale, so no prices are advertised here.
// The previous tier layout (£14/mo, £119/yr) is in git history — restore it when
// Steady actually goes on sale, and get the consumer-contract terms reviewed first.

export const metadata: Metadata = {
  title: "Pricing: Steady is free during the trial",
  description:
    "Steady is an invite-only research trial. It is free, there is nothing to buy, and no card is taken. Pricing comes later, and invited testers will hear about it first.",
  alternates: { canonical: "https://beingsteady.com/pricing" },
};

const points = [
  {
    q: "What does it cost right now?",
    a: "Nothing. Steady is an invite-only research trial and there is nothing to buy. No card, no trial that quietly converts, no upgrade prompt.",
  },
  {
    q: "Why isn't it on sale?",
    a: "Because it is early. We are testing it with a small group of adults first, gathering feedback, and bringing clinical expertise onto the team. Selling it before that would be getting the order wrong.",
  },
  {
    q: "Will it cost money later?",
    a: "Almost certainly, yes — building this properly is not free. When that happens we will say so plainly, in advance, and nobody will be charged for anything they did not choose.",
  },
  {
    q: "What do you want from me instead?",
    a: "Honest feedback. What helped, what felt wrong, what you would never use again. That is the whole deal for now.",
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
              It&rsquo;s free.{" "}
              <br className="hidden sm:block" />
              There&rsquo;s nothing to buy yet.
            </>
          }
          sub="Steady is an invite-only research trial. No card, no tiers, no upgrade nudges. If you are invited, you get all of it for nothing."
          photo="/photos/woman-laugh-portrait.jpg"
          photoAlt="A woman laughing freely"
        />

        <section className="bg-cream">
          <div className="mx-auto max-w-[820px] px-5 py-16 md:py-20">
            <div className="space-y-8">
              {points.map((p, i) => (
                <Reveal key={p.q} delay={i * 70}>
                  <div className="border-b border-line pb-7 last:border-0">
                    <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-ink md:text-[21px]">{p.q}</h2>
                    <p className="mt-2.5 text-[16px] leading-relaxed text-ink-soft">{p.a}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={280}>
              <div className="mt-12 rounded-3xl border border-line bg-white p-8">
                <p className="text-[17px] font-semibold text-ink">Want in on the first group?</p>
                <p className="mt-2 text-[15.5px] leading-relaxed text-ink-soft">
                  Adults 18 and over, US only for now. Steady is not therapy, not medical care and
                  not an emergency service.
                </p>
                <a
                  href="/invite"
                  className="btn-dark mt-6 inline-flex items-center rounded-full px-6 py-3 text-[15px] font-semibold"
                >
                  Click here to be invited
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
