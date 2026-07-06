"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import rules from "@/data/rules";

import RulesSidebar from "./RulesSidebar";
import RulesContent from "./RulesContent";

export default function RulesLayout() {
  const [search, setSearch] = useState("");

  const filteredRules = useMemo(() => {
    if (!search.trim()) return rules;

    return rules
      .map((category) => ({
        ...category,
        sections: category.sections.filter((section) => {
          const query = search.toLowerCase();

          if (section.title.toLowerCase().includes(query)) return true;

          return section.rules.some((rule) =>
            rule.toLowerCase().includes(query),
          );
        }),
      }))
      .filter((category) => category.sections.length > 0);
  }, [search]);

  return (
    <main className="min-h-screen bg-[#090909] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}

        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#c92a2a]">
            Astra Roleplay
          </p>

          <h1 className="mt-3 text-5xl font-bold">Server Rules</h1>

          <p className="mt-4 max-w-3xl text-zinc-400">
            These rules exist to maintain a fair, immersive and enjoyable
            roleplay experience for every member of the Astra community. Please
            read them carefully before joining the server.
          </p>
        </div>

        {/* Search */}

        <div className="relative mb-10 max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rules..."
            className="h-12 w-full rounded-xl border border-white/10 bg-[#141414] pl-11 pr-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#8c1218]"
          />
        </div>

        {/* Layout */}

        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <RulesSidebar categories={filteredRules} />

          <RulesContent categories={filteredRules} />
        </div>
      </div>
    </main>
  );
}
