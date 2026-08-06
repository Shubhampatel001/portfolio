"use client";

import { motion } from "framer-motion";
import { ExternalLink, Trophy } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { achievements } from "@/data/resume";

export function Achievements() {
  return (
    <section id="achievements" className="scroll-mt-24 px-6 pb-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Achievements" title="Notable moments" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {achievements.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <Trophy size={18} className="mb-4 text-[var(--color-accent)]" />
              <h3 className="mb-2 font-display text-base font-medium text-[var(--color-text)]">
                {a.title}
              </h3>
              <p className="mb-3 flex-1 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                {a.description}
              </p>
              {a.url && (
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                >
                  Read more <ExternalLink size={12} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
