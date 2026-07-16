import StaffGuard from "@/components/auth/staffGuard";
import StaffNavbar from "@/components/staff/StaffNavbar";

export default function StaffLayout({ children }) {
  return (
    <StaffGuard>
      <div className="min-h-screen bg-[#0b0b0b]">
        <StaffNavbar />

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </StaffGuard>
  );
}
