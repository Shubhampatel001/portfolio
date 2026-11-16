"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/data/resume";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "AI/ML", "Full Stack", "Games", "Web"] as const;

export function ProjectLab({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const list = useMemo(
    () => projects.filter((p) => filter === "All" || p.category === filter),
    [filter, projects]
  );

  return (
    <div id="work" className="scroll-mt-24 mt-12 pt-16">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <h3 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl">
          Everything else
        </h3>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors",
                filter === item
                  ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]"
                  : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
              )}
            >
              {item.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-8 border-t-2 border-[var(--color-text)]">
        {list.map((p) => {
          const href = p.demo ?? p.github;
          const inner = (
            <>
              <span className="relative hidden h-14 w-24 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-hover)] sm:block">
                {(p.previewImage ?? (p.media ? `${p.media}.jpg` : undefined)) && (
                  <Image src={(p.previewImage ?? `${p.media}.jpg`) as string} alt="" fill sizes="96px" className="object-cover object-top" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-xl font-semibold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                  {p.name}
                </span>
                <span className="block truncate text-sm text-[var(--color-text-muted)]">{p.tagline}</span>
              </span>
              <span className="hidden font-mono text-[11px] text-[var(--color-text-faint)] md:block">{p.category.toLowerCase()}</span>
              <span className="shrink-0 font-mono text-[11px] text-[var(--color-text-faint)]">{p.duration}</span>
              {href && <ArrowUpRight size={18} className="shrink-0 text-[var(--color-text)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
            </>
          );
          const cls = "group flex items-center gap-4 border-b border-[var(--color-border)] py-4";
          return (
            <li key={p.slug}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              ) : (
                <div className={cls}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
