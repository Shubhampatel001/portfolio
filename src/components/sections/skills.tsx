"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { skills } from "@/data/resume";
import { cn } from "@/lib/utils";

const CATEGORIES = Object.keys(skills) as (keyof typeof skills)[];

export function Skills() {
  const [active, setActive] = useState<keyof typeof skills>(CATEGORIES[0]);

  return (
    <section id="skills" className="scroll-mt-24 px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Skills"
          title="Toolkit"
          description="Grouped by category — click through to explore."
        />

        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                active === cat
                  ? "text-[var(--color-bg)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              )}
            >
              {active === cat && (
                <motion.span
                  layoutId="skill-tab-active"
                  className="absolute inset-0 rounded-full bg-[var(--color-text)]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{cat}</span>
            </button>
          ))}
        </div>

        <div className="min-h-[140px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-wrap gap-3"
            >
              {skills[active].map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 font-mono text-sm text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
