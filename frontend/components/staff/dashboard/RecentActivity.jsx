"use client";

import {
  CheckCircle2,
  UserPlus,
  XCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function RecentActivity({
  activity,
  showViewAll = true,
}) {
  const icons = {
    application_submitted: (
      <FileText className="text-blue-400" size={18} />
    ),

    application_approved: (
      <CheckCircle2 className="text-green-400" size={18} />
    ),

    application_rejected: (
      <XCircle className="text-red-400" size={18} />
    ),

    user_registered: (
      <UserPlus className="text-purple-400" size={18} />
    ),
  };

  function render(activity) {
    switch (activity.type) {
      case "application_submitted":
        return (
          <>
            <strong>
              {activity.target?.globalName || activity.target?.username}
            </strong>{" "}
            submitted a whitelist application.
          </>
        );

      case "application_approved":
        return (
          <>
            <strong>
              {activity.actor?.globalName || activity.actor?.username}
            </strong>{" "}
            approved{" "}
            <strong>
              {activity.target?.globalName || activity.target?.username}
            </strong>
            &apos;s whitelist application.
          </>
        );

      case "application_rejected":
        return (
          <>
            <strong>
              {activity.actor?.globalName || activity.actor?.username}
            </strong>{" "}
            rejected{" "}
            <strong>
              {activity.target?.globalName || activity.target?.username}
            </strong>
            &apos;s whitelist application.
          </>
        );

      case "user_registered":
        return (
          <>
            <strong>
              {activity.target?.globalName || activity.target?.username}
            </strong>{" "}
            registered on Astra RP.
          </>
        );

      default:
        return activity.type;
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111]">
      <div className="flex items-center justify-between border-b border-white/10 p-6">
        <div>
          <h2 className="text-xl font-semibold">Recent Activity</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Latest moderation events.
          </p>
        </div>

        {showViewAll && (
  <Link
    href="/staff/activity"
    className="text-sm font-medium text-[#8c1218] transition hover:text-red-400"
  >
    View All →
  </Link>
)}
      </div>

      <div>
        {!activity.length ? (
          <div className="py-16 text-center text-zinc-500">
            No activity yet.
          </div>
        ) : (
          activity.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 border-b border-white/5 p-5"
            >
              <div className="mt-1">{icons[item.type]}</div>

              <div>
                <p className="leading-7">{render(item)}</p>

                <p className="mt-2 text-xs text-zinc-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}