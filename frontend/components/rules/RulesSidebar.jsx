"use client";

import { useEffect, useState } from "react";

export default function RulesSidebar({ categories }) {
  const [active, setActive] = useState("");

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

    categories.forEach((category) => {
      const el = document.getElementById(category.id);

      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28">
        {categories.map((category) => (
          <div key={category.id} className="mb-8">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white">
              {category.title}
            </h3>

            <div className="space-y-2">
              {category.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    active === section.id
                      ? "bg-[#8c1218]/20 text-[#c92a2a]"
                      : "text-zinc-500 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
