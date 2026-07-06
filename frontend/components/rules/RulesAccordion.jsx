"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function RuleAccordion({ title, rules }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111111]">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-white/2"
      >
        <span className="text-lg font-medium">{title}</span>

        <ChevronDown
          size={20}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-250" : "max-h-0"
        }`}
      >
        <div className="border-t border-white/10 px-6 py-6">
          <ul className="space-y-4">
            {rules.map((rule, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 rounded-full bg-[#c92a2a]" />
                <p className="leading-8 text-zinc-400">{rule}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
