export default function PageHero({
  kicker,
  title,
  sub,
  photo,
  photoAlt,
}: {
  kicker: string;
  title: React.ReactNode;
  sub?: string;
  photo?: string;
  photoAlt?: string;
}) {
  return (
    <section className="hero-grad relative overflow-hidden">
      <div
        className={`relative z-10 mx-auto max-w-[1200px] px-5 pb-14 pt-36 md:pb-20 md:pt-44 ${
          photo ? "grid items-center gap-10 md:grid-cols-[1.2fr_1fr]" : "text-center"
        }`}
      >
        <div className={photo ? "max-w-[560px]" : ""}>
          <p className="rise rise-1 text-[13px] font-semibold uppercase tracking-[0.18em] text-sage">
            {kicker}
          </p>
          <h1
            className={`rise rise-2 mt-4 text-balance text-[38px] font-semibold leading-[1.06] tracking-[-0.02em] text-ink md:text-[52px] ${
              photo ? "" : "mx-auto max-w-[860px]"
            }`}
          >
            {title}
          </h1>
          {sub && (
            <p
              className={`rise rise-3 mt-5 text-balance text-[17px] leading-relaxed text-ink-soft ${
                photo ? "max-w-[480px]" : "mx-auto max-w-[620px]"
              }`}
            >
              {sub}
            </p>
          )}
        </div>
        {photo && (
          <div className="photo-card tilt-r rise rise-3 relative hidden aspect-[4/3] md:block">
            <img src={photo} alt={photoAlt ?? ""} />
          </div>
        )}
      </div>
    </section>
  );
}
