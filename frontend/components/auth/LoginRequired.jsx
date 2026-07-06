"use client";

import { Lock, ShieldCheck } from "lucide-react";
import LoginButton from "./LoginButton";

export default function LoginRequired() {
  return (
    <div className="absolute inset-0 z-100 flex items-center justify-center bg-black/75 backdrop-blur-md">

      {/* Background Glow */}

      <div className="absolute h-112.5 w-112.5 rounded-full bg-[#8c1218]/20 blur-[180px]" />

      <div className="relative w-full max-w-lg overflow-hidden rounded-4xl border border-white/10 bg-[#111111]/80 p-10 backdrop-blur-2xl">

        <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#d65b5b]">
          Members Only
        </span>

        <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#8c1218]/10">
          <Lock className="h-10 w-10 text-[#8c1218]" />
        </div>

        <h1 className="mt-8 text-4xl font-black uppercase">
          Login
          <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
            Required
          </span>
        </h1>

        <p className="mt-6 leading-8 text-zinc-400">
          This page is only available to authenticated Astra Roleplay members.
          Sign in with Discord to continue.
        </p>

        <div className="mt-10">
          <LoginButton />
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-5">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />

          <p className="text-sm leading-6 text-zinc-400">
            We only use Discord to verify your identity and whitelist status.
          </p>
        </div>
      </div>
    </div>
  );
}