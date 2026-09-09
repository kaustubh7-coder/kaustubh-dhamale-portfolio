import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 1; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 1500 * i));
    }
  }
  throw new Error("Unreachable");
}

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const certs = await withRetry(() =>
      prisma.certification.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] })
    );
    return Response.json(certs);
  } catch (err) {
    console.error("Admin certs GET error:", err);
    return Response.json({ error: "Failed to fetch. Database may be waking up — try again." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { title, code, issuer, badge, color, description, credlyUrl, issueDate, sortOrder } = body;
    if (!title?.trim() || !issuer?.trim()) {
      return Response.json({ error: "Title and issuer are required" }, { status: 400 });
    }
    const cert = await withRetry(() =>
      prisma.certification.create({
        data: {
          title: title.trim(),
          code: (code ?? "").trim(),
          issuer: issuer.trim(),
          badge: (badge ?? issuer.slice(0, 3).toUpperCase()).trim(),
          color: color ?? "#1e6bff",
          description: (description ?? "").trim(),
          credlyUrl: credlyUrl?.trim() || null,
          issueDate: issueDate?.trim() || null,
          sortOrder: sortOrder ?? 0,
        },
      })
    );
    return Response.json(cert, { status: 201 });
  } catch (err) {
    console.error("Admin certs POST error:", err);
    return Response.json({ error: "Failed to create" }, { status: 500 });
  }
}
