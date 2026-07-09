"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  RotateCcw,
  XCircle,
} from "lucide-react";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function StatusBanner({
  type,
  application,
  applicationDefinition,
  canReapply = false,
  cooldownEnds,
  reloadApplication,
}) {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const applicationTitle = applicationDefinition?.title || "Application";

  const applicationSlug =
    applicationDefinition?.slug || application?.applicationSlug;

  const config = {
    pending: {
      icon: Clock3,
      glow: "bg-yellow-500/15",
      color: "text-yellow-400",
      badge: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
      stroke: "[-webkit-text-stroke:1px_#facc15]",
      title: "Application Pending",
      subtitle: "Awaiting Review",
      description: `Your ${applicationTitle} has been submitted successfully. Our staff team will review it as soon as possible.`,
    },

    accepted: {
      icon: CheckCircle2,
      glow: "bg-emerald-500/15",
      color: "text-emerald-400",
      badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      stroke: "[-webkit-text-stroke:1px_#22c55e]",
      title: "Application Accepted",
      subtitle: "Application Approved",
      description: `Your ${applicationTitle} has been approved successfully.`,
    },

    rejected: {
      icon: XCircle,
      glow: "bg-red-500/15",
      color: "text-red-400",
      badge: "border-red-500/20 bg-red-500/10 text-red-400",
      stroke: "[-webkit-text-stroke:1px_#ef4444]",
      title: "Application Rejected",
      subtitle: "Application Declined",
      description:
        application?.reviewReason ||
        application?.review?.reason ||
        `Your ${applicationTitle} was not accepted this time.`,
    },
  };

  const current = config[type] || config.pending;
  const Icon = current.icon;

  /*
  |--------------------------------------------------------------------------
  | Cooldown Countdown
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!cooldownEnds || canReapply) {
      return;
    }

    let reloading = false;

    const update = () => {
      const difference = new Date(cooldownEnds).getTime() - Date.now();

      if (difference <= 0) {
        if (!reloading) {
          reloading = true;
          void reloadApplication?.();
        }

        return;
      }

      setCountdown({
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(
          2,
          "0",
        ),

        hours: String(
          Math.floor((difference / (1000 * 60 * 60)) % 24),
        ).padStart(2, "0"),

        minutes: String(Math.floor((difference / (1000 * 60)) % 60)).padStart(
          2,
          "0",
        ),

        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
      });
    };

    update();

    const interval = window.setInterval(update, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [cooldownEnds, canReapply, reloadApplication]);

  /*
  |--------------------------------------------------------------------------
  | Create New Attempt
  |--------------------------------------------------------------------------
  */

  async function createNewApplication() {
    if (!applicationSlug || creating) {
      return;
    }

    try {
      setCreating(true);
      setError("");

      await api.post(`/applications/${applicationSlug}/new`);

      await reloadApplication?.();
    } catch (error) {
      console.error("CREATE NEW APPLICATION ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create a new application attempt.",
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090909] px-4 pb-24 pt-32 sm:px-6 lg:px-8 lg:pt-36">
      {/* Background */}

      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div
        className={`pointer-events-none absolute left-1/2 top-40 -z-10 h-100 w-100 -translate-x-1/2 rounded-full blur-[180px] sm:h-137.5 sm:w-137.5 ${current.glow}`}
      />

      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-[36px] border border-white/10 bg-[#111111]/80 backdrop-blur-xl">
          {/* Hero */}

          <div className="px-5 py-10 text-center sm:px-8 sm:py-14 lg:px-16 lg:py-16">
            <span
              className={`inline-flex rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] sm:px-5 sm:text-xs sm:tracking-[0.35em] ${current.badge}`}
            >
              {current.subtitle}
            </span>

            <div
              className={`mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full sm:mt-10 sm:h-28 sm:w-28 ${current.glow}`}
            >
              <Icon className={`h-10 w-10 sm:h-14 sm:w-14 ${current.color}`} />
            </div>

            <h1 className="mt-8 text-3xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
              {current.title.split(" ")[0]}

              <span className={`block text-transparent ${current.stroke}`}>
                {current.title.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:mt-8 sm:text-lg sm:leading-8">
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
                  : type === "pending"
                    ? "Awaiting Review"
                    : "-"
              }
            />
          </div>

          {/* Staff Response */}

          {(application?.reviewReason || application?.review?.reason) && (
            <div className="border-b border-white/10 p-5 sm:p-8">
              <h3 className="mb-4 text-xl font-semibold text-white">
                Staff Response
              </h3>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 leading-7 text-zinc-300 sm:p-6 sm:leading-8">
                {application.reviewReason || application.review.reason}
              </div>
            </div>
          )}

          {/* Actions */}

          <div className="p-5 sm:p-8 lg:p-10">
            {error && (
              <div className="mx-auto mb-6 max-w-2xl rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-center">
                <p className="text-sm leading-6 text-red-400">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
              <Button
                asChild
                size="lg"
                className="h-12 w-full rounded-xl bg-[#8c1218] px-8 text-white hover:bg-[#a41717] sm:h-14 sm:w-auto"
              >
                <Link href="/applications">View Applications</Link>
              </Button>

              {type === "accepted" && applicationDefinition?.discordUrl && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 w-full rounded-xl border-white/10 bg-white/3 px-8 text-white hover:border-[#8c1218] hover:bg-[#8c1218]/10 sm:h-14 sm:w-auto"
                >
                  <Link
                    href={applicationDefinition.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Discord
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}

              {type === "rejected" &&
                (canReapply ? (
                  <Button
                    type="button"
                    size="lg"
                    disabled={creating}
                    onClick={createNewApplication}
                    className="h-12 w-full rounded-xl bg-[#8c1218] px-8 text-white hover:bg-[#a41717] disabled:opacity-60 sm:h-14 sm:w-auto"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Create New Application
                      </>
                    )}
                  </Button>
                ) : cooldownEnds ? (
                  <div className="w-full">
                    <p className="mb-6 text-center text-sm uppercase tracking-[0.35em] text-red-400">
                      Reapply Available In
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-center sm:gap-4">
                      <CountdownCard value={countdown.days} label="Days" />

                      <CountdownCard value={countdown.hours} label="Hours" />

                      <CountdownCard
                        value={countdown.minutes}
                        label="Minutes"
                      />

                      <CountdownCard
                        value={countdown.seconds}
                        label="Seconds"
                      />
                    </div>
                  </div>
                ) : null)}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
        {label}
      </p>

      <h3
        className={`mt-3 wrap-break-word text-base font-semibold capitalize sm:text-lg ${
          color || "text-white"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function CountdownCard({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center sm:w-28 sm:p-5">
      <p className="text-3xl font-black text-white sm:text-4xl">{value}</p>

      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </p>
    </div>
  );
}
