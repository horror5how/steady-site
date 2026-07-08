import Reveal from "./Reveal";
import { ArrowRight, Mic } from "./icons";

export default function Becoming() {
  return (
    <section className="meadow-grad grain relative overflow-hidden">
      <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-16 md:py-28">
        <Reveal>
          <div className="relative">
            <div className="photo-card relative aspect-[4/3]">
              <img
                src="/photos/sunrise-exhale.jpg"
                alt="A person on a hilltop at sunrise, shoulders relaxed, breathing out"
                loading="lazy"
              />
            </div>
            <div className="glass float-a absolute -bottom-4 left-1/2 flex w-[80%] max-w-[330px] -translate-x-1/2 items-center gap-3 rounded-2xl p-3.5">
              <span className="relative grid h-9 w-9 shrink-0 place-items-center">
                <span className="orb absolute inset-0" />
                <Mic className="relative h-4 w-4 text-white" />
              </span>
              <p className="text-[12.5px] leading-snug text-ink">
                &ldquo;Hear that? Nothing happened. You just&hellip; let it pass. I&rsquo;m
                so glad you heard it too.&rdquo;
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="max-w-[480px]">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-sage">
              Why talking works
            </p>
            <h2 className="mt-4 text-[36px] font-semibold tracking-[-0.02em] text-ink md:text-[46px]">
              Saying it out loud changes everything
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
              The loop runs on words in your head. So the fix works best out loud. You say
              the worry. A warm voice helps you leave it be. And your brain finally learns
              what all that checking never taught it: you were okay the whole time.
            </p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft/80">
              It&rsquo;s not just a nice idea — UCLA brain scans show that putting feelings
              into words calms the amygdala, the brain&rsquo;s alarm bell.{" "}
              <a
                href="https://www.uclahealth.org/news/release/putting-feelings-into-words-produces-therapeutic-effects-in-the-brain-ucla-neuroimaging-study-supports-ancient-buddhist-teachings"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sage underline-offset-2 hover:underline"
              >
                See the study →
              </a>
            </p>
            <a
              href="/know-more"
              className="btn-dark mt-7 inline-flex items-center gap-2 px-5 py-3 text-[15px] font-semibold"
            >
              See how it works <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
