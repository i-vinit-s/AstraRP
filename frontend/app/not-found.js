import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#090909] text-white">
      {/* Background */}

      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8c1218]/15 blur-[180px]" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#c92a2a]">
          Error 404
        </p>

        <h1 className="mt-6 text-7xl font-black uppercase tracking-tight md:text-9xl">
          404
        </h1>

        <h2 className="mt-6 text-3xl font-bold md:text-5xl">
          Looks like you&apos;re lost.
        </h2>

        <p className="mt-6 max-w-xl leading-8 text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist, has been moved,
          or is no longer available. Return home or head back to continue
          exploring Astra Roleplay.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button
            asChild
            className="h-12 px-8 rounded-none bg-[#8c1218] hover:bg-[#c92a2a] transition-all duration-300 [clip-path:polygon(8%_0,100%_0,100%_100%,0_100%,0_28%)]"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back Home
            </Link>
          </Button>
        </div>

        <div className="mt-20 text-sm text-zinc-600">
          Astra Roleplay • Craft your legacy.
        </div>
      </div>
    </main>
  );
}
