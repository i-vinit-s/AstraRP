"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import siteConfig from "@/config/site";
import Container from "../common/Container";

const particles = [
  { left: "8%", top: "18%" },
  { left: "15%", top: "72%" },
  { left: "22%", top: "34%" },
  { left: "28%", top: "82%" },
  { left: "36%", top: "24%" },
  { left: "44%", top: "60%" },
  { left: "52%", top: "16%" },
  { left: "58%", top: "76%" },
  { left: "64%", top: "38%" },
  { left: "72%", top: "12%" },
  { left: "78%", top: "56%" },
  { left: "84%", top: "30%" },
  { left: "90%", top: "70%" },
  { left: "12%", top: "46%" },
  { left: "30%", top: "52%" },
  { left: "48%", top: "88%" },
  { left: "68%", top: "84%" },
  { left: "92%", top: "44%" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-svh overflow-hidden bg-[#090909]">
      {/* Grid */}

      <div
        className="absolute inset-0 -z-30 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] bg-size-[60px_60px]"
      />

      <div className="absolute left-1/2 top-[42%] -z-20 h-162.5 w-162.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8c1218]/20 blur-[120px] md:blur-[220px]" />

      {/* Glows */}

      <div className="absolute -left-40 top-0 -z-20 h-175 w-175 rounded-full bg-[#8c1218]/20 blur-[120px] md:blur-[220px]" />

      <div className="absolute -bottom-75 -right-62.5 -z-20 h-200 w-200 rounded-full bg-[#8c1218]/15 blur-[120px] md:blur-[220px]" />

      {/* Animated Polygon */}

      <motion.div
        animate={{
          rotate: [0, 2, 0],
          y: [0, -15, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut",
        }}
        className="hidden lg:block absolute -right-45 -top-30 -z-20 h-225 w-225 bg-[#8c1218]/8 backdrop-blur-xl [clip-path:polygon(35%_0%,100%_0%,72%_100%,0_100%)]"
      />

      {/* Floating Particles */}

      {particles.map((particle, i) => (
        <motion.span
          key={i}
          className={`absolute h-1 w-1 rounded-full bg-[#8c1218] ${
            i > 8 ? "hidden md:block" : ""
          }`}
          animate={{
            y: [0, -30, 0],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{
            repeat: Infinity,
            duration: 4 + i,
            delay: i * 0.25,
          }}
          style={particle}
        />
      ))}

      <Container>
        <div className="flex min-h-svh items-center justify-center py-36 sm:py-40 lg:py-44">
          {/* LEFT */}

          {/* <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-5xl text-center"
          > */}
          <div className="mx-auto max-w-5xl text-center">
            <div className="flex justify-center">
              <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-4 py-2 text-[10px] sm:px-5 sm:text-xs text-xs uppercase tracking-[0.35em] text-[#d65b5b]">
                FiveM Roleplay
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] sm:mt-10 sm:text-6xl md:text-7xl lg:text-[7rem] xl:text-[8rem] 2xl:text-[9rem]">
              ASTRA
              <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
                ROLEPLAY
              </span>
            </h1>

            <p className="mx-auto x-auto mt-8 max-w-2xl px-2 text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8 lg:max-w-3xl lg:text-xl lg:leading-9">
              India&apos;s next-generation FiveM roleplay experience powered by
              OP Framework. Build your story, create your legacy and experience
              roleplay without limits.
            </p>

            <div className="mt-12 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:justify-center">
              <Link
                href={`${siteConfig.discordUrl}`}
                className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-[#8c1218] px-8 font-semibold transition hover:bg-[#a41717] sm:w-auto"
              >
                Join Discord
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/applications"
                className="inline-flex h-14 w-full items-center justify-center rounded-xl border border-white/10 px-8 transition hover:border-[#8c1218] sm:w-auto"
              >
                Apply Now
              </Link>
            </div>
          </div>
          {/* </motion.div> */}
        </div>
      </Container>

      {/* Scroll */}

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex h-12 w-7 justify-center rounded-full border border-white/15">
          <div className="mt-2 h-2 w-2 rounded-full bg-[#8c1218]" />
        </div>
      </motion.div>
    </section>
  );
}
