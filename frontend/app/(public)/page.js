"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle } from "lucide-react";
import Hero from "@/components/home/Hero";
import Container from "@/components/common/Container";

import siteConfig from "@/config/site";

export default function HomePage() {
  return (
    <main className="bg-[#0a0707] text-[#f2ede8] selection:bg-[#8c1218] selection:text-[#f2ede8]">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <Hero />
      {/* ── OUR STORY ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">
        {/* Background Glow */}

        <div className="absolute left-0 top-1/2 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-[#8c1218]/10 blur-[120px] md:h-125 md:w-125 md:blur-[180px]" />

        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_520px] lg:gap-20">
            {/* Left */}

            <div className="order-2 lg:order-1">
              <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-[#d65b5b] sm:px-5 sm:text-xs">
                Our Story
              </span>

              <h2 className="mt-6 text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:mt-8 lg:text-6xl">
                Built for
                <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
                  Serious Roleplay
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
                {siteConfig.description}
              </p>

              {/* Stats */}

              <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    2026
                  </h3>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:text-xs">
                    Founded
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    OPFW
                  </h3>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:text-xs">
                    Framework
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    24/7
                  </h3>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:text-xs">
                    Community
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}

            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* Glow */}

                <div className="absolute -inset-4 rounded-[30px] bg-[#8c1218]/15 blur-2xl sm:-inset-6 lg:-inset-8 lg:blur-3xl" />

                {/* Border */}

                <div className="absolute inset-0 rounded-[28px] border border-[#8c1218]/20 lg:rounded-[34px]" />

                {/* Image */}

                <div className="relative aspect-4/3 overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] lg:rounded-[34px]">
                  <Image
                    src="/about/AboutImage.png"
                    alt="Astra Roleplay"
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 520px"
                    className="object-cover transition duration-700 hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                </div>

                {/* Floating Card */}

                <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d0d0d]/90 p-5 backdrop-blur-xl lg:absolute lg:-bottom-8 lg:left-8 lg:mt-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8c1218]">
                    Astra RP
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    Craft your legacy.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── PILLARS ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
        {/* Background Glow */}

        <div className="absolute right-0 top-1/2 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-[#8c1218]/10 blur-[120px] md:h-125 md:w-125 md:blur-[180px]" />

        <Container>
          {/* Heading */}

          <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-16">
            <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-[#d65b5b] sm:px-5 sm:text-xs">
              Why Astra
            </span>

            <h2 className="mt-6 text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:mt-8 lg:text-6xl">
              What Makes
              <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
                Astra Different
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              Built from the ground up to deliver an immersive, realistic and
              community-driven roleplay experience.
            </p>
          </div>

          {/* Cards */}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {siteConfig.pillars.map(({ icon: Icon, title, copy }, index) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#8c1218]/40 sm:p-7 lg:p-8"
              >
                {/* Hover Glow */}

                <div className="absolute inset-0 bg-linear-to-br from-transparent via-[#8c1218]/5 to-[#8c1218]/10 opacity-0 transition duration-500 group-hover:opacity-100" />

                {/* Number */}

                <span className="absolute right-5 top-5 text-4xl font-black text-white/5 sm:text-5xl">
                  0{index + 1}
                </span>

                {/* Icon */}

                <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8c1218]/20 bg-[#8c1218]/10 transition duration-300 group-hover:scale-110 group-hover:border-[#8c1218]/40 sm:h-16 sm:w-16">
                  <Icon
                    className="h-7 w-7 text-[#8c1218] sm:h-8 sm:w-8"
                    strokeWidth={1.8}
                  />
                </div>

                {/* Title */}

                <h3 className="relative text-xl font-bold uppercase sm:text-2xl">
                  {title}
                </h3>

                {/* Description */}

                <p className="relative mt-4 text-sm leading-7 text-zinc-400 sm:mt-5 sm:text-base sm:leading-8">
                  {copy}
                </p>

                {/* Accent */}

                <div className="mt-8 h-px w-14 bg-linear-to-r from-[#8c1218] to-transparent transition-all duration-500 group-hover:w-full sm:mt-10 sm:w-16" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── JOIN PANEL (single server card) ─────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">
        {/* Background Glow */}

        <div className="absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8c1218]/15 blur-[120px] md:h-150 md:w-150 md:blur-[180px]" />

        <Container>
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-linear-to-br from-[#111111] via-[#141414] to-[#1b0d0d] px-6 py-14 text-center shadow-[0_30px_80px_rgba(0,0,0,.45)] sm:px-8 sm:py-16 lg:rounded-[36px] lg:px-20 lg:py-20">
            {/* Decorative */}

            <div className="absolute -right-24 -top-24 hidden h-60 w-60 rounded-full border border-[#8c1218]/10 lg:block" />

            <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-[#8c1218]/10 blur-[80px] sm:h-60 sm:w-60 sm:blur-[120px]" />

            {/* Badge */}

            <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-[#d65b5b] sm:px-5 sm:text-xs">
              Join Astra Roleplay
            </span>

            {/* Heading */}

            <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:mt-8 lg:text-6xl">
              Ready To Create
              <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
                Your Legacy?
              </span>
            </h2>

            {/* Description */}

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              Become part of a community where every decision matters, every
              story evolves naturally, and every player leaves their mark on
              Astra Roleplay.
            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-5">
              <Button
                asChild
                size="lg"
                className="h-14 w-full rounded-xl bg-[#8c1218] px-8 text-white transition hover:bg-[#a41717] sm:w-auto"
              >
                <a href={siteConfig.discordUrl}>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Join Discord
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 w-full rounded-xl border-white/10 bg-white/5 px-8 text-white transition hover:border-[#8c1218] hover:bg-[#8c1218]/10 sm:w-auto"
              >
                <a href="/applications">
                  <Users className="mr-2 h-5 w-5" />
                  Apply for Whitelist
                </a>
              </Button>
            </div>

            {/* Bottom Accent */}

            <div className="mx-auto mt-12 h-px w-24 bg-linear-to-r from-transparent via-[#8c1218] to-transparent opacity-60" />
          </div>
        </Container>
      </section>
    </main>
  );
}
