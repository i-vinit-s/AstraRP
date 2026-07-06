"use client";

import Link from "next/link";
import Image from "next/image";
import StatusBadge from "./StatusBadge";

export default function UsersTable({ users, loading, error }) {
  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8c1218] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
        Failed to load users.
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111111] py-24 text-center">
        <h3 className="text-xl font-semibold">No matching players</h3>

        <p className="mt-2 text-zinc-500">Try changing your search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
      <table className="w-full">
        <thead className="border-b border-white/10 text-left text-xs uppercase tracking-widest text-zinc-500">
          <tr>
            <th className="px-6 py-5">Player</th>
            <th>Discord ID</th>
            <th>Status</th>
            <th>Joined</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-b border-white/5 transition hover:bg-white/5"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <Image
                    src={user.avatar ? `${user.avatar}` : "/logo.png"}
                    alt="Profile Picture"
                    height={128}
                    width={128}
                    loading="lazy"
                    className="h-12 w-12 rounded-full border border-white/10"
                  />

                  <div>
                    <h3 className="font-medium">
                      {user.globalName || user.username}
                    </h3>

                    <p className="text-sm text-zinc-500">@{user.username}</p>
                  </div>
                </div>
              </td>

              <td className="font-mono text-sm text-zinc-400">
                {user.discordId}
              </td>

              <td>
                <StatusBadge whitelisted={user.isWhitelisted} />
              </td>

              <td className="text-sm text-zinc-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>

              {/* <td className="pr-6 text-right">
                <Link
                  href={`/staff/users/${user._id}`}
                  className="text-[#8c1218] transition hover:text-red-400"
                >
                  View
                </Link>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
