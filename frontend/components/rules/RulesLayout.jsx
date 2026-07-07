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

    const query = search.toLowerCase();

    function filterNodes(nodes = []) {
      return nodes
        .map((node) => {
          const titleMatch = node.title?.toLowerCase().includes(query);

          const descriptionMatch = node.description
            ?.toLowerCase()
            .includes(query);

          const ruleMatch = node.rules?.some((rule) =>
            rule.toLowerCase().includes(query),
          );

          const children = filterNodes(node.children || []);

          if (titleMatch || descriptionMatch || ruleMatch || children.length) {
            return {
              ...node,
              children,
            };
          }

          return null;
        })
        .filter(Boolean);
    }

    return rules
      .map((category) => ({
        ...category,
        children: filterNodes(category.children || []),
      }))
      .filter(
        (category) =>
          category.title.toLowerCase().includes(query) ||
          category.children.length,
      );
  }, [search]);
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090909] pt-28 pb-24">
      {/* Background */}

      <div className="absolute inset-0 -z-20 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="absolute left-1/2 top-20 -z-10 h-125 w-125 -translate-x-1/2 rounded-full bg-[#8c1218]/15 blur-[180px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}

        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-5 py-2 text-xs uppercase tracking-[0.35em] text-[#d65b5b]">
            Astra Roleplay
          </span>

          <h1 className="mt-8 text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl lg:text-7xl">
            Server
            <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
              Rules
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
            These rules exist to maintain a fair, immersive and enjoyable
            experience for every member of Astra Roleplay. Ignorance of the
            rules is never accepted as an excuse.
          </p>
        </div>

        {/* Search */}

        <div className="mx-auto mt-14 max-w-xl">
          <div className="relative">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
              size={20}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rules..."
              className="h-14 w-full rounded-2xl border  border-white/10  bg-[#111111]/70 pl-14 pr-5  text-white backdrop-blur-xl outline-none transition-all  placeholder:text-zinc-600  focus:border-[#8c1218] focus:ring-4  focus:ring-[#8c1218]/10"
            />
          </div>
        </div>

        {/* Mobile Categories */}

        <div className="mt-10 flex gap-3 overflow-x-auto pb-2 lg:hidden">
          {filteredRules.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-300 transition hover:border-[#8c1218]"
            >
              {category.title}
            </a>
          ))}
        </div>

        {/* Content */}

        <div className="mt-16 grid gap-10 lg:grid-cols-[280px_1fr]">
          <RulesSidebar categories={filteredRules} />
          <RulesContent categories={filteredRules} />
        </div>
      </div>
    </main>
  );
}
