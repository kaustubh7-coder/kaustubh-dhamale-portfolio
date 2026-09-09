import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Login page is exempt
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
    >
      {session ? (
        <div className="flex min-h-screen">
          <AdminSidebar email={session.user?.email ?? ""} />
          <main className="flex-1 ml-0 md:ml-64 min-h-screen">
            <div className="p-6 max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
