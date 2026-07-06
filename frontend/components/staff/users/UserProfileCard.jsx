"use client";

import StatusBadge from "./StatusBadge";
import Image from "next/image";

export default function UserProfileCard({ user }) {
  if (!user) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111111] p-8">
        <p className="text-zinc-500">User not found.</p>
      </div>
    );
  }

  const avatar = user.avatar
    ? `${user.avatar}`
    : `https://cdn.discordapp.com/embed/avatars/${
        Number(user.discriminator || 0) % 5
      }.png`;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
      <div className="h-28 bg-linear-to-r from-[#8c1218]/30 via-[#8c1218]/10 to-transparent" />

      <div className="-mt-14 flex flex-col items-center px-8 pb-8">
        <Image
          src={avatar}
          alt={user.username}
          height={128}
          width={128}
          className="h-28 w-28 rounded-full border-4 border-[#111111] object-cover"
        />

        <h2 className="mt-5 text-center text-2xl font-bold">
          {user.globalName || user.username}
        </h2>

        <p className="mt-1 text-zinc-500">@{user.username}</p>

        <div className="mt-5">
          <StatusBadge whitelisted={user.isWhitelisted} />
        </div>

        <div className="mt-8 w-full space-y-5 border-t border-white/10 pt-8">
          <Info label="Discord ID" value={user.discordId} />

          <Info
            label="Joined Website"
            value={new Date(user.createdAt).toLocaleDateString()}
          />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </p>

      <p className="mt-2 break-all text-sm text-white">{value}</p>
    </div>
  );
}
