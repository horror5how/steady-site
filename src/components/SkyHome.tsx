"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ph } from "@/lib/analytics";
import s from "./SkyHome.module.css";

const VoiceHero = dynamic(() => import("./VoiceHero"), {
  loading: () => <p className={s.loading}>Getting Steady ready…</p>,
});

function Icon({ name = "wave", size = 20 }: { name?: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    wave: (
      <>
        <path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    mic: (
      <>
        <rect x="9" y="3" width="6" height="12" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
      </>
    ),
    map: (
      <>
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="9" r="3" />
        <circle cx="10" cy="19" r="3" />
        <path d="m9 7 6 1M16 12l-4 4M6 9l3 7" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    shield: (
      <>
        <path d="m12 3 8 3v5c0 5-8 10-8 10S4 16 4 11V6l8-3Z" />
        <path d="m8 11 3 3 5-5" />
      </>
    ),
    pause: (
      <>
        <path d="M8 5v14M16 5v14" />
      </>
    ),
    play: <path d="m8 5 11 7-11 7V5Z" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    plus: <path d="M5 12h14M12 5v14" />,
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="3" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    chart: (
      <>
        <path d="M4 4v16h16M7 15l4-5 4 2 5-7" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.wave}
    </svg>
  );
}

function Wordmark() {
  return (
    <span className={s.wordmark}>
      <Icon size={27} />
      Steady
    </span>
  );
}
function Apply({
  light = false,
  children = "Apply for a place",
}: {
  light?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <a
      className={`${s.button} ${light ? s.light : ""}`}
      href="/invite"
      onClick={() => ph("cta_click", { source: "sky-home" })}
    >
      {children}
      <Icon name="arrow" size={16} />
    </a>
  );
}
function Tag({
  children,
  icon = "wave",
}: {
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <span className={s.tag}>
      <Icon name={icon} size={16} />
      {children}
    </span>
  );
}
function Wave({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`${s.waveform} ${small ? s.smallWave : ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: small ? 32 : 52 }, (_, i) => (
        <i
          key={i}
          style={
            {
              "--bar": `${(16 + Math.sin(i * 1.73) ** 2 * 70).toFixed(2)}%`,
              "--delay": `${i * -0.08}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

const examples = [
  {
    thought: "Did I lock the door?",
    habit: "Checking it again.",
    step: "Notice the urge to check.",
    note: "I can leave this unanswered.",
  },
  {
    thought: "What if I said the wrong thing?",
    habit: "Replaying the conversation.",
    step: "Notice the urge to replay.",
    note: "I can make room for a maybe.",
  },
  {
    thought: "Why did that thought come back?",
    habit: "Searching for certainty.",
    step: "Name the loop, without solving it.",
    note: "A thought can just be a thought.",
  },
];

function ThoughtCards({ example }: { example: number }) {
  const item = examples[example];
  return (
    <div className={s.cardStage}>
      <div className={s.backPaper} />
      <div className={s.backPaperTwo} />
      <article className={s.thoughtCard}>
        <span className={s.floatingLabel}>
          <Icon name="map" size={15} />
          The loop
        </span>
        <span className={s.paperEyebrow}>ON REPEAT</span>
        <p className={s.handwritten} key={item.thought}>
          {item.thought}
        </p>
        <svg className={s.scribble} viewBox="0 0 230 90" aria-hidden="true">
          <path d="M7 57C50 0 207 8 212 40S33 99 30 51 202 8 222 43 68 89 49 42 166 24 181 49 119 85 92 58 121 39 140 50" />
        </svg>
        <p className={s.loopAgain}>
          {item.habit}
          <br />
          Then the doubt comes back.
        </p>
        <div className={s.paperRule} />
        <span className={s.paperFoot}>Same question. Another lap.</span>
      </article>
      <article className={s.practiceCard}>
        <span className={s.floatingLabel}>
          <Icon name="check" size={15} />A different response
        </span>
        <div className={s.paperHeader}>
          <Wordmark />
          <span>Practice preview</span>
        </div>
        <div className={s.miniVoice}>
          <Icon name="wave" size={19} />
          <span>One moment at a time</span>
          <span className={s.liveDot} />
        </div>
        <Wave />
        <h3 key={item.step}>{item.step}</h3>
        <p>
          You don’t have to answer it
          <br />
          right now.
        </p>
        <div className={s.chosenStep}>
          <Icon name="check" size={16} />
          {item.note}
        </div>
        <div className={s.paperBottom}>
          <span>Your pace. Your choice.</span>
          <Icon name="shield" size={16} />
        </div>
      </article>
      <div className={s.voiceFloat}>
        <span className={s.voiceFloatIcon}>
          <Icon name="mic" size={21} />
        </span>
        <span>
          Say what’s on your mind.<small>Start with your own words.</small>
        </span>
        <Wave small />
      </div>
    </div>
  );
}

const questions = [
  [
    "What is Steady?",
    "Steady is an AI voice companion for looping thoughts and self-guided practice. You can talk things through, map the pattern and choose a small practice step. It is not a therapist, a diagnosis or a crisis service.",
  ],
  [
    "How do I get a place?",
    "Apply by answering nine short questions. If your answers meet the current access criteria, you can enter the app immediately. There is no email waiting list. The application explains who the early trial is suitable for.",
  ],
  [
    "Do I have to talk out loud?",
    "The app is built around voice. If you want to get a feel for Steady first, the website taster also gives you the option to type.",
  ],
  [
    "Can I stop a practice?",
    "Yes. You choose the step and agree to begin. You can pause or stop. Understanding your loop and starting an exposure practice are separate parts of the experience.",
  ],
  [
    "Can I use it alongside therapy?",
    "Steady is a self-guided practice companion and does not replace professional care. If you are working with a therapist, discuss whether it fits with your existing plan.",
  ],
];

export default function SkyHome() {
  const [example, setExample] = useState(0);
  const [paused, setPaused] = useState(false);
  const [menu, setMenu] = useState(false);
  const [talkLive, setTalkLive] = useState(false);
  const talkRef = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPaused(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      if (!document.hidden) setExample((i) => (i + 1) % examples.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [paused]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.setAttribute("data-visible", "true");
            observer.unobserve(e.target);
          }
      },
      { threshold: 0.12 },
    );
    root.current
      ?.querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  /* ponytail: the taster warms an API and prefetches its baked audio on mount,
     so it only boots once the section is actually near the viewport. */
  useEffect(() => {
    const el = talkRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTalkLive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const openDemo = () => {
    setTalkLive(true);
    ph("demo_open", { source: "sky-home" });
    talkRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={root} className={`${s.site} ${paused ? s.paused : ""}`}>
      <a className={s.skip} href="#main">
        Skip to content
      </a>
      <section className={s.hero}>
        <header className={s.nav}>
          <a href="/" aria-label="Steady home">
            <Wordmark />
          </a>
          <nav className={s.desktopNav} aria-label="Main navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#safety">Our approach</a>
            <a href="/therapists">For therapists</a>
          </nav>
          <div className={s.navActions}>
            <a className={s.login} href="/login">
              Log in
            </a>
            <Apply light>Apply</Apply>
            <button
              className={s.menuButton}
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              aria-controls="mobile-menu"
              onClick={() => setMenu(!menu)}
            >
              <Icon name={menu ? "close" : "plus"} />
            </button>
          </div>
          {menu && (
            <nav
              id="mobile-menu"
              className={s.mobileNav}
              aria-label="Mobile navigation"
              onClick={() => setMenu(false)}
            >
              <a href="#how-it-works">How it works</a>
              <a href="#features">Features</a>
              <a href="#safety">Our approach</a>
              <a href="/therapists">For therapists</a>
              <a href="/login">Log in</a>
            </nav>
          )}
        </header>
        <main id="main" className={s.heroCopy}>
          <h1>
            A calm voice.
            <br />
            For a loud mind.
          </h1>
          <p>
            When the same thought keeps coming back,
            <br className={s.desktopBreak} /> talk it through with Steady.
            <br />
            <strong>A little more room for living.</strong>
          </p>
          <div className={s.heroActions}>
            <Apply />
            <button className={s.demoLink} onClick={openDemo}>
              <Icon name="play" size={15} />
              Meet Steady
            </button>
          </div>
          <span className={s.heroNote}>Free to apply · Adults 18+</span>
        </main>
        <div className={s.skyWisps} aria-hidden="true" />
        <div className={s.stars} aria-hidden="true">
          {Array.from({ length: 17 }, (_, i) => (
            <i
              key={i}
              style={{
                left: `${5 + ((i * 37) % 90)}%`,
                top: `${27 + ((i * 19) % 66)}%`,
                animationDelay: `${-i * 0.7}s`,
              }}
            />
          ))}
        </div>
        <ThoughtCards example={example} />
        <div className={s.heroControls}>
          <span>Illustrative conversation</span>
          <button
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Play animation" : "Pause animation"}
            aria-pressed={paused}
          >
            <Icon name={paused ? "play" : "pause"} size={14} />
          </button>
        </div>
      </section>

      <div className={s.belowHero}>
        <section id="talk" className={`${s.section} ${s.talkSection}`} ref={talkRef}>
          <div className={s.talkCard}>
            <div className={s.talkHeading}>
              <span className={s.eyebrow}>TALK TO STEADY NOW</span>
              <h2>
                Say it out loud.{" "}
                <span className={s.talkEm}>
                  He&rsquo;s listening
                  <Wave small />
                </span>
              </h2>
              <p>
                One minute, right here on the page. No sign-up, no download &mdash;
                speak to Steady, or type if you&rsquo;d rather.
              </p>
            </div>
            <div className={s.talkStage}>
              {talkLive ? (
                <VoiceHero compact />
              ) : (
                <p className={s.loading}>Getting Steady ready…</p>
              )}
            </div>
          </div>
        </section>

        <section id="features" className={`${s.section} ${s.firstSection}`}>
          <div className={s.sectionHeading} data-reveal>
            <span className={s.eyebrow}>YOUR MIND HAS A LOT TO SAY</span>
            <h2>
              Let’s make some
              <br />
              space for{" "}
              <span className={s.inlineWave}>
                <Icon size={37} />
              </span>{" "}
              you.
            </h2>
            <p>
              A place to speak freely. A way to understand the loop.
              <br />A small next step that you choose.
            </p>
          </div>
          <div className={s.featureGrid}>
            <article id="map" className={s.featureCard} data-reveal>
              <Tag icon="map">Voice mapping</Tag>
              <h3>
                Say it out loud.
                <br />
                See it differently.
              </h3>
              <p>
                You talk. Steady helps you put the trigger, the thought and the
                response into words.
              </p>
              <div className={s.mapDemo} aria-label="Illustrative loop map">
                <div className={s.mapInput}>
                  <Icon name="mic" size={19} />
                  <span>“I keep going back to check…”</span>
                  <Wave small />
                </div>
                <div className={s.connector} />
                {[
                  ["The trigger", "Leaving the house"],
                  ["The thought", "What if it isn’t locked?"],
                  ["The response", "Going back to check"],
                ].map(([label, text], i) => (
                  <div
                    key={label}
                    className={s.mapRow}
                    style={{ "--order": i } as CSSProperties}
                  >
                    <span className={s.node} />
                    <div>
                      <small>{label}</small>
                      <span>{text}</span>
                    </div>
                    <Icon name="check" size={14} />
                  </div>
                ))}
              </div>
              <a className={s.textLink} href="/know-more">
                Explore voice mapping
                <Icon name="arrow" size={17} />
              </a>
            </article>
            <article id="practice" className={s.featureCard} data-reveal>
              <Tag icon="mic">Guided practice</Tag>
              <h3>
                A small step.
                <br />A voice beside you.
              </h3>
              <p>
                Choose a practice together. Begin when you’re ready, with room
                to pause or stop.
              </p>
              <div className={s.sessionDemo}>
                <div className={s.sessionTop}>
                  <span className={s.liveDot} />
                  GUIDED PRACTICE<span>Preview</span>
                </div>
                <Wave />
                <p>
                  “We can take this
                  <br />
                  one moment at a time.”
                </p>
                <div className={s.sessionControls}>
                  <span>
                    <Icon name="mic" size={17} />
                  </span>
                  <span>
                    <Icon name="pause" size={17} />
                  </span>
                  <span>
                    <Icon name="close" size={17} />
                  </span>
                </div>
                <small>Your pace. Always.</small>
              </div>
              <button className={s.textLink} onClick={openDemo}>
                Meet the voice
                <Icon name="arrow" size={17} />
              </button>
            </article>
          </div>
        </section>

        <section className={`${s.section} ${s.nightSection}`}>
          <figure className={s.nightBand} data-reveal>
            <Image
              src="/photos/night-loop.jpg"
              alt="Sitting awake late at night, the same thought going round"
              width={1600}
              height={1200}
              sizes="(max-width: 900px) 100vw, 1128px"
              className={s.nightImage}
            />
            <figcaption className={s.nightCaption}>
              <span className={s.nightStamp}>
                <span className={s.liveDot} />
                2:14 AM
              </span>
              <p>
                Seventh time round the same thought.
                <strong>You don&rsquo;t have to argue with it on your own.</strong>
              </p>
            </figcaption>
          </figure>
        </section>

        <section id="how-it-works" className={`${s.section} ${s.howSection}`}>
          <div className={s.sectionHeading} data-reveal>
            <h2>
              A little less tangled.
              <br />
              One conversation at a time.
            </h2>
            <p>
              Start with what’s on your mind. You don’t have to
              <br className={s.desktopBreak} /> know how to explain it.
            </p>
          </div>
          <div className={s.steps} data-reveal>
            {[
              [
                "01",
                "Find your words",
                "Talk about what keeps coming back. Steady listens and helps you describe the pattern.",
                "/photos/man-walk-talking.jpg",
                "Walking and talking it through with headphones in",
              ],
              [
                "02",
                "Understand the loop",
                "Connect the trigger, the thought and what you do next. Your experience, in your words.",
                "/photos/kitchen-mapping.jpg",
                "Talking at the kitchen table, working out what set it off",
              ],
              [
                "03",
                "Choose your next step",
                "When you’re ready, work towards a small, agreed practice. You decide when to begin.",
                "/photos/hopeful-walk.jpg",
                "Walking out of the door into the light, a little easier",
              ],
            ].map(([n, title, text, photo, alt]) => (
              <article key={n}>
                <div className={s.stepPhoto}>
                  <Image
                    src={photo}
                    alt={alt}
                    width={1200}
                    height={900}
                    sizes="(max-width: 900px) 100vw, 350px"
                  />
                </div>
                <span className={s.stepNumber}>{n}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${s.section} ${s.progressSection}`} id="progress">
          <article className={s.progressCard} data-reveal>
            <div>
              <Tag icon="chart">Your progress</Tag>
              <h2>
                Small steps.
                <br />
                Worth keeping.
              </h2>
              <p>
                Your map and practice history give you somewhere to pick up
                from. Come back to the next conversation with a little more
                context.
              </p>
              <a className={s.textLink} href="/know-more">
                Get to know Steady
                <Icon name="arrow" size={17} />
              </a>
            </div>
            <div className={s.progressPreview}>
              <div className={s.progressTitle}>
                <Wordmark />
                <span>Your journey</span>
              </div>
              <h3>Every chosen step counts.</h3>
              <span className={s.previewLabel}>AN ILLUSTRATIVE JOURNEY</span>
              <div className={s.journeyLine}>
                {["Found my words", "Named the loop", "Chose a practice"].map(
                  (text, i) => (
                    <div key={text}>
                      <span style={{ "--order": i } as CSSProperties}>
                        <Icon name="check" size={17} />
                      </span>
                      <p>{text}</p>
                    </div>
                  ),
                )}
              </div>
              <div className={s.progressNote}>
                <Icon name="map" size={18} />
                <p>
                  There is no perfect pace.
                  <br />
                  <strong>There is your pace.</strong>
                </p>
              </div>
            </div>
          </article>
        </section>

        <section id="safety" className={`${s.section} ${s.safetySection}`}>
          <div className={s.sectionHeading} data-reveal>
            <Tag icon="shield">A thoughtful approach</Tag>
            <h2>
              Your voice.
              <br />
              Your choice. Always.
            </h2>
            <p>Clear boundaries are part of the experience.</p>
          </div>
          <div className={s.safetyGrid} data-reveal>
            {[
              [
                "shield",
                "You choose to begin",
                "Mapping your thoughts never quietly becomes a practice. Readiness and consent come first.",
              ],
              [
                "pause",
                "You can pause or stop",
                "A practice is a step you agree to. You stay in control of when it begins and ends.",
              ],
              [
                "lock",
                "Know what you share",
                "Understand how your information is used before you begin. Read our privacy promise.",
              ],
            ].map(([icon, title, body]) => (
              <article key={title}>
                <Icon name={icon} size={26} />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <div className={s.boundary} data-reveal>
            <p>
              Steady is an AI practice companion, not therapy, medical advice or
              crisis support. It does not replace professional care.
            </p>
            <a href="/privacy">
              Privacy promise
              <Icon name="arrow" size={15} />
            </a>
          </div>
        </section>

        <section className={`${s.section} ${s.faqSection}`}>
          <div className={s.sectionHeading} data-reveal>
            <h2>
              A few things
              <br />
              you might be wondering.
            </h2>
          </div>
          <div className={s.faqList}>
            {questions.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Icon name="plus" size={20} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={`${s.section} ${s.payoffSection}`}>
          <div className={s.payoff} data-reveal>
            <figure className={s.payoffPhoto}>
              <Image
                src="/photos/hero-woman-relief.jpg"
                alt="Laughing on the sofa, hand on her chest, shoulders finally down"
                width={1376}
                height={768}
                sizes="(max-width: 900px) 100vw, 620px"
              />
            </figure>
            <div className={s.payoffCopy}>
              <span className={s.eyebrow}>WHAT THE QUIET FEELS LIKE</span>
              <h2>
                The evening
                <br />
                gives itself back.
              </h2>
              <p>
                Less checking. Less asking. Less one in the morning looking for
                the answer that never lands. The loop gets quieter, and the hours
                it was taking come back to you.
              </p>
              <a className={s.textLink} href="/know-more">
                See how it works
                <Icon name="arrow" size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className={s.finalCta} data-reveal>
          <span className={s.ctaMark}>
            <Icon size={43} />
          </span>
          <h2>
            You don’t have to find
            <br />
            all the words alone.
          </h2>
          <p>Start with the ones you have.</p>
          <Apply />
          <span>Nine questions to apply. Free, no card.</span>
        </section>
        <footer className={s.footer}>
          <div className={s.footerTop}>
            <div>
              <a href="/" aria-label="Steady home">
                <Wordmark />
              </a>
              <p>A calm voice for a loud mind.</p>
            </div>
            <div>
              <strong>Explore</strong>
              <a href="/know-more">How it works</a>
              <a href="/help">The loop library</a>
              <a href="/blog">Journal</a>
            </div>
            <div>
              <strong>Support</strong>
              <a href="/therapists">For therapists</a>
              <a href="/faq">Questions & answers</a>
              <a href="/therapists#crisis">Crisis resources</a>
            </div>
            <div>
              <strong>The details</strong>
              <a href="/privacy">Privacy promise</a>
              <a href="https://app.beingsteady.com/legal/terms.html">
                Terms of use
              </a>
              <a href="/faq#disclaimer">Medical disclaimer</a>
            </div>
          </div>
          <div className={s.footerBottom}>
            <span>© {new Date().getFullYear()} Steady</span>
            <span>A self-guided practice companion. For adults 18+.</span>
            <a href="/invite">
              Find your place
              <Icon name="arrow" size={15} />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
