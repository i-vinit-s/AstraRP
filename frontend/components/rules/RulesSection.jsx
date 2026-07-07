"use client";

import { CheckCircle2 } from "lucide-react";

export default function RulesSection({ section }) {
  return (
    <div
      id={section.id}
      className="scroll-mt-28 overflow-hidden rounded-3xl border border-white/10 bg-[#111111]/70 backdrop-blur-xl"
    >
      {/* Header */}

      <div className="border-b border-white/10 px-6 py-6 sm:px-8 sm:py-7">
        <span className="text-xs uppercase tracking-[0.3em] text-[#8c1218]">
          Rule
        </span>

        <h3 className="mt-3 text-2xl font-bold sm:text-3xl">{section.title}</h3>

        {section.description && (
          <p className="mt-5 max-w-4xl text-[15px] leading-8 text-zinc-400">
            {section.description}
          </p>
        )}
      </div>

      {/* Rules */}

      {section.rules?.length > 0 && (
        <div className="divide-y divide-white/5">
          {section.rules.map((rule, index) => (
            <div
              key={index}
              className="flex items-start gap-5 px-6 py-5 transition hover:bg-white/2 sm:px-8"
            >
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#8c1218]/20 bg-[#8c1218]/10">
                <CheckCircle2
                  className="h-4 w-4 text-[#c92a2a]"
                  strokeWidth={2.4}
                />
              </div>

              <div className="flex-1">
                <p className="leading-8 text-zinc-300">{rule}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
