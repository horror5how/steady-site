const loops = [
  "“Did I lock it?”",
  "“What if I hurt someone?”",
  "“Am I sure? Really sure?”",
  "The 2am replay",
  "“What kind of person thinks that?”",
  "One more check",
  "One more Google",
  "“Just tell me it's fine”",
  "The conversation autopsy",
  "“It has to feel right”",
];

export default function LogoBar() {
  return (
    <section className="bg-cream-2/60">
      <div className="mx-auto max-w-[1200px] px-5 py-12">
        <p className="mb-8 text-center text-[13px] font-medium uppercase tracking-[0.16em] text-ink/40">
          Sound familiar? You&rsquo;re in exactly the right place.
        </p>
        <div className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="marquee-track items-center gap-x-14">
            {[...loops, ...loops, ...loops].map((name, i) => (
              <span
                key={i}
                className="shrink-0 text-[21px] font-semibold tracking-tight text-ink/30 transition hover:text-sage/70"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
