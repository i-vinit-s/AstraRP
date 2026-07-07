"use client";

import { useEffect, useMemo, useState } from "react";

function flatten(nodes, depth = 0) {
  let result = [];

  for (const node of nodes) {
    result.push({
      id: node.id,
      title: node.title,
      depth,
    });

    if (node.children?.length) {
      result.push(...flatten(node.children, depth + 1));
    }
  }

  return result;
}

export default function RulesSidebar({ categories }) {
  const [active, setActive] = useState("");

  const items = useMemo(() => {
    return categories.flatMap((category) => [
      {
        id: category.id,
        title: category.title,
        heading: true,
      },
      ...flatten(category.children || []),
    ]);
  }, [categories]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
      },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);

      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-28 rounded-3xl border border-white/5 bg-[#0d0d0d]/70 p-5 backdrop-blur-xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#8c1218]">
          Contents
        </p>

        <div className="space-y-5">
          {items.map((item) =>
            item.heading ? (
              <div key={item.id}>
                <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-white">
                  {item.title}
                </h3>
              </div>
            ) : (
              <a
                key={item.id}
                href={`#${item.id}`}
                style={{
                  paddingLeft: `${10 + item.depth * 16}px`,
                }}
                className={`relative block border-l py-0.5 text-[14px] transition-colors ${active === item.id ? "border-[#8c1218] text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
              >
                {item.title}
              </a>
            ),
          )}
        </div>
      </div>
    </aside>
  );
}
