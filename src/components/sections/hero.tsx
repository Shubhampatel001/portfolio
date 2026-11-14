"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { profile } from "@/data/resume";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden px-6 pt-32 pb-20 sm:pt-40">
      <div
        aria-hidden
        className="dither dither-fade pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-60 sm:h-[560px] sm:w-[560px]"
      />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-text)] bg-[var(--color-surface)] px-4 py-1.5 font-mono text-xs text-[var(--color-text)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          </span>
          open to new roles &middot; {profile.location.toLowerCase()}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease }}
          className="font-display max-w-4xl text-[14vw] font-semibold leading-[0.92] tracking-tight text-[var(--color-text)] sm:text-7xl md:text-8xl"
        >
          i build software that{" "}
          <span className="relative inline-block text-[var(--color-accent)]">
            ships
            <svg aria-hidden viewBox="0 0 200 12" className="absolute -bottom-1 left-0 w-full" preserveAspectRatio="none">
              <path d="M2 8 Q 50 0 100 6 T 198 5" fill="none" stroke="var(--color-lime)" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </span>
          .
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg"
        >
          I&apos;m <span className="text-[var(--color-text)]">{profile.name}</span>, a software
          engineer at <span className="text-[var(--color-text)]">LTM</span>. Full-stack with Spring
          Boot, Angular and React, Guidewire PolicyCenter for insurance, and a growing habit of
          building GenAI / RAG systems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#contact"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 hover:bg-[var(--color-accent-hover)]"
          >
            get in touch <ArrowUpRight size={16} />
          </a>
          <a
            href="/resume.pdf"
            download
            className="inline-flex h-11 items-center rounded-full border border-[var(--color-text)] px-6 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
          >
            resume
          </a>
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="rounded-full p-2.5 text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]">
            <GithubIcon size={20} />
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-full p-2.5 text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]">
            <LinkedinIcon size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
