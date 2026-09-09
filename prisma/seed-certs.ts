import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const certs = [
    { title: "Azure Administrator Associate", code: "AZ-104", issuer: "Microsoft", badge: "MS", color: "#0078d4", description: "Validates skills in implementing, managing and monitoring Azure environments — compute, storage, networking and identity.", sortOrder: 1 },
    { title: "OCI DevOps Professional", code: "OCI 2025", issuer: "Oracle", badge: "OCI", color: "#c74634", description: "Oracle Cloud Infrastructure DevOps — CI/CD pipelines, container services and deployment automation.", sortOrder: 2 },
    { title: "OCI Multicloud Architect Professional", code: "OCI 2025", issuer: "Oracle", badge: "OCI", color: "#c74634", description: "Multicloud architecture patterns, interconnecting OCI with other cloud providers and resilient distributed systems.", sortOrder: 3 },
    { title: "OCI Foundations Associate", code: "OCI 2025", issuer: "Oracle", badge: "OCI", color: "#c74634", description: "Foundational Oracle Cloud Infrastructure services, core concepts, pricing and support models.", sortOrder: 4 },
    { title: "AWS with DevOps", code: "AWS", issuer: "Naresh IT", badge: "AWS", color: "#ff9900", description: "AWS services with DevOps practices — CI/CD, infrastructure as code, monitoring and automation pipelines.", sortOrder: 5 },
    { title: "Git and GitHub for Developers", code: "GIT", issuer: "Infosys Springboard", badge: "GIT", color: "#f05032", description: "Version control fundamentals, branching strategies, pull requests and GitHub Actions workflows.", sortOrder: 6 },
  ];
  for (const c of certs) {
    const id = c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.certification.upsert({ where: { id }, update: c, create: { ...c, id } });
  }
  console.log("✅ Seeded", certs.length, "certifications");
}

main().catch(console.error).finally(() => prisma.$disconnect());
