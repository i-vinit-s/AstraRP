import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import siteConfig from "@/config/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#090909]">
      {/* Background */}

      <div className="absolute inset-0 -z-10 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="absolute left-1/2 top-0 -z-10 h-125 w-125 -translate-x-1/2 rounded-full bg-[#8c1218]/10 blur-[180px]" />

      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-20 lg:grid-cols-[1.2fr_1fr]">
          {/* Left */}

          <div>
            <div className="flex items-center gap-4">
              <Image src="/logo.png" width={52} height={52} alt="Astra" />

              <div>
                <h2 className="text-2xl font-black uppercase tracking-wide">
                  Astra
                </h2>

                <p className="text-sm text-zinc-500">Craft your legacy.</p>
              </div>
            </div>

            <p className="mt-8 max-w-lg text-lg leading-8 text-zinc-400">
              Astra Roleplay is a premium FiveM roleplay community powered by OP
              Framework, built for immersive storytelling, realistic progression
              and unforgettable experiences.
            </p>

            <div className="mt-10 flex gap-3">
              <a
                href={`${siteConfig.discordUrl}`}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm transition hover:border-[#8c1218] hover:bg-[#8c1218]/10"
              >
                Discord
              </a>

              {/* <a
                href="/store"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm transition hover:border-[#8c1218] hover:bg-[#8c1218]/10"
              >
                Store
              </a> */}

              <a
                href="/apply"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm transition hover:border-[#8c1218] hover:bg-[#8c1218]/10"
              >
                Apply
              </a>
            </div>
          </div>

          {/* Right */}

          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#8c1218]">
                Navigation
              </p>

              <div className="space-y-4">
                {[
                  ["Home", "/"],
                  ["Rules", "/rules"],
                  ["FAQ", "/faq"],
                  // ["Applications", "/applications"],
                ].map(([name, href]) => (
                  <Link
                    key={name}
                    href={href}
                    className="group flex items-center justify-between text-zinc-400 transition hover:text-white"
                  >
                    {name}

                    <ArrowUpRight
                      size={16}
                      className="translate-x-0 opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#8c1218]">
                Legal
              </p>

              <div className="space-y-4">
                {[
                  ["Privacy", "/privacy"],
                  ["Terms", "/terms"],
                  ["Refund Policy", "/refund"],
                  // ["Contact", "/contact"],
                ].map(([name, href]) => (
                  <Link
                    key={name}
                    href={href}
                    className="group flex items-center justify-between text-zinc-400 transition hover:text-white"
                  >
                    {name}

                    <ArrowUpRight
                      size={16}
                      className="translate-x-0 opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div className="mt-20 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-sm text-zinc-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} Astra Roleplay. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Powered by{" "}
            <span className="font-semibold text-white">OP Framework</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
