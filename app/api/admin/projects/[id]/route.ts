import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Context) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(project);
  } catch {
    return Response.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, ctx: Context) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    const body = await request.json();
    const parsed = projectSchema.partial().safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = {
      ...parsed.data,
      image: parsed.data.image === "" ? null : parsed.data.image,
      githubUrl: parsed.data.githubUrl === "" ? null : parsed.data.githubUrl,
      liveUrl: parsed.data.liveUrl === "" ? null : parsed.data.liveUrl,
    };

    const project = await prisma.project.update({ where: { id }, data });
    return Response.json(project);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    await prisma.project.delete({ where: { id } });
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
    return Response.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
