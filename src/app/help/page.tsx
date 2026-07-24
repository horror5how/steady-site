import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Cta from "@/components/Cta";
import { topics } from "@/lib/help";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "The Loop Library: Real Anxiety & OCD Loops, In Your Own Words",
  description:
    "Motorway panic, checking the locks, 2am symptom Googling, replayed conversations. Find your loop in plain English, learn why avoiding grows it, and take one small practice step today.",
  alternates: { canonical: "https://beingsteady.com/help" },
};

export default function HelpIndexPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHero
          kicker="The loop library"
          title={
            <>
              Whatever loops for you,
              <br />
              it has a name and a way out
            </>
          }
          sub="Twelve of the most common loops, written in the words people actually say. Find yours, learn how it grows, and take one small step this week."
          photo="/photos/hug-relief.jpg"
          photoAlt="Two people hugging with visible relief"
        />

        <section className="bg-cream">
          <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-20">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((t, i) => (
                <Reveal key={t.slug} delay={(i % 3) * 60}>
                  <a
                    href={`/help/${t.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(63,79,66,0.35)]"
                  >
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-sage">
                      {t.kicker}
                    </p>
                    <h2 className="mt-3 text-[18px] font-semibold leading-snug tracking-[-0.01em] text-ink">
                      &ldquo;{t.h1}&rdquo;
                    </h2>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                      {t.short}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-5 text-[14px] font-semibold text-sage transition group-hover:gap-2">
                      Read about this loop <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="mt-12 rounded-2xl border border-peach/60 bg-sun/30 p-6 text-[14px] leading-relaxed text-ink-soft">
                <strong className="text-ink">The honest line:</strong> Steady is not a
                therapist or crisis care. It&rsquo;s a self-guided practice companion. If
                you&rsquo;re in crisis, call 988 (US), 999 (UK), or your local emergency
                number. You matter.
              </div>
            </Reveal>
          </div>
        </section>

        <Cta />
      </main>
      <Footer />
    </>
  );
}
