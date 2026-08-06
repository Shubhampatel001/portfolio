"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/data/resume";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="About" title="How I got here" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 text-[15px] leading-relaxed text-[var(--color-text-muted)] sm:text-base"
          >
            <p>{profile.summary}</p>
            <p>
              <span className="font-medium text-[var(--color-text)]">Currently focused on: </span>
              {profile.currentFocus}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-4"
          >
            {profile.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors duration-300 hover:border-[var(--color-border-hover)]"
              >
                <div className="font-display text-3xl font-medium text-[var(--color-text)]">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-[var(--color-text-muted)]">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
