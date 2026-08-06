import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectShowcase } from "./project-showcase";
import { projects } from "@/data/resume";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Featured Work"
          title="Things I've built"
          description="From production-grade RAG search to neuro-evolution game agents — a mix of applied ML and full-stack engineering."
        />

        <div>
          {projects.map((project, i) => (
            <ProjectShowcase key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
