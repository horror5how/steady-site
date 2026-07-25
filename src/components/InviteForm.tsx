"use client";

import { useState } from "react";

const APP = "https://steady-erp-voice-fresh.vercel.app";
const TERMS = `${APP}/legal/terms.html`;
const PRIVACY = `${APP}/legal/privacy.html`;

const STATES = [
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

const field =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition focus:border-ink/25";
const label = "block text-[13.5px] font-semibold text-ink";

export default function InviteForm() {
  const [state, setState] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSending(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          city: data.get("city"),
          state: data.get("state"),
          about: data.get("about"),
          agreed,
        }),
      });
      const result = await response.json().catch(() => ({ ok: false, error: "Something went wrong." }));
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
  }

  if (done) {
    return (
      <div className="mt-10 rounded-2xl border border-sage/25 bg-sage/5 p-6">
        <h2 className="text-[20px] font-semibold text-ink">Thank you — that&rsquo;s with us.</h2>
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
          We read every application ourselves. If there is a place in this group you will get an
          email with your invitation and what to expect. If not, we will keep you on the list for
          the next one.
        </p>
        <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
          If things are hard right now and you need someone today: call or text{" "}
          <strong className="text-ink">988</strong> (Suicide &amp; Crisis Lifeline), or text HOME to{" "}
          <strong className="text-ink">741741</strong>. In an emergency, call 911.
        </p>
      </div>
    );
  }

  const blockedPick = state === "IL" || state === "NV" || state === "WA";

  return (
    <form onSubmit={submit} className="mt-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">First name</label>
          <input id="name" name="name" required maxLength={80} autoComplete="given-name" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required maxLength={160} autoComplete="email" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="city">City <span className="font-normal text-ink-soft">(optional)</span></label>
          <input id="city" name="city" maxLength={80} autoComplete="address-level2" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="state">State</label>
          <select
            id="state"
            name="state"
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={field}
          >
            <option value="">Choose your state</option>
            {STATES.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {blockedPick && (
        <div className="mt-5 rounded-xl border border-peach-deep/30 bg-peach/10 p-4 text-[14px] leading-relaxed text-ink">
          We can&rsquo;t take applications from Illinois, Nevada or Washington yet. The law in those
          states requires a licensed clinician to oversee AI-guided mental-health practice, and we
          don&rsquo;t have one on the team yet. We&rsquo;d rather tell you straight than bend it.
          When that changes, we&rsquo;ll open up — meanwhile the{" "}
          <a className="underline" href="https://iocdf.org/find-help/" target="_blank" rel="noreferrer">
            IOCDF directory
          </a>{" "}
          is the best place to find an ERP-trained therapist near you.
        </div>
      )}

      <div className="mt-5">
        <label className={label} htmlFor="about">
          Anything you&rsquo;d like us to know? <span className="font-normal text-ink-soft">(optional)</span>
        </label>
        <textarea id="about" name="about" rows={4} maxLength={1200} className={field} />
        <p className="mt-1.5 text-[12.5px] text-ink-soft">
          Only share what you&rsquo;re comfortable putting in writing. This is stored encrypted and
          read only by us.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-cream-2/60 p-5">
        <p className="text-[13.5px] font-semibold text-ink">Before you tick, the honest version:</p>
        <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-ink-soft">
          <li>
            Steady is an <strong className="text-ink">early research trial</strong>, not a finished
            product. It is not therapy, not medical care, not a diagnosis, and not an emergency
            service. It does not treat any condition.
          </li>
          <li>I am <strong className="text-ink">18 or over</strong>, and I won&rsquo;t pass my invitation on to anyone under 18.</li>
          <li>
            I&rsquo;m taking part <strong className="text-ink">voluntarily</strong>. It may not help
            me, it may get things wrong, and I won&rsquo;t rely on it in a crisis. If I&rsquo;m in
            crisis I&rsquo;ll call or text 988, or 911 in an emergency.
          </li>
          <li>
            Steady <strong className="text-ink">stores what I tell it</strong>, including things
            about my mental health, and my voice is processed by OpenAI to power the conversation. I
            can delete everything at any time.
          </li>
          <li>
            I agree to the{" "}
            <a className="underline" href={TERMS} target="_blank" rel="noreferrer">Terms of Use</a>{" "}
            and{" "}
            <a className="underline" href={PRIVACY} target="_blank" rel="noreferrer">Privacy Policy</a>,
            including the arbitration agreement, class-action waiver and limit of liability in the
            Terms.
          </li>
        </ul>
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-[14.5px] font-medium text-ink">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#3e7a5e]"
          />
          <span>I&rsquo;ve read the five points above and I agree to take part on those terms.</span>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-peach-deep/30 bg-peach/10 p-4 text-[14px] leading-relaxed text-ink">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending || !agreed || blockedPick}
        className="btn-dark mt-7 inline-flex items-center rounded-full px-6 py-3 text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {sending ? "Sending…" : "Apply for an invitation"}
      </button>
      <p className="mt-3 text-[12.5px] text-ink-soft">
        Free · no card · adults 18+ · we don&rsquo;t sell or share your data
      </p>
    </form>
  );
}
