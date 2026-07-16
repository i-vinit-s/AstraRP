"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import Loading from "@/app/loading";

export default function StaffGuard({ children }) {
  const router = useRouter();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user?.isStaff) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user?.isStaff) {
    return null;
  }

  return children;
}
