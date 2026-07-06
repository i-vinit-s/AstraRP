"use client";

import Link from "next/link";
import { Calendar, ClipboardCheck, ExternalLink, Shield } from "lucide-react";

export default function UserOverviewCard({ user, application }) {
  return (
    <div className="space-y-6">
      {/* Account Overview */}

      <section className="rounded-2xl border border-white/10 bg-[#111111] p-8">
        <h2 className="mb-6 text-2xl font-bold">Account Overview</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Info
            icon={Shield}
            label="Whitelist Status"
            value={user.isWhitelisted ? "Whitelisted" : "Not Whitelisted"}
          />

          <Info
            icon={Calendar}
            label="Joined Website"
            value={new Date(user.createdAt).toLocaleString()}
          />

          <Info
            icon={ClipboardCheck}
            label="Discord ID"
            value={user.discordId}
          />
        </div>
      </section>

      {/* Latest Application */}

      <section className="rounded-2xl border border-white/10 bg-[#111111] p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Latest Whitelist Application</h2>

            <p className="mt-2 text-zinc-500">Latest whitelist submission.</p>
          </div>
        </div>

        {!application ? (
          <div className="mt-10 rounded-xl border border-dashed border-white/10 py-12 text-center text-zinc-500">
            This player has never submitted a whitelist application.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Card title="Status" value={application.status} />

            <Card
              title="Submitted"
              value={
                application.submittedAt
                  ? new Date(application.submittedAt).toLocaleString()
                  : "—"
              }
            />

            <Card
              title="Reviewed"
              value={
                application.reviewedAt
                  ? new Date(application.reviewedAt).toLocaleString()
                  : "Pending"
              }
            />
          </div>
        )}
      </section>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-5">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-[#8c1218]" />

        <p className="text-sm text-zinc-500">{label}</p>
      </div>

      <p className="mt-4 break-all text-lg font-medium">{value}</p>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-5">
      <p className="text-sm text-zinc-500">{title}</p>

      <h3 className="mt-3 font-semibold">{value}</h3>
    </div>
  );
}
