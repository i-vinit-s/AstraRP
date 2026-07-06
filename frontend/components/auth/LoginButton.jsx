"use client";

import { Button } from "@/components/ui/button";

export default function LoginButton() {
  function login() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/discord`;
  }

  return (
    <Button
      variant="outline"
      onClick={login}
      className="h-11 px-7 rounded-none border-white/15 bg-transparent text-white transition-all duration-300 hover:border-[#c92a2a] hover:bg-white hover:text-black [clip-path:polygon(8%_0,100%_0,100%_100%,0_100%,0_28%)]"
    >
      Login
    </Button>
  );
}