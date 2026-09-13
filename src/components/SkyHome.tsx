"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ph } from "@/lib/analytics";
import s from "./SkyHome.module.css";

const VoiceHero = dynamic(() => import("./VoiceHero"), {
  loading: () => <p className={s.loading}>Getting Steady ready…</p>,
});
/* WebGL, so it never renders on the server and never blocks the page */
const TalkBackdrop = dynamic(() => import("./TalkBackdrop"), { ssr: false });

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
    "Is this just ChatGPT with a voice?",
    "No. Steady runs one thing: a structured practice built on exposure and response prevention, the approach NICE recommends first for adults with OCD. It will not reassure you, because reassurance is what feeds the loop. A general chatbot will happily tell you the door is locked. Steady will not, and that is the whole point.",
  ],
  [
    "I do not want to talk to a robot about this.",
    "Fair. So do not decide from a description — press the button above and say one sentence to it. Sixty seconds, nothing saved, no sign-up. If it feels wrong, close the tab and you have lost a minute.",
  ],
  [
    "What does it cost?",
    "Applying is free and the early trial is free. There is no card, and you will not be charged without being asked first.",
  ],
  [
    "What happens after I apply?",
    "Nine short questions, about two minutes. If your answers meet the current access criteria you go straight into the app — there is no email waiting list and nobody calls you. The questions also explain who the early trial is not suitable for.",
  ],
  [
    "Will it push me into something I am not ready for?",
    "No. Mapping a loop and practising with it are deliberately separate. A practice is a step you agree to out loud first, and you can pause or end it at any point. Nothing starts without your explicit go-ahead.",
  ],
  [
    "Do I have to speak out loud?",
    "In the app, yes — the whole method works on the channel the loop lives on. On this page you can type instead if you would rather start there.",
  ],
  [
    "I am already seeing a therapist.",
    "Plenty of people use Steady as the thing between sessions, when the loop turns up at eleven at night and the next appointment is Thursday. It does not replace professional care. Tell your therapist you are using it.",
  ],
  [
    "What happens to what I say?",
    "The taster on this page is not saved at all. In the app you can see everything Steady remembers about you and make it forget any of it, on the spot.",
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
          <span className={s.heroKicker}>A calm voice for a loud mind</span>
          <h1>
            An AI voice that talks you
            <br className={s.desktopBreak} /> out of looping thoughts.
          </h1>
          <p>
            Say the thought that keeps coming back out loud, and hear it lose
            its grip.{" "}
            <strong>No waiting list. No diagnosis. No appointment.</strong>
          </p>
          <div className={s.heroActions}>
            <button className={s.button} onClick={openDemo}>
              Talk to Steady now
              <Icon name="arrow" size={16} />
            </button>
            <Apply light>Apply for a place</Apply>
          </div>
          <span className={s.heroNote}>
            Free · No sign-up · 60 seconds · Adults 18+ · Not therapy
          </span>
          <div className={s.heroProof}>
            <a href="/evidence">
              <Icon name="check" size={15} />
              Built on exposure practice &mdash; what NICE recommends first for
              OCD in adults
            </a>
            <span>
              <Icon name="lock" size={15} />
              The taster isn&rsquo;t saved. Stop whenever you like.
            </span>
          </div>
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
        <section
          id="talk"
          className={`${s.section} ${s.talkSection}`}
          ref={talkRef}
        >
          <div className={s.talkCard}>
            <div className={s.talkBackdrop} aria-hidden="true">
              {talkLive && !paused && <TalkBackdrop />}
            </div>
            <div className={s.talkInner}>
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
                  Don&rsquo;t take our word for any of it. This is the actual
                  product, not a video. One minute, no sign-up, no download
                  &mdash; speak to Steady, or type if you&rsquo;d rather.
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
          </div>
        </section>

        <section className={`${s.section} ${s.firstSection} ${s.problemSection}`}>
          <div className={s.sectionHeading} data-reveal>
            <span className={s.eyebrow}>IF ANY OF THIS IS YOURS</span>
            <h2>
              You already know
              <br />
              how the night goes.
            </h2>
          </div>
          <div className={s.problemGrid} data-reveal>
            {[
              [
                "“I know it's locked. I go back anyway.”",
                "The relief lasts about a minute. Then the doubt is back, and it is a little louder than it was.",
              ],
              [
                "“I just need someone to tell me it's fine.”",
                "They tell you. It helps for an evening. By Tuesday you need to ask again, and you can hear yourself asking.",
              ],
              [
                "“It's 2am and I'm still reading about it.”",
                "Forty tabs deep, and every answer makes a new question. It feels like research. It is the loop wearing a lab coat.",
              ],
            ].map(([quote, body]) => (
              <article key={quote} className={s.problemCard}>
                <h3>{quote}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <p className={s.problemTurn} data-reveal>
            None of that is a character flaw. It is a loop, and loops have a
            shape you can learn.
          </p>
        </section>

        <section id="features" className={`${s.section}`}>
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

        <section className={`${s.section} ${s.midCtaSection}`}>
          <div className={s.midCta} data-reveal>
            <div>
              <h3>You can be talking to Steady in ten seconds.</h3>
              <p>No sign-up, no download, nothing saved. Just say the thing.</p>
            </div>
            <button className={s.button} onClick={openDemo}>
              Talk to Steady now
              <Icon name="arrow" size={16} />
            </button>
          </div>
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

        <section id="evidence" className={`${s.section} ${s.evidenceSection}`}>
          <div className={s.sectionHeading} data-reveal>
            <span className={s.eyebrow}>WHY ANY OF THIS WORKS</span>
            <h2>
              Not a new idea.
              <br />A well-studied one, said out loud.
            </h2>
            <p>
              Three things the research keeps finding. Every one of them is
              linked to the paper it came from.
            </p>
          </div>
          <div className={s.evidenceGrid} data-reveal>
            {[
              {
                claim: "Facing it beats arguing with it",
                body: "For adults with OCD, the first thing NICE tells clinicians to offer is CBT including exposure and response prevention — facing the feared thing in graded steps, without the escape move.",
                source: "NICE guideline CG31, recommendation 1.5.1.1",
                href: "https://www.nice.org.uk/guidance/cg31/chapter/Recommendations",
              },
              {
                claim: "Surprise is the part that teaches",
                body: "“The mismatch between expectancy and outcome is critical for new learning… The more the expectancy can be violated by experience, the greater the inhibitory learning.”",
                source:
                  "Craske et al., Maximizing Exposure Therapy, Behaviour Research and Therapy, 2014",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4114726/",
              },
              {
                claim: "The props are what keep it alive",
                body: "“Safety signals alleviate distress in the short term, but when they are no longer present, the fear returns.” The checking, the asking, the phone in your hand.",
                source:
                  "Craske et al., 2014, on the removal of safety signals",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4114726/",
              },
            ].map((e) => (
              <article key={e.claim} className={s.evidenceCard}>
                <h3>{e.claim}</h3>
                <p>{e.body}</p>
                <a href={e.href} target="_blank" rel="noreferrer noopener">
                  {e.source}
                  <Icon name="arrow" size={14} />
                </a>
              </article>
            ))}
          </div>
          <div className={s.honesty} data-reveal>
            <p>
              <strong>Said plainly:</strong> the evidence backs the approach, not
              any app, and certainly not a promise about you. Steady is a
              practice companion. It is not therapy, not treatment, and not a
              diagnosis.
            </p>
            <a href="/evidence">
              Read the whole thinking
              <Icon name="arrow" size={15} />
            </a>
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
          <div className={s.notList} data-reveal>
            <h3>And plainly, what Steady is not</h3>
            <ul>
              {[
                "Not a therapist, and not a replacement for one. If you can get professional care, take it.",
                "Not a diagnosis. Steady will never tell you what you have.",
                "Not crisis support. If you need someone now: 988 in the US, 999 or Samaritans on 116 123 in the UK.",
                "Not for under 18s.",
                "Not a promise about you. The evidence backs the practice, not an outcome.",
              ].map((line) => (
                <li key={line}>
                  <Icon name="close" size={15} />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className={s.boundary} data-reveal>
            <p>
              Your session notes are yours. You can see what Steady remembers
              and make it forget any of it, whenever you want.
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
