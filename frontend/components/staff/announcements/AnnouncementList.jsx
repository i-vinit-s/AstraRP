"use client";

import { Pin } from "lucide-react";

export default function AnnouncementList({ announcements }) {
  if (!announcements.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 py-24 text-center text-zinc-500">
        No announcements yet.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {announcements.map((announcement) => (
        <div
          key={announcement._id}
          className="rounded-2xl border border-white/10 bg-[#111111] p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                {announcement.pinned && (
                  <Pin size={16} className="text-yellow-400" />
                )}

                <h2 className="text-xl font-semibold">{announcement.title}</h2>
              </div>

              <p className="mt-3 text-zinc-500">
                {announcement.content.slice(0, 180)}
              </p>
            </div>

            <div className="text-right text-sm text-zinc-500">
              <p>{announcement.category}</p>

              <p className="mt-2">
                {new Date(announcement.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
