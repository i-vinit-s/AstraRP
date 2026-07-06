"use client";

import LoginRequired from "./LoginRequired";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909]">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#8c1218] border-t-transparent" />
      </main>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div
        className={
          !user
            ? "pointer-events-none select-none blur-md transition-all duration-300"
            : ""
        }
      >
        {children}
      </div>

      {!user && <LoginRequired />}
    </div>
  );
}
