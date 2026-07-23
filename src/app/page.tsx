import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import VoiceHero from "@/components/VoiceHero";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

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

function Collage() {
  return (
    <section className="overflow-hidden px-5 pb-20 pt-8">
      <Reveal>
        <div className="mx-auto flex max-w-[1150px] items-center justify-center gap-4 sm:gap-5">
          {/* photo left */}
          <div className="hidden w-[190px] shrink-0 -rotate-2 overflow-hidden rounded-3xl shadow-lg lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos/night-loop.jpg" alt="Lying awake at night with looping thoughts" className="h-[300px] w-full object-cover" />
          </div>

          {/* stat card sage */}
          <div className="hidden h-[240px] w-[180px] shrink-0 flex-col justify-between rounded-3xl p-5 text-white shadow-lg sm:flex"
            style={{ background: "linear-gradient(160deg,#4c8a6b 0%,#23312a 100%)" }}>
            <span className="text-[40px] font-bold leading-none tracking-tight">24/7</span>
            <span className="text-[14px] leading-snug text-white/85">
              There the moment the loop starts. Day or 3am.
            </span>
          </div>

          {/* phone centre */}
          <div className="w-[250px] shrink-0 sm:w-[290px]">
            <PhoneFrame src="/app/mobile-session.png" alt="Steady mobile app during a live voice session" />
          </div>

          {/* stat card peach */}
          <div className="hidden h-[240px] w-[180px] shrink-0 flex-col justify-between rounded-3xl p-5 shadow-lg sm:flex"
            style={{ background: "linear-gradient(160deg,#f9e3b7 0%,#dd8f58 100%)" }}>
            <span className="text-[40px] font-bold leading-none tracking-tight text-forest">10 min</span>
            <span className="text-[14px] leading-snug text-forest/80">
              Your first conversation. Speaking, not typing.
            </span>
          </div>

          {/* photo right */}
          <div className="hidden w-[190px] shrink-0 rotate-2 overflow-hidden rounded-3xl shadow-lg lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos/warm-portrait.jpg" alt="Smiling with relief after a Steady session" className="h-[300px] w-full object-cover" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const problems = [
  {
    quote: "It's 1am and I'm still checking the front door.",
    body: "Locks, ovens, emails you already sent. Checking buys a minute of calm, then the doubt comes straight back.",
    photo: "/photos/checking-door.jpg",
    alt: "Checking the front door late at night",
    bg: "#e8f0fb",
  },
  {
    quote: "I ask “are you sure?” ten times a day.",
    body: "Partners, friends, group chats. Every reassurance feels good for an hour and feeds the loop for a week.",
    photo: "/photos/asking-reassurance.jpg",
    alt: "Asking a partner for reassurance again",
    bg: "#efe9fa",
  },
  {
    quote: "One scary thought takes my whole afternoon.",
    body: "A thought lands, you argue with it, it argues back. The harder you push it away, the louder it gets.",
    photo: "/photos/window-lost.jpg",
    alt: "Lost in thought by the window",
    bg: "#fdeee1",
  },
  {
    quote: "Googling symptoms ate my evening. Again.",
    body: "Forty tabs later there is no answer, just a bigger knot. Research feels productive. It is the loop in disguise.",
    photo: "/photos/googling-night.jpg",
    alt: "Late-night searching for answers",
    bg: "#e7f3e9",
  },
];

function Problems() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-[1150px]">
        <Reveal>
          <p className="text-center text-[14px] font-semibold uppercase tracking-wide text-sage">
            The loop you know too well
          </p>
          <h2 className="mx-auto mt-3 max-w-[640px] text-center text-[32px] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[44px]">
            Sound familiar?
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center text-[16px] leading-relaxed text-ink-soft">
            Looping thoughts are exhausting because everything you try brings
            relief for a moment and makes the loop stronger for the long run.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p, i) => (
            <Reveal key={p.quote} delay={i * 80}>
              <div
                className="flex h-full flex-col overflow-hidden rounded-3xl"
                style={{ background: p.bg }}
              >
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-[22px] leading-none text-ink/30">&ldquo;</span>
                  <p className="mt-1 text-[17px] font-semibold leading-snug text-ink">
                    {p.quote}
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink/70">
                    {p.body}
                  </p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.photo} alt={p.alt} className="h-[180px] w-full object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

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
        <Collage />
        <Problems />
        <Value />
        <AppShowcase />
        <Cta />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
