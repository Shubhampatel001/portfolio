"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { profile } from "@/data/resume";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 px-6 py-28">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-16 text-center sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]/20 blur-[100px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Contact
          </div>
          <h2 className="font-display mx-auto max-w-lg text-3xl font-medium tracking-tight text-[var(--color-text)] sm:text-4xl">
            Let&apos;s build something worth shipping.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-[var(--color-text-muted)]">
            Open to full-stack and AI-focused engineering roles. The fastest way to reach me is
            email.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-text)] px-6 py-3 text-sm font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-accent-hover)] hover:text-white"
            >
              {profile.email} <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-full p-3 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="rounded-full p-3 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
            >
              <LinkedinIcon size={18} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
