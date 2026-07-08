import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cta from "@/components/Cta";
import { posts, getPost } from "@/lib/posts";
import { ArrowRight } from "@/components/icons";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} | Steady Blog`,
    description: post.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* warm header band */}
        <section className="hero-grad relative overflow-hidden">
          <div className="relative z-10 mx-auto max-w-[840px] px-5 pb-12 pt-36 md:pb-14 md:pt-44">
            <p className="rise rise-1 text-[13px] font-semibold uppercase tracking-[0.18em] text-sage">
              {post.tag}
            </p>
            <h1 className="rise rise-2 mt-4 text-balance text-[34px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink md:text-[46px]">
              {post.title}
            </h1>
            <p className="rise rise-3 mt-5 text-[14px] text-ink-soft">
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              · {post.readMin} min read · The Steady team
            </p>
          </div>
        </section>

        <article className="bg-cream">
          <div
            className="prose-steady mx-auto max-w-[760px] px-5 py-14 md:py-16"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {/* read next */}
          <div className="mx-auto max-w-[760px] px-5 pb-20">
            <div className="border-t border-line pt-10">
              <h2 className="text-[15px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                Read next
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {others.map((o) => (
                  <a
                    key={o.slug}
                    href={`/blog/${o.slug}`}
                    className="group rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-25px_rgba(63,79,66,0.3)]"
                  >
                    <h3 className="text-[16.5px] font-semibold leading-snug text-ink">
                      {o.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-[13.5px] font-semibold text-sage transition group-hover:gap-2">
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>

        <Cta />
      </main>
      <Footer />
    </>
  );
}
