import { ArrowRight, Sparkle, Mic, Chart, Pause } from "./icons";

export default function Hero() {
  return (
    <section id="top" className="hero-grad relative isolate overflow-hidden">
      <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-12 px-5 pb-16 pt-36 md:grid-cols-[1.05fr_1fr] md:gap-10 md:pb-24 md:pt-44">
        {/* Copy */}
        <div className="max-w-[560px]">
          <div className="rise rise-1 inline-flex items-center gap-2 rounded-full bg-sage/10 px-3.5 py-1.5 text-[13.5px] font-semibold text-sage">
            <span className="wave" aria-hidden>
              <i /><i /><i /><i /><i />
            </span>
            A voice that helps you let the loop go
          </div>
          <h1 className="rise rise-2 mt-5 text-balance text-[42px] font-semibold leading-[1.04] tracking-[-0.02em] text-ink sm:text-[52px] md:text-[60px]">
            Your head is loud.
            <br />
            Let&rsquo;s talk it quiet.
          </h1>
          <p className="rise rise-3 mt-5 max-w-[480px] text-[17px] leading-relaxed text-ink-soft md:text-[19px]">
            Stuck on the same thought all day? Steady is a friendly voice you talk with,
            out loud. It helps you understand the loop, practice letting it go, and feel
            like yourself again.
          </p>
          <div className="rise rise-4 mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/invite"
              className="group inline-flex items-center gap-3 rounded-full bg-sage py-2 pl-6 pr-2 text-[15.5px] font-semibold text-white shadow-[0_14px_36px_-12px_rgba(62,122,94,0.6)] transition hover:bg-[#336750]"
            >
              Click here to be invited
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 transition group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4 text-white" />
              </span>
            </a>
            <a
              href="/know-more"
              className="inline-flex items-center gap-1.5 text-[15.5px] font-semibold text-ink transition hover:gap-2.5"
            >
              How it works <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="rise rise-5 mt-5 text-[13.5px] text-ink-soft/80">
            Invite-only research trial · free, no card · adults 18+ · not therapy or medical care
          </p>
        </div>

        {/* Photo composition */}
        <div className="relative">
          <div className="photo-card rise rise-3 relative aspect-[4/5] sm:aspect-[5/5] md:aspect-[4/4.6]">
            <img
              src="/photos/hero-woman-relief.jpg"
              alt="A woman laughing with relief on her sofa in morning light"
            />
            {/* breathing orb badge */}
            <div className="absolute right-5 top-5 h-16 w-16">
              <div className="orb-ring" />
              <div className="orb-ring orb-ring-2" />
              <div className="orb absolute inset-[12%]" />
            </div>
          </div>

          {/* floating voice card */}
          <div className="glass float-a rise rise-4 absolute -left-4 bottom-16 w-[270px] rounded-2xl p-4 sm:-left-8">
            <div className="flex items-center justify-between text-[12px] text-ink-soft">
              <span className="inline-flex items-center gap-2 font-semibold text-ink">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-sage/15 text-sage">
                  <Sparkle className="h-3 w-3" />
                </span>
                Steady
              </span>
              <span className="wave text-sage" aria-hidden>
                <i /><i /><i /><i /><i />
              </span>
            </div>
            <p className="mt-2.5 text-[13px] leading-snug text-ink">
              &ldquo;That thought again? Okay. We&rsquo;ve got this — let&rsquo;s not answer
              it together.&rdquo;
            </p>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11.5px] text-ink-soft">
              <Mic className="h-3.5 w-3.5 text-sage" /> A real conversation, out loud
            </div>
          </div>

          {/* floating progress pill */}
          <div className="glass float-b rise rise-5 absolute -right-2 bottom-4 inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 sm:-right-4">
            <Chart className="h-4 w-4 text-peach-deep" />
            <span className="text-[13px] font-semibold text-ink">
              Tonight: 7 <span className="text-ink-soft">→</span> 3
            </span>
            <span className="text-[11.5px] text-ink-soft">the wave passed</span>
          </div>

          {/* pause chip */}
          <div className="glass float-b rise rise-5 absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium text-ink">
            <Pause className="h-3 w-3 text-sage" /> You set the pace
          </div>
        </div>
      </div>
    </section>
  );
}
