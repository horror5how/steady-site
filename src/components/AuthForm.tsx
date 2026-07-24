"use client";

// Wireframe auth pages for beingsteady.com/login + /signup.
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
    <main
      style={{ background: "#f6f3ea" }}
      className="grid min-h-[100dvh] place-items-center px-6 py-16"
    >
      <div className="w-full max-w-[400px]">
        <a href="/" className="wordmark text-[15px] text-ink">
          Steady
        </a>

        <h1 className="mt-8 text-[26px] font-semibold text-ink">{c.title}</h1>
        <p className="mt-2 text-[15px] text-ink-soft">{c.sub}</p>

        <form onSubmit={go} className="mt-8 flex flex-col gap-4">
          {mode === "signup" && (
            <label className="text-[13px] font-medium text-ink-soft">
              Name
              <input
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-sage"
              />
            </label>
          )}
          <label className="text-[13px] font-medium text-ink-soft">
            Email
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-sage"
            />
          </label>
          <label className="text-[13px] font-medium text-ink-soft">
            Password
            <input
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-sage"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-sage px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#336750] disabled:opacity-60"
          >
            {c.submit}
          </button>
        </form>

        {/* TEMPORARY developer shortcut — remove when real auth ships. */}
        <button
          type="button"
          onClick={() => go()}
          className="mt-3 w-full rounded-full border border-dashed border-ink/30 px-6 py-3 text-[14px] font-medium text-ink-soft transition hover:border-ink/50 hover:text-ink"
        >
          Bypass (I&apos;m a developer)
        </button>

        <p className="mt-8 text-center text-[14px] text-ink-soft">
          {c.alt}{" "}
          <a href={c.altHref} className="font-semibold text-sage hover:underline">
            {c.altLabel}
          </a>
        </p>
      </div>
    </main>
  );
}
