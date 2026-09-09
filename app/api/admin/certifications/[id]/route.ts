import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const cert = await prisma.certification.update({
      where: { id },
      data: {
        title:       body.title?.trim(),
        code:        body.code?.trim(),
        issuer:      body.issuer?.trim(),
        badge:       body.badge?.trim(),
        color:       body.color,
        description: body.description?.trim(),
        credlyUrl:   body.credlyUrl?.trim() || null,
        issueDate:   body.issueDate?.trim() || null,
        sortOrder:   body.sortOrder ?? 0,
      },
    });
    return Response.json(cert);
  } catch {
    return Response.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  try {
    await prisma.certification.delete({ where: { id } });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }
}
