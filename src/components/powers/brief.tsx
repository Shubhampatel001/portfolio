"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { profile, projects } from "@/data/resume";
import { Overlay } from "./overlay";

/** Sasuke: the whole portfolio on one screen, 30 seconds. */
export function Brief({ onClose }: { onClose: () => void }) {
  const top = projects.filter((p) => p.featured).slice(0, 3);
  const row = (i: number) => ({ initial: { opacity: 0, x: -24 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.08 * i, duration: 0.25 } });

  return (
    <Overlay title="30-second brief" onClose={onClose} className="max-w-3xl">
      <motion.div {...row(0)}>
        <h2 className="font-display text-4xl font-black leading-none tracking-tight text-[var(--color-text)]">{profile.name}</h2>
        <p className="mt-2 text-[var(--color-text-muted)]">
          {profile.role} at LTM, Pune. {profile.focus.replaceAll("·", "/")}
        </p>
      </motion.div>

      <motion.dl {...row(1)} className="mt-6 grid grid-cols-3 gap-3 border-y border-[var(--color-border)] py-4">
        {profile.stats.map((s) => (
          <div key={s.label}>
            <dt className="text-xs text-[var(--color-text-muted)]">{s.label}</dt>
            <dd className="font-display text-3xl font-black text-[var(--color-accent)]">{s.value}</dd>
          </div>
        ))}
      </motion.dl>

      <motion.ul {...row(2)} className="mt-5 space-y-3">
        {top.map((p) => (
          <li key={p.slug} className="flex items-baseline justify-between gap-4">
            <span>
              <span className="font-bold text-[var(--color-text)]">{p.name}</span>
              <span className="text-[var(--color-text-muted)]"> · {p.tagline}</span>
            </span>
            {(p.demo ?? p.github) && (
              <a href={p.demo ?? p.github} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.name}`} className="shrink-0 text-[var(--color-accent)]">
                <ArrowUpRight size={18} />
              </a>
            )}
          </li>
        ))}
      </motion.ul>

      <motion.div {...row(3)} className="mt-6 flex flex-wrap items-center gap-3">
        <a href={`mailto:${profile.email}`} className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-on-accent)]">
          {profile.email}
        </a>
        <a href="/resume.pdf" download className="rounded-full border border-[var(--color-text)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]">
          Resume
        </a>
        <span className="text-xs text-[var(--color-text-faint)]">Esc to close</span>
      </motion.div>
    </Overlay>
  );
}
