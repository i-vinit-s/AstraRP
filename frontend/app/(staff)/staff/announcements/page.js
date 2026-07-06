"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

import AnnouncementList from "@/components/staff/announcements/AnnouncementList";
import CreateAnnouncementButton from "@/components/staff/announcements/CreateAnnouncementButton";

export default function StaffAnnouncementsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data } = await api.get("/staff/announcements");
      return data.announcements;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8c1218] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#8c1218]">
            Content Management
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Announcements
          </h1>
        </div>

        <CreateAnnouncementButton />
      </div>

      <AnnouncementList announcements={data || []} />
    </div>
  );
}