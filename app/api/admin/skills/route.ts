import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { skillSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return Response.json(skills);
  } catch {
    return Response.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = skillSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = {
      ...parsed.data,
      icon: parsed.data.icon || null,
    };

    const skill = await prisma.skill.create({ data });
    return Response.json(skill, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
