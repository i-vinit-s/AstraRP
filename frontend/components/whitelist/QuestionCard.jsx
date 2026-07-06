"use client";

import { FileText, Sparkles } from "lucide-react";

export default function QuestionCard({ title, children }) {
  return (
    <section className="overflow-hidden rounded-4xl border border-white/10 bg-[#111111]/80 backdrop-blur-xl">
      {/* Header */}

      <div className="relative overflow-hidden border-b border-white/10">
        {/* Glow */}

        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#8c1218]/10 blur-[100px]" />

        <div className="relative flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8c1218]/20 bg-[#8c1218]/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-[#8c1218]" />

              <span className="text-xs font-medium uppercase tracking-[0.35em] text-[#d65b5b]">
                Current Section
              </span>
            </div>

            <h2 className="mt-6 text-3xl font-black uppercase tracking-tight">
              {title}
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
              Take your time while answering these questions. Detailed and
              thoughtful responses significantly improve your application.
            </p>
          </div>

          <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl border border-[#8c1218]/20 bg-[#8c1218]/10">
            <FileText className="h-8 w-8 text-[#8c1218]" strokeWidth={1.7} />
          </div>
        </div>
      </div>

      {/* Questions */}

      <div className="space-y-12 p-8 lg:p-10">{children}</div>
    </section>
  );
}
