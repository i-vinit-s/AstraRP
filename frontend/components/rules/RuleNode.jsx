"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function RuleNode({ node, level = 0 }) {
  const [open, setOpen] = useState(level === 0);

  const hasChildren = Array.isArray(node.children) && node.children.length > 0;

  const hasRules = Array.isArray(node.rules) && node.rules.length > 0;

  const hasDescription = Boolean(node.description);

  return (
    <div
      id={node.id}
      className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#111111]/70 backdrop-blur-xl"
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-white/5"
      >
        <div>
          <h3
            className={`font-bold ${
              level === 0 ? "text-2xl" : level === 1 ? "text-xl" : "text-lg"
            }`}
          >
            {node.title}
          </h3>

          {(hasDescription || hasRules || hasChildren) && (
            <p className="mt-2 text-sm text-zinc-500">
              {[
                hasDescription && "Description",
                hasRules &&
                  `${node.rules.length} Rule${
                    node.rules.length > 1 ? "s" : ""
                  }`,
                hasChildren &&
                  `${node.children.length} Section${
                    node.children.length > 1 ? "s" : ""
                  }`,
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>
          )}
        </div>

        <ChevronDown
          className={`transition duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[5000px]" : "max-h-0"
        }`}
      >
        <div className="border-t border-white/10 px-6 py-6">
          {hasDescription && (
            <div className="mb-6 rounded-2xl border border-white/5 bg-black/20 p-5">
              <p className="leading-8 text-zinc-400">{node.description}</p>
            </div>
          )}

          {hasRules && (
            <ul className="space-y-4">
              {node.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="mt-3 h-2 w-2 rounded-full bg-[#8c1218]" />

                  <p className="leading-8 text-zinc-300">{rule}</p>
                </li>
              ))}
            </ul>
          )}

          {hasChildren && (
            <div
              className={`${
                hasRules || hasDescription ? "mt-8" : ""
              } space-y-5 border-l border-white/10 pl-5`}
            >
              {node.children.map((child) => (
                <RuleNode key={child.id} node={child} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
