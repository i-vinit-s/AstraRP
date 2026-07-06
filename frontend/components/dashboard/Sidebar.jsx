"use client";

import { Home, User } from "lucide-react";

import NavItem from "./NavItems";

const nav = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 border-r border-white/5 bg-[#0c0c0c] lg:flex lg:flex-col">
      <div className="border-b border-white/5 p-8">
        <h2 className="text-2xl font-bold uppercase">Astra</h2>

        <p className="mt-2 text-sm text-zinc-500">Dashboard</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-5">
        {nav.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
    </aside>
  );
}
