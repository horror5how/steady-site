import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Cta from "@/components/Cta";
import { Check } from "@/components/icons";

export const metadata: Metadata = {
  title: "Privacy at Steady: What We Keep, Where It Lives, How You Delete It",
  description:
    "Voice sessions stay private. Account data lives encrypted in a European database, sensitive memories get extra field-level encryption, and you can see and delete everything, instantly, in-app. No data sold, no ads.",
  alternates: { canonical: "https://beingsteady.com/privacy" },
};

const promises: { title: string; body: string }[] = [
  {
    title: "Your voice sessions are private",
    body: "What you say to Steady is between you and Steady. Sessions happen in real time, and conversations aren't broadcast, shared, or sold to anyone. The things you'd only say out loud in a private room stay in that room.",
  },
  {
    title: "Your data lives encrypted, in Europe",
    body: "Your account data is stored encrypted in a European database (the eu-west-1 region, in Ireland). Encrypted in transit, encrypted at rest, under European data protection law.",
  },
  {
    title: "Sensitive memories get extra locks",
    body: "The most personal things Steady remembers for you, the content of your loops, your fears, your practice plan, are field-encrypted: locked individually inside the database, not just behind it.",
  },
  {
    title: "You can see everything Steady knows",
    body: "No hidden profile, no shadow file. Everything Steady remembers about you is visible to you, in the app, in plain language. If it knows it, you can read it.",
  },
  {
    title: "Delete everything, instantly, yourself",
    body: "One action in the app deletes your account and all your data. Not a support ticket, not a 30-day queue, not an export-first obstacle course. You press it, it's gone.",
  },
  {
    title: "No data sold. No ads. Ever.",
    body: "Steady makes money one way: people who find the practice valuable pay a subscription. Your inner life is not inventory. We don't sell data, we don't rent audiences, and there are no ads to target.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHero
          kicker="Privacy, in plain English"
          title={
            <>
              You tell Steady real things.
              <br />
              Here&rsquo;s how we honour that.
            </>
          }
          sub="No legal maze, no fine-print energy. Six promises, written the way we'd want them written if it were our 2am thoughts on the line."
          photo="/photos/woman-headphones-couch.jpg"
          photoAlt="A woman relaxing on a couch with headphones, at ease"
        />

        <section className="bg-cream">
          <div className="mx-auto max-w-[840px] px-5 py-16 md:py-20">
            <div className="space-y-4">
              {promises.map((p, i) => (
                <Reveal key={p.title} delay={i * 40}>
                  <div className="flex gap-5 rounded-3xl border border-line bg-white p-6 md:p-7">
                    <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint">
                      <Check className="h-4 w-4 text-sage" />
                    </span>
                    <div>
                      <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-ink">
                        {p.title}
                      </h2>
                      <p className="mt-2 text-[15.5px] leading-relaxed text-ink-soft">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="mt-10 rounded-2xl border border-line bg-white p-6 text-[14.5px] leading-relaxed text-ink-soft">
                <strong className="text-ink">What we measure, and only if you say yes.</strong>{" "}
                If you accept cookies, we use PostHog to see which pages and buttons people
                use, and to replay how the site was navigated, so we can fix what&rsquo;s
                confusing. Anything you type is masked before it leaves your browser, and in
                the app itself the on-screen words are masked too, so a replay shows the
                shape of a visit, never its content. Reject cookies and none of this runs.
              </div>
            </Reveal>

            <Reveal>
              <div className="mt-4 rounded-2xl border border-line bg-white p-6 text-[14.5px] leading-relaxed text-ink-soft">
                <strong className="text-ink">Questions?</strong> Ask Steady itself, it&rsquo;s
                disarmingly honest about what it stores, or reach us any time. If we
                wouldn&rsquo;t be comfortable with a practice, we don&rsquo;t build it.
              </div>
            </Reveal>

            <Reveal>
              <div className="mt-6 rounded-2xl border border-peach/60 bg-sun/30 p-6 text-[14px] leading-relaxed text-ink-soft">
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
