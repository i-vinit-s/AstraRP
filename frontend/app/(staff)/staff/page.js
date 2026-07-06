"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Users,
  Clock3,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import RecentActivity from "@/components/staff/dashboard/RecentActivity";
import api from "@/lib/api";

export default function StaffDashboard() {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["staff-applications"],
    queryFn: async () => {
      const { data } = await api.get("/staff/applications");
      return data.applications || [];
    },
  });
  const { data: dashboard } = useQuery({
    queryKey: ["staff-dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/staff/dashboard");
      return data;
    },
  });

  const stats = dashboard?.stats;
  const activity = dashboard?.recentActivity || [];

  return (
    <div className="space-y-10">
      <div>
        <p className="mb-2 text-sm uppercase tracking-[0.35em] text-[#8c1218]">
          Astra Staff
        </p>

        <h1 className="text-5xl font-bold">Dashboard</h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Review whitelist applications, manage players and keep the community
          running smoothly.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pending Applications"
          value={stats ? stats.pendingApplications : "--"}
          icon={Clock3}
          color="text-yellow-400"
        />

        <StatCard
          title="Approved Today"
          value={stats ? stats.approvedToday : "--"}
          icon={CheckCircle2}
          color="text-green-400"
        />

        <StatCard
          title="Registered Users"
          value={stats ? stats.totalUsers : "--"}
          icon={Users}
          color="text-blue-400"
        />

        <StatCard
          title="Applications"
          value={stats ? stats.totalApplications : "--"}
          icon={FileText}
          color="text-[#8c1218]"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-white/10 bg-[#111111]">
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <div>
              <h2 className="text-xl font-semibold">
                Recent Pending Applications
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Applications waiting for review.
              </p>
            </div>

            <Link
              href="/staff/applications"
              className="flex items-center gap-2 text-sm text-[#8c1218] hover:text-red-400"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div>
            {!applications.length ? (
              <div className="py-16 text-center text-zinc-500">
                No pending applications 🎉
              </div>
            ) : (
              applications.slice(0, 5).map((app) => (
                <Link
                  key={app._id}
                  href={`/staff/applications/${app._id}`}
                  className="flex items-center justify-between border-b border-white/5 p-6 transition hover:bg-white/5"
                >
                  <div>
                    <h3 className="font-medium">
                      {app.user.globalName || app.user.username}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      @{app.user.username}
                    </p>
                  </div>

                  <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                    Pending
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <RecentActivity activity={activity} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{title}</p>

        <Icon className={color} size={22} />
      </div>

      <h2 className="mt-5 text-4xl font-bold">{value}</h2>
    </div>
  );
}

function QuickAction({ title, description, href }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-white/10 bg-[#111111] p-6 transition hover:border-[#8c1218]"
    >
      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>

      <div className="mt-6 flex items-center gap-2 text-[#8c1218]">
        Open
        <ArrowRight size={16} />
      </div>
    </Link>
  );
}
