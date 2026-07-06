"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/");
      return;
    }

    localStorage.setItem("token", token);

    router.replace("/");
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
      Logging you in...
    </div>
  );
}
