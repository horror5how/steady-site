import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { ArrowRight, Check, Heart, MapIcon, Shield } from "@/components/icons";

export const metadata: Metadata = {
  title: "Find a Real Therapist | Steady Works Best Beside One",
  description:
    "Directories to find ERP-trained OCD therapists (IOCDF, Psychology Today, NOCD, BABCP), how Steady fits alongside therapy, and crisis resources.",
};

const directories = [
  {
    name: "IOCDF Resource Directory",
    region: "Worldwide",
    desc: "The International OCD Foundation's directory of therapists, clinics, and support groups that specialise in OCD and ERP. The gold-standard starting point.",
    href: "https://iocdf.org/find-help/",
  },
  {
    name: "Psychology Today",
    region: "US, CA, UK & more",
    desc: "Filter by OCD specialty, insurance, price, and location. Read profiles until one feels like a person you could actually talk to.",
    href: "https://www.psychologytoday.com/us/therapists/ocd",
  },
  {
    name: "NOCD",
    region: "US & international",
    desc: "Virtual ERP therapy with OCD specialists, often covered by US insurance. Video sessions, structured ERP, between-session support.",
    href: "https://www.treatmyocd.com/",
  },
  {
    name: "BABCP CBT Register",
    region: "UK & Ireland",
    desc: "The official register of accredited CBT therapists in the UK. Look for ERP experience with OCD in their profile.",
    href: "https://babcp.com/CBTRegister",
  },
  {
    name: "OCD Action",
    region: "UK",
    desc: "The UK's OCD charity — helpline, support groups, and guidance on getting ERP through the NHS or privately.",
    href: "https://ocdaction.org.uk/",
  },
  {
    name: "OCD-UK",
    region: "UK",
    desc: "Charity run by people with lived experience of OCD. Practical guides on accessing treatment and what good ERP looks like.",
    href: "https://www.ocduk.org/",
  },
];

const together = [
  {
    Icon: MapIcon,
    t: "Arrive already mapped",
    b: "Weeks of intake compressed: export your Steady map — triggers, loops, feared meanings, hierarchy — and hand it to your therapist in session one.",
  },
  {
    Icon: Heart,
    t: "Practice between sessions",
    b: "Therapy is one hour a week. The loop works full-time. Steady is the practice partner for the other 167 hours — at 2am, on the commute, wherever it hits.",
  },
  {
    Icon: Shield,
    t: "Same playbook, no conflicts",
    b: "Steady runs on exposure and response prevention — the approach OCD specialists already use. It reinforces your therapist's work instead of contradicting it.",
  },
];

export default function TherapistsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHero
          kicker="Real humans, real help"
          title={
            <>
              Some journeys deserve
              <br />a therapist too
            </>
          }
          sub="Steady will tell you this itself: a good ERP-trained therapist is the gold standard. Here's how to find one — and how Steady makes the two of you an unfair advantage against the loop."
          photo="/photos/therapist.jpg"
          photoAlt="A warm, welcoming therapist in a bright, plant-filled office"
        />

        {/* Steady + therapist */}
        <section className="bg-cream">
          <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-20">
            <Reveal>
              <h2 className="text-center text-[30px] font-semibold tracking-[-0.02em] text-ink md:text-[40px]">
                Steady + your therapist = the dream team
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <Reveal delay={40}>
                <div className="photo-card tilt-l relative aspect-[4/3] transition duration-300 hover:rotate-0">
                  <img
                    src="/photos/hug-relief.jpg"
                    alt="Two people in a long, relieved hug"
                    loading="lazy"
                  />
                  <span className="glass absolute bottom-4 left-4 rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-ink">
                    Real support matters
                  </span>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="photo-card tilt-r relative aspect-[4/3] transition duration-300 hover:rotate-0">
                  <img
                    src="/photos/mum-kid-play.jpg"
                    alt="A mother laughing and playing with her child"
                    loading="lazy"
                  />
                  <span className="glass absolute bottom-4 left-4 rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-ink">
                    This is the goal
                  </span>
                </div>
              </Reveal>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {together.map((c, i) => (
                <Reveal key={c.t} delay={i * 70}>
                  <div className="h-full rounded-3xl border border-line bg-white p-7">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage/10 text-sage">
                      <c.Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-[19px] font-semibold text-ink">{c.t}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{c.b}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Directories */}
        <section className="bg-cream-2/70">
          <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-20">
            <Reveal>
              <h2 className="text-center text-[30px] font-semibold tracking-[-0.02em] text-ink md:text-[40px]">
                Find your person
              </h2>
              <p className="mx-auto mt-4 max-w-[560px] text-center text-[16px] text-ink-soft">
                Trusted directories of ERP-trained therapists. One tip from us: it&rsquo;s
                completely okay to meet three and choose the one you exhale around.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {directories.map((d, i) => (
                <Reveal key={d.name} delay={(i % 3) * 60}>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_26px_60px_-28px_rgba(63,79,66,0.35)]"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-[18px] font-semibold text-ink">{d.name}</h3>
                      <span className="rounded-full bg-sage/10 px-2.5 py-1 text-[11.5px] font-semibold text-sage">
                        {d.region}
                      </span>
                    </div>
                    <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-soft">
                      {d.desc}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-sage transition group-hover:gap-2.5">
                      Open directory <ArrowRight className="h-4 w-4" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
            <Reveal delay={80}>
              <p className="mx-auto mt-8 max-w-[640px] text-center text-[13px] leading-relaxed text-ink-soft/80">
                These are independent organisations — Steady has no commercial relationship
                with any of them. We link them because they&rsquo;re genuinely where
                we&rsquo;d send a friend.
              </p>
            </Reveal>
          </div>
        </section>

        {/* What to look for */}
        <section className="bg-cream">
          <div className="mx-auto max-w-[840px] px-5 py-16 md:py-20">
            <Reveal>
              <h2 className="text-[26px] font-semibold tracking-[-0.01em] text-ink md:text-[32px]">
                What to ask a potential therapist
              </h2>
              <ul className="mt-6 space-y-3.5">
                {[
                  "“Do you use ERP (exposure and response prevention) for OCD and rumination?” — the single most important question. Talk therapy alone often feeds the loop.",
                  "“Have you worked with Pure O / mental compulsions?” — looping that happens invisibly, in your head, needs a therapist who knows it exists.",
                  "“What does a typical session look like?” — good ERP therapists describe practice, hierarchies, and homework, not just talking about feelings.",
                  "“Can I bring my own mapping?” — bring your Steady export. The good ones will be delighted.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15.5px] leading-relaxed text-ink">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sage/12 text-sage">
                      <Check className="h-3 w-3" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Crisis */}
            <Reveal delay={60}>
              <div
                id="crisis"
                className="mt-14 rounded-2xl border border-peach/60 bg-sun/30 p-6 text-[14.5px] leading-relaxed text-ink"
              >
                <strong>If you need help right now:</strong> don&rsquo;t browse, call.
                <span className="mt-2 block text-ink-soft">
                  US: call or text <strong className="text-ink">988</strong> (Suicide &amp;
                  Crisis Lifeline) · UK: call <strong className="text-ink">999</strong> in an
                  emergency or <strong className="text-ink">111</strong> for urgent mental
                  health support, or text SHOUT to <strong className="text-ink">85258</strong>{" "}
                  · Elsewhere: your local emergency number. Real humans, right now, who want
                  to talk to you.
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
