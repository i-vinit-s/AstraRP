"use client";

import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LoginButton() {
  function login() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/discord`;
  }

  return (
    <Button
      onClick={login}
      className="h-11 rounded-xl bg-[#8c1218] px-6 font-medium text-white shadow-lg shadow-[#8c1218]/20 transition-all duration-300 hover:bg-[#a41717]"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Login with Discord
    </Button>
  );
}
