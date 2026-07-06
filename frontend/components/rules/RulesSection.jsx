"use client";

import RulesAccordion from "./RulesAccordion";

export default function RuleSection({ section }) {
  return (
    <div id={section.id} className="scroll-mt-28">
      <RulesAccordion title={section.title} rules={section.rules} />
    </div>
  );
}
