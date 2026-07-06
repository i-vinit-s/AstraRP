export default function LegalSection({
  number,
  id,
  title,
  content,
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28"
    >
      <div className="mb-8">

        <span className="text-sm font-mono text-[#c92a2a]">
          {String(number).padStart(2, "0")}
        </span>

        <h2 className="mt-2 text-3xl font-bold text-white">
          {title}
        </h2>

      </div>

      <div className="rounded-xl border border-white/10 bg-[#111111] p-8">

        {content.map((paragraph, index) => (
          <p
            key={index}
            className="mb-5 leading-8 text-zinc-400 last:mb-0"
          >
            {paragraph}
          </p>
        ))}

      </div>

    </section>
  );
}