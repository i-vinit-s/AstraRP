"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, Settings2 } from "lucide-react";

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

  return (
    <aside className="sticky top-0 h-screen w-72 shrink-0 border-r border-white/5 bg-[#0d0d0d]">
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
    </aside>
  );
}
