import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Cta from "@/components/Cta";
import { posts } from "@/lib/posts";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "The Steady Blog: Plain-Language Writing on OCD, Rumination & ERP",
  description:
    "No jargon, no fear-mongering. Honest, warm writing about looping thoughts, compulsions, and the practice that actually changes them.",
};

const covers: Record<string, string> = {
  "why-reassurance-makes-it-worse": "/photos/night-loop.jpg",
  "what-is-rumination": "/photos/kitchen-mapping.jpg",
  "erp-explained-simply": "/photos/calm-breath.jpg",
  "voice-ai-exposure-therapy": "/photos/man-walk-talking.jpg",
  "build-an-exposure-hierarchy": "/photos/sunrise-exhale.jpg",
};

export default function Blog() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHero
          kicker="The Steady blog"
          title={
            <>
              Warm words for{" "}
              <br className="hidden sm:block" />
              busy minds
            </>
          }
          sub="What rumination actually is, why reassurance backfires, and how gentle practice works. Written straight, with love, zero jargon."
        />

        <section className="bg-cream">
          <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-20">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 60}>
                  <a
                    href={`/blog/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(63,79,66,0.35)]"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={covers[p.slug] ?? "/photos/warm-portrait.jpg"}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                      <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-[12px] font-semibold text-ink">
                        {p.tag}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="text-[20px] font-semibold leading-snug tracking-[-0.01em] text-ink">
                        {p.title}
                      </h2>
                      <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-soft">
                        {p.description}
                      </p>
                      <div className="mt-5 flex items-center justify-between text-[13px] text-ink/45">
                        <span>
                          {new Date(p.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · {p.readMin} min read
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-sage transition group-hover:gap-2">
                          Read <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Cta />
      </main>
      <Footer />
    </>
  );
}
