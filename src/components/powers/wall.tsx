"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { projects } from "@/data/resume";
import { Overlay } from "./overlay";

/** Naruto: shadow clones. Every project plays at once; clicking one jumps to it. */
export function Wall({ onClose }: { onClose: () => void }) {
  const go = (slug: string, featured: boolean) => {
    onClose();
    window.setTimeout(() => {
      const el = document.getElementById(featured ? `project-${slug}` : "work");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
  };

  return (
    <Overlay title="All projects" onClose={onClose} className="max-w-6xl">
      <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--color-text)]">Every project, at once</h2>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">Pick one to jump to it. Esc closes.</p>
      <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((p, i) => (
          <motion.li
            key={p.slug}
            initial={{ opacity: 0, scale: 0.4, x: -120, y: 120 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 22 }}
          >
            <button
              onClick={() => go(p.slug, p.featured)}
              className="group block w-full text-left"
              aria-label={`Go to ${p.name}`}
            >
              <span className="relative block aspect-[4/3] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-hover)] transition-colors group-hover:border-[var(--color-accent)]">
                {p.media ? (
                  <video
                    src={`${p.media}.mp4`}
                    poster={`${p.media}.jpg`}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className={p.mediaFit === "contain" ? "h-full w-full object-contain" : "h-full w-full object-cover object-top"}
                  />
                ) : p.previewImage ? (
                  <Image src={p.previewImage} alt="" fill sizes="25vw" className="object-cover object-top" />
                ) : null}
              </span>
              <span className="mt-2 block text-sm font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)]">{p.name}</span>
              <span className="block truncate text-xs text-[var(--color-text-muted)]">{p.tagline}</span>
            </button>
          </motion.li>
        ))}
      </ul>
    </Overlay>
  );
}
