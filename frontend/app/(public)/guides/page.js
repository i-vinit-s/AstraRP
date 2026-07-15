import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Command,
  BriefcaseBusiness,
  UserRound,
} from "lucide-react";

import Container from "@/components/common/Container";

const guides = [
  {
    title: "Commands & Keybinds",
    description:
      "Learn every important command and keyboard shortcut used in Astra Roleplay.",
    icon: Command,
    href: "/guides/commands",
    color: "from-[#8c1218]/20 to-[#8c1218]/5",
  },
  // {
  //   title: "New Player Guide",
  //   description:
  //     "Everything you need to know before joining the server for the first time.",
  //   icon: UserRound,
  //   href: "/guides/new-player",
  //   color: "from-emerald-500/20 to-emerald-500/5",
  // },
  // {
  //   title: "Jobs Guide",
  //   description:
  //     "Explore legal and illegal jobs, careers and progression within Astra.",
  //   icon: BriefcaseBusiness,
  //   href: "/guides/jobs",
  //   color: "from-[#8c1218]/20 to-[#8c1218]/5",
  // },
];

export default function GuidesPage() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}

      <div className="absolute inset-0 -z-20 bg-[#090909]" />

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="absolute left-1/2 top-32 -z-10 h-125 w-125 -translate-x-1/2 rounded-full bg-[#8c1218]/15 blur-[180px]" />

      <Container>
        {/* Hero */}

        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#8c1218]/20 bg-[#8c1218]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#d13a3f]">
            <BookOpen size={15} />
            Player Guide
          </span>

          <h1 className="mt-8 text-5xl font-black uppercase leading-none tracking-[-0.04em] md:text-7xl">
            Learn Before
            <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
              You Roleplay
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
            Everything you need to get started inside Astra Roleplay. Learn the
            controls, understand server mechanics and begin your journey with
            confidence.
          </p>
        </div>

        {/* Cards */}

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {guides.map((guide) => {
            const Icon = guide.icon;

            return (
              <Link
                key={guide.title}
                href={guide.href}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111111]/80 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#8c1218]/40"
              >
                {/* Glow */}

                <div
                  className={`absolute inset-0 bg-linear-to-br ${guide.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                    <Icon className="h-8 w-8 text-[#d13a3f]" />
                  </div>

                  <h2 className="mt-8 text-2xl font-bold">{guide.title}</h2>

                  <p className="mt-4 leading-7 text-zinc-400">
                    {guide.description}
                  </p>

                  <div className="mt-8 flex items-center gap-2 font-medium text-[#d13a3f]">
                    Explore Guide
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}

        <div className="mt-20 rounded-3xl border border-white/10 bg-[#111111]/70 p-10 text-center">
          <h2 className="text-3xl font-bold">Ready to Join Astra?</h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-400">
            Once you&apos;ve gone through the guides, you&apos;re ready to submit your
            whitelist application and begin your journey.
          </p>

          <Link
            href="/applications"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-[#8c1218] px-8 font-semibold transition hover:bg-[#a41717]"
          >
            Apply Now
          </Link>
        </div>
      </Container>
    </section>
  );
}
