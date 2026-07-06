"use client";

export default function StatusFilter({
  value,
  onChange,
  total,
  whitelisted,
  notWhitelisted,
}) {
  const filters = [
    {
      key: "all",
      label: `All (${total})`,
    },
    {
      key: "whitelisted",
      label: `Whitelisted (${whitelisted})`,
    },
    {
      key: "not_whitelisted",
      label: `Not Whitelisted (${notWhitelisted})`,
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onChange(filter.key)}
          className={`rounded-full px-5 py-2 text-sm transition ${
            value === filter.key
              ? "bg-[#8c1218] text-white"
              : "border border-white/10 bg-[#111111] text-zinc-400 hover:border-[#8c1218]"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}