"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import RecentActivity from "@/components/staff/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";

export default function StaffActivityPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["staff-activity", page],

    queryFn: async () => {
      const { data } = await api.get(`/staff/activity?page=${page}&limit=20`);

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8c1218] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-[#8c1218]">
          Astra Staff
        </p>

        <h1 className="mt-2 text-5xl font-bold">Activity Logs</h1>

        <p className="mt-3 text-zinc-400">
          Complete history of moderation activity.
        </p>
      </div>

      <RecentActivity activity={data.activity} showViewAll={false} />

      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111111] p-5">
        <Button
          variant="outline"
          disabled={!data.pagination.hasPrevious}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>

        <p className="text-sm text-zinc-400">
          Page{" "}
          <span className="font-semibold text-white">
            {data.pagination.page}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-white">
            {data.pagination.totalPages}
          </span>
        </p>

        <Button
          disabled={!data.pagination.hasNext}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
