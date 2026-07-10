"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Lock,
  LogIn,
  ShoppingBag,
  XCircle,
  Shield,
  Star,
  BriefcaseBusiness,
  Ambulance,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const icons = {
  shield: Shield,
  star: Star,
  ambulance: Ambulance,
  business: BriefcaseBusiness,
  users: Users,
};

const badgeColors = {
  green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  orange: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  red: "border-red-500/20 bg-red-500/10 text-red-400",
  gray: "border-white/10 bg-white/5 text-zinc-300",
};

export default function ApplicationCard({ application }) {
  const Icon = icons[application.icon?.toLowerCase()] ?? Shield;

  function getStatus() {
    switch (application.action) {
      case "accepted":
        return {
          icon: CheckCircle2,
          color: "text-emerald-400",
          label: "Accepted",
        };

      case "pending":
        return {
          icon: Clock3,
          color: "text-yellow-400",
          label: "Under Review",
        };

      case "result":
        return {
          icon: XCircle,
          color: "text-red-400",
          label: "Rejected",
        };

      case "continue":
        return {
          icon: ArrowRight,
          color: "text-blue-400",
          label: "Draft Saved",
        };

      case "purchase":
      case "locked":
        return {
          icon: Lock,
          color: "text-zinc-400",
          label: "Locked",
        };

      case "login":
        return {
          icon: LogIn,
          color: "text-zinc-400",
          label: "Login Required",
        };

      default:
        return {
          icon: CheckCircle2,
          color: "text-emerald-400",
          label: "Available",
        };
    }
  }

  const status = getStatus();

  const StatusIcon = status.icon;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111111]/70 p-7 backdrop-blur-xl transition-all duration-300 hover:border-[#8c1218]/30">
      {/* Badge */}

      {application.badge && (
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${
            badgeColors[application.badge.color] ?? badgeColors.gray
          }`}
        >
          {application.badge.text}
        </span>
      )}

      {/* Title */}

      <div className="mt-6">
        <h3 className="text-2xl font-bold">{application.title}</h3>

        <p className="mt-3 text-sm leading-7 text-zinc-400">
          {application.description}
        </p>
      </div>

      {/* Lock reason */}

      {application.lockReason && (
        <p className="mt-5 text-sm text-zinc-500">{application.lockReason}</p>
      )}

      {/* Button */}

      <div className="mt-8">
        {application.action === "purchase" ? (
          <Button className="h-12 w-full rounded-xl bg-[#8c1218] hover:bg-[#a41717]">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Buy Priority
          </Button>
        ) : application.action === "locked" ? (
          <Button
            disabled
            className="h-12 w-full rounded-xl bg-white/5 text-zinc-500"
          >
            <Lock className="mr-2 h-4 w-4" />
            Locked
          </Button>
        ) : application.action === "login" ? (
          <Button className="h-12 w-full rounded-xl bg-[#8c1218] hover:bg-[#a41717]">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        ) : (
          <Button
            asChild
            className="h-12 w-full rounded-xl bg-[#8c1218] hover:bg-[#a41717]"
          >
            <Link href={application.route}>{application.buttonText}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
