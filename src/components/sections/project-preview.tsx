import Image from "next/image";
import { Monitor } from "lucide-react";
import type { Project } from "@/data/resume";
import { ProjectVideo } from "./project-video";

export function ProjectPreview({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-xl border-2 border-[var(--color-text)] bg-[var(--color-surface)] ${compact ? "" : "shadow-[6px_6px_0_var(--color-text)]"}`}>
      <div className="flex h-8 items-center gap-1.5 border-b-2 border-[var(--color-text)] bg-[var(--color-surface-hover)] px-3">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-faint)]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-faint)]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-faint)]" />
        <span className="ml-2 truncate font-mono text-[10px] text-[var(--color-text-faint)]">{project.name.toLowerCase().replaceAll(" ", "-")}.app</span>
      </div>
      <div className={`relative overflow-hidden bg-[var(--color-bg)] ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        {project.media ? (
          <ProjectVideo base={project.media} label={project.name} fit={project.mediaFit} />
        ) : project.previewImage ? (
          <Image src={project.previewImage} alt={`${project.name} project preview`} fill sizes={compact ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 1024px) 100vw, 50vw"} className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_center,var(--color-accent-soft),transparent_55%)] px-6 text-center">
            <Monitor size={compact ? 20 : 28} className="text-[var(--color-accent)]" />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">Live project</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">Preview coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
