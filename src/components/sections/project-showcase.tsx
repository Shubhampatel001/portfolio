"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Badge } from "@/components/ui/badge";
import { ProjectPreview } from "./project-preview";
import type { Project } from "@/data/resume";
import { cn } from "@/lib/utils";

export function ProjectShowcase({ project, index }: { project: Project; index: number }) {
  const reversed = index % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group grid grid-cols-1 items-center gap-10 border-b border-[var(--color-border)] py-16 last:border-none lg:grid-cols-2 lg:gap-16"
    >
      <div className={cn(reversed && "lg:order-2")}>
        <ProjectPreview project={project} />
      </div>

      <div className={cn(reversed && "lg:order-1")}>
        <div className="mb-3 flex items-center gap-3 font-mono text-xs text-[var(--color-text-faint)]">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px flex-1 max-w-8 bg-[var(--color-border)]" />
          <span>{project.duration}</span>
        </div>

        <h3 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)] sm:text-4xl">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{project.tagline}</p>

        <div className="mt-6 space-y-4 text-[14px] leading-relaxed">
          <div>
            <span className="mb-1 block font-mono text-[11px] tracking-wide text-[var(--color-accent)]">
              the problem
            </span>
            <p className="text-[var(--color-text-muted)]">{project.problem}</p>
          </div>
          <div>
            <span className="mb-1 block font-mono text-[11px] tracking-wide text-[var(--color-accent)]">
              what i did
            </span>
            <p className="text-[var(--color-text-muted)]">{project.solution}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
            >
              <GithubIcon size={16} /> source
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
            >
              live demo <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
