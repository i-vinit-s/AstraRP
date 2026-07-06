"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, ScrollText } from "lucide-react";

import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Apply | Astra Roleplay",
};

export default function ApplyPage() {
  return (
    <main className="relative overflow-hidden bg-[#090909] text-white">
      {/* Background Grid */}

      <div
        className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-size-[60px_60px]"
      />

      {/* Glow */}

      <div className="absolute left-1/2 top-55 h-162.5 w-162.5 -translate-x-1/2 rounded-full bg-[#8c1218]/20 blur-[180px]" />

      <div className="absolute -left-32 top-32 h-105 w-105 rounded-full bg-[#8c1218]/10 blur-[150px]" />

      <div className="absolute -right-32 bottom-0 h-112.5 w-112.5 rounded-full bg-[#8c1218]/10 blur-[170px]" />

      {/* Decorative Rings */}

      <div className="absolute left-1/2 top-45 -translate-x-1/2">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
          className="h-162.5 w-162.5 rounded-full border border-white/4"
        />

        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-10 rounded-full border border-[#8c1218]/10"
        />
      </div>

      {/* HERO */}

      <section className="relative flex min-h-screen items-center">
        <Container>
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="mx-auto max-w-5xl pt-32 pb-20 text-center"
          >
            {/* Badge */}

            <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-5 py-2 text-xs uppercase tracking-[0.35em] text-[#d65b5b]">
              Whitelist Applications Open
            </span>

            {/* Heading */}

            <h1 className="mt-10 text-7xl font-black uppercase leading-[0.88] tracking-[-0.04em] sm:text-8xl lg:text-[8rem] xl:text-[9rem]">
              WHITELIST
              <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
                APPLICATION
              </span>
            </h1>

            {/* Description */}

            <p className="mx-auto mt-10 max-w-3xl text-xl leading-9 text-zinc-400">
              Every player begins their journey here. Complete our whitelist
              application and become part of a realistic, immersive and
              community-driven FiveM roleplay experience powered by OP
              Framework.
            </p>

            {/* Buttons */}

            <div className="mt-14 flex flex-wrap justify-center gap-5">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-xl bg-[#8c1218] px-8 hover:bg-[#a41717]"
              >
                <Link href="/apply/form">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 rounded-xl border-white/10 bg-white/3 px-8 text-white hover:border-[#8c1218] hover:bg-[#8c1218]/10"
              >
                <Link href="/rules">
                  <ScrollText className="mr-2 h-5 w-5" />
                  Read Rules
                </Link>
              </Button>
            </div>

            {/* Small Notice */}

            <div className="mx-auto mt-16 flex max-w-xl items-start gap-4 rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
              <div className="rounded-xl bg-[#8c1218]/10 p-3">
                <ShieldCheck className="h-6 w-6 text-[#8c1218]" />
              </div>

              <div className="text-left">
                <h3 className="font-semibold">Before you apply</h3>

                <p className="mt-2 text-sm leading-7 text-zinc-400">
                  Please ensure you&apos;ve read our server rules carefully.
                  Applications with low effort or rule violations will
                  automatically be rejected.
                </p>
              </div>
            </div>

            {/* Scroll */}

            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="mt-20 flex justify-center"
            >
              <div className="flex h-12 w-7 justify-center rounded-full border border-white/15">
                <div className="mt-2 h-2 w-2 rounded-full bg-[#8c1218]" />
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* WHY WHITELIST */}

      <section className="relative overflow-hidden py-28">
        <div className="absolute right-0 top-1/2 -z-10 h-125 w-125 -translate-y-1/2 rounded-full bg-[#8c1218]/10 blur-[180px]" />

        <Container>
          <div className="mb-20 text-center">
            <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-5 py-2 text-xs uppercase tracking-[0.35em] text-[#d65b5b]">
              Why Astra
            </span>

            <h2 className="mt-8 text-5xl font-black uppercase leading-none tracking-tight lg:text-6xl">
              Why Join
              <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
                Astra Roleplay
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
              Our whitelist exists to ensure every player contributes to a
              mature, immersive and enjoyable roleplay experience.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                number: "01",
                title: "Serious Roleplay",
                description:
                  "We value realistic storytelling over grinding. Every action has consequences.",
              },
              {
                number: "02",
                title: "Active Staff",
                description:
                  "Our experienced staff continuously improve gameplay and ensure fair moderation.",
              },
              {
                number: "03",
                title: "Custom Experience",
                description:
                  "Built on OP Framework with custom jobs, businesses, systems and unique mechanics.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/3 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#8c1218]/40"
              >
                <div className="absolute inset-0 bg-linear-to-br from-[#8c1218]/0 via-[#8c1218]/5 to-[#8c1218]/10 opacity-0 transition duration-500 group-hover:opacity-100" />

                <span className="absolute right-6 top-6 text-5xl font-black text-white/5">
                  {item.number}
                </span>

                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#8c1218]/20 bg-[#8c1218]/10">
                  <span className="text-xl font-bold text-[#8c1218]">
                    {item.number}
                  </span>
                </div>

                <h3 className="relative mt-8 text-2xl font-bold uppercase">
                  {item.title}
                </h3>

                <p className="relative mt-5 leading-8 text-zinc-400">
                  {item.description}
                </p>

                <div className="mt-10 h-px w-16 bg-linear-to-r from-[#8c1218] to-transparent transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* APPLICATION PROCESS */}

      <section className="relative py-32">
        <Container>
          <div className="text-center">
            <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-5 py-2 text-xs uppercase tracking-[0.35em] text-[#d65b5b]">
              Process
            </span>

            <h2 className="mt-8 text-5xl font-black uppercase leading-none tracking-tight lg:text-6xl">
              Application
              <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
                Journey
              </span>
            </h2>
          </div>

          <div className="relative mx-auto mt-24 max-w-6xl">
            <div className="absolute left-0 top-10 hidden h-px w-full bg-linear-to-r from-transparent via-[#8c1218]/30 to-transparent lg:block" />

            <div className="grid gap-10 lg:grid-cols-5">
              {[
                {
                  step: "01",
                  title: "Join Discord",
                  description:
                    "Become a member of our official Discord community.",
                },
                {
                  step: "02",
                  title: "Read Rules",
                  description:
                    "Understand our roleplay standards and expectations.",
                },
                {
                  step: "03",
                  title: "Submit Application",
                  description:
                    "Answer every question honestly and with effort.",
                },
                {
                  step: "04",
                  title: "Staff Review",
                  description: "Our team carefully reviews every application.",
                },
                {
                  step: "05",
                  title: "Start Playing",
                  description: "Once accepted, connect and begin your journey.",
                },
              ].map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#8c1218]/30 bg-[#111111] text-2xl font-bold text-[#8c1218]">
                    {item.step}
                  </div>

                  <h3 className="mt-8 text-xl font-bold uppercase">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-zinc-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* REQUIREMENTS */}

      <section className="relative pb-32">
        <Container>
          <div className="mb-20 text-center">
            <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-5 py-2 text-xs uppercase tracking-[0.35em] text-[#d65b5b]">
              Requirements
            </span>

            <h2 className="mt-8 text-5xl font-black uppercase leading-none tracking-tight lg:text-6xl">
              Before
              <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
                Applying
              </span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Must have a Discord account",
              "Read the server rules carefully",
              "Working microphone required",
              "Respect roleplay at all times",
              "Low effort applications are rejected",
              "Patience during the review process",
            ].map((requirement) => (
              <div
                key={requirement}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8c1218]/10">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#8c1218]" />
                </div>

                <p className="text-zinc-300">{requirement}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}

      <section className="relative py-28">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-5 py-2 text-xs uppercase tracking-[0.35em] text-[#d65b5b]">
                FAQ
              </span>

              <h2 className="mt-8 text-5xl font-black uppercase leading-none tracking-tight lg:text-6xl">
                Frequently Asked
                <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
                  Questions
                </span>
              </h2>

              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
                Everything you need to know before submitting your whitelist
                application.
              </p>
            </div>

            <div className="mt-20 space-y-5">
              {[
                {
                  question: "How long does the review take?",
                  answer:
                    "Most applications are reviewed within 24 to 72 hours depending on staff availability.",
                },
                {
                  question: "Can I edit my application later?",
                  answer:
                    "No. Please review every answer carefully before submitting your application.",
                },
                {
                  question: "What happens if I'm rejected?",
                  answer:
                    "You may reapply after the cooldown period mentioned in our Discord server.",
                },
                {
                  question: "Do I need previous RP experience?",
                  answer:
                    "No. We welcome both experienced and new roleplayers who are willing to learn.",
                },
              ].map((item) => (
                <details
                  key={item.question}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl"
                >
                  <summary className="cursor-pointer list-none px-8 py-6 text-lg font-semibold transition hover:bg-white/5">
                    {item.question}
                  </summary>

                  <div className="border-t border-white/10 px-8 py-6 text-zinc-400 leading-8">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FINAL CTA */}

      <section className="relative pb-32">
        <Container>
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-linear-to-br from-[#111111] via-[#141414] to-[#1b0d0d] px-8 py-20 text-center shadow-[0_30px_80px_rgba(0,0,0,.45)] lg:px-20">
            {/* Background */}

            <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full border border-[#8c1218]/10" />

            <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#8c1218]/10 blur-[120px]" />

            <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-5 py-2 text-xs uppercase tracking-[0.35em] text-[#d65b5b]">
              Ready?
            </span>

            <h2 className="mt-8 text-5xl font-black uppercase leading-none tracking-tight lg:text-6xl">
              Start Your
              <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
                Astra Journey
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
              Your next story begins here. Join hundreds of players building a
              living, breathing roleplay world together.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-xl bg-[#8c1218] px-8 hover:bg-[#a41717]"
              >
                <Link href="/apply/form">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 rounded-xl border-white/10 bg-white/3 px-8 text-white hover:border-[#8c1218] hover:bg-[#8c1218]/10"
              >
                <Link href="/rules">Read Rules</Link>
              </Button>
            </div>

            <div className="mt-14 flex flex-wrap justify-center gap-10 text-sm text-zinc-500">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Fair Review Process
              </div>

              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Active Staff Team
              </div>

              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Immersive Roleplay
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
