import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: Context) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    const { read } = await request.json();
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: Boolean(read) },
    });
    return Response.json(message);
  } catch {
    return Response.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
