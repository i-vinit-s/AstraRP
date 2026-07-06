"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";

import UserProfileCard from "@/components/staff/users/UserProfileCard";
import UserOverviewCard from "@/components/staff/users/UserOverviewCard";

export default function StaffUserPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["staff-user", id],
    queryFn: async () => {
      const response = await api.get(`/staff/users/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8c1218] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
        Failed to load player.
      </div>
    );
  }

    return (
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <UserProfileCard user={data.user} />

        <UserOverviewCard
          user={data.user}
          application={data.application}
        />
      </div>
    );
}
