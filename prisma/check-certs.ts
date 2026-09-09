import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
p.certification.findMany().then(r => console.log("COUNT:", r.length, JSON.stringify(r.slice(0,1)))).catch(console.error).finally(() => p.$disconnect());
