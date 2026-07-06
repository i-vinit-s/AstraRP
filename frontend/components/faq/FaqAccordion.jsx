"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQAccordion({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden border border-white/10 bg-[#111111]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-8 py-6 text-left transition hover:bg-white/3"
      >
        <span className="text-lg font-semibold">{question}</span>

        <ChevronDown
          className={`transition duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="border-t border-white/10 px-8 py-6">
          <p className="leading-8 text-zinc-400">{answer}</p>
        </div>
      </div>
    </div>
  );
}
