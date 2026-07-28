"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ph, stopReplay } from "@/lib/analytics";

/* One question per screen. Warm questions first, legal last — by the time the
 * consent screen arrives someone has told us what they want help with, which is
 * both kinder and better for conversion. The screening still happens before any
 * of it is submitted, and the consent tick is the last thing before submit, so
 * it stays conspicuous and affirmative.
 *
 * Exits (under 18, blocked state, risk flags) end the flow gently with real
 * resources. Nobody gets told they failed a test. */

const APP = "https://steady-erp-voice-fresh.vercel.app";
const TERMS = `${APP}/legal/terms.html`;
const PRIVACY = `${APP}/legal/privacy.html`;

const GOALS = [
  "Stop the same thought looping",
  "Quiet the what-ifs",
  "Stop checking and re-checking",
  "Stop replaying conversations",
  "Understand my patterns",
  "Practise between therapy sessions",
  "Something else",
];

const FREQUENCY = [
  "Most of the day, most days",
  "A few hours a day",
  "Some days, not others",
  "It comes in waves",
];

const AGE_BANDS = ["Under 18", "18 to 24", "25 to 34", "35 to 44", "45 to 54", "55 and up"];

const STATES: [string, string][] = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["DC","District of Columbia"],
  ["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],
  ["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],
  ["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],
  ["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],
  ["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],
  ["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],
  ["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],
  ["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],
  ["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
];

const RISK_OPTIONS = [
  { key: "riskSelfHarm", label: "Thoughts of harming myself or someone else — or I have acted on them" },
  { key: "riskRecentCrisis", label: "A mental-health crisis, or hospital care for one" },
  { key: "riskCrisisCare", label: "I'm under crisis or urgent mental-health care right now" },
];

const BLOCKED_STATES = new Set(["IL", "NV", "WA"]);

/* Screen order, for analytics only. Kept out of the screens memo so the
 * step-viewed effect fires once per step instead of once per render. Must stay
 * in sync with the screen keys below — the dev-only check further down shouts
 * in the console if the two ever drift. */
const STEP_KEYS = [
  "welcome", "goals", "frequency", "age", "name",
  "email", "state", "risk", "about", "consent",
] as const;

type Exit = { title: string; body: React.ReactNode; reason: string } | null;

const CRISIS_LINE = (
  <>
    call or text <strong>988</strong> (Suicide &amp; Crisis Lifeline), text HOME to{" "}
    <strong>741741</strong>, or call 911 if you&rsquo;re in immediate danger
  </>
);

const IOCDF = (
  <a className="underline underline-offset-2" href="https://iocdf.org/find-help/" target="_blank" rel="noreferrer">
    iocdf.org/find-help
  </a>
);

export default function InviteFlow() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [exit, setExit] = useState<Exit>(null);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [goals, setGoals] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("");
  const [ageBand, setAgeBand] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [risk, setRisk] = useState<Record<string, boolean>>({});
  const [about, setAbout] = useState("");
  const [agreed, setAgreed] = useState(false);

  const liveRef = useRef<HTMLDivElement>(null);

  const go = useCallback((next: number) => {
    setError("");
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }, [step]);

  const next = useCallback(() => go(step + 1), [go, step]);
  const back = useCallback(() => (step > 0 ? go(step - 1) : undefined), [go, step]);

  const submit = useCallback(async () => {
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, city, state, about, agreed,
          ageBand, goals, frequency,
          riskSelfHarm: risk.riskSelfHarm === true,
          riskRecentCrisis: risk.riskRecentCrisis === true,
          riskCrisisCare: risk.riskCrisisCare === true,
        }),
      });
      const result = await response.json().catch(() => ({ ok: false }));
      if (result.screenedOut || result.blocked) {
        setExit({
          title: "Not right now — and that's the honest answer",
          body: <p>{result.error}</p>,
          reason: result.blocked ? "blocked_state" : "screened_out",
        });
        return;
      }
      if (!response.ok || !result.ok) {
        setError(result.error || "Something went wrong. Try again in a moment.");
        return;
      }
      setDone(true);
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }, [name, email, city, state, about, agreed, ageBand, goals, frequency, risk]);

  /* ---------- screens ---------- */
  const screens = useMemo(() => [
    {
      key: "welcome",
      kicker: "Invite-only research trial",
      title: "Let’s see if Steady is right for you",
      sub: "Nine short questions and one thing to agree to — about two minutes. There are no wrong answers, and nothing here costs anything.",
      body: (
        <button type="button" onClick={next} className="btn-dark mt-9 inline-flex items-center rounded-full px-7 py-3.5 text-[15px] font-semibold">
          Start
        </button>
      ),
    },
    {
      key: "goals",
      kicker: "Question 1 of 9",
      title: "What brings you here?",
      sub: "Pick up to three. It helps us know who this first group should be.",
      body: (
        <>
          <Options
            options={GOALS}
            selected={goals}
            multi
            onPick={(value) =>
              setGoals((current) =>
                current.includes(value)
                  ? current.filter((item) => item !== value)
                  : current.length >= 3 ? current : [...current, value],
              )
            }
          />
          <Continue onClick={next} disabled={goals.length === 0} />
        </>
      ),
    },
    {
      key: "frequency",
      kicker: "Question 2 of 9",
      title: "How much room does it take up?",
      sub: "However you answer is fine. We just want to understand the shape of it.",
      body: <Options options={FREQUENCY} selected={frequency ? [frequency] : []} onPick={(value) => { setFrequency(value); setTimeout(next, 180); }} />,
    },
    {
      key: "age",
      kicker: "Question 3 of 9",
      title: "What’s your age range?",
      sub: "Steady is for adults only while it’s still being tested.",
      body: (
        <Options
          options={AGE_BANDS}
          selected={ageBand ? [ageBand] : []}
          onPick={(value) => {
            setAgeBand(value);
            if (value === "Under 18") {
              setExit({
                reason: "under_18",
                title: "We can’t take under-18s yet — sorry",
                body: (
                  <>
                    <p>
                      Steady is being tested with adults first, and we won’t bend that. It isn’t
                      about you — it’s about us not having the safeguards a younger person deserves
                      yet.
                    </p>
                    <p className="mt-3">
                      If your thoughts are looping and it’s hard, please talk to someone who can
                      help properly: in the US, {CRISIS_LINE}. The{" "}
                      <a className="underline underline-offset-2" href="https://iocdf.org/find-help/" target="_blank" rel="noreferrer">
                        IOCDF directory
                      </a>{" "}
                      lists therapists who work with young people, and it’s the best there is.
                    </p>
                  </>
                ),
              });
              return;
            }
            setTimeout(next, 180);
          }}
        />
      ),
    },
    {
      key: "name",
      kicker: "Question 4 of 9",
      title: "What should we call you?",
      sub: "First name is plenty.",
      body: (
        <TextStep
          value={name}
          onChange={setName}
          onEnter={next}
          placeholder="Your first name"
          autoComplete="given-name"
          valid={name.trim().length > 0}
        />
      ),
    },
    {
      key: "email",
      kicker: "Question 5 of 9",
      title: "Where should the invitation go?",
      sub: "One email when there’s a place for you. Nothing else, ever.",
      body: (
        <TextStep
          value={email}
          onChange={setEmail}
          onEnter={next}
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          valid={/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email.trim())}
        />
      ),
    },
    {
      key: "state",
      kicker: "Question 6 of 9",
      title: "Which state are you in?",
      sub: "The rules for this kind of app are set state by state, so we have to ask.",
      body: (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <select
              value={state}
              onChange={(event) => {
                const picked = event.target.value;
                setState(picked);
                if (BLOCKED_STATES.has(picked)) {
                  setExit({
                    reason: "blocked_state",
                    title: "Not available in your state yet",
                    body: (
                      <>
                        <p>
                          Illinois, Nevada and Washington require a licensed clinician to oversee
                          AI-guided mental-health practice. We don’t have one on the team yet, so
                          taking you on would mean bending a rule that exists for good reason.
                        </p>
                        <p className="mt-3">
                          The moment that changes, we’ll open up — leave it with us. Meanwhile {IOCDF}{" "}
                          is the best place to find an ERP-trained therapist near you.
                        </p>
                      </>
                    ),
                  });
                }
              }}
              className="w-full rounded-2xl border border-line bg-white px-5 py-4 text-[16px] text-ink outline-none transition focus:border-ink/30"
            >
              <option value="">Choose your state</option>
              {STATES.map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="City (optional)"
              autoComplete="address-level2"
              className="w-full rounded-2xl border border-line bg-white px-5 py-4 text-[16px] text-ink outline-none transition focus:border-ink/30"
            />
          </div>
          <Continue onClick={next} disabled={!state} />
        </>
      ),
    },
    {
      key: "risk",
      kicker: "Question 7 of 9 · one important one",
      title: "Has any of this been true in the last three months?",
      sub: "We ask because Steady has no clinician on the team yet. If any of these fit, there’s something better for you than us — and we’d rather point you to it.",
      body: (
        <>
          <Options
            options={RISK_OPTIONS.map((option) => option.label)}
            selected={RISK_OPTIONS.filter((option) => risk[option.key]).map((option) => option.label)}
            multi
            onPick={(label) => {
              const option = RISK_OPTIONS.find((item) => item.label === label);
              if (!option) return;
              setRisk((current) => ({ ...current, [option.key]: !current[option.key] }));
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (RISK_OPTIONS.some((option) => risk[option.key])) {
                /* Deliberately coarse: "screened_out", never which box was
                 * ticked. The step-viewed funnel already tells us how many
                 * leave here — labelling it with the health reason would put
                 * clinical data in a third party, which the rest of this rail
                 * is careful never to do. */
                setExit({
                  reason: "screened_out",
                  title: "There’s something better for you than us right now",
                  body: (
                    <>
                      <p>
                        Thank you for being straight with us — that took something. Steady is an
                        early trial with no clinician on the team, so it isn’t the right place for
                        you at the moment, and we’d rather say so than take you in.
                      </p>
                      <p className="mt-3">Please talk to someone who can actually help: {CRISIS_LINE}.</p>
                      <p className="mt-3">
                        For OCD specialists, {IOCDF} is the best directory there is. And when things
                        are steadier, we’d genuinely be glad to hear from you again.
                      </p>
                    </>
                  ),
                });
                return;
              }
              next();
            }}
            className="btn-dark mt-9 inline-flex items-center rounded-full px-7 py-3.5 text-[15px] font-semibold"
          >
            {RISK_OPTIONS.some((option) => risk[option.key]) ? "Continue" : "None of these apply"}
          </button>
        </>
      ),
    },
    {
      key: "about",
      kicker: "Question 8 of 9 · optional",
      title: "Anything you’d like us to know?",
      sub: "Only what you’re comfortable writing down. Skip it if you’d rather.",
      body: (
        <>
          <textarea
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            rows={4}
            maxLength={1200}
            className="mt-8 w-full rounded-2xl border border-line bg-white px-5 py-4 text-[16px] leading-relaxed text-ink outline-none transition focus:border-ink/30"
          />
          <p className="mt-2 text-[12.5px] text-ink-soft">Stored encrypted. Read only by us.</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button type="button" onClick={next} className="btn-dark inline-flex items-center rounded-full px-7 py-3.5 text-[15px] font-semibold">
              Continue
            </button>
            <button type="button" onClick={next} className="text-[14.5px] font-medium text-ink-soft underline underline-offset-2 hover:text-ink">
              Skip
            </button>
          </div>
        </>
      ),
    },
    {
      key: "consent",
      kicker: "Question 9 of 9 · and it matters",
      title: "The honest version, in six lines",
      sub: "Read these properly — they’re the deal, not the small print.",
      body: (
        <>
          <ul className="mt-7 space-y-3 text-[15px] leading-relaxed text-ink-soft">
            <li>
              <strong className="text-ink">Steady is an early research trial</strong>, not a finished
              product. It is not therapy, not medical care, not a diagnosis and not an emergency
              service. It does not treat any condition.
            </li>
            <li>I am <strong className="text-ink">18 or over</strong>, and I won’t pass my invitation to anyone under 18.</li>
            <li>
              I’m taking part <strong className="text-ink">voluntarily</strong>. It may not help me,
              it can get things wrong, and I won’t rely on it in a crisis — I’ll call or text 988,
              or 911 in an emergency.
            </li>
            <li>
              Steady <strong className="text-ink">stores what I tell it</strong>, including things
              about my mental health, and my voice is processed by OpenAI to power the conversation.
              I can delete everything at any time.
            </li>
            <li>
              If I describe being in danger, Steady <strong className="text-ink">stops the practice</strong>{" "}
              and points me to real help, and a person at Steady is told so they can check in. If they
              believe someone’s life is in immediate danger, they may contact emergency services.
            </li>
            <li>
              I agree to the{" "}
              <a className="underline underline-offset-2" href={TERMS} target="_blank" rel="noreferrer">Terms of Use</a>{" "}
              and{" "}
              <a className="underline underline-offset-2" href={PRIVACY} target="_blank" rel="noreferrer">Privacy Policy</a>,
              including the arbitration agreement, class-action waiver and limit of liability.
            </li>
          </ul>
          <label className="mt-7 flex cursor-pointer items-start gap-3 text-[15px] font-semibold text-ink">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-1 h-[18px] w-[18px] shrink-0 accent-[#3e7a5e]"
            />
            <span>I’ve read the six points above and I agree to take part on those terms.</span>
          </label>
          {error && (
            <p role="alert" className="mt-5 rounded-xl border border-peach-deep/30 bg-peach/10 p-4 text-[14px] text-ink">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!agreed || sending}
            className="btn-dark mt-7 inline-flex items-center rounded-full px-7 py-3.5 text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? "Sending…" : "Apply for my invitation"}
          </button>
        </>
      ),
    },
  ], [goals, frequency, ageBand, name, email, state, city, risk, about, agreed, error, sending, next, submit]);

  const total = screens.length;
  const current = screens[Math.min(step, total - 1)];

  useEffect(() => {
    liveRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, exit, done]);

  /* Session replay is on across the marketing site and masks typed input — but
   * the answers here are buttons, not inputs, so a recording would show which
   * risk box someone ticked. Never record this flow. */
  useEffect(() => { stopReplay(); }, []);

  /* Funnel instrumentation. Which step someone reaches, and how they left —
   * nothing about what they answered. */
  useEffect(() => {
    if (exit || done) return;
    ph("invite_step_viewed", { step, key: STEP_KEYS[Math.min(step, STEP_KEYS.length - 1)] });
  }, [step, exit, done]);

  useEffect(() => { if (exit) ph("invite_exit", { step, reason: exit.reason }); }, [exit, step]);
  useEffect(() => { if (done) ph("invite_submitted"); }, [done]);

  /* Mislabelled funnel steps are worse than none — catch drift in dev. */
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const actual = screens.map((screen) => screen.key).join(",");
    if (actual !== STEP_KEYS.join(",")) {
      console.error("[invite] STEP_KEYS out of sync with screens:", actual);
    }
  }, [screens]);

  if (exit) {
    return (
      <Shell>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-sage">A straight answer</p>
        <h1 className="mt-4 text-balance text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] text-ink md:text-[42px]">
          {exit.title}
        </h1>
        <div className="mt-6 text-[16px] leading-relaxed text-ink-soft">{exit.body}</div>
        <a href="/" className="mt-9 inline-flex items-center text-[15px] font-semibold text-ink underline underline-offset-4">
          Back to Steady
        </a>
      </Shell>
    );
  }

  if (done) {
    return (
      <Shell>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-sage">Application received</p>
        <h1 className="mt-4 text-balance text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] text-ink md:text-[42px]">
          Thank you, {name.trim() || "friend"} — that’s with us
        </h1>
        <p className="mt-6 text-[16px] leading-relaxed text-ink-soft">
          Every application is read by a person, not a filter. If there’s a place in this first group
          you’ll get an email with your invitation and exactly what to expect. If not, we’ll keep you
          first in line for the next one.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          If things are hard before then and you need someone today: {CRISIS_LINE}.
        </p>
        <a href="/" className="mt-9 inline-flex items-center text-[15px] font-semibold text-ink underline underline-offset-4">
          Back to Steady
        </a>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex items-center gap-4">
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            aria-label="Previous question"
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink transition hover:bg-cream-2"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <div className="flex flex-1 items-center gap-1.5" aria-hidden>
          {screens.map((screen, index) => (
            <span
              key={screen.key}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === step ? "w-7 bg-sage" : index < step ? "w-4 bg-sage/40" : "w-4 bg-line"
              }`}
            />
          ))}
        </div>
      </div>

      <div
        key={current.key}
        ref={liveRef}
        tabIndex={-1}
        className={`mt-12 outline-none ${direction === 1 ? "step-in" : "step-in-back"}`}
      >
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-sage">{current.kicker}</p>
        <h1 className="mt-4 text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] text-ink md:text-[42px]">
          {current.title}
        </h1>
        {current.sub && <p className="mt-4 max-w-[520px] text-[16px] leading-relaxed text-ink-soft">{current.sub}</p>}
        {current.body}
      </div>

      <style>{`
        .step-in { animation: stepIn .42s cubic-bezier(.23,1,.32,1) both; }
        .step-in-back { animation: stepInBack .42s cubic-bezier(.23,1,.32,1) both; }
        @keyframes stepIn { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
        @keyframes stepInBack { from { opacity: 0; transform: translateY(-10px) } to { opacity: 1; transform: none } }
        @media (prefers-reduced-motion: reduce) {
          .step-in, .step-in-back { animation: none }
        }
      `}</style>
    </Shell>
  );
}

/* ---------- small pieces ---------- */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-[78vh] max-w-[680px] px-5 pb-28 pt-32 md:pt-40">{children}</main>
  );
}

function Options({
  options,
  selected,
  onPick,
  multi = false,
}: {
  options: string[];
  selected: string[];
  onPick: (value: string) => void;
  multi?: boolean;
}) {
  return (
    <div className="mt-8 space-y-3" role={multi ? "group" : "radiogroup"}>
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={active}
            onClick={() => onPick(option)}
            className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-6 py-4 text-left text-[16px] transition duration-200 ${
              active
                ? "border-sage bg-sage/10 font-semibold text-ink shadow-[0_10px_30px_-18px_rgba(62,122,94,.6)]"
                : "border-line bg-white text-ink hover:border-ink/20 hover:bg-cream-2"
            }`}
          >
            <span>{option}</span>
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition ${
                active ? "border-sage bg-sage text-white" : "border-line"
              }`}
            >
              {active && (
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Continue({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-dark mt-9 inline-flex items-center rounded-full px-7 py-3.5 text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-40"
    >
      Continue
    </button>
  );
}

function TextStep({
  value, onChange, onEnter, placeholder, type = "text", autoComplete, valid,
}: {
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  valid: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <>
      <input
        ref={ref}
        value={value}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && valid) { event.preventDefault(); onEnter(); }
        }}
        className="mt-8 w-full border-0 border-b border-line bg-transparent px-1 pb-3 text-[26px] text-ink outline-none transition placeholder:text-ink-soft/40 focus:border-sage md:text-[32px]"
      />
      <Continue onClick={onEnter} disabled={!valid} />
    </>
  );
}
