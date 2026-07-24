import Reveal from "./Reveal";

const moments = [
  {
    photo: "/photos/night-loop.jpg",
    alt: "Someone awake at night with a busy mind",
    time: "2:14 AM",
    caption: "The loop doesn't care what time it is.",
    note: "“Did I say the wrong thing? Let me just go over it once more…”",
    tilt: "tilt-l",
  },
  {
    photo: "/photos/man-walk-talking.jpg",
    alt: "A man talking to Steady on a sunny walk",
    time: "The next morning",
    caption: "So you talk to Steady. Anywhere. Out loud.",
    note: "“Okay, it's here again. Can we do a short practice?”",
    tilt: "",
  },
  {
    photo: "/photos/man-portrait-hope.jpg",
    alt: "A young man with a quiet, hopeful smile",
    time: "A few weeks in",
    caption: "And one day you notice: it let go first.",
    note: "“The thought showed up… and I just carried on with my day.”",
    tilt: "tilt-r",
  },
];

export default function Moments() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:py-24">
        <Reveal>
          <h2 className="text-center text-[36px] font-bold leading-[0.97] tracking-[-0.035em] text-ink md:text-[48px]">
            You&rsquo;re not broken. You&rsquo;re looping.
            <span className="text-sage"> And loops can unlearn.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[540px] text-center text-[16px] text-ink-soft">
            Millions of normal, caring people get stuck checking, replaying, and asking
            &ldquo;am I sure?&rdquo; Here&rsquo;s what change looks like.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {moments.map((m, i) => (
            <Reveal key={m.time} delay={i * 90}>
              <div className={`${m.tilt} transition duration-300 hover:rotate-0`}>
                <div className="photo-card relative aspect-[4/4.4]">
                  <img src={m.photo} alt={m.alt} loading="lazy" />
                  <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-[12px] font-semibold text-ink">
                    {m.time}
                  </span>
                </div>
                <div className="px-2 pt-5">
                  <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-ink">
                    {m.caption}
                  </h3>
                  <p className="mt-2 text-[14.5px] italic leading-relaxed text-ink-soft">
                    {m.note}
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
