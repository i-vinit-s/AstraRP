"use client";

import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation({ current, total, onBack, onNext }) {
  const isFirst = current === 0;
  const isReview = current >= total;

  return (
    <div className="flex w-full flex-col gap-5 rounded-3xl border border-white/10 bg-[#111111]/70 p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      {/* Progress Text */}

      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[#8c1218]">
          Application
        </p>

        <h3 className="mt-2 text-xl font-semibold">
          {isReview ? "Ready to Submit" : `Step ${current + 1} of ${total + 1}`}
        </h3>

        <p className="mt-1 text-sm text-zinc-500">
          {isReview
            ? "Review everything carefully before submitting."
            : "Complete this section before moving forward."}
        </p>
      </div>

      {/* Buttons */}

      <div className="flex flex-wrap items-center gap-3">
        {!isFirst && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 rounded-xl border-white/10 bg-white/3 px-6 text-white transition-all duration-300 hover:border-[#8c1218] hover:bg-[#8c1218]/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
        )}

        <Button
          type="button"
          onClick={onNext}
          className="h-12 rounded-xl  bg-[#8c1218] px-7  text-white shadow-lg shadow-[#8c1218]/20 transition-all duration-300 hover:scale-[1.02]  hover:bg-[#a41717]"
        >
          {isReview ? (
            <>
              Submit Application
              <CheckCircle2 className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
