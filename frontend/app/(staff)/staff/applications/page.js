"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function StaffApplicationsPage() {
  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["staff-applications"],
    queryFn: async () => {
      const { data } = await api.get("/staff/applications");
      return data.applications || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8c1218] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
        Failed to load applications.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Whitelist Applications</h1>

          <p className="mt-2 text-zinc-400">
            Pending applications awaiting review.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#111111] px-5 py-3">
          <span className="text-sm text-zinc-400">Pending</span>

          <p className="text-3xl font-bold">{applications.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {applications.map((application) => (
          <Link
            key={application._id}
            href={`/staff/applications/${application._id}`}
            className="block rounded-2xl border border-white/10 bg-[#111111] p-6 transition hover:border-[#8c1218]"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  {application.user.globalName || application.user.username}
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  @{application.user.username}
                </p>
              </div>

              <div className="text-right">
                <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                  Pending
                </span>

                <p className="mt-3 text-sm text-zinc-500">
                  {new Date(application.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {!applications.length && (
          <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center text-zinc-500">
            No pending applications.
          </div>
        )}
      </div>
    </div>
  );
}
