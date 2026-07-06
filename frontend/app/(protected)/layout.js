"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ProtectedLayout({ children }) {
  return (
    <>
      <Navbar />

      <ProtectedRoute>{children}</ProtectedRoute>

      <Footer />
    </>
  );
}
