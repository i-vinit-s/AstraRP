"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  XCircle,
} from "lucide-react";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function StaffDashboard() {
  const { user } = useAuth();
  const {
    data: applications = [],
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useQuery({
    queryKey: ["staff-applications", "pending", ""],

    queryFn: async () => {
      const { data } = await api.get("/staff/applications?status=pending");

      return data.applications || [];
    },
    enabled: !!user.canViewApplications,
  });

  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ["staff-dashboard"],

    queryFn: async () => {
      const { data } = await api.get("/staff/dashboard");

      return data;
    },
    enabled: !!user.isStaff,
  });

  const stats = dashboard?.stats;

  const isLoading = applicationsLoading || dashboardLoading;

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      {/* Header */}

      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#a71920]">
            Astra Staff
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            Dashboard
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
            Review and manage application submissions across Astra Roleplay.
          </p>
        </div>

        {user?.canViewApplications && (
          <Link
            href="/staff/applications"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#8c1218] px-6 text-sm font-medium text-white transition hover:bg-[#a41717]"
          >
            View Applications
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Stats */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pending"
          value={stats?.pendingApplications}
          loading={dashboardLoading}
          icon={Clock3}
          iconClassName="text-yellow-400"
          iconBackground="border-yellow-500/20 bg-yellow-500/10"
        />

        <StatCard
          title="Approved Today"
          value={stats?.approvedToday}
          loading={dashboardLoading}
          icon={CheckCircle2}
          iconClassName="text-emerald-400"
          iconBackground="border-emerald-500/20 bg-emerald-500/10"
        />

        <StatCard
          title="Rejected"
          value={stats?.rejectedApplications}
          loading={dashboardLoading}
          icon={XCircle}
          iconClassName="text-red-400"
          iconBackground="border-red-500/20 bg-red-500/10"
        />

        <StatCard
          title="Total Submissions"
          value={stats?.totalApplications}
          loading={dashboardLoading}
          icon={FileText}
          iconClassName="text-[#c92a2a]"
          iconBackground="border-[#8c1218]/20 bg-[#8c1218]/10"
        />
      </div>

      {/* Pending applications */}

      {user?.canViewApplications && (
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:px-8">
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Pending Applications
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Applications currently waiting for staff review.
              </p>
            </div>

            <Link
              href="/staff/applications"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#c92a2a] transition hover:text-red-400"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {applicationsLoading && (
            <div className="flex min-h-80 items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#8c1218]" />

                <p className="mt-4 text-sm text-zinc-500">
                  Loading applications...
                </p>
              </div>
            </div>
          )}

          {!applicationsLoading && applicationsError && (
            <div className="m-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-400 sm:m-8">
              {applicationsError.response?.data?.message ||
                "Failed to load pending applications."}
            </div>
          )}

          {!applicationsLoading &&
            !applicationsError &&
            applications.length === 0 && (
              <div className="px-6 py-20 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <CheckCircle2 className="h-7 w-7 text-zinc-600" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  No pending applications
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  There are currently no submissions waiting for review.
                </p>
              </div>
            )}

          {!applicationsLoading &&
            !applicationsError &&
            applications.length > 0 && (
              <div className="divide-y divide-white/5">
                {applications.slice(0, 6).map((submission) => (
                  <PendingApplicationRow
                    key={submission._id}
                    submission={submission}
                  />
                ))}
              </div>
            )}
        </section>
      )}
    </div>
  );
}

function PendingApplicationRow({ submission }) {
  const user = submission.user;
  const application = submission.application;

  return (
    <Link
      href={`/staff/applications/${submission._id}`}
      className="group flex flex-col justify-between gap-5 p-6 transition hover:bg-white/2.5 sm:px-8 md:flex-row md:items-center"
    >
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#8c1218]/20 bg-[#8c1218]/10">
          <FileText className="h-5 w-5 text-[#c92a2a]" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-white">
              {user?.globalName || user?.username || "Unknown Applicant"}
            </h3>

            <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-[11px] font-semibold text-yellow-400">
              Pending
            </span>
          </div>

          <p className="mt-1 text-sm text-zinc-500">
            @{user?.username || "unknown"}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-600">
            <span>{application?.title || "Unknown application"}</span>

            <span>Attempt #{submission.attempt || 1}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-5 md:justify-end">
        <div className="text-left md:text-right">
          <p className="text-sm text-zinc-400">
            {submission.submittedAt
              ? new Date(submission.submittedAt).toLocaleString()
              : "Not submitted"}
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            {application?.category || "Uncategorized"}
          </p>
        </div>

        <ArrowRight className="h-5 w-5 text-zinc-700 transition group-hover:translate-x-1 group-hover:text-[#c92a2a]" />
      </div>
    </Link>
  );
}

function StatCard({
  title,
  value,
  loading,
  icon: Icon,
  iconClassName,
  iconBackground,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-zinc-500">{title}</p>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${iconBackground}`}
        >
          <Icon className={`h-5 w-5 ${iconClassName}`} />
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="h-10 w-20 animate-pulse rounded-lg bg-white/5" />
        ) : (
          <p className="text-4xl font-bold text-white">{value ?? 0}</p>
        )}
      </div>
    </div>
  );
}
