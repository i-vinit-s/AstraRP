import Image from "next/image";

export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909]">
      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow */}

      <div className="absolute h-125 w-125 rounded-full bg-[#8c1218]/20 blur-[140px]" />

      <div className="relative flex flex-col items-center">
        <Image
          src="/logo.png"
          alt="Astra RP"
          width={110}
          height={110}
          priority
          className="animate-pulse"
        />

        <h1 className="mt-8 text-3xl font-bold uppercase tracking-[0.35em]">
          Astra RP
        </h1>

        <p className="mt-3 text-sm uppercase tracking-[0.25em] text-zinc-500">
          Craft your legacy
        </p>

        {/* Progress */}

        <div className="mt-10 h-0.5 w-56 overflow-hidden bg-white/10">
          <div className="loader-progress h-full bg-[#8c1218]" />
        </div>
      </div>
    </main>
  );
}
