import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectShowcase } from "./project-showcase";
import { ProjectLab } from "./project-lab";
import { projects } from "@/data/resume";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="selected work"
          title="things i've built."
          description="From RAG search to neuro-evolution game agents: applied ML and full-stack, one project at a time."
        />

        <div>
          {projects.filter((project) => project.featured).map((project, i) => (
            <ProjectShowcase key={project.slug} project={project} index={i} />
          ))}
        </div>
        <ProjectLab projects={projects} />
      </div>
    </section>
  );
}
