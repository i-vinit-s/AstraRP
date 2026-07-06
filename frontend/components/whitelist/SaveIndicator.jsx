"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

export default function SaveIndicator({ saving }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111111] px-4 py-3">
      {saving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-[#8c1218]" />

          <div>
            <p className="text-sm font-medium">Saving...</p>

            <p className="text-xs text-zinc-500">Your draft is being saved.</p>
          </div>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-500" />

          <div>
            <p className="text-sm font-medium">All changes saved</p>

            <p className="text-xs text-zinc-500">Your progress is safe.</p>
          </div>
        </>
      )}
    </div>
  );
}
