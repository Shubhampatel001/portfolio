"use client";

import { motion } from "framer-motion";
import { ExternalLink, Lightbulb } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Badge } from "@/components/ui/badge";
import { ProjectVisual } from "./project-visual";
import { FlappyDemo } from "./flappy-demo";
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
        {project.hasPlayableDemo ? (
          <FlappyDemo />
        ) : (
          <ProjectVisual slug={project.slug} />
        )}
      </div>

      <div className={cn(reversed && "lg:order-1")}>
        <div className="mb-3 flex items-center gap-3 font-mono text-xs text-[var(--color-text-faint)]">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px flex-1 max-w-8 bg-[var(--color-border)]" />
          <span>{project.duration}</span>
        </div>

        <h3 className="font-display text-2xl font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)] sm:text-3xl">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{project.tagline}</p>

        <div className="mt-6 space-y-4 text-[14px] leading-relaxed">
          <div>
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-[var(--color-text-faint)]">
              Problem
            </span>
            <p className="text-[var(--color-text-muted)]">{project.problem}</p>
          </div>
          <div>
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-[var(--color-text-faint)]">
              Solution
            </span>
            <p className="text-[var(--color-text-muted)]">{project.solution}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-[var(--color-accent)]">
            <Lightbulb size={14} />
            <span className="font-mono text-[11px] uppercase tracking-wide">Key learnings</span>
          </div>
          <ul className="space-y-1.5">
            {project.learnings.map((l) => (
              <li key={l} className="flex gap-2 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-text-faint)]" />
                {l}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
            >
              <GithubIcon size={16} /> Source
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
            >
              <ExternalLink size={16} /> Live demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
