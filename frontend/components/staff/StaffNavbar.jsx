"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import navigation from "./NavigationConfig";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function StaffNavbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop */}

      <header className="sticky top-0 z-50 hidden border-b border-white/10 bg-[#0d0d0d]/90 backdrop-blur-xl lg:block">
        <div className="mx-auto flex h-20 max-w-7xl">
          {/* Left */}

          <div className="flex w-72 shrink-0 items-center border-r border-white/10 pr-8">
            <Link href="/staff">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#a71920]">
                  Astra Roleplay
                </p>

                <h1 className="mt-1 text-3xl font-black leading-none text-white">
                  Staff Panel
                </h1>
              </div>
            </Link>
          </div>

          {/* Right */}

          <nav className="flex flex-1 items-center gap-2 px-8">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                item.href === "/staff"
                  ? pathname === "/staff"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "border border-[#8c1218]/30 bg-[#8c1218]/15 text-[#d13a3f]"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={17} />

                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile */}

      <MobileNavbar />
    </>
  );
}

function MobileNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0d0d0d]/90 backdrop-blur-xl lg:hidden">
      <div className="flex h-16 items-center justify-between px-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a71920]">
            Astra Roleplay
          </p>

          <h2 className="text-lg font-bold text-white">Staff Panel</h2>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="rounded-xl border border-white/10 p-2 transition hover:bg-white/5">
              <Menu size={22} />
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-80 border-white/10 bg-[#111111] p-0"
          >
            <div className="border-b border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-[#a71920]">
                Astra Roleplay
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Staff Panel
              </h2>
            </div>

            <nav className="space-y-2 p-5">
              {navigation.map((item) => {
                const Icon = item.icon;

                const active =
                  item.href === "/staff"
                    ? pathname === "/staff"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "border border-[#8c1218]/30 bg-[#8c1218]/15 text-[#d13a3f]"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />

                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
