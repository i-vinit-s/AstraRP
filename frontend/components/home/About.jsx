"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import Container from "../common/Container";

export default function About() {
  return (
    <section className="relative bg-[#101010] py-32">
      <Container>
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#7A1111]">
              About Astra
            </p>

            <h2 className="mt-5 text-5xl font-black leading-tight md:text-6xl">
              Crafted For
              <span className="block text-[#7A1111]">Serious Roleplay</span>
            </h2>

            <p className="mt-8 text-lg leading-9 text-zinc-400">
              Astra RP is more than just another FiveM server.
              <br />
              <br />
              We focus on immersive storytelling, realistic systems, balanced
              progression and a mature community where every player contributes
              to the world.
            </p>

            <div className="mt-10 flex flex-wrap gap-8">
              <Stat number="100+" title="Custom Systems" />

              <Stat number="24/7" title="Support" />

              <Stat number="∞" title="Stories" />
            </div>
          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-[#7A1111]/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#181818] p-8">
              <Image
                src="/logo.png"
                alt="Astra"
                width={320}
                height={320}
                className="mx-auto opacity-90"
              />

              <div className="mt-8 border-t border-white/10 pt-8">
                <h3 className="text-2xl font-semibold">
                  Powered by OP Framework
                </h3>

                <p className="mt-4 leading-8 text-zinc-400">
                  Built on a custom framework engineered for performance,
                  flexibility and immersive gameplay.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function Stat({ number, title }) {
  return (
    <div>
      <h3 className="text-4xl font-black text-[#7A1111]">{number}</h3>

      <p className="mt-2 text-sm uppercase tracking-[0.25em] text-zinc-500">
        {title}
      </p>
    </div>
  );
}
