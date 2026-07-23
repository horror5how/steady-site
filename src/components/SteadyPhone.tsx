/* Voice-AI phone — Gleb Kuznetsov-style animation, Steady edition.
   Pure CSS 16s loop: spoken words → listening wave → thinking sparkles → loop-map cards. */

const LOOP_CARDS: [string, string][] = [
  ["Trigger", "sent that email"],
  ["Thought", "“what if it was wrong?”"],
  ["Habit", "re-reading the sent folder"],
  ["Back to now", "60 seconds of ground"],
];

export default function SteadyPhone() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* mist behind the phone */}
      <div aria-hidden className="absolute -left-28 bottom-8 h-44 w-60 rounded-full bg-[#ccd3d9]/50 blur-3xl" />
      <div aria-hidden className="absolute -right-28 bottom-16 h-48 w-64 rounded-full bg-[#d7dde1]/60 blur-3xl" />

      {/* phone body */}
      <div className="relative rounded-[2.8rem] border border-white bg-gradient-to-b from-white to-[#eceef0] p-2 shadow-[0_40px_90px_-30px_rgba(35,40,44,0.35)]">
        <div className="relative h-[560px] overflow-hidden rounded-[2.3rem] bg-gradient-to-b from-[#fbfcfc] to-[#eef0f2]">
          {/* notch */}
          <div className="absolute left-1/2 top-2.5 z-10 h-[16px] w-[86px] -translate-x-1/2 rounded-full bg-[#dfe3e6]" />

          {/* phase 1 — spoken words appear as you talk */}
          <div className="absolute inset-x-6 top-[150px] text-center">
            <p className="ph-t1 text-[15.5px] font-medium leading-relaxed text-ink/45">Steady, my head</p>
            <p className="ph-t2 text-[15.5px] font-semibold leading-relaxed text-ink">won&apos;t stop looping.</p>
            <p className="ph-status mt-4 text-[11.5px] text-ink/40">Steady is listening&hellip;</p>
          </div>

          {/* phase 2 — thinking sparkles */}
          <div aria-hidden className="absolute inset-x-0 top-[170px] h-[140px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="ph-spark absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_3px_rgba(185,194,201,0.9)]"
                style={{ left: `${24 + i * 7}%`, top: `${(i % 4) * 30}px`, animationDelay: `${i * 0.22}s` }}
              />
            ))}
          </div>

          {/* phase 3 — the loop, mapped */}
          <p className="ph-title absolute inset-x-0 top-[58px] text-center text-[13px] font-semibold tracking-wide text-ink">
            Your loop, mapped
          </p>
          <div className="absolute inset-x-5 top-[92px] space-y-2.5">
            {LOOP_CARDS.map(([k, v], i) => (
              <div
                key={k}
                className="ph-card rounded-xl border border-white/80 bg-white/90 px-3.5 py-2.5 shadow-[0_10px_24px_-14px_rgba(35,40,44,0.35)]"
                style={{ animationDelay: `${i * 0.55}s` }}
              >
                <p className="text-[10.5px] font-semibold uppercase tracking-wider text-ink/40">{k}</p>
                <p className="mt-0.5 text-[12.5px] font-medium text-ink">{v}</p>
              </div>
            ))}
          </div>

          {/* the delicate voice wave */}
          <div className="ph-amp absolute inset-x-0 bottom-[64px]" aria-hidden>
            <div className="overflow-hidden">
              <svg viewBox="0 0 300 26" className="w-full" fill="none">
                <path
                  className="ph-wavepath"
                  d="M0 13 C 25 4, 50 22, 75 13 S 125 4, 150 13 S 200 22, 225 13 S 275 4, 300 13 S 350 22, 375 13 S 425 4, 450 13 S 500 22, 525 13 S 575 4, 600 13"
                  stroke="#9aa4ab"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* home bar */}
          <div className="absolute bottom-2.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-ink/15" />
        </div>
      </div>
    </div>
  );
}
