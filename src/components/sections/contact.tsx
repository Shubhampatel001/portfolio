"use client";

import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { CopyEmail } from "@/components/ui/copy-email";
import { profile } from "@/data/resume";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[var(--color-accent)] px-8 py-16 text-white sm:px-16"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full opacity-30"
          style={{
            backgroundImage: "radial-gradient(#fff 28%, transparent 30%)",
            backgroundSize: "8px 8px",
          }}
        />
        <p className="font-mono text-xs">got a project?</p>
        <h2 className="font-display mt-3 max-w-2xl text-4xl font-semibold leading-[1] tracking-tight sm:text-6xl">
          i&apos;m open to new roles and good ideas.
        </h2>
        <CopyEmail className="mt-10 inline-flex items-center rounded-full bg-white px-6 py-3 font-mono text-sm text-[#0b0b0c] transition-transform hover:-translate-y-0.5">
          {profile.email}
        </CopyEmail>
        <p className="mt-3 font-mono text-[11px] opacity-80">click to copy</p>
        <div className="mt-8 flex items-center gap-2">
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="rounded-full p-2.5 hover:bg-white/15">
            <GithubIcon size={20} />
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-full p-2.5 hover:bg-white/15">
            <LinkedinIcon size={20} />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
