"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import LoginButton from "@/components/auth/LoginButton";
import { useAuth } from "@/context/AuthContext";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Rules",
    href: "/rules",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto flex h-20 items-center justify-between transition-all duration-500 ease-out ${scrolled ? "md:h-19" : ""} items-center justify-between transition-all duration-500 ease-out ${scrolled ? `md:mt-4 md:max-w-7xl md:rounded-2xl md:border  md:border-[#8c1218]/20  md:bg-[#090909]/70 md:px-8 md:shadow-[0_20px_60px_rgba(0,0,0,.45)] md:backdrop-blur-2xl px-5  bg-[#090909]/90` : ` max-w-full border-b border-white/5 bg-[#090909]/70 px-5 lg:px-8 backdrop-blur-xl`}`}
      >
        {/* Logo */}

        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Astra RP"
            width={38}
            height={38}
            className="h-9 w-9 md:h-10 md:w-10"
          />

          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wide">
              Astra RP
            </h2>

            <p className="-mt-1 text-xs text-zinc-500">Craft your legacy.</p>
          </div>
        </Link>

        {/* Desktop Nav */}

        <nav className="hidden items-center gap-10 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}

        <div className="hidden items-center gap-3 lg:flex">
          {loading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-3 rounded-2xl bg-white/3 px-3 py-2 transition-all duration-300 hover:border-[#8c1218]/40 hover:bg-white/5 hover:shadow-[0_0_30px_rgba(140,18,24,.15)]">
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    width={128}
                    height={128}
                    className="h-11 w-11 rounded-xl object-cover"
                  />

                  <div className="text-left">
                    <p className="text-[15px] font-semibold">
                      {user.globalName || user.username}
                    </p>

                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />

                      <span className="text-xs text-zinc-500">Connected</span>
                    </div>
                  </div>

                  <ChevronDown className="ml-1 h-4 w-4 text-zinc-500 transition duration-300 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="w-72 rounded-2xl bg-[#101010]/95 p-2 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,.6)]"
              >
                {user?.canAccessStaffDashboard && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/staff"
                      className="h-11 px-3 flex cursor-pointer items-center gap-3 rounded-xl"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Staff Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="h-11 px-3 flex cursor-pointer items-center gap-3 rounded-xl"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem
                  onClick={logout}
                  className="h-11 px-3 cursor-pointer rounded-xl  text-red-400  focus:bg-red-500/10  focus:text-red-400"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <LoginButton />

              <Button className="h-11 px-7 rounded-none bg-[#8c1218] hover:bg-[#c92a2a] [clip-path:polygon(8%_0,100%_0,100%_100%,0_100%,0_28%)]">
                Apply
              </Button>
            </>
          )}
        </div>

        {/* Mobile */}

        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 text-white hover:border-[#8c1218]/40 hover:bg-[#8c1218]/10"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-full max-w-90 flex-col border-white/10 bg-[#090909] p-0 text-white"
            >
              <div className="border-b border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <Image src="/logo.png" width={36} height={36} alt="Astra" />

                  <div>
                    <h2 className="font-semibold">Astra RP</h2>

                    <p className="text-xs text-zinc-500">Craft your legacy.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <nav className="space-y-2">
                  {navLinks.map((item) => (
                    <SheetClose
                      asChild
                      onClick={() => setMobileOpen(false)}
                      key={item.label}
                    >
                      <Link
                        href={item.href}
                        className="block rounded-xl px-3 py-3 text-zinc-300 transition hover:bg-white/5 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="mt-auto space-y-3">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/5 p-3">
                        <Image
                          src={user.avatar}
                          className="h-10 w-10 rounded-full"
                          alt=""
                          height={128}
                          width={128}
                          referrerPolicy="no-referrer"
                        />

                        <div>
                          <p className="font-medium">
                            {user.globalName || user.username}
                          </p>

                          <p className="text-xs text-zinc-500">Connected</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <SheetClose asChild>
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-2xl border  border-white/10  bg-white/5 px-4 py-4 transition-all duration-300  hover:border-[#8c1218]/40  hover:bg-[#8c1218]/10">
                            <LayoutDashboard className="h-5 w-5 text-[#8c1218]" />

                            <span className="font-medium">Dashboard</span>
                          </Link>
                        </SheetClose>

                        <button
                          onClick={logout}
                          className="flex w-full items-center gap-3 rounded-2xl border  border-red-500/10 px-4 py-4  text-red-400 transition-all duration-300  hover:bg-red-500/10  hover:border-red-500/30">
                          <LogOut className="h-5 w-5" />

                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <LoginButton />

                      <Button className="w-full rounded-none bg-[#8c1218] hover:bg-[#c92a2a] [clip-path:polygon(8%_0,100%_0,100%_100%,0_100%,0_28%)]">
                        Apply
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
