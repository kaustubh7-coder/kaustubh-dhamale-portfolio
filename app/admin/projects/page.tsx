import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminProjectsClient } from "@/components/admin/AdminProjectsClient";

export default async function AdminProjectsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  return (
    <div className="pt-16 md:pt-0">
      <AdminProjectsClient />
    </div>
  );
}
