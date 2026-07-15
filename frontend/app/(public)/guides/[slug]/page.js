import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

import Container from "@/components/common/Container";
import guides from "@/data/guides";

export async function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export default async function GuidePage({ params }) {
  const { slug } = await params;

  const guide = guides.find((item) => item.slug === slug);

  if (!guide) {
    notFound();
  }

  const currentIndex = guides.findIndex((item) => item.slug === slug);

  const previousGuide = currentIndex > 0 ? guides[currentIndex - 1] : null;

  const nextGuide =
    currentIndex < guides.length - 1 ? guides[currentIndex + 1] : null;

  const Icon = guide.icon;

  return (
    <section className="relative overflow-hidden bg-[#090909] py-20">
      {/* Background */}

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="absolute left-1/2 top-0 -z-10 h-112.5 w-112.5 -translate-x-1/2 rounded-full bg-[#8c1218]/15 blur-[180px]" />

      <Container>
        {/* Breadcrumb */}

        <div className="mb-10 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <Link href="/guides" className="transition hover:text-white">
            Player Guide
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="text-white">{guide.title}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-white/10 bg-[#111111]/70 p-6 backdrop-blur">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#8c1218]/10">
                <Icon className="h-8 w-8 text-[#d13a3f]" />
              </div>

              <h1 className="mt-6 text-3xl font-black">{guide.title}</h1>

              <p className="mt-4 leading-7 text-zinc-400">
                {guide.description}
              </p>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                  Guides
                </p>

                <nav className="space-y-2">
                  {guides.map((item) => {
                    const ActiveIcon = item.icon;

                    return (
                      <Link
                        key={item.slug}
                        href={`/guides/${item.slug}`}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                          item.slug === guide.slug
                            ? "border border-[#8c1218]/30 bg-[#8c1218]/10 text-white"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <ActiveIcon className="h-5 w-5" />

                        {item.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Content */}

          <div className="space-y-8">
            {guide.sections.map((section) => (
              <div
                key={section.title}
                className="rounded-3xl border border-white/10 bg-[#111111]/70 p-8 backdrop-blur"
              >
                <h2 className="text-3xl font-bold">{section.title}</h2>

                <div className="mt-8 grid gap-4">
                  {section.items.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-[#8c1218]/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                      </div>

                      <p className="mt-3 leading-7 text-zinc-400">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Navigation */}

            <div className="grid gap-4 sm:grid-cols-2">
              {previousGuide ? (
                <Link
                  href={`/guides/${previousGuide.slug}`}
                  className="group rounded-3xl border border-white/10 bg-[#111111]/70 p-6 transition hover:border-[#8c1218]/30"
                >
                  <p className="flex items-center gap-2 text-sm text-zinc-500">
                    <ArrowLeft className="h-4 w-4" />
                    Previous Guide
                  </p>

                  <h3 className="mt-3 text-xl font-semibold">
                    {previousGuide.title}
                  </h3>
                </Link>
              ) : (
                <div />
              )}

              {nextGuide ? (
                <Link
                  href={`/guides/${nextGuide.slug}`}
                  className="group rounded-3xl border border-white/10 bg-[#111111]/70 p-6 text-right transition hover:border-[#8c1218]/30"
                >
                  <p className="flex items-center justify-end gap-2 text-sm text-zinc-500">
                    Next Guide
                    <ArrowRight className="h-4 w-4" />
                  </p>

                  <h3 className="mt-3 text-xl font-semibold">
                    {nextGuide.title}
                  </h3>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
