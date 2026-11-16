"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { projects, type Project } from "@/data/resume";
import { Overlay } from "./overlay";

const CATEGORY_LABEL: Record<Project["category"], string> = {
  "AI/ML": "Applied AI",
  "Full Stack": "Real full-stack apps",
  Games: "Something playful",
  Web: "Polished front-end",
};

/**
 * Ghostface: two questions, then a project pitch. The options and the answer all come from the
 * project data, so nothing here is made up.
 */
export function Quiz({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<Project["category"] | null>(null);
  const [pick, setPick] = useState<Project | null>(null);

  const categories = useMemo(() => {
    const seen = new Set<Project["category"]>();
    projects.forEach((p) => seen.add(p.category));
    return [...seen];
  }, []);

  const options = useMemo(
    () =>
      category
        ? projects
            .filter((p) => p.category === category)
            .sort((a, b) => Number(b.featured) - Number(a.featured))
            .slice(0, 3)
        : [],
    [category]
  );

  const result = pick ?? (options.length === 1 ? options[0] : null);

  const reset = () => {
    setCategory(null);
    setPick(null);
  };
  const go = (p: Project) => {
    onClose();
    window.setTimeout(() => {
      document.getElementById(p.featured ? `project-${p.slug}` : "work")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
  };

  const choice =
    "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-left text-sm text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)]";

  return (
    <Overlay title="Project quiz" onClose={onClose} className="max-w-xl">
      <p className="text-xs uppercase tracking-widest text-[var(--color-accent)]">
        {result ? "Your match" : category ? "Question 2 of 2" : "Question 1 of 2"}
      </p>

      {!category && (
        <motion.div key="q1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-[var(--color-text)]">What&apos;s your favourite kind of project?</h2>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={choice}>
                {CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {category && !result && (
        <motion.div key="q2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-[var(--color-text)]">Which one would you open first?</h2>
          <div className="mt-5 grid gap-2.5">
            {options.map((p) => (
              <button key={p.slug} onClick={() => setPick(p)} className={choice}>
                <span className="block font-semibold">{p.name}</span>
                <span className="mt-0.5 block text-[13px] text-[var(--color-text-muted)]">{p.tagline}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-[var(--color-text)]">{result.name}</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{result.tagline}</p>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--color-text)]">{result.solution}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {result.tech.slice(0, 6).map((t) => (
              <span key={t} className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-xs text-[var(--color-text-muted)]">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={() => go(result)} className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-on-accent)]">
              Show me
            </button>
            <button onClick={reset} className="rounded-full border border-[var(--color-text)] px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]">
              Ask me again
            </button>
          </div>
        </motion.div>
      )}
    </Overlay>
  );
}
