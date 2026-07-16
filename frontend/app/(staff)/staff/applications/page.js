"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  Clock3,
  FileText,
  Filter,
  Loader2,
  Search,
} from "lucide-react";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const statusFilters = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "draft", label: "Draft" },
  { value: "all", label: "All" },
];

export default function StaffApplicationsPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState("pending");
  const [applicationType, setApplicationType] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["staff-applications", status, applicationType, search, page],
    enabled: !!user?.canViewApplications,
    queryFn: async () => {
      const params = new URLSearchParams();

      params.set("page", page);
      params.set("limit", PAGE_SIZE);

      if (status) {
        params.set("status", status);
      }

      if (applicationType) {
        params.set("application", applicationType);
      }

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const { data } = await api.get(
        `/staff/applications?${params.toString()}`,
      );

      return data;
    },
  });

  const applications = data?.applications ?? [];

  const pagination = data?.pagination;

  const applicationTypes = Array.from(
    new Map(
      applications
        .filter((submission) => submission.application)
        .map((submission) => [
          submission.application.slug,
          submission.application,
        ]),
    ).values(),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}

      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#a71920]">
            Astra Staff
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            Applications
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Review and manage application submissions across Astra Roleplay.
          </p>
        </div>

        <div className="flex min-w-40 items-center gap-4 rounded-2xl border border-white/10 bg-[#111111] px-5 py-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#8c1218]/20 bg-[#8c1218]/10">
            <FileText className="h-5 w-5 text-[#c92a2a]" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-600">
              Results
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {pagination?.total ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}

      <section className="rounded-3xl border border-white/10 bg-[#111111] p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          {/* Status filters */}

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => {
              const active = status === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    setStatus(filter.value);
                    setPage(1);
                  }}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-[#8c1218] text-white"
                      : "border border-white/10 bg-white/5 text-zinc-400 hover:border-[#8c1218]/40 hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]">
            {/* Search */}

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search applicant, Discord ID or application..."
                className="h-12 w-full rounded-xl border border-white/10 bg-[#090909] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#8c1218]/60"
              />
            </div>

            {/* Application type */}

            <div className="relative">
              <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

              <select
                value={applicationType}
                onChange={(e) => {
                  setApplicationType(e.target.value);
                  setPage(1);
                }}
                className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-[#090909] pl-11 pr-10 text-sm text-zinc-300 outline-none transition focus:border-[#8c1218]/60"
              >
                <option value="">All application types</option>

                {applicationTypes.map((application) => (
                  <option key={application.slug} value={application.slug}>
                    {application.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Loading */}

      {isLoading && (
        <div className="flex min-h-96 items-center justify-center rounded-3xl border border-white/10 bg-[#111111]">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#8c1218]" />

            <p className="mt-4 text-sm text-zinc-500">
              Loading applications...
            </p>
          </div>
        </div>
      )}

      {/* Error */}

      {!isLoading && error && (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
          {error.response?.data?.message || "Failed to load applications."}
        </div>
      )}

      {/* Applications */}

      {!isLoading && !error && applications.length > 0 && (
        <div className="space-y-3">
          {applications.map((submission) => (
            <ApplicationRow key={submission._id} submission={submission} />
          ))}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111111] px-5 py-4">
              <p className="text-sm text-zinc-500">
                Showing {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={!pagination.hasPrevious}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#8c1218]/40"
                >
                  Previous
                </button>

                <span className="rounded-xl border border-white/10 px-4 py-2 text-sm">
                  {pagination.page} / {pagination.totalPages}
                </span>

                <button
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#8c1218]/40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty */}

      {!isLoading && !error && applications.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#111111] px-6 py-24 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <FileText className="h-7 w-7 text-zinc-600" />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-white">
            No applications found
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            No submissions match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}

function ApplicationRow({ submission }) {
  const { user: currentUser } = useAuth();
  const user = submission.user;
  const application = submission.application;
  const canReview = currentUser?.canReviewApplications;

  const content = (
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#8c1218]/20 bg-[#8c1218]/10">
          <FileText className="h-5 w-5 text-[#c92a2a]" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-semibold text-white">
              {user?.globalName || user?.username || "Unknown Applicant"}
            </h2>

            <StatusBadge status={submission.status} />
          </div>

          <p className="mt-1 text-sm text-zinc-500">
            @{user?.username || "unknown"}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-600">
            <span>{application?.title || "Unknown application"}</span>

            <span>Attempt #{submission.attempt || 1}</span>

            {user?.discordId && (
              <span className="font-mono">{user.discordId}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-5 md:justify-end">
        <div className="text-left md:text-right">
          <div className="flex items-center gap-2 text-sm text-zinc-400 md:justify-end">
            <Clock3 className="h-4 w-4 text-zinc-600" />

            {submission.submittedAt
              ? new Date(submission.submittedAt).toLocaleString()
              : "Not submitted"}
          </div>

          <p className="mt-1 text-xs text-zinc-600">
            {application?.category || "Uncategorized"}
          </p>
        </div>

        <ChevronRight className="h-5 w-5 text-zinc-700 transition group-hover:translate-x-1 group-hover:text-[#c92a2a]" />
      </div>
    </div>
  );

  if (!canReview) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-6">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/staff/applications/${submission._id}`}
      className="group block rounded-2xl border border-white/10 bg-[#111111] p-5 transition hover:border-[#8c1218]/40 hover:bg-[#131313] sm:p-6"
    >
      {content}
    </Link>
  );
}

function StatusBadge({ status }) {
  const styles = {
    draft: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    pending: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    accepted: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    rejected: "border-red-500/20 bg-red-500/10 text-red-400",
    closed: "border-white/10 bg-white/5 text-zinc-400",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${
        styles[status] || styles.closed
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}
