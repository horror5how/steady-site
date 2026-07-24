import Reveal from "./Reveal";
import { ArrowRight } from "./icons";

const patterns = [
  {
    photo: "/photos/window-lost.jpg",
    alt: "A woman on the bus, lost in the same circling thought",
    name: "Looping thoughts",
    quote: "“The same thought has been playing all day. Arguing with it just makes it louder.”",
    body: "A worry, a conversation, a what-if — on repeat like a song you can't turn off.",
    help: "Pushing a thought away makes it bounce back stronger — psychologists proved it in 1987 (the “white bear” effect). Saying it out loud and mapping it does the opposite.",
    cite: "Wegner et al., 1987",
    link: "https://pubmed.ncbi.nlm.nih.gov/3612492/",
  },
  {
    photo: "/photos/asking-reassurance.jpg",
    alt: "A man anxiously searching his partner's face for reassurance",
    name: "The reassurance-seeking mind",
    quote: "“Just tell me it's okay. Okay but… are you sure?”",
    body: "You ask. You feel better for ten minutes. Then the doubt comes back, hungrier. Partners, friends, Google — never quite enough.",
    help: "Research calls reassurance a “safety behavior”: relief now, more anxiety later, because your brain never gets to learn it was fine. Gently practicing not-asking is the exit.",
    cite: "Salkovskis model · review, 2020",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7339499/",
  },
  {
    photo: "/photos/email-recheck.jpg",
    alt: "A woman re-reading a sent email again, worried",
    name: "The compulsion",
    quote: "“One more check, and then I'll be able to relax.”",
    body: "Check the lock. Reread the email. Count it, redo it, get it “just right”. The action buys quiet — and quietly teaches your brain the fear was real.",
    help: "Practicing the trigger without the ritual (called ERP) is the most-proven approach there is — large, lasting improvements across 37 clinical trials.",
    cite: "Öst et al., meta-analysis, 2015",
    link: "https://pubmed.ncbi.nlm.nih.gov/26117062/",
  },
  {
    photo: "/photos/dawn-thoughts.jpg",
    alt: "A man on the edge of his bed at dawn, thoughts still there",
    name: "Anxiety that won't leave",
    quote: "“It follows me — dinner, the shower, 2am. I just want my head back.”",
    body: "Not real danger. Just a thought that clamps on and drags anxiety behind it, everywhere you go.",
    help: "94% of people get intrusive thoughts — a 13-country study proved it. The difference isn't the thought. It's how you respond to it. And that part is trainable.",
    cite: "Radomsky et al., 6 continents, 2014",
    link: "https://www.sciencedaily.com/releases/2014/04/140408122137.htm",
  },
];

export default function Patterns() {
  return (
    <section id="patterns" className="bg-cream">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:py-24">
        <Reveal>
          <h2 className="text-center text-[34px] font-semibold tracking-[-0.02em] text-ink md:text-[44px]">
            Which one is your loop?
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-center text-[16px] text-ink-soft">
            Four patterns. The same engine underneath. Every one of them is trainable —
            and the science backs it.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {patterns.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 80}>
              <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(63,79,66,0.35)] sm:flex-row">
                <div className="relative sm:w-[42%] sm:shrink-0">
                  <div className="relative aspect-[4/3] h-full sm:aspect-auto">
                    <img
                      src={p.photo}
                      alt={p.alt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-ink">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-[15px] font-medium italic leading-snug text-sage">
                    {p.quote}
                  </p>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">{p.body}</p>
                  <div className="mt-4 flex-1 rounded-2xl bg-sage/[0.07] p-4">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-sage">
                      What actually helps
                    </p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-ink">{p.help}</p>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-sage/80 underline-offset-2 transition hover:text-sage hover:underline"
                    >
                      {p.cite} →
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* hopeful closer */}
        <Reveal delay={100}>
          <div className="relative mt-10 overflow-hidden rounded-3xl">
            <div className="photo-card relative aspect-[16/7] md:aspect-[16/5]">
              <img
                src="/photos/hopeful-walk.jpg"
                alt="A woman stepping out of her front door into bright morning sun"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#12211c]/70 via-[#12211c]/30 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-[480px] p-7 md:p-10">
                  <p className="text-[22px] font-semibold leading-snug tracking-[-0.01em] text-white md:text-[28px]">
                    All four run on the same engine. The same gentle practice unwinds them.
                  </p>
                  <a
                    href="/signup"
                    className="btn-light mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-[14.5px] font-semibold"
                  >
                    Start unwinding yours <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
