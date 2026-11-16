"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile, projects } from "@/data/resume";

const STEPS = [
  { id: "hero", sfx: "THWIP!", text: `Hang on tight. This is ${profile.name}, a software engineer at LTM in Pune: Java, Spring Boot, Angular and React.` },
  { id: "projects", sfx: "SWOOSH!", text: `${projects.length} projects so far, from a RAG search assistant to a self-driving simulation that evolves.` },
  { id: "experience", sfx: "ZIP!", text: "Work history: LTM since June 2025, with earlier roles in video editing and an engineering internship." },
  { id: "skills", sfx: "WHOOSH!", text: "The toolbox: languages, frameworks, cloud and the AI/ML side." },
  { id: "achievements", sfx: "THWIP!", text: "A few things he is proud of, from leading a team to published research." },
  { id: "contact", sfx: "LANDED!", text: "Have a role or project in mind? Email is the fastest way to reach him." },
];
const STEP_MS = 6500;
const SWING_MS = 1100;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Spider-Man: a web shoots to each section, the page swings there, and the stop is narrated. */
export function Swing({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const raf = useRef(0);

  const stopScroll = useCallback(() => cancelAnimationFrame(raf.current), []);
  const next = useCallback(() => setStep((s) => s + 1), []);

  useEffect(() => {
    if (step >= STEPS.length) {
      onClose();
      return;
    }
    const el = document.getElementById(STEPS[step].id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = window.setTimeout(() => {
      if (!el) return;
      const from = window.scrollY;
      const to = Math.max(0, el.getBoundingClientRect().top + from - 96);
      if (reduce) return window.scrollTo(0, to);
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / SWING_MS);
        window.scrollTo(0, from + (to - from) * ease(p));
        if (p < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }, 300);
    const advance = window.setTimeout(next, STEP_MS);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(advance);
      stopScroll();
    };
  }, [step, next, onClose, stopScroll]);

  // The visitor taking over the scroll wheel or touch ends the swing in progress.
  useEffect(() => {
    window.addEventListener("wheel", stopScroll, { passive: true });
    window.addEventListener("touchstart", stopScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", stopScroll);
      window.removeEventListener("touchstart", stopScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [stopScroll, onClose]);

  const cur = STEPS[Math.min(step, STEPS.length - 1)];

  return (
    <>
      {/* The web line, shot from the top-right corner at every stop */}
      <svg aria-hidden className="pointer-events-none fixed inset-0 z-[74] h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          key={`web-${step}`}
          d="M100 0 Q72 26 50 18"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: [1, 1, 0] }}
          transition={{ duration: 0.9, times: [0, 0.5, 1], ease: "easeOut" }}
        />
      </svg>

      {/* Comic sound effect */}
      <AnimatePresence mode="wait">
        <motion.span
          key={`sfx-${step}`}
          aria-hidden
          initial={{ opacity: 0, scale: 0.3, rotate: -14 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.15, 1, 1], rotate: -8 }}
          transition={{ duration: 1.3, times: [0, 0.25, 0.7, 1] }}
          className="font-display pointer-events-none fixed left-[8%] top-[34%] z-[74] text-5xl font-black italic text-[var(--color-accent)] sm:text-7xl"
          style={{ textShadow: "3px 3px 0 var(--color-text)" }}
        >
          {cur.sfx}
        </motion.span>
      </AnimatePresence>

      <motion.div
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="fixed left-1/2 top-20 z-[75] w-[min(520px,calc(100vw-1.5rem))] -translate-x-1/2 rounded-2xl border-2 border-[var(--color-text)] bg-[var(--color-surface)] p-4 shadow-[4px_4px_0_var(--color-accent)]"
      >
        <p className="text-sm leading-relaxed text-[var(--color-text)]">{cur.text}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex gap-1.5" aria-hidden>
            {STEPS.map((s, i) => (
              <span key={s.id} className={`h-1.5 w-5 rounded-full ${i <= step ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"}`} />
            ))}
          </div>
          <div className="flex gap-2 text-xs">
            <button onClick={next} className="rounded-full border border-[var(--color-text)] px-3 py-1 text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]">
              Next
            </button>
            <button onClick={onClose} className="rounded-full px-3 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              Stop tour
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
