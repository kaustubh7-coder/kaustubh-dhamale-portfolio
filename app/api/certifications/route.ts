import { prisma } from "@/lib/prisma";

export async function GET() {
  // Retry up to 3 times to handle Neon cold-start
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const certs = await prisma.certification.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      return Response.json(certs);
    } catch (err) {
      if (attempt === 3) {
        console.error("Certifications API failed after 3 attempts:", err);
        return Response.json({ error: "Failed to fetch certifications" }, { status: 500 });
      }
      // Wait before retry (Neon wake-up)
      await new Promise(r => setTimeout(r, 1500 * attempt));
    }
  }
}
