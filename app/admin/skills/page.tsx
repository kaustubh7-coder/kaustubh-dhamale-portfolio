import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSkillsClient } from "@/components/admin/AdminSkillsClient";

export default async function AdminSkillsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  return (
    <div className="pt-16 md:pt-0">
      <AdminSkillsClient />
    </div>
  );
}
