import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return Response.json(skills);
  } catch (error) {
    console.error("[skills] GET error:", error);
    return Response.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}
