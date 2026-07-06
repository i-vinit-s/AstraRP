"use client";

import {
  CalendarDays,
  Copy,
  Hash,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function ProfileInfo() {
  const { user } = useAuth();

  if (!user) return null;

  const joined = new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const lastLogin = user.lastLogin
    ? new Date(user.lastLogin).toLocaleString("en-IN")
    : "Never";

  const cards = [
    {
      icon: Hash,
      title: "Discord ID",
      value: user.discordId,
      copy: true,
    },
    {
      icon: UserRound,
      title: "Username",
      value: `@${user.username}`,
    },
    {
      icon: UserRound,
      title: "Display Name",
      value: user.globalName || user.username,
    },
    {
      icon: Mail,
      title: "Email",
      value: user.email || "Not Available",
    },
    {
      icon: CalendarDays,
      title: "Joined Astra",
      value: joined,
    },
    {
      icon: CalendarDays,
      title: "Last Login",
      value: lastLogin,
    },
    {
      icon: ShieldCheck,
      title: "Whitelist",
      value: user.isWhitelisted ? "Approved" : "Not Whitelisted",
      color: user.isWhitelisted ? "text-green-400" : "text-yellow-400",
    },
    {
      icon: ShieldCheck,
      title: "Application",
      value:
        user.applicationStatus?.charAt(0).toUpperCase() +
          user.applicationStatus?.slice(1) || "None",
      color:
        user.applicationStatus === "accepted"
          ? "text-green-400"
          : user.applicationStatus === "pending"
            ? "text-yellow-400"
            : user.applicationStatus === "rejected"
              ? "text-red-400"
              : "",
    },
  ];

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <section>
      <div className="mb-10">
        <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#d65b5b]">
          Account Overview
        </span>

        <h2 className="mt-5 text-4xl font-black uppercase">
          Your
          <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
            Information
          </span>
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-3xl border  border-white/10  bg-[#111111]/60 p-6 backdrop-blur-xl transition-all duration-300  hover:border-[#8c1218]/30"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#8c1218]/10 blur-3xl" />

              <div className="relative flex items-start justify-between">
                <div className="rounded-2xl border border-[#8c1218]/20 bg-[#8c1218]/10 p-3">
                  <Icon className="h-5 w-5 text-[#8c1218]" />
                </div>

                {item.copy && (
                  <button
                    onClick={() => copy(item.value)}
                    className="rounded-xl p-2 transition hover:bg-white/5"
                  >
                    <Copy className="h-4 w-4 text-zinc-500" />
                  </button>
                )}
              </div>

              <p className="mt-8 text-xs uppercase tracking-[0.25em] text-zinc-500">
                {item.title}
              </p>

              <h3
                className={`mt-3 break-all text-lg font-semibold ${item.color || ""}`}
              >
                {item.value}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}
