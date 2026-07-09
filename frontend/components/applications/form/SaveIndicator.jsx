"use client";

import { AlertCircle, CheckCircle2, Cloud, Loader2 } from "lucide-react";

export default function SaveIndicator({
  saving,
  hasChanges = false,
  error = "",
}) {
  if (error) {
    return (
      <div className="flex items-center gap-2.5 text-sm text-red-400">
        <AlertCircle className="h-4 w-4 shrink-0" />

        <span>Failed to save draft</span>
      </div>
    );
  }

  if (saving) {
    return (
      <div className="flex items-center gap-2.5 text-sm text-zinc-400">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#c92a2a]" />

        <span>Saving changes...</span>
      </div>
    );
  }

  if (hasChanges) {
    return (
      <div className="flex items-center gap-2.5 text-sm text-zinc-500">
        <Cloud className="h-4 w-4 shrink-0" />

        <span>Unsaved changes</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 text-sm text-zinc-500">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />

      <span>All changes saved</span>
    </div>
  );
}
