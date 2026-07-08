import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Cta from "@/components/Cta";
import { ArrowRight, Mic, MapIcon, Shield, Chart, Check, Pause, Heart } from "@/components/icons";

export const metadata: Metadata = {
  title: "How Steady Works: A Warm Voice for Looping Thoughts",
  description:
    "Inside Steady: how talking maps your loops, how gentle 15-minute practice sessions work, the science of ERP, and the guardrails that keep it honest and kind.",
};

const steps = [
  {
    n: "01",
    Icon: Mic,
    title: "Talk",
    body: "You talk about what loops. Steady listens and asks the next kind question. No forms. No quiz. Just a conversation.",
    photo: "/photos/kitchen-mapping.jpg",
    alt: "A woman chatting with Steady over morning coffee",
  },
  {
    n: "02",
    Icon: MapIcon,
    title: "Map",
    body: "Your words become a simple map: what sets the loop off, what it makes you do. Then a gentle ladder of practice steps — easy ones first. You approve every step.",
    photo: "/photos/woman-headphones-couch.jpg",
    alt: "A woman relaxed on her couch, talking through her map",
  },
  {
    n: "03",
    Icon: Pause,
    title: "Practice",
    body: "You say “start”. For 15 minutes, a warm voice helps you face the thought without feeding it. Pause or stop anytime, with one word.",
    photo: "/photos/calm-breath.jpg",
    alt: "A man breathing calmly through a practice session",
  },
  {
    n: "04",
    Icon: Chart,
    title: "Feel it change",
    body: "Worries that peaked at 8 start topping out at 3. You watch it happen, week by week, in plain words. Proof beats hope.",
    photo: "/photos/celebrate-win.jpg",
    alt: "A man beaming with relief by a bright window",
  },
];

const nevers = [
  {
    title: "It never feeds the loop",
    body: "Steady won't answer “but am I sure?” — quick relief is what keeps the question coming back. It helps you stop needing the answer. That's the kindest thing in the product.",
  },
  {
    title: "It never starts without you",
    body: "Every practice needs your okay and the word “start”, said out loud. You drive. Steady navigates.",
  },
  {
    title: "It never plays therapist",
    body: "Steady is a practice companion, not a therapist — and it says so. It works great alongside a real one. See our therapists page.",
  },
  {
    title: "It never keeps going in a crisis",
    body: "Mention crisis or self-harm and Steady stops everything and points you to real humans: 988 (US), 999 (UK), your local services.",
  },
];

export default function KnowMore() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHero
          kicker="How Steady works"
          title={
            <>
              A kind voice, a clear map,
              <br />
              and 15 minutes at a time
            </>
          }
          sub="Talking becomes a map. The map becomes practice. Practice gives you your life back. Here's each step."
          photo="/photos/man-walk-talking.jpg"
          photoAlt="A man happily talking to Steady on a sunny walk"
        />

        {/* Steps */}
        <section id="how" className="bg-cream">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:py-28">
            <Reveal>
              <h2 className="text-center text-[34px] font-semibold tracking-[-0.02em] text-ink md:text-[44px]">
                From first word to lasting change
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 60}>
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white">
                    {s.photo && (
                      <div className="h-52 overflow-hidden">
                        <img
                          src={s.photo}
                          alt={s.alt}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-8">
                      <div className="flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage/10 text-sage">
                          <s.Icon className="h-5 w-5" />
                        </span>
                        <span className="text-[13px] font-semibold tracking-[0.14em] text-ink/30">
                          {s.n}
                        </span>
                      </div>
                      <h3 className="mt-5 text-[22px] font-semibold tracking-[-0.01em] text-ink">
                        {s.title}
                      </h3>
                      <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">{s.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Science */}
        <section className="meadow-grad grain relative overflow-hidden">
          <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-20 md:py-28">
            <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
              <Reveal>
                <div className="max-w-[480px]">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-sage">
                    The science
                  </p>
                  <h2 className="mt-4 text-[34px] font-semibold tracking-[-0.02em] text-ink md:text-[44px]">
                    Warm on the outside. Rigorous underneath.
                  </h2>
                  <p className="mt-5 text-[16.5px] leading-relaxed text-ink-soft">
                    Steady uses exposure practice (ERP) — the approach therapists trust most
                    for OCD and looping thoughts, backed by decades of research. The idea is
                    simple: answer the loop, and your brain thinks the alarm was real. Let
                    the alarm ring without answering, and your brain learns the truth.
                    Steady makes the second one doable.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="space-y-4">
                  {[
                    {
                      Icon: Heart,
                      t: "Why speaking beats typing",
                      b: "Rumination is verbal — it runs in your inner voice. Practising out loud works the exact channel the loop lives on.",
                    },
                    {
                      Icon: Pause,
                      t: "Why 15 minutes",
                      b: "Long enough for the wave to rise, peak, and fall while you're still there to feel it fall. That falling part is where your brain rewires.",
                    },
                    {
                      Icon: Check,
                      t: "Why no quick answers",
                      b: "Reassurance is relief now, loop forever. The lasting calm comes from discovering you never needed the answer. Steady walks you there.",
                    },
                  ].map((c) => (
                    <div key={c.t} className="glass-light rounded-2xl p-5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-sage/12 text-sage">
                          <c.Icon className="h-4 w-4" />
                        </span>
                        <h3 className="text-[17px] font-semibold text-ink">{c.t}</h3>
                      </div>
                      <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">{c.b}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* What Steady never does */}
        <section id="safety" className="bg-cream">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:py-28">
            <Reveal>
              <h2 className="text-center text-[34px] font-semibold tracking-[-0.02em] text-ink md:text-[44px]">
                What Steady never does
              </h2>
              <p className="mx-auto mt-4 max-w-[560px] text-center text-[16px] text-ink-soft">
                The guardrails aren&rsquo;t fine print. They&rsquo;re the product.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {nevers.map((n, i) => (
                <Reveal key={n.title} delay={i * 60}>
                  <div className="h-full rounded-3xl border border-line bg-white p-8">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-peach/30 text-peach-deep">
                        <Shield className="h-4 w-4" />
                      </span>
                      <h3 className="text-[19px] font-semibold text-ink">{n.title}</h3>
                    </div>
                    <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">{n.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={80}>
              <div className="mt-12 text-center">
                <a
                  href="/faq"
                  className="inline-flex items-center gap-2 text-[16px] font-semibold text-sage transition hover:gap-3"
                >
                  More questions? The full FAQ answers everything{" "}
                  <ArrowRight className="h-4 w-4" />
                </a>
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
