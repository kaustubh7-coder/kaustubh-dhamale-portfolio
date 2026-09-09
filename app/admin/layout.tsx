import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel — Kaustubh Dhamale",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    return (
      <div style={{ background: "#0d1117", minHeight: "100vh" }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ background: "#0d1117", minHeight: "100vh", display: "flex" }}>
      <AdminSidebar email={session.user?.email ?? ""} />

      {/* Always offset by sidebar — inline style, no Tailwind needed */}
      <main style={{
        flex: 1,
        marginLeft: "260px",
        minHeight: "100vh",
        padding: "40px 48px",
        maxWidth: "calc(100vw - 260px)",
        boxSizing: "border-box",
      }}>
        {children}
      </main>

      {/* Responsive: collapse sidebar offset on mobile */}
      <style>{`
        @media (max-width: 767px) {
          main { margin-left: 0 !important; padding: 76px 20px 40px !important; max-width: 100vw !important; }
        }
      `}</style>
    </div>
  );
}
