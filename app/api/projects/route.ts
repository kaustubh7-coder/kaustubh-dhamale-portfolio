import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return Response.json(projects);
  } catch (error) {
    console.error("[projects] GET error:", error);
    return Response.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
