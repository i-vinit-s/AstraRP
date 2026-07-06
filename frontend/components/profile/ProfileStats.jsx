"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Shield,
  UserCircle,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import siteConfig from "@/config/site";

export default function ProfileStats() {
  const { user } = useAuth();

  const actions = [
    {
      title: "Whitelist",
      description:
        user?.applicationStatus === "none"
          ? "Start your application"
          : "View your application",
      href: "/whitelist",
      icon: FileText,
      show: true,
    },
    {
      title: "Discord",
      description: "Join our community",
      href: siteConfig.discordUrl,
      icon: MessageCircle,
      external: true,
      show: true,
    },
    {
      title: "Rules",
      description: "Read server rules",
      href: "/rules",
      icon: Shield,
      show: true,
    },
    {
      title: "Staff Dashboard",
      description: "Moderation panel",
      href: "/staff",
      icon: LayoutDashboard,
      show: user?.canAccessStaffDashboard || false,
    },
  ];

  return (
    <section>
      <div className="mb-10">
        <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#d65b5b]">
          Quick Actions
        </span>

        <h2 className="mt-5 text-4xl font-black uppercase">
          Everything
          <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
            You Need
          </span>
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {actions
          .filter((item) => item.show)
          .map((action) => {
            const Icon = action.icon;

            const Card = (
              <div
                className="group relative overflow-hidden rounded-3xl border  border-white/10  bg-white/3 p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2  hover:border-[#8c1218]/40">
                {/* Glow */}

                <div className="absolute inset-0 bg-linear-to-br from-[#8c1218]/0 via-[#8c1218]/5 to-[#8c1218]/10 opacity-0 transition duration-500 group-hover:opacity-100" />

                <div className="relative flex items-center justify-between">
                  <div className="rounded-2xl border border-[#8c1218]/20 bg-[#8c1218]/10 p-4">
                    <Icon className="h-7 w-7 text-[#8c1218]" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white" />
                </div>

                <h3 className="relative mt-8 text-2xl font-bold uppercase">
                  {action.title}
                </h3>

                <p className="relative mt-3 leading-7 text-zinc-400">
                  {action.description}
                </p>

                <div className="mt-8 h-px w-16 bg-linear-to-r from-[#8c1218] to-transparent transition-all duration-500 group-hover:w-full" />
              </div>
            );

            if (action.external) {
              return (
                <a
                  key={action.title}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {Card}
                </a>
              );
            }

            return (
              <Link key={action.title} href={action.href}>
                {Card}
              </Link>
            );
          })}
      </div>
    </section>
  );
}
