"use client";

import { CheckCircle2, Clock3 } from "lucide-react";

export default function StatusBadge({ whitelisted }) {
  if (whitelisted) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
        <CheckCircle2 size={14} />
        Whitelisted
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
      <Clock3 size={14} />
      Not Whitelisted
    </span>
  );
}