"use client";

import { LogOut, ShieldCheck, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function ProfileDanger() {
  const { logout, user } = useAuth();

  const lastLogin = user?.lastLogin
    ? new Date(user.lastLogin).toLocaleString("en-IN")
    : "Unknown";

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111111]/70 backdrop-blur-xl">
      {/* Header */}

      <div className="relative overflow-hidden border-b border-white/10 p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#8c1218]/10 blur-[120px]" />

        <span className="relative inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#d65b5b]">
          Security
        </span>

        <h2 className="relative mt-5 text-3xl font-black uppercase">Account</h2>

        <p className="relative mt-4 leading-7 text-zinc-400">
          Your Discord account is securely connected to Astra Roleplay. Logging
          out will only end your current browser session.
        </p>
      </div>

      {/* Info */}

      <div className="space-y-5 p-8">
        <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">
          <ShieldCheck className="mt-1 h-6 w-6 text-green-400" />

          <div>
            <h3 className="font-semibold">Discord Authentication</h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Your account is authenticated through Discord OAuth.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">
          <Clock3 className="mt-1 h-6 w-6 text-[#8c1218]" />

          <div>
            <h3 className="font-semibold">Last Login</h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">{lastLogin}</p>
          </div>
        </div>
      </div>

      {/* Logout */}

      <div className="border-t border-white/10 p-8">
        <Button
          onClick={logout}
          className="h-13 w-full rounded-xl bg-[#8c1218] text-white transition-all duration-300  hover:bg-[#a41717] hover:shadow-[0_0_30px_rgba(140,18,24,.35)]">
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </section>
  );
}
