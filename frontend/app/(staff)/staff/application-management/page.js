"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  ArrowRight,
  BriefcaseBusiness,
  FileQuestion,
  FileText,
  Loader2,
  Lock,
  Plus,
  Power,
  Users,
} from "lucide-react";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function ApplicationManagementPage() {
  const queryClient = useQueryClient();
  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["application-definitions"],

    queryFn: async () => {
      const { data } = await api.get("/staff/application-definitions");

      return data.applications || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#8c1218]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-400">
        Failed to load application definitions.
      </div>
    );
  }

  const openApplications = applications.filter(
    (application) => application.enabled,
  ).length;

  const closedApplications = applications.length - openApplications;

  const totalSubmissions = applications.reduce(
    (total, application) => total + (application.submissionCount || 0),
    0,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[#8c1218]">
            Astra Staff
          </p>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Application Management
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
            Create, configure and manage every application available to the
            Astra RP community.
          </p>
        </div>

        <Button
          asChild
          className="h-11 bg-[#8c1218] px-5 text-white hover:bg-[#a41717]"
        >
          <Link href="/staff/application-management/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Application
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Applications"
          value={applications.length}
          icon={BriefcaseBusiness}
        />

        <StatCard title="Open" value={openApplications} icon={FileText} />

        <StatCard
          title="Closed"
          value={closedApplications}
          icon={FileQuestion}
        />

        <StatCard
          title="Total Submissions"
          value={totalSubmissions}
          icon={Users}
        />
      </div>

      {!applications.length ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#111111] px-6 py-24 text-center">
          <BriefcaseBusiness className="mx-auto text-zinc-700" size={42} />

          <h2 className="mt-6 text-2xl font-semibold">No applications yet</h2>

          <p className="mx-auto mt-3 max-w-md leading-7 text-zinc-500">
            Create your first application definition and configure its
            questions, sections and access requirements.
          </p>

          <Button
            asChild
            className="mt-7 bg-[#8c1218] text-white hover:bg-[#a41717]"
          >
            <Link href="/staff/application-management/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Application
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              queryClient={queryClient}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({ application, queryClient }) {
  const status = application.enabled
    ? {
        text: "OPEN",
        className: "border-green-500/20 bg-green-500/10 text-green-400",
      }
    : {
        text: "CLOSED",
        className: "border-red-500/20 bg-red-500/10 text-red-400",
      };

  const statusMutation = useMutation({
    mutationFn: async (enabled) => {
      const { data } = await api.patch(
        `/staff/application-definitions/${application._id}`,
        {
          enabled,
        },
      );

      return data;
    },

    onSuccess: async (data) => {
      toast.success(
        data.application?.enabled
          ? "Application opened"
          : "Application closed", {
            description: "Application Update Successfully."
          }
      );

      await queryClient.invalidateQueries({
        queryKey: ["application-definitions"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["application-builder", application._id],
      });
    },

    onError: (error) => {
      const response = error.response?.data;

      if (Array.isArray(response?.errors) && response.errors.length) {
        toast.error(response.message || "Application cannot be opened.", {
          description: response.errors.join(" "),
        });

        return;
      }

      toast.error(response?.message || "Failed to update application status.");
    },
  });

  function handleStatusChange() {
    if (statusMutation.isPending) {
      return;
    }

    if (application.enabled) {
      const confirmed = window.confirm(
        `Close "${application.title}"? Users will no longer be able to start new submissions.`,
      );

      if (!confirmed) {
        return;
      }
    }

    statusMutation.mutate(!application.enabled);
  }

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111111] transition hover:border-[#8c1218]/60">
      <Link
        href={`/staff/application-management/${application._id}`}
        className="block p-6 sm:p-7"
      >
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="truncate text-xl font-semibold">
                {application.title}
              </h2>

              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wider ${status.className}`}
              >
                {status.text}
              </span>
            </div>

            <p className="mt-2 text-sm text-zinc-600">/{application.slug}</p>
          </div>

          <ArrowRight
            size={20}
            className="mt-1 shrink-0 text-zinc-700 transition group-hover:translate-x-1 group-hover:text-[#8c1218]"
          />
        </div>

        <p className="mt-5 line-clamp-2 min-h-12 text-sm leading-6 text-zinc-500">
          {application.description || "No application description provided."}
        </p>

        <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-black/20">
          <Metric
            label="Submissions"
            value={application.submissionCount || 0}
          />

          <Metric label="Questions" value={application.questionCount || 0} />

          <Metric label="Sections" value={application.sectionCount || 0} />
        </div>
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-5 sm:px-7">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400">
            {application.category}
          </span>

          <span className="text-xs text-zinc-600">
            {application.maxAttempts > 0
              ? `${application.maxAttempts} max attempts`
              : "Unlimited attempts"}
          </span>
        </div>

        <button
          type="button"
          disabled={statusMutation.isPending}
          onClick={handleStatusChange}
          className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
            application.enabled
              ? "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              : "border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20"
          }`}
        >
          {statusMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : application.enabled ? (
            <Lock className="h-3.5 w-3.5" />
          ) : (
            <Power className="h-3.5 w-3.5" />
          )}

          {statusMutation.isPending
            ? "Updating..."
            : application.enabled
              ? "Close"
              : "Open"}
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="px-3 py-4 text-center">
      <p className="text-xl font-semibold text-white">{value}</p>

      <p className="mt-1 text-xs text-zinc-600">{label}</p>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{title}</p>

        <Icon size={19} className="text-[#8c1218]" />
      </div>

      <p className="mt-5 text-3xl font-bold">{value}</p>
    </div>
  );
}
