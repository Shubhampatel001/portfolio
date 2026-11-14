"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { experience } from "@/data/resume";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've worked"
          description="A timeline of roles, ordered most recent first."
        />

        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-border)] to-transparent sm:left-[9px]" />

          <div className="space-y-14">
            {experience.map((entry, i) => (
              <motion.div
                key={`${entry.company}-${entry.role}`}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-8 sm:pl-10"
              >
                <span
                  className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-accent)] ring-4 ring-[var(--color-accent)]/15 sm:h-[19px] sm:w-[19px]"
                  aria-hidden
                />

                <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-xl font-medium text-[var(--color-text)]">
                    {entry.role}
                  </h3>
                  <span className="font-mono text-xs text-[var(--color-text-faint)]">
                    {entry.duration}
                  </span>
                </div>
                <div className="mb-4 text-sm text-[var(--color-accent)]">{entry.company}</div>

                <ul className="mb-5 space-y-2.5">
                  {entry.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-[14px] leading-relaxed text-[var(--color-text-muted)]"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-text-faint)]" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {entry.tech.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
