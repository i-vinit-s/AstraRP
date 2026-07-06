"use client";

import faq from "@/data/faq";
import FaqAccordion from "./FaqAccordion";

export default function FAQSection() {
  return (
    <main className="bg-[#090909] min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#c92a2a]">
          Support
        </p>

        <h1 className="mt-4 text-5xl font-bold text-white">
          Frequently Asked Questions
        </h1>

        <p className="mt-5 max-w-2xl text-zinc-400 leading-8">
          Find answers to common questions about Astra Roleplay, applications,
          gameplay and community guidelines.
        </p>

        <div className="mt-14 space-y-5">
          {faq.map((item, index) => (
            <FaqAccordion key={index} {...item} />
          ))}
        </div>
      </div>
    </main>
  );
}
