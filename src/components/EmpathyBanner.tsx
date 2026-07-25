import Reveal from "./Reveal";
import { ArrowRight, Mic } from "./icons";

export default function EmpathyBanner() {
  return (
    <section className="hero-grad grain relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          {/* animated feminine orb */}
          <Reveal>
            <div className="relative mx-auto grid h-[300px] w-[300px] place-items-center md:h-[380px] md:w-[380px]">
              <div className="orb-ring" />
              <div className="orb-ring orb-ring-2" />
              <div className="orb-ring orb-ring-3" />
              <div className="absolute inset-[10%] overflow-hidden rounded-full shadow-[0_0_80px_20px_rgba(247,207,186,0.5),0_30px_80px_-20px_rgba(63,79,66,0.35)]">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden
                  className="h-full w-full scale-[1.35] object-cover"
                >
                  <source src="/orb-loop.mp4" type="video/mp4" />
                </video>
              </div>
              <span className="glass absolute -bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold text-ink">
                <span className="wave text-sage" aria-hidden>
                  <i /><i /><i /><i /><i />
                </span>
                Hi. I&rsquo;m Steady.
              </span>
            </div>
          </Reveal>

          {/* copy */}
          <Reveal delay={90}>
            <div className="max-w-[520px]">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-sage">
                Meet Steady
              </p>
              <h2 className="mt-4 text-balance text-[36px] font-bold leading-[0.98] tracking-[-0.035em] text-ink md:text-[48px]">
                Empathy-based AI, here to help you live the life you&rsquo;re meant to.
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
                Not a chatbot. Not a form. A warm, patient voice that listens, understands
                how loops work, and walks beside you until your head is yours again.
              </p>
              <a
                href="/invite"
                className="btn-dark mt-7 inline-flex items-center gap-2 px-6 py-3.5 text-[15.5px] font-semibold"
              >
                <Mic className="h-4 w-4" /> Click here to be invited
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* the advert */}
        <Reveal delay={120}>
          <div className="mx-auto mt-16 max-w-[880px]">
            <div className="photo-card relative">
              <video
                controls
                playsInline
                preload="metadata"
                poster="/photos/group-golden.jpg"
                className="block h-auto w-full"
              >
                <source src="/steady-advert.mp4" type="video/mp4" />
              </video>
            </div>
            <p className="mt-4 text-center text-[13.5px] text-ink-soft">
              Sound on. 40 seconds. That&rsquo;s the whole story.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
