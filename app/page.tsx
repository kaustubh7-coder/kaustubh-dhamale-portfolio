import { prisma } from "@/lib/prisma";
import { Navbar }         from "@/components/ui/Navbar";
import { Footer }         from "@/components/ui/Footer";
import { Hero }           from "@/components/sections/Hero";
import { About }          from "@/components/sections/About";
import { Skills }         from "@/components/sections/Skills";
import { Experience }     from "@/components/sections/Experience";
import { Projects }       from "@/components/sections/Projects";
import { Certifications } from "@/components/sections/Certifications";
import { Contact }        from "@/components/sections/Contact";

async function getData() {
  try {
    const [skills, projects] = await Promise.all([
      prisma.skill.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
      prisma.project.findMany({ orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }] }),
    ]);
    return { skills, projects };
  } catch {
    return { skills: [], projects: [] };
  }
}

export default async function Home() {
  const { skills, projects } = await getData();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills skills={skills} />
        <Experience />
        <Projects projects={projects} />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
