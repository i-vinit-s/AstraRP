"use client";

export default function QuestionInput({
  index,
  question,
  value,
  error,
  onChange,
}) {
  const common = `w-full rounded-2xl border border-white/10 bg-[#090909] px-5 py-4 text-[15px] text-white outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-white/20 focus:border-[#8c1218] focus:ring-4 focus:ring-[#8c1218]/1 disabled:opacity-60 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}`;
  let input = null;

  switch (question.type) {
    case "number":
      input = (
        <input
          id={question.id}
          type="number"
          value={value}
          placeholder={question.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={common}
        />
      );
      break;

    case "textarea":
      input = (
        <textarea
          id={question.id}
          rows={10}
          value={value}
          placeholder={question.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${common} min-h-65 resize-y`}
        />
      );
      break;

    case "select":
      input = (
        <select
          style={{
            colorScheme: "dark",
          }}
          id={question.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={common}
        >
          <option value="">Select an option</option>

          {question.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      break;

    case "radio":
      input = (
        <div className="space-y-3">
          {question.options?.map((option) => (
            <label
              key={option.value}
              htmlFor={`${question.id}-${option.value}`}
              className={`flex cursor-pointer items-center gap-4 rounded-3xl border p-4 transition-all ${
                value === option.value
                  ? "border-[#8c1218] bg-[#8c1218]/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <input
                id={`${question.id}-${option.value}`}
                type="radio"
                name={question.id}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="hidden"
              />

              <div
                className={`h-4 w-4 rounded-full border ${
                  value === option.value
                    ? "border-[#8c1218] bg-[#8c1218]"
                    : "border-white/30"
                }`}
              />

              <span>{option.label}</span>
            </label>
          ))}
        </div>
      );
      break;

    case "checkbox":
      input = (
        <div className="space-y-3">
          {question.options?.map((option) => {
            const checked = (value || []).includes(option.value);

            return (
              <label
                key={option.value}
                htmlFor={`${question.id}-${option.value}`}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all ${
                  checked
                    ? `border-[#8c1218]/40 bg-linear-to-r from-[#8c1218]/15 to-transparent shadow-[0_0_30px_rgba(140,18,24,.15)]`
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <input
                  id={`${question.id}-${option.value}`}
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    let arr = [...(value || [])];

                    if (e.target.checked) {
                      arr.push(option.value);
                    } else {
                      arr = arr.filter((item) => item !== option.value);
                    }

                    onChange(arr);
                  }}
                  className="hidden"
                />

                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    checked
                      ? "border-[#8c1218] bg-[#8c1218]"
                      : "border-white/20"
                  }`}
                >
                  {checked && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      );
      break;

    default:
      input = (
        <input
          id={question.id}
          type="text"
          value={value}
          placeholder={question.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={common}
        />
      );
  }

  return (
    <div className="relative space-y-6 rounded-3xl border border-white/5 bg-black/10 p-6 transition-all duration-300 hover:border-white/10">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#8c1218]">
          Question {index}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-bold leading-8">{question.title}</h3>

          {question.required && (
            <span className="rounded-full border border-[#8c1218]/20 bg-[#8c1218]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d65b5b]">
              Required
            </span>
          )}
        </div>

        {question.description && (
          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-zinc-500">
            {question.description}
          </p>
        )}
      </div>

      <div className="relative">{input}</div>

      <div className="flex items-center justify-between text-sm">
        {error ? (
          <span className="font-medium text-red-500">{error}</span>
        ) : (
          <span />
        )}

        {question.maxLength && (
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1">
            <div
              className={`h-2 w-2 rounded-full ${
                (value || "").length >= question.maxLength
                  ? "bg-red-500"
                  : "bg-[#8c1218]"
              }`}
            />

            <span className="text-xs text-zinc-400">
              {(value || "").length} / {question.maxLength}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
