"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { certifications } from "@/data/resume";

export function Certifications() {
  return (
    <section id="certifications" className="scroll-mt-24 px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Certifications" title="Credentials" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-300 hover:border-[var(--color-accent)]/50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <BadgeCheck size={20} />
              </div>
              <h3 className="mb-1 font-display text-[15px] font-medium leading-snug text-[var(--color-text)]">
                {cert.name}
              </h3>
              <p className="font-mono text-xs text-[var(--color-text-faint)]">{cert.issuer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
