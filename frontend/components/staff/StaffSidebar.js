"use client";

import Link from "next/link";
import { LayoutDashboard, FileText, Users } from "lucide-react";

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
    name: "Users",
    href: "/staff/users",
    icon: Users,
  },
];

export default function StaffSidebar() {
  return (
    <aside className="sticky top-0 h-screen w-72 border-r border-white/5 bg-[#0d0d0d]">
      <div className="border-b border-white/5 p-8">
        <h2 className="text-2xl font-bold">Astra Staff</h2>
      </div>

      <nav className="space-y-2 p-5">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-4 rounded-xl px-5 py-4 text-zinc-400 transition hover:bg-white/5 hover:text-white"
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
