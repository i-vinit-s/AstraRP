"use client";

export default function ProgressBar({ current, total }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Progress</h3>

          <p className="mt-1 text-sm text-zinc-500">
            Step {current} of {total}
          </p>
        </div>

        <span className="text-xl font-bold text-[#8c1218]">{percentage}%</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-[#8c1218] transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}
