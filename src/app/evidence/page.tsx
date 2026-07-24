import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Cta from "@/components/Cta";

export const metadata: Metadata = {
  title: "Why Steady's Approach Works: The Evidence Behind Exposure Practice",
  description:
    "Steady is built on graded exposure practice and expectancy violation, the most-studied approach for anxiety loops and OCD, plus the simple power of saying thoughts out loud. Here's the thinking, in plain English.",
  alternates: { canonical: "https://beingsteady.com/evidence" },
};

const sections: { title: string; paras: string[] }[] = [
  {
    title: "The core idea: faced fears fade, avoided fears grow",
    paras: [
      "Every loop on our help pages runs on the same engine. A fear arrives, you do something to escape it (avoid, check, wash, ask, ruminate), relief follows, and the relief teaches your brain the fear was valid. The escape is the fertiliser.",
      "Exposure-based practice reverses the engine: you face the feared thing on purpose, in graded steps, without the escape move, and let the fear rise, peak, and pass on its own. Done repeatedly, the alarm recalibrates. This isn't a Steady invention. It's the approach specialist clinicians have used and studied for decades, across phobias, panic, social fears, and obsessive loops, and it's consistently among the best-supported approaches psychology has.",
    ],
  },
  {
    title: "Graded means graded: a ladder, not a plunge",
    paras: [
      "Nobody's first practice is the worst-case scenario. You build a ladder from mildly uncomfortable to genuinely hard, and you climb at a pace you'd choose again tomorrow. Each rung is practiced until it's boring before you move up.",
      "The grading matters for a simple reason: practice only teaches when you stay long enough for the wave to peak and fall. Steps small enough to stay with are steps that teach. Heroics that end in fleeing teach the old lesson. Steady's sessions are built around this: your ladder, your pace, your explicit go-ahead every time.",
    ],
  },
  {
    title: "Expectancy violation: surprise is the teacher",
    paras: [
      "Modern thinking about why exposure works centres on a beautifully simple idea: learning happens when your prediction is proven wrong. The alarm predicts 'if I stay in this queue, I'll collapse.' You stay. You don't collapse. The gap between what was predicted and what happened is where the rewiring occurs.",
      "This is why practice focuses on testing predictions rather than just enduring discomfort. Before a session you name what the loop predicts, as specifically as possible. Afterwards you compare it with what actually happened. The bigger the surprise, the deeper the learning, which is also why dropping safety behaviours matters: every prop gives the alarm an excuse ('you only survived because you had your phone'), and every prop dropped makes the surprise cleaner.",
    ],
  },
  {
    title: "Why out loud: speaking works on the loop's home channel",
    paras: [
      "Loops run in your inner voice, silent, fast, and circular. Saying the fear out loud changes the medium. Speech is slower than thought, so the loop has to decelerate to be spoken. It's linear, so the circle has to become a sentence. And it's external, so the thing that felt fused to you becomes something you can hear, examine, and rank on a ladder.",
      "There's a long tradition in psychology of putting feelings into words as a way of reducing their grip, and anyone who's ever felt a fear shrink in the telling knows the effect firsthand. Steady leans into it deliberately: mapping happens out loud, practice happens out loud, and the coaching voice meets the loop on the channel where it lives.",
    ],
  },
  {
    title: "What Steady is, and carefully isn't",
    paras: [
      "Steady is a practice companion: a warm voice that helps you map your loops in plain words, build a graded ladder, practice facing rungs without the escape moves, and see your progress in numbers you generated yourself. The approach it walks you through is the exposure-based practice described above.",
      "Steady is not a therapist, not treatment, and not a substitute for professional care. We don't diagnose anything and we don't promise outcomes; loops differ, and what the evidence base supports is the approach, not any specific app. Many people use Steady alongside a therapist as a between-sessions practice partner. If you can access professional care, take it, and our therapists page can help you look. If you're in crisis, skip all of this and reach real human help: 988 (US), 999 (UK), or your local emergency number.",
    ],
  },
  {
    title: "Honest limits, honest hope",
    paras: [
      "We won't dress this up with invented citations or precision we don't have. The plain summary of the field is this: for anxiety and obsessive loops, facing the feared thing gradually, without rituals and escape moves, is the approach with the strongest track record there is, and it's the only approach Steady is built on.",
      "The hope part is just as plain. The skill is learnable. People who haven't merged onto a motorway in years merge again. People who washed until their hands cracked hold a coin and make dinner. Not because the fear was argued away, but because it was practiced away, one rung, one wave, one surprise at a time.",
    ],
  },
];

export default function EvidencePage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHero
          kicker="Why this works"
          title={
            <>
              Built on the practice
              <br />
              with the strongest track record
            </>
          }
          sub="Graded exposure practice, expectancy violation, and the old human truth that things shrink when you say them out loud. In plain English, with no invented citations."
          photo="/photos/proud-progress.jpg"
          photoAlt="A person looking quietly proud of hard-won progress"
        />

        <section className="bg-cream">
          <div className="mx-auto max-w-[760px] px-5 py-16 md:py-20">
            {sections.map((s, i) => (
              <Reveal key={s.title}>
                <div className={i ? "mt-12" : ""}>
                  <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-ink">
                    {s.title}
                  </h2>
                  {s.paras.map((p) => (
                    <p
                      key={p.slice(0, 40)}
                      className="mt-4 text-[17px] leading-[1.75] text-ink-soft"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}

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
