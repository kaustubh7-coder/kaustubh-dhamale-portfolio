import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminMessagesClient } from "@/components/admin/AdminMessagesClient";

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  return <AdminMessagesClient />;
}
