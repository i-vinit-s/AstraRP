import LegalSection from "./LegalSection";

export default function LegalLayout({
  badge,
  title,
  description,
  lastUpdated,
  sections,
}) {
  return (
    <main className="min-h-screen bg-[#090909] pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero */}

        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#c92a2a]">
            {badge}
          </p>

          <h1 className="mt-4 text-5xl font-bold text-white">{title}</h1>

          <p className="mt-6 leading-8 text-zinc-400">{description}</p>

          <p className="mt-6 text-sm text-zinc-500">
            Last Updated • {lastUpdated}
          </p>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}

          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-xl border border-white/10 bg-[#111111] p-6">
              <h3 className="mb-5 font-semibold">Contents</h3>

              <nav className="space-y-3">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-zinc-400 transition hover:text-white"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}

          <div className="space-y-16">
            {sections.map((section, index) => (
              <LegalSection key={section.id} number={index + 1} {...section} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
