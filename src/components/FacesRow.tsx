import Reveal from "./Reveal";

const faces = [
  { src: "/photos/warm-portrait.jpg", alt: "A woman with a warm smile", tilt: "tilt-l" },
  { src: "/photos/man-portrait-hope.jpg", alt: "A young man with a hopeful smile", tilt: "" },
  { src: "/photos/older-man-hope.jpg", alt: "An older man with kind eyes", tilt: "tilt-r" },
  { src: "/photos/woman-laugh-portrait.jpg", alt: "A woman laughing freely", tilt: "tilt-l" },
];

export default function FacesRow() {
  return (
    <section className="bg-cream-2/70">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-20">
        <Reveal>
          <h2 className="text-center text-[30px] font-semibold tracking-[-0.02em] text-ink md:text-[38px]">
            Made for minds like yours
          </h2>
          <p className="mx-auto mt-3 max-w-[460px] text-center text-[15.5px] text-ink-soft">
            Overthinkers. Checkers. Replayers. The kindest, most careful people you know —
            that&rsquo;s who loops pick on.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {faces.map((f, i) => (
            <Reveal key={f.src} delay={i * 70}>
              <div className={`photo-card ${f.tilt} transition duration-300 hover:rotate-0`}>
                <div className="relative aspect-[3/3.6]">
                  <img src={f.src} alt={f.alt} loading="lazy" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
