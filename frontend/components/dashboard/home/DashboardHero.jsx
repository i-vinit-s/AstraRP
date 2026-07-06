"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardHero() {
  const { user } = useAuth();

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  return (
    <section className="rounded-3xl border border-white/10 bg-linear-to-r from-[#111111] to-[#1a0a0a] p-8">
      <p className="text-zinc-400">{greeting},</p>

      <h1 className="mt-2 text-4xl font-bold">
        {user?.globalName || user?.username} 👋
      </h1>

      <p className="mt-5 max-w-2xl text-zinc-500">
        Welcome back to Astra Roleplay. Continue your whitelist journey and stay
        updated with the latest community announcements.
      </p>
    </section>
  );
}
