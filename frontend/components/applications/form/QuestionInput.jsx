"use client";

export default function QuestionInput({
  index,
  question,
  value,
  error,
  onChange,
}) {
  const questionId = String(question.id || question._id);

  const common = `w-full rounded-2xl border bg-[#090909] px-5 py-4 text-[15px] text-white outline-none transition-all duration-300 placeholder:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-60 ${
    error
      ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
      : "border-white/10 hover:border-white/20 focus:border-[#8c1218] focus:ring-4 focus:ring-[#8c1218]/10"
  }`;

  let input = null;

  switch (question.type) {
    case "number":
      input = (
        <input
          id={questionId}
          type="number"
          value={value ?? ""}
          min={question.min ?? undefined}
          max={question.max ?? undefined}
          placeholder={question.placeholder || ""}
          onChange={(event) => onChange(event.target.value)}
          className={common}
        />
      );
      break;

    case "textarea":
      input = (
        <textarea
          id={questionId}
          rows={8}
          value={value ?? ""}
          minLength={question.minLength || undefined}
          maxLength={question.maxLength || undefined}
          placeholder={question.placeholder || ""}
          onChange={(event) => onChange(event.target.value)}
          className={`${common} min-h-52 resize-y`}
        />
      );
      break;

    case "select":
      input = (
        <select
          id={questionId}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className={common}
          style={{ colorScheme: "dark" }}
        >
          <option value="">{question.placeholder || "Select an option"}</option>

          {question.options?.map((option) => {
            const optionValue =
              typeof option === "string" ? option : option.value;

            const optionLabel =
              typeof option === "string"
                ? option
                : option.label || option.value;

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      );
      break;

    case "radio":
      input = (
        <div id={questionId} className="space-y-3" tabIndex={-1}>
          {question.options?.map((option) => {
            const optionValue =
              typeof option === "string" ? option : option.value;

            const optionLabel =
              typeof option === "string"
                ? option
                : option.label || option.value;

            const checked = value === optionValue;

            return (
              <label
                key={optionValue}
                htmlFor={`${questionId}-${optionValue}`}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all duration-300 ${
                  checked
                    ? "border-[#8c1218]/50 bg-[#8c1218]/10"
                    : "border-white/10 bg-[#090909] hover:border-white/20"
                }`}
              >
                <input
                  id={`${questionId}-${optionValue}`}
                  type="radio"
                  name={questionId}
                  value={optionValue}
                  checked={checked}
                  onChange={() => onChange(optionValue)}
                  className="sr-only"
                />

                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                    checked
                      ? "border-[#c92a2a] bg-[#8c1218]"
                      : "border-white/30"
                  }`}
                >
                  {checked && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>

                <span className="text-sm text-zinc-200 sm:text-[15px]">
                  {optionLabel}
                </span>
              </label>
            );
          })}
        </div>
      );
      break;

    case "checkbox":
      input = (
        <div id={questionId} className="space-y-3" tabIndex={-1}>
          {question.options?.map((option) => {
            const optionValue =
              typeof option === "string" ? option : option.value;

            const optionLabel =
              typeof option === "string"
                ? option
                : option.label || option.value;

            const currentValues = Array.isArray(value) ? value : [];
            const checked = currentValues.includes(optionValue);

            return (
              <label
                key={optionValue}
                htmlFor={`${questionId}-${optionValue}`}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all duration-300 ${
                  checked
                    ? "border-[#8c1218]/40 bg-[#8c1218]/10"
                    : "border-white/10 bg-[#090909] hover:border-white/20"
                }`}
              >
                <input
                  id={`${questionId}-${optionValue}`}
                  type="checkbox"
                  value={optionValue}
                  checked={checked}
                  onChange={(event) => {
                    if (event.target.checked) {
                      onChange([...currentValues, optionValue]);
                      return;
                    }

                    onChange(
                      currentValues.filter((item) => item !== optionValue),
                    );
                  }}
                  className="sr-only"
                />

                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                    checked
                      ? "border-[#c92a2a] bg-[#8c1218]"
                      : "border-white/30"
                  }`}
                >
                  {checked && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                      aria-hidden="true"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  )}
                </span>

                <span className="text-sm text-zinc-200 sm:text-[15px]">
                  {optionLabel}
                </span>
              </label>
            );
          })}
        </div>
      );
      break;

    default:
      input = (
        <input
          id={questionId}
          type="text"
          value={value ?? ""}
          minLength={question.minLength || undefined}
          maxLength={question.maxLength || undefined}
          placeholder={question.placeholder || ""}
          onChange={(event) => onChange(event.target.value)}
          className={common}
        />
      );
  }

  const characterCount = typeof value === "string" ? value.length : 0;

  return (
    <div
      className={`relative space-y-6 rounded-3xl border bg-black/10 p-5 transition-all duration-300 sm:p-6 ${
        error ? "border-red-500/20" : "border-white/5 hover:border-white/10"
      }`}
    >
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#c92a2a]">
          Question {index}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-bold leading-8 text-white sm:text-xl">
            {question.title}
          </h3>

          {question.required && (
            <span className="rounded-full border border-[#8c1218]/20 bg-[#8c1218]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d65b5b] sm:text-[11px]">
              Required
            </span>
          )}
        </div>

        {question.description && (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-500 sm:text-[15px]">
            {question.description}
          </p>
        )}
      </div>

      <div>{input}</div>

      {(error || question.maxLength) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {error ? (
            <p className="text-sm font-medium text-red-400">{error}</p>
          ) : (
            <span />
          )}

          {question.maxLength && (
            <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1">
              <span
                className={`h-2 w-2 rounded-full ${
                  characterCount >= question.maxLength
                    ? "bg-red-500"
                    : "bg-[#8c1218]"
                }`}
              />

              <span className="text-xs text-zinc-400">
                {characterCount} / {question.maxLength}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
