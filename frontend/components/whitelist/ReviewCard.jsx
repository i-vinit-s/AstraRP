"use client";

import { CheckCircle2 } from "lucide-react";

export default function ReviewCard({ sections, answers }) {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="rounded-3xl border border-white/10 bg-[#111111] p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8c1218]">
          Final Review
        </p>

        <h2 className="mt-3 text-3xl font-semibold">Review Your Application</h2>

        <p className="mt-4 leading-7 text-zinc-400">
          Carefully review every answer before submitting. Once submitted, your
          application will be locked until it has been reviewed by our staff.
        </p>
      </div>

      {/* Sections */}

      {sections.map((section) => (
        <div
          key={section.title}
          className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]"
        >
          {/* Section Header */}

          <div className="flex items-center justify-between border-b border-white/10 px-7 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#8c1218]">
                Section
              </p>

              <h3 className="mt-2 text-2xl font-semibold">{section.title}</h3>
            </div>

            <CheckCircle2 size={22} className="text-emerald-500" />
          </div>

          {/* Questions */}

          <div className="divide-y divide-white/5">
            {section.questions.map((question) => (
              <div key={question.id} className="px-7 py-6">
                <p className="text-sm font-medium text-white">
                  {question.title}
                </p>

                <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b0b0b] p-4">
                  {Array.isArray(answers[question.id]) ? (
                    <div className="max-h-44 overflow-y-auto">
                      <ul className="list-disc space-y-2 pl-5 text-zinc-300">
                        {answers[question.id].map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b0b0b] p-4">
                      <div
                        className="h-44 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-all leading-7 text-zinc-300">
                        {answers[question.id] ? (
                          answers[question.id]
                        ) : (
                          <span className="italic text-zinc-600">
                            No answer provided.
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Warning */}

      <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-6">
        <h4 className="font-semibold text-yellow-400">Before you submit</h4>

        <ul className="mt-4 space-y-2 text-sm leading-7 text-zinc-300">
          <li>• Double-check every answer.</li>
          <li>• Low-effort responses may be rejected.</li>
          <li>• False information may result in denial.</li>
          <li>
            • Once submitted, you cannot edit your application until it has been
            reviewed by staff.
          </li>
        </ul>
      </div>
    </div>
  );
}
