import Reveal from "./Reveal";
import { Sparkle } from "./icons";

export default function Cta() {
  return (
    <section id="cta" className="cta-grad grain relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-24 md:py-32">
        <div className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <Reveal>
            <div className="text-white">
              <h2 className="max-w-[620px] text-balance text-[38px] font-semibold leading-[1.04] tracking-[-0.025em] drop-shadow-sm md:text-[56px]">
                Ten minutes from now, it could be out of your head
              </h2>
              <p className="mt-5 max-w-[480px] text-[17px] leading-relaxed text-white/90">
                Say hello, say what's looping, and feel what it's like to have a warm voice
                on your side. Free to start. No card. No pressure.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <a
                  href="/signup"
                  className="btn-light inline-flex items-center gap-2 px-6 py-3.5 text-[15px] font-semibold"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-sage/15">
                    <Sparkle className="h-3 w-3 text-sage" />
                  </span>
                  Start talking, free
                </a>
                <a
                  href="/pricing"
                  className="inline-flex items-center px-4 py-3.5 text-[15px] font-semibold text-white/95 transition hover:text-white"
                >
                  See pricing →
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="photo-card tilt-r relative hidden aspect-[4/3] md:block">
              <img
                src="/photos/group-golden.jpg"
                alt="Friends laughing together at a golden-hour picnic"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
