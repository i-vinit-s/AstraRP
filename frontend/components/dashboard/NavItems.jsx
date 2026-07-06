"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({ href, icon: Icon, label }) {
  const pathname = usePathname();

  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300
      ${
        active
          ? "bg-[#8c1218] text-white"
          : "text-zinc-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon size={20} />
      {label}
    </Link>
  );
}
