import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const email = process.env.ADMIN_EMAIL ?? "kaustubhdhamale.work@gmail.com";
  const password = process.env.ADMIN_PASSWORD ?? "change-me-before-deploy";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log(`✅ Admin user created/updated: ${email}`);

  // Skills
  const skills = [
    // Cloud
    { name: "Microsoft Azure", category: "Cloud", proficiency: 90, sortOrder: 1 },
    { name: "AWS", category: "Cloud", proficiency: 65, sortOrder: 2 },
    { name: "Azure VM", category: "Cloud", proficiency: 90, sortOrder: 3 },
    { name: "Amazon EC2", category: "Cloud", proficiency: 65, sortOrder: 4 },
    { name: "Storage Accounts", category: "Cloud", proficiency: 88, sortOrder: 5 },
    { name: "Blob Storage", category: "Cloud", proficiency: 85, sortOrder: 6 },
    { name: "VNet", category: "Cloud", proficiency: 80, sortOrder: 7 },
    { name: "NSG", category: "Cloud", proficiency: 82, sortOrder: 8 },
    { name: "Azure Entra ID", category: "Cloud", proficiency: 80, sortOrder: 9 },
    { name: "Key Vault", category: "Cloud", proficiency: 75, sortOrder: 10 },
    { name: "Load Balancer", category: "Cloud", proficiency: 70, sortOrder: 11 },
    { name: "IAM", category: "Cloud", proficiency: 72, sortOrder: 12 },
    // Monitoring
    { name: "Azure Monitor", category: "Monitoring", proficiency: 90, sortOrder: 1 },
    { name: "Log Analytics", category: "Monitoring", proficiency: 88, sortOrder: 2 },
    { name: "Application Insights", category: "Monitoring", proficiency: 75, sortOrder: 3 },
    { name: "Amazon CloudWatch", category: "Monitoring", proficiency: 60, sortOrder: 4 },
    { name: "Resource Health", category: "Monitoring", proficiency: 85, sortOrder: 5 },
    { name: "Alerts & Metrics", category: "Monitoring", proficiency: 85, sortOrder: 6 },
    // Operating Systems
    { name: "Linux (Ubuntu)", category: "Operating Systems", proficiency: 85, sortOrder: 1 },
    { name: "Red Hat Linux", category: "Operating Systems", proficiency: 80, sortOrder: 2 },
    { name: "Windows Server", category: "Operating Systems", proficiency: 82, sortOrder: 3 },
    // Networking
    { name: "TCP/IP", category: "Networking", proficiency: 80, sortOrder: 1 },
    { name: "DNS", category: "Networking", proficiency: 78, sortOrder: 2 },
    { name: "HTTP/HTTPS", category: "Networking", proficiency: 82, sortOrder: 3 },
    { name: "VPN Fundamentals", category: "Networking", proficiency: 70, sortOrder: 4 },
    { name: "Network Troubleshooting", category: "Networking", proficiency: 82, sortOrder: 5 },
    // Automation & IaC
    { name: "Terraform", category: "Automation & IaC", proficiency: 75, sortOrder: 1 },
    { name: "PowerShell", category: "Automation & IaC", proficiency: 80, sortOrder: 2 },
    { name: "Bash", category: "Automation & IaC", proficiency: 78, sortOrder: 3 },
    { name: "Azure CLI", category: "Automation & IaC", proficiency: 85, sortOrder: 4 },
    // Containers & Tools
    { name: "Docker", category: "Containers & Tools", proficiency: 70, sortOrder: 1 },
    { name: "Kubernetes Fundamentals", category: "Containers & Tools", proficiency: 60, sortOrder: 2 },
    { name: "Git", category: "Containers & Tools", proficiency: 80, sortOrder: 3 },
    { name: "GitHub", category: "Containers & Tools", proficiency: 80, sortOrder: 4 },
    // IT Operations
    { name: "Incident Management", category: "IT Operations", proficiency: 90, sortOrder: 1 },
    { name: "Problem Management", category: "IT Operations", proficiency: 80, sortOrder: 2 },
    { name: "Change Management", category: "IT Operations", proficiency: 75, sortOrder: 3 },
    { name: "SLA Management", category: "IT Operations", proficiency: 88, sortOrder: 4 },
    { name: "RCA", category: "IT Operations", proficiency: 80, sortOrder: 5 },
    { name: "ServiceNow", category: "IT Operations", proficiency: 85, sortOrder: 6 },
    { name: "Jira", category: "IT Operations", proficiency: 82, sortOrder: 7 },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-") },
      update: skill,
      create: { ...skill, id: skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-") },
    });
  }
  console.log(`✅ ${skills.length} skills seeded`);

  // Project
  const project = await prisma.project.upsert({
    where: { slug: "azure-infrastructure-monitoring" },
    update: {},
    create: {
      title: "Azure Infrastructure Monitoring & Cloud Support",
      slug: "azure-infrastructure-monitoring",
      description:
        "Supported a cloud-hosted application environment by monitoring Azure VMs, Storage Accounts, VNets, NSGs and application services using Azure Monitor and Log Analytics.",
      longDescription:
        "Diagnosed issues related to resource utilisation, disk capacity, DNS resolution, network connectivity, and service availability, improving initial incident diagnosis efficiency by 30%. Provisioned and maintained selected Azure resources using Terraform and Azure CLI, promoting consistent and repeatable infrastructure configuration. Implemented automated alert validation and routine health checks through scripting, helping identify infrastructure anomalies before they impacted users.",
      featured: true,
      technologies: ["Azure", "Terraform", "PowerShell", "Linux", "Azure Monitor", "Log Analytics", "Azure CLI"],
      sortOrder: 1,
    },
  });
  console.log(`✅ Project seeded: ${project.title}`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
