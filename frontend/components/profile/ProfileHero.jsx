"use client";

import Image from "next/image";
import { ShieldCheck, Clock3, CalendarDays } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileHero() {
  const { user } = useAuth();

  if (!user) return null;

  const joined = new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const lastLogin = user.lastLogin
    ? new Date(user.lastLogin).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Never";

  return (
    <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-[#111111]/70 backdrop-blur-xl">
      {/* Grid */}

      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-size-[50px_50px]" />

      {/* Glow */}

      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#8c1218]/20 blur-[140px]" />

      <div className="relative p-6 md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}

          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#8c1218]/30 blur-xl" />

              <Image
                src={user.avatar}
                alt={user.username}
                width={140}
                height={140}
                referrerPolicy="no-referrer"
                className="relative h-28 w-28 rounded-full border-4 border-[#8c1218]/40 object-cover md:h-36 md:w-36"
              />
            </div>

            <div>
              <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-[#d65b5b]">
                Astra Account
              </span>

              <h2 className="mt-5 text-3xl font-black uppercase md:text-5xl">
                {user.globalName || user.username}
              </h2>

              <p className="mt-2 text-lg text-zinc-400">@{user.username}</p>

              <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
                  ● Connected
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-sm ${
                    user.isWhitelisted
                      ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : "border border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {user.isWhitelisted ? "Whitelisted" : "Not Whitelisted"}
                </span>
              </div>
            </div>
          </div>

          {/* Right */}

          <div className="grid w-full gap-4 sm:grid-cols-3 lg:w-auto">
            <InfoCard icon={CalendarDays} title="Member Since" value={joined} />

            <InfoCard icon={Clock3} title="Last Login" value={lastLogin} />

            <InfoCard
              icon={ShieldCheck}
              title="Application"
              value={user.applicationStatus || "None"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
      <Icon className="h-6 w-6 text-[#8c1218]" />

      <p className="mt-4 text-xs uppercase tracking-[0.25em] text-zinc-500">
        {title}
      </p>

      <h3 className="mt-2 font-semibold text-white">{value}</h3>
    </div>
  );
}
