import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Cta from "@/components/Cta";
import { topics, getTopic, type HelpSection } from "@/lib/help";
import { ArrowRight, Sparkle } from "@/components/icons";

const PRODUCT_URL = "https://steady-erp-voice-fresh.vercel.app/";

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const topic = getTopic((await params).slug);
  if (!topic) return {};
  return {
    title: topic.metaTitle,
    description: topic.metaDescription,
    alternates: { canonical: `https://beingsteady.com/help/${topic.slug}` },
    openGraph: {
      title: topic.metaTitle,
      description: topic.metaDescription,
      images: [topic.photo],
    },
  };
}

function Section({ section }: { section: HelpSection }) {
  return (
    <Reveal>
      <div className="mt-12">
        <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-ink">
          {section.title}
        </h2>
        {section.paras.map((p) => (
          <p key={p.slice(0, 40)} className="mt-4 text-[17px] leading-[1.75] text-ink-soft">
            {p}
          </p>
        ))}
      </div>
    </Reveal>
  );
}

function TalkCta({ slug, label }: { slug: string; label?: string }) {
  return (
    <a
      href={`${PRODUCT_URL}?concern=${slug}`}
      className="btn-dark inline-flex items-center gap-2 px-6 py-3.5 text-[15px] font-semibold"
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15">
        <Sparkle className="h-3 w-3 text-white" />
      </span>
      {label ?? "Talk it through with Steady right now, free"}
    </a>
  );
}

export default async function HelpTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const topic = getTopic((await params).slug);
  if (!topic) notFound();

  const related = topic.related
    .map((slug) => getTopic(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topic.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Nav />
      <main className="flex-1">
        {/* hero */}
        <section className="hero-grad relative overflow-hidden">
          <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-10 px-5 pb-14 pt-36 md:grid-cols-[1.2fr_1fr] md:pb-20 md:pt-44">
            <div className="max-w-[620px]">
              <p className="rise rise-1 text-[13px] font-semibold uppercase tracking-[0.18em] text-sage">
                {topic.kicker} · In your words
              </p>
              <h1 className="rise rise-2 mt-4 text-balance text-[36px] font-bold leading-[1.02] tracking-[-0.035em] text-ink md:text-[52px]">
                &ldquo;{topic.h1}&rdquo;
              </h1>
              <p className="rise rise-3 mt-5 max-w-[520px] text-balance text-[17px] leading-relaxed text-ink-soft">
                {topic.short}
              </p>
              <div className="rise rise-4 mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <TalkCta slug={topic.slug} />
                <a
                  href="/help"
                  className="inline-flex items-center px-2 py-3.5 text-[15px] font-semibold text-ink-soft transition hover:text-ink"
                >
                  All loops →
                </a>
              </div>
            </div>
            <div className="photo-card tilt-r rise rise-3 relative hidden aspect-[4/3] md:block">
              <img src={topic.photo} alt={topic.photoAlt} />
            </div>
          </div>
        </section>

        {/* body */}
        <section className="bg-cream">
          <div className="mx-auto max-w-[760px] px-5 py-14 md:py-16">
            <Reveal>
              <div>
                {topic.intro.map((p) => (
                  <p
                    key={p.slice(0, 40)}
                    className="mt-4 first:mt-0 text-[18px] leading-[1.75] text-ink-soft"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Section section={topic.loop} />
            <Section section={topic.avoidance} />
            <Section section={topic.practice} />
            <Section section={topic.firstStep} />

            {/* mid-page CTA */}
            <Reveal>
              <div className="mt-12 rounded-3xl border border-line bg-white p-7 shadow-[0_24px_60px_-32px_rgba(35,40,44,0.25)] md:p-9">
                <h2 className="text-[24px] font-bold tracking-[-0.02em] text-ink">
                  You don&rsquo;t have to figure this out in your own head
                </h2>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
                  Steady is a warm voice you talk with, out loud. Say what&rsquo;s looping,
                  map it together, and practice the first small step, today, free, no card.
                </p>
                <div className="mt-6">
                  <TalkCta slug={topic.slug} />
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-soft/80">
                  Steady is not a therapist or crisis care. It&rsquo;s a self-guided practice
                  companion, and in a crisis it will point you to real human help.
                </p>
              </div>
            </Reveal>

            {/* co-occurring patterns */}
            <Reveal>
              <div className="mt-14">
                <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-ink">
                  What people with this also experience
                </h2>
                <div className="mt-6 space-y-4">
                  {topic.also.map((a) => (
                    <div key={a.title} className="rounded-2xl border border-line bg-white p-6">
                      <h3 className="text-[17px] font-semibold text-ink">{a.title}</h3>
                      <p className="mt-2 text-[15.5px] leading-relaxed text-ink-soft">
                        {a.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* FAQ */}
            <Reveal>
              <div className="mt-14">
                <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-ink">
                  Questions people ask
                </h2>
                <div className="mt-6 space-y-3">
                  {topic.faqs.map((f) => (
                    <details
                      key={f.q}
                      className="group rounded-2xl border border-line bg-white p-1 open:shadow-[0_16px_40px_-24px_rgba(63,79,66,0.3)]"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 text-[16.5px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                        {f.q}
                        <span className="text-[20px] font-normal text-sage transition group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="px-5 pb-5 text-[15.5px] leading-relaxed text-ink-soft">
                        {f.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* boundary */}
            <Reveal>
              <div className="mt-12 rounded-2xl border border-peach/60 bg-sun/30 p-6 text-[14px] leading-relaxed text-ink-soft">
                <strong className="text-ink">The honest line, on every page:</strong> Steady
                is not a therapist or crisis care. It&rsquo;s a self-guided practice
                companion. If you&rsquo;re in crisis, call 988 (US), 999 (UK), or your local
                emergency number. You matter.
              </div>
            </Reveal>

            {/* related loops */}
            <Reveal>
              <div className="mt-14 border-t border-line pt-10">
                <h2 className="text-[15px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                  Related loops
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {related.map((r) => (
                    <a
                      key={r.slug}
                      href={`/help/${r.slug}`}
                      className="group rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-25px_rgba(63,79,66,0.3)]"
                    >
                      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sage">
                        {r.kicker}
                      </p>
                      <h3 className="mt-2 text-[15.5px] font-semibold leading-snug text-ink">
                        &ldquo;{r.h1}&rdquo;
                      </h3>
                      <span className="mt-3 inline-flex items-center gap-1 text-[13.5px] font-semibold text-sage transition group-hover:gap-2">
                        Read <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </a>
                  ))}
                </div>
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
