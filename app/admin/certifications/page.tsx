import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminCertificationsClient } from "@/components/admin/AdminCertificationsClient";

export default async function AdminCertificationsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  return <AdminCertificationsClient />;
}
