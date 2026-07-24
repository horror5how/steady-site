"use client";

// Wireframe auth pages for beingsteady.com/login + /signup.
// Themed to match the site (editorial cream/ink/sage tokens, btn-dark, site cards).
// ponytail: no real auth yet — every path just lands on /dashboard.
// The "Bypass (I'm a developer)" button is TEMPORARY, remove once real auth lands.

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";

const copy = {
  login: {
    title: "Welcome back",
    sub: "Sign in to pick up where you left off.",
    submit: "Log in",
    alt: "New here?",
    altHref: "/signup",
    altLabel: "Create an account",
  },
  signup: {
    title: "Try Steady",
    sub: "Create your account and start talking to Steady.",
    submit: "Create account",
    alt: "Already have an account?",
    altHref: "/login",
    altLabel: "Log in",
  },
} as const;

const inputCls =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition focus:border-sage focus:ring-2 focus:ring-sage-soft";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const c = copy[mode];
  const [busy, setBusy] = useState(false);

  // No backend yet — swallow the submit and go straight to the dashboard.
  function go(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    router.push("/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-5 py-16 sm:py-24">
      <div className="w-full max-w-[420px] rounded-3xl border border-black/5 bg-white p-8 shadow-[0_24px_60px_-30px_rgba(35,40,44,0.35)] sm:p-10">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-ink">{c.title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{c.sub}</p>

        <form onSubmit={go} className="mt-8 flex flex-col gap-4">
          {mode === "signup" && (
            <label className="text-[13px] font-medium text-ink-soft">
              Name
              <input type="text" autoComplete="name" placeholder="Your name" className={inputCls} />
            </label>
          )}
          <label className="text-[13px] font-medium text-ink-soft">
            Email
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputCls}
            />
          </label>
          <label className="text-[13px] font-medium text-ink-soft">
            Password
            <input
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="••••••••"
              className={inputCls}
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="btn-dark mt-2 inline-flex items-center justify-center px-6 py-3 text-[15px] font-semibold disabled:opacity-60"
          >
            {c.submit}
          </button>
        </form>

        {/* TEMPORARY developer shortcut — remove when real auth ships. */}
        <button
          type="button"
          onClick={() => go()}
          className="mt-3 w-full rounded-full border border-dashed border-line px-6 py-3 text-[14px] font-medium text-ink-soft transition hover:border-haze hover:text-ink"
        >
          Bypass (I&apos;m a developer)
        </button>

        <p className="mt-8 text-center text-[14px] text-ink-soft">
          {c.alt}{" "}
          <a href={c.altHref} className="font-semibold text-ink hover:underline">
            {c.altLabel}
          </a>
        </p>
      </div>
    </main>
  );
}
