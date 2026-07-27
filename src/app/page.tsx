import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import ScrollStory from "@/components/ScrollStory";
import VoiceHero from "@/components/VoiceHero";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

const APP = "https://steady-erp-voice-fresh.vercel.app";

/* ---------- small building blocks ---------- */

function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto w-full max-w-[290px] rounded-[2.4rem] border border-black/10 bg-white p-2 shadow-[0_24px_60px_-20px_rgba(35,49,42,0.35)]">
      <div className="relative overflow-hidden rounded-[1.9rem] bg-[#f5f1e8]">
        <div className="absolute left-1/2 top-2 z-10 h-[18px] w-[92px] -translate-x-1/2 rounded-full bg-black/85" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="mt-8 block w-full" />
      </div>
    </div>
  );
}

function BrowserFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_24px_60px_-20px_rgba(35,49,42,0.3)]">
      <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#f6f5f1] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#f0b9ae]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f2d9a4]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#b8d4bf]" />
        <span className="ml-3 hidden truncate rounded-md bg-white px-3 py-0.5 text-[11px] text-ink-soft sm:block">
          beingsteady.com
        </span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="block w-full" />
    </div>
  );
}

/* ---------- sections ---------- */

/* Hero = live Steady taster (VoiceHero component) */

const journeys = [
  {
    problem: {
      photo: "/photos/window-lost.jpg",
      alt: "Lost in thought by the window",
      text: "One intrusive thought hijacks the whole afternoon. You argue with it; it argues back, louder.",
    },
    solution: {
      photo: "/photos/calm-breath.jpg",
      alt: "Breathing slowly, calm again",
      text: "You say it out loud instead. Steady helps you name it and let it pass — afternoon back.",
    },
  },
  {
    problem: {
      photo: "/photos/checking-door.jpg",
      alt: "Checking the front door late at night",
      text: "The front door, checked five times. Relief lasts a minute; the doubt comes straight back.",
    },
    solution: {
      photo: "/photos/proud-progress.jpg",
      alt: "Quietly proud after resisting the urge",
      text: "One conversation replaces the sixth check. The urge passes without the ritual — that's the win.",
    },
  },
  {
    problem: {
      photo: "/photos/asking-reassurance.jpg",
      alt: "Asking a partner for reassurance again",
      text: "“Are you sure?” — ten times a day. Every answer feeds the loop for a week.",
    },
    solution: {
      photo: "/photos/friends-laughing.jpg",
      alt: "Laughing with friends, present again",
      text: "Steady never feeds the loop. You practise sitting with the maybe — and people become people again.",
    },
  },
  {
    problem: {
      photo: "/photos/googling-night.jpg",
      alt: "Late-night searching for answers",
      text: "Forty tabs of symptoms at midnight. Research that feels productive and never ends.",
    },
    solution: {
      photo: "/photos/sunrise-exhale.jpg",
      alt: "Exhaling at sunrise, rested",
      text: "Your loop gets mapped: trigger, thought, habit. You wake with a plan, not a search history.",
    },
  },
];

/* Collage + ProblemsSolutions now live inside ScrollStory (pinned phone, layers stack in on scroll) */

const values = [
  {
    title: "Say it out loud",
    body: "No forms, no typing, no staring at a blank box. You talk, Steady listens and answers in a warm human voice. Saying the loop out loud already loosens it.",
    photo: "/photos/calm-breath.jpg",
    alt: "Speaking calmly during a voice session",
  },
  {
    title: "See your loop clearly",
    body: "Steady helps you map the trigger, the thought, and the habit that keeps it alive. Once the loop is on paper, it stops feeling like it is you.",
    photo: "/photos/woman-headphones-couch.jpg",
    alt: "Relaxed on the couch, talking the loop through",
  },
  {
    title: "Practice letting thoughts pass",
    body: "Short, gentle practice sessions built on exposure methods therapists trust. Always your pace, always your consent, never a push.",
    photo: "/photos/hopeful-walk.jpg",
    alt: "Walking with more ease",
  },
  {
    title: "Get your evenings back",
    body: "Less checking, less asking, less 1am research. The loop gets quieter and the time comes back to you, your people, and your sleep.",
    photo: "/photos/friends-laughing.jpg",
    alt: "Enjoying a light evening with friends",
  },
];

function Value() {
  return (
    <section className="bg-cream-2/60 px-5 py-20">
      <div className="mx-auto max-w-[1150px]">
        <Reveal>
          <p className="text-center text-[14px] font-semibold uppercase tracking-wide text-sage">
            What you get
          </p>
          <h2 className="mx-auto mt-3 max-w-[680px] text-center text-[32px] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[44px]">
            A calmer head, one conversation at a time
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.photo} alt={v.alt} className="h-[220px] w-full object-cover" />
                <div className="p-7">
                  <h3 className="text-[20px] font-bold text-ink">{v.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    {v.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppShowcase() {
  const webRows = [
    "Choose where to begin: an introduction, a session for right now, or practice",
    "Safety comes first. Practice stays locked until every readiness step is done",
    "Clear, calm screens with nothing to figure out",
  ];
  const mobileRows = [
    "Just speak. Steady listens and replies in a warm voice",
    "No pressing, no typing. When Steady finishes, you answer normally",
    "Pause the microphone or end the session with one tap",
  ];
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-[1150px]">
        <Reveal>
          <p className="text-center text-[14px] font-semibold uppercase tracking-wide text-sage">
            The Steady app
          </p>
          <h2 className="mx-auto mt-3 max-w-[640px] text-center text-[32px] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[44px]">
            One companion. Every screen.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-black/5 bg-cream-2/70 p-7 sm:p-9">
              <h3 className="text-[22px] font-bold text-ink">On the web</h3>
              <p className="mt-1 text-[15px] text-ink-soft">
                Open it in any browser. Nothing to install.
              </p>
              <div className="mt-6">
                <BrowserFrame src="/app/web-app.png" alt="Steady web app: choosing where to begin" />
              </div>
              <ul className="mt-6 space-y-3">
                {webRows.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-ink/80">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex h-full flex-col rounded-3xl border border-black/5 bg-cream-2/70 p-7 sm:p-9">
              <h3 className="text-[22px] font-bold text-ink">In your pocket</h3>
              <p className="mt-1 text-[15px] text-ink-soft">
                The same calm voice on your phone, wherever the loop finds you.
              </p>
              <div className="mt-6">
                <PhoneFrame src="/app/mobile-app.png" alt="Steady on mobile: your private trial home screen" />
              </div>
              <ul className="mt-6 space-y-3">
                {mobileRows.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-ink/80">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <VoiceHero />
        <ScrollStory journeys={journeys} />
        <Value />
        <AppShowcase />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
