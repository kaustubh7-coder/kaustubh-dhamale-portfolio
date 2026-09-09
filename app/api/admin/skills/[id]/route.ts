import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { skillSchema } from "@/lib/validations";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, ctx: Context) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    const body = await request.json();
    const parsed = skillSchema.partial().safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: parsed.data,
    });
    return Response.json(skill);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    await prisma.skill.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
