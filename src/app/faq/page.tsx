import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Cta from "@/components/Cta";

export const metadata: Metadata = {
  title: "Steady FAQ: Every Question, Answered Warmly and Straight",
  description:
    "What is Steady? Does it work for Pure O? Is my data private? Can I use it with my therapist? Every question about the voice companion for looping thoughts, answered.",
};

const sections: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "About Steady",
    items: [
      {
        q: "What exactly is Steady?",
        a: "A friendly voice you talk with, out loud, when your thoughts loop. You talk, it responds in real time. Together you map the loop and practice letting it pass — using the same method specialist therapists use (called ERP).",
      },
      {
        q: "Who is Steady for?",
        a: "Anyone whose brain won't drop it: the 2am replayers, the door-checkers, the “but am I sure?” askers, the people who Google the same symptom nine times. Diagnosed OCD, suspected OCD, Pure O, health anxiety loops, or just relentless rumination — if it loops, Steady is built for it.",
      },
      {
        q: "Is Steady a therapist?",
        a: "No, and it will tell you so itself. Steady is a practice companion built on a therapist-trusted protocol. It doesn't diagnose, prescribe, or treat. Many people use it alongside a real therapist (it's a great between-sessions practice partner), and many use it on its own as a self-guided practice. If you can access professional care, take it — see our therapists page.",
      },
      {
        q: "Do I need a diagnosis to use it?",
        a: "Not at all. Loops don't check credentials and neither do we. If your thoughts loop and your rituals (checking, asking, reviewing, googling) eat your time and peace, you can start today.",
      },
      {
        q: "Why voice instead of an app I type into?",
        a: "Because the loop is spoken — it runs in your inner voice. Saying it out loud, and hearing a warm voice help you leave it unanswered, works on the exact channel the loop lives in. Also: you can practice on a walk, in the kitchen, in the dark — no screen required.",
      },
    ],
  },
  {
    title: "The practice",
    items: [
      {
        q: "What is ERP, in plain words?",
        a: "You gently face the thought that scares you, and skip the usual ritual — the check, the question, the mental replay. The worry rises, peaks, and fades on its own. Your brain learns the alarm was false. It's the most-recommended method for OCD and looping thoughts.",
      },
      {
        q: "What does a session actually look like?",
        a: "You pick something from your own plan, Steady checks you're ready, and you say “start” out loud. For about 15 minutes you face the thought together — Steady coaches you through the uncomfortable middle, checks how you're doing, and celebrates when the wave passes. Then a short, kind debrief. Pause or stop anytime with one word.",
      },
      {
        q: "Will Steady reassure me when I'm anxious?",
        a: "Steady will always be warm with you — and it will lovingly decline to answer the loop's question, because that quick relief is exactly what keeps the loop alive. Instead, it helps you get to a much better place: not needing the answer. That's real reassurance — the kind that lasts.",
      },
      {
        q: "How fast will I feel a difference?",
        a: "Mapping alone usually brings relief in the first week — naming the loop shrinks it. Most people feel the practice working within a few weeks of regular 15-minute sessions, when a worry that used to peak at 8 starts peaking at 5. Steady tracks it so you can see it happening.",
      },
      {
        q: "What if it feels too hard?",
        a: "Then it's too hard, and you tell Steady — or just say “pause” or “stop”. The plan is a ladder you built, and you never have to jump rungs. Practice only works at a pace you'd choose again tomorrow.",
      },
    ],
  },
  {
    title: "Safety & privacy",
    items: [
      {
        q: "Are my voice sessions recorded?",
        a: "No. Conversations happen in real time and audio isn't stored. What's saved is your map and progress — in your account, in plain language, exportable and deletable whenever you like.",
      },
      {
        q: "Who can see what I share?",
        a: "You. Your map lives in your account and isn't shared with anyone. You can export it (some people bring it to their therapist) or delete it entirely, anytime.",
      },
      {
        q: "What happens if I'm in crisis?",
        a: "Steady stops the session immediately and points you to real human help — 988 (US), 999/111 (UK), or your local services. It's built to know its limits. If you're in crisis right now, please skip the website and call. You matter more than any app.",
      },
      {
        q: "Can anything start without my consent?",
        a: "No. Every practice needs an item you approved, your explicit okay, and the word “start” said out loud, every time. Mapping never quietly becomes practice.",
      },
    ],
  },
  {
    title: "Money & practical",
    items: [
      {
        q: "How much does it cost?",
        a: "Free to start — mapping plus your first guided sessions, no card. The full practice is £14/month or £119/year, and you can cancel in one click and take your data with you. A single specialist therapy session typically costs £80–£150; Steady exists so cost is never the reason you don't practice.",
      },
      {
        q: "Does it work on my phone?",
        a: "Yes — Steady runs in your browser and installs to your home screen like a native app (open it in Safari or Chrome, hit Share, Add to Home Screen). Practice from the sofa, the park, or the bed you were just lying awake in.",
      },
      {
        q: "Can I use Steady in my language?",
        a: "Steady speaks naturally and can converse in many languages — start talking in yours and it follows. Plain language is the whole philosophy: no jargon, whatever the language.",
      },
      {
        q: "Can I bring Steady to my therapist?",
        a: "Please do. Export your map and session history and bring it to your sessions — therapists love arriving at a first appointment with the loop already mapped. More on our therapists page.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHero
          kicker="Questions & answers"
          title={
            <>
              Ask us anything.
              <br />
              We&rsquo;ll answer straight.
            </>
          }
          sub="No jargon, no dodging, no fine-print energy. If your question isn't here, ask Steady itself — it's disarmingly honest."
          photo="/photos/warm-portrait.jpg"
          photoAlt="A woman with a warm, genuine smile"
        />

        <section className="bg-cream">
          <div className="mx-auto max-w-[840px] px-5 py-16 md:py-20">
            {sections.map((s, si) => (
              <div key={s.title} className={si ? "mt-14" : ""}>
                <Reveal>
                  <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-ink">
                    {s.title}
                  </h2>
                </Reveal>
                <div className="mt-5 space-y-3">
                  {s.items.map((f, i) => (
                    <Reveal key={f.q} delay={i * 35}>
                      <details className="group rounded-2xl border border-line bg-white p-1 open:shadow-[0_16px_40px_-24px_rgba(63,79,66,0.3)]">
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
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}

            <Reveal delay={60}>
              <div
                id="disclaimer"
                className="mt-14 rounded-2xl border border-peach/60 bg-sun/30 p-6 text-[14px] leading-relaxed text-ink-soft"
              >
                <strong className="text-ink">The honest small print, in big letters:</strong>{" "}
                Steady is a self-guided practice companion — not a medical device, not
                therapy, not a diagnosis, and not a crisis service. It works brilliantly
                alongside professional care and never instead of it when you need that care.
                In crisis, call 988 (US), 999 (UK), or your local emergency number.
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
