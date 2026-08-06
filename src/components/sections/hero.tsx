"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/resume";

const ROLES = ["Full-Stack Engineer", "Guidewire PolicyCenter", "GenAI / RAG Systems"];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-28 pb-16"
    >
      {/* Ambient gradient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/20 blur-[140px]" />
        <div className="absolute right-[10%] top-[30%] h-[380px] w-[380px] rounded-full bg-[var(--color-violet)]/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 font-mono text-xs text-[var(--color-text-muted)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Open to new roles &middot; {profile.location}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display max-w-4xl text-[13vw] font-medium leading-[0.98] tracking-tight text-[var(--color-text)] sm:text-6xl md:text-7xl"
        >
          {profile.name.split(" ")[0]}{" "}
          <span className="text-gradient">{profile.name.split(" ")[1]}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-[var(--color-text-muted)] sm:text-base"
        >
          {ROLES.map((role, i) => (
            <span key={role} className="flex items-center gap-3">
              <span className="text-[var(--color-text)]">{role}</span>
              {i < ROLES.length - 1 && <span className="text-[var(--color-accent)]">/</span>}
            </span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mt-8 max-w-xl text-[15px] leading-relaxed text-[var(--color-text-muted)] sm:text-base"
        >
          I build full-stack, production-grade software — from Guidewire PolicyCenter
          insurance workflows to GenAI-powered retrieval systems. Currently at{" "}
          <span className="text-[var(--color-text)]">LTM</span>, shipping with Spring Boot,
          Angular, React, and a growing focus on applied ML.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button
            onClick={() =>
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View Projects <ArrowUpRight size={16} />
          </Button>
          <Button variant="outline" asChild>
            <a href="/resume.pdf" download>
              Download Resume
            </a>
          </Button>

          <div className="ml-2 flex items-center gap-1">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-full p-2.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="rounded-full p-2.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="rounded-full p-2.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
            >
              <Mail size={18} />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-text)]"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={18} />
        </motion.div>
      </motion.button>
    </section>
  );
}
