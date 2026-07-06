"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-[#090909]/80 px-8 backdrop-blur-xl">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <p className="mt-1 text-sm text-zinc-500">
          Welcome back, {user?.globalName || user?.username}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Image
          src={user?.avatar}
          alt=""
          height={128}
          width={128}
          className="h-11 w-11 rounded-full border border-white/10"
        />
      </div>
    </header>
  );
}
