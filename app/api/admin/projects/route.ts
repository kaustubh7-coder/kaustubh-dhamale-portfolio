import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return Response.json(projects);
  } catch {
    return Response.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = {
      ...parsed.data,
      slug: parsed.data.slug || slugify(parsed.data.title),
      image: parsed.data.image || null,
      githubUrl: parsed.data.githubUrl || null,
      liveUrl: parsed.data.liveUrl || null,
      longDescription: parsed.data.longDescription || null,
    };

    const project = await prisma.project.create({ data });
    return Response.json(project, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return Response.json({ error: "A project with this slug already exists" }, { status: 409 });
    }
    return Response.json({ error: "Failed to create project" }, { status: 500 });
  }
}
