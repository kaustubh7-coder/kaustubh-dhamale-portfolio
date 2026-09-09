import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) return Response.json({ error: "No file provided" }, { status: 400 });
    if (file.type !== "application/pdf") {
      return Response.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: "File too large (max 10 MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dest = join(process.cwd(), "public", "Kaustubh Dhamale CV.pdf");
    await writeFile(dest, buffer);

    return Response.json({ success: true, message: "Resume updated successfully" });
  } catch (err) {
    console.error("Resume upload error:", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
