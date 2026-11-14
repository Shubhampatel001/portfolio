"use client";

import { motion } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { volunteerExperience } from "@/data/resume";

export function Volunteering() {
  return (
    <section id="volunteering" className="scroll-mt-24 px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Community"
          title="Outside the day job"
          description="Volunteer work and causes I have contributed to."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {volunteerExperience.map((entry, index) => (
            <motion.article
              key={`${entry.organization}-${entry.role}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <HeartHandshake size={18} className="mb-4 text-[var(--color-accent)]" />
              <p className="font-mono text-xs text-[var(--color-text-faint)]">{entry.duration}</p>
              <h3 className="mt-2 font-display text-base font-medium text-[var(--color-text)]">{entry.role}</h3>
              <p className="mt-1 text-sm text-[var(--color-accent)]">{entry.organization}</p>
              <p className="mt-4 text-[13px] leading-relaxed text-[var(--color-text-muted)]">{entry.focus}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
