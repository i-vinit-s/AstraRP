"use client";

import RulesSection from "./RulesSection";

export default function RulesContent({ categories }) {
  return (
    <div className="space-y-16">
      {categories.map((category) => (
        <section key={category.id} id={category.id} className="scroll-mt-28">
          <h2 className="mb-8 text-4xl font-bold">{category.title}</h2>

          <div className="space-y-5">
            {category.sections.map((section) => (
              <RulesSection key={section.id} section={section} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
