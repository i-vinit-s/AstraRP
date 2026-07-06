"use client";

import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by username, display name or Discord ID..."
        className="h-12 w-full rounded-xl border border-white/10 bg-[#111111] pl-11 pr-4 text-white outline-none transition focus:border-[#8c1218]"
      />
    </div>
  );
}
