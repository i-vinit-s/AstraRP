"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function StatusBanner({
  type,
  application,
  canReapply = false,
  cooldownEnds,
  reloadApplication,
}) {
  const config = {
    pending: {
      icon: Clock3,
      glow: "bg-yellow-500/15",
      color: "text-yellow-400",
      badge: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
      title: "Application Pending",
      subtitle: "Awaiting Review",
      description:
        "Your whitelist application has been submitted successfully. Our staff team will review it as soon as possible.",
    },

    accepted: {
      icon: CheckCircle2,
      glow: "bg-emerald-500/15",
      color: "text-emerald-400",
      badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      title: "Application Accepted",
      subtitle: "Welcome to Astra",
      description:
        "Congratulations! Your whitelist application has been approved. Welcome to Astra Roleplay.",
    },

    rejected: {
      icon: XCircle,
      glow: "bg-red-500/15",
      color: "text-red-400",
      badge: "border-red-500/20 bg-red-500/10 text-red-400",
      title: "Application Rejected",
      subtitle: "Better Luck Next Time",
      description:
        application?.reviewReason ||
        "Unfortunately your application wasn't accepted this time.",
    },
  };

  const current = config[type];
  const Icon = current.icon;
  const [countdown, setCountdown] = useState({
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
});

  useEffect(() => {
  if (!cooldownEnds || canReapply) return;

  const update = () => {
    const diff = new Date(cooldownEnds).getTime() - Date.now();

    if (diff <= 0) {
      reloadApplication?.();
      return;
    }

    setCountdown({
      days: String(
        Math.floor(diff / (1000 * 60 * 60 * 24))
      ).padStart(2, "0"),

      hours: String(
        Math.floor((diff / (1000 * 60 * 60)) % 24)
      ).padStart(2, "0"),

      minutes: String(
        Math.floor((diff / (1000 * 60)) % 60)
      ).padStart(2, "0"),

      seconds: String(
        Math.floor((diff / 1000) % 60)
      ).padStart(2, "0"),
    });
  };

  update();

  const interval = setInterval(update, 1000);

  return () => clearInterval(interval);
}, [cooldownEnds, canReapply, reloadApplication]);

async function createNewApplication() {
  try {
    await api.post("/applications/new");

    await reloadApplication?.();
  } catch (err) {
    console.error(err);
  }
}

  return (
    <section className="relative overflow-hidden">
      {/* Background */}

      <div className="absolute inset-0 -z-20 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div
        className={`absolute left-1/2 top-40 -z-10 h-137.5 w-137.5 -translate-x-1/2 rounded-full ${current.glow} blur-[180px]`}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-[36px] border border-white/10 bg-[#111111]/70 backdrop-blur-xl">
          {/* Hero */}

          <div className="px-5 py-10 text-center sm:px-8 sm:py-14 lg:px-16 lg:py-16">
            <span
              className={`inline-flex rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.28em] sm:px-5 sm:text-xs sm:tracking-[0.35em] ${current.badge}`}
            >
              {current.subtitle}
            </span>

            <div
              className={`mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full sm:mt-10 sm:h-28 sm:w-28 ${current.glow}`}
            >
              <Icon className={`${current.color} h-10 w-10 sm:h-14 sm:w-14`} />
            </div>

            <h1
              className="mt-8 text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:text-6xl"
            >
              {current.title.split(" ")[0]}

              <span
                className={`block text-transparent ${
                  type === "accepted"
                    ? "[-webkit-text-stroke:1px_#22c55e]"
                    : type === "pending"
                      ? "[-webkit-text-stroke:1px_#facc15]"
                      : "[-webkit-text-stroke:1px_#ef4444]"
                }`}
              >
                {current.title.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            <p
              className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:mt-8 sm:text-lg sm:leading-8"
            >
              {current.description}
            </p>
          </div>

          {/* Details */}

          <div className="grid gap-4 border-y border-white/10 p-5 sm:p-8 md:grid-cols-3">
            <InfoCard
              label="Status"
              value={application?.status || type}
              color={current.color}
            />

            <InfoCard
              label="Submitted"
              value={
                application?.submittedAt
                  ? new Date(application.submittedAt).toLocaleString()
                  : "-"
              }
            />

            <InfoCard
              label="Reviewed"
              value={
                application?.reviewedAt
                  ? new Date(application.reviewedAt).toLocaleString()
                  : "Awaiting Review"
              }
            />
          </div>

          {/* Staff Response */}

          {application?.reviewReason && (
            <div className="border-b border-white/10 p-5 sm:p-8">
              <h3 className="mb-4 text-xl font-semibold">Staff Response</h3>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 leading-7 text-zinc-300 sm:p-6 sm:leading-8">
                {application.reviewReason}
              </div>
            </div>
          )}

          {/* Actions */}

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:flex-wrap sm:justify-center sm:p-10">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-xl sm:h-14 sm:w-auto bg-[#8c1218] px-8 hover:bg-[#a41717]"
            >
              <Link href="/">Go to HomePage</Link>
            </Button>

            {type === "accepted" && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 w-full rounded-xl sm:h-14 sm:w-auto border-white/10 bg-white/3 px-8 text-white hover:border-[#8c1218] hover:bg-[#8c1218]/10"
              >
                <Link href="https://discord.gg/yourinvite" target="_blank">
                  Join Discord
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}

            {type === "rejected" &&
              (canReapply ? (
                <Button
                  size="lg"
                  onClick={createNewApplication}
                  className="h-12 w-full rounded-xl sm:h-14 sm:w-auto bg-[#8c1218] px-8 hover:bg-[#a41717]"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Create New Application
                </Button>
              ) : (
                <div className="w-full">
                  <p className="mb-6 text-center text-sm uppercase tracking-[0.35em] text-red-400">
                    Reapply Available In
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-center sm:gap-4">
                    <CountdownCard value={countdown.days} label="Days" />

                    <CountdownCard value={countdown.hours} label="Hours" />

                    <CountdownCard value={countdown.minutes} label="Minutes" />

                    <CountdownCard value={countdown.seconds} label="Seconds" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
        {label}
      </p>

      <h3
  className={`mt-3 wrap-break-word text-base font-semibold sm:text-lg ${color || ""}`}
>{value}</h3>
    </div>
  );
}

function CountdownCard({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center sm:w-28 sm:p-5">
      <p className="text-3xl font-black sm:text-4xl">{value}</p>

      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </p>
    </div>
  );
}