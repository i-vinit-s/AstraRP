import StaffSidebar from "@/components/staff/StaffSidebar";

export default function StaffLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-[1700px]">
        <StaffSidebar />

        <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
