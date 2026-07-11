"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FileText, LayoutDashboard, Menu, Settings2 } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  {
    name: "Dashboard",
    href: "/staff",
    icon: LayoutDashboard,
  },
  {
    name: "Applications",
    href: "/staff/applications",
    icon: FileText,
  },
  {
    name: "Manage Applications",
    href: "/staff/application-management",
    icon: Settings2,
  },
];

export default function StaffSidebar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#0d0d0d]/95 px-5 backdrop-blur lg:hidden">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#a71920]">
            Astra Roleplay
          </p>

          <h2 className="text-lg font-bold text-white">Staff Panel</h2>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="rounded-lg border border-white/10 p-2 transition hover:bg-white/5">
              <Menu size={22} />
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-72 border-white/10 bg-[#0d0d0d] p-0"
          >
            <SidebarContent pathname={pathname} close={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/5 bg-[#0d0d0d] lg:block">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}

function SidebarContent({ pathname, close }) {
  return (
    <>
      <div className="border-b border-white/5 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a71920]">
          Astra Roleplay
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">Staff Panel</h2>
      </div>

      <nav className="space-y-2 p-5">
        {links.map((link) => {
          const Icon = link.icon;

          const active =
            link.href === "/staff"
              ? pathname === "/staff"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className={`flex items-center gap-4 rounded-xl px-5 py-4 text-sm font-medium transition ${
                active
                  ? "bg-[#8c1218]/15 text-[#d13a3f]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={20} />

              {link.name}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
