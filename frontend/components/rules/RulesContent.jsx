"use client";

import RuleNode from "./RuleNode";

export default function RulesContent({ categories }) {
  return (
    <div className="space-y-20">
      {categories.map((category) => (
        <section key={category.id} id={category.id} className="scroll-mt-28">
          <div className="mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-[#8c1218]">
              Category
            </span>

            <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl">
              {category.title}
            </h2>

            {category.description && (
              <p className="mt-5 max-w-4xl leading-8 text-zinc-400">
                {category.description}
              </p>
            )}

            <div className="mt-6 h-px w-24 bg-linear-to-r from-[#8c1218] to-transparent" />
          </div>

          <div className="space-y-5">
            {(category.children || []).map((node) => (
              <RuleNode key={node.id} node={node} level={0} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
