"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Zap } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { PersonaAvatar } from "@/components/ui/persona-avatar";
import { getPersonaById } from "@/lib/personas";
import { usePersona } from "@/lib/persona-store";
import { profile } from "@/data/resume";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const personaId = usePersona();
  const persona = getPersonaById(personaId);
  const [first, last] = profile.name.split(" ");

  return (
    <section id="hero" className="px-6 pt-32 pb-24 sm:pt-40">
      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="font-display text-[19vw] font-black leading-[0.86] tracking-tight text-[var(--color-text)] sm:text-8xl lg:text-[8.5rem]"
          >
            {first}
            <br />
            {last}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 max-w-[34rem] text-lg leading-relaxed text-[var(--color-text)]"
          >
            Software engineer at LTM in Pune. I build full-stack systems in Java, Spring Boot, Angular and React, and
            work on Guidewire PolicyCenter for insurance. I also make GenAI and machine-learning projects, like
            Perplexa, a RAG search assistant, and EvoDrive, a self-driving simulation that learns by evolution.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#contact"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 text-sm font-medium text-[var(--color-on-accent)] transition-transform hover:-translate-y-0.5"
            >
              Get in touch <ArrowUpRight size={16} />
            </a>
            <a
              href="/resume.pdf"
              download
              className="inline-flex h-11 items-center rounded-full border border-[var(--color-text)] px-6 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
            >
              Download resume
            </a>
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="rounded-full p-2.5 text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]">
              <GithubIcon size={20} />
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-full p-2.5 text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]">
              <LinkedinIcon size={20} />
            </a>
          </motion.div>
        </div>

        {/* The guide, large. Swaps with the chosen persona. A personal photo can live here instead. */}
        {persona && (
          <div className="relative mx-auto w-full max-w-[300px] lg:ml-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease }}
              >
                <div className="aspect-square w-full [&>svg]:h-full [&>svg]:w-full">
                  <PersonaAvatar id={persona.id} size={400} />
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  <span className="font-bold text-[var(--color-text)]">{persona.name}</span> is showing you around.{" "}
                  {persona.power.blurb}
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("guide-power", { detail: { id: persona.power.id } }))}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)]"
                >
                  <Zap size={14} /> {persona.power.label}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
