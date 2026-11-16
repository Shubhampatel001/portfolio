"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { achievements, skills } from "@/data/resume";

// Everything revealed comes straight from the resume data: skill groups and achievements.
const ITEMS = [
  ...Object.entries(skills).map(([title, list]) => ({ title, text: list.join(" · ") })),
  ...achievements.map((a) => ({ title: a.title, text: a.description })),
];

type Burst = { id: number; x: number; y: number };

/** Pennywise: balloons drift up; pop one to float a skill group or achievement out of it. */
export function Balloons({ onClose }: { onClose: () => void }) {
  const [popped, setPopped] = useState<number[]>([]);
  const [shown, setShown] = useState<number | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstId = useRef(0);

  // Fixed per-balloon motion so re-renders do not reshuffle them.
  const ride = useMemo(
    () =>
      ITEMS.map((_, i) => ({
        left: 6 + ((i * 11.5 + (i % 2) * 4) % 84),
        duration: 15 + ((i * 7) % 9),
        delay: i * 1.1,
        sway: 10 + (i % 3) * 6,
      })),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const pop = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = ++burstId.current;
    setBursts((b) => [...b, { id, x: r.left + r.width / 2, y: r.top + r.height * 0.35 }]);
    window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 800);
    setPopped((p) => [...p, i]);
    setShown(i);
  };

  const left = ITEMS.length - popped.length;
  const item = shown === null ? null : ITEMS[shown];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pointer-events-none fixed inset-0 z-[76] overflow-hidden"
      >
        {ITEMS.map((_, i) => {
          if (popped.includes(i)) return null;
          const r = ride[i];
          return (
            <motion.div
              key={i}
              className="absolute bottom-0"
              style={{ left: `${r.left}%` }}
              initial={{ y: 140 }}
              animate={{ y: "-115vh" }}
              transition={{ duration: r.duration, delay: r.delay, repeat: Infinity, ease: "linear", repeatDelay: 0 }}
            >
              <motion.div
                animate={{ x: [-r.sway, r.sway] }}
                transition={{ duration: 2.4 + (i % 3) * 0.6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
              >
                <button
                  onClick={(e) => pop(i, e)}
                  aria-label={`Pop balloon ${i + 1} of ${ITEMS.length}`}
                  className="pointer-events-auto block cursor-pointer transition-transform hover:scale-110 focus-visible:scale-110"
                >
                  <svg width="58" height="110" viewBox="0 0 58 110" aria-hidden>
                    <path d="M29 82 Q22 96 29 108" fill="none" stroke="var(--color-text)" strokeOpacity="0.5" strokeWidth="1.2" />
                    <ellipse cx="29" cy="34" rx="25" ry="31" fill={i % 3 === 2 ? "var(--color-lime)" : "var(--color-accent)"} />
                    <path d="M29 65 L24 74 L34 74Z" fill={i % 3 === 2 ? "var(--color-lime)" : "var(--color-accent)"} />
                    <ellipse cx="19" cy="21" rx="5" ry="9" fill="#fff" opacity="0.35" transform="rotate(-20 19 21)" />
                    <text x="29" y="42" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff" opacity="0.85">?</text>
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Pop shards */}
        {bursts.map((b) =>
          Array.from({ length: 10 }, (_, k) => {
            const a = (k / 10) * Math.PI * 2;
            return (
              <motion.span
                key={`${b.id}-${k}`}
                className="absolute h-1.5 w-3 rounded-sm bg-[var(--color-accent)]"
                style={{ left: b.x, top: b.y, rotate: `${(a * 180) / Math.PI}deg` }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: Math.cos(a) * 70, y: Math.sin(a) * 70 + 20, opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              />
            );
          })
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed left-1/2 top-20 z-[77] w-[min(440px,calc(100vw-1.5rem))] -translate-x-1/2"
      >
        <div className="flex items-center justify-between gap-3 rounded-full border-2 border-[var(--color-text)] bg-[var(--color-surface)] py-1.5 pl-4 pr-1.5 text-xs text-[var(--color-text)] shadow-[3px_3px_0_var(--color-text)]">
          <span role="status">{left > 0 ? `Pop a balloon. ${left} left.` : "All popped. They do float, after all."}</span>
          <button onClick={onClose} className="rounded-full bg-[var(--color-text)] px-3 py-1 text-[var(--color-bg)]">
            Done
          </button>
        </div>
        <AnimatePresence mode="wait">
          {item && (
            <motion.div
              key={shown}
              role="status"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3 rounded-2xl border-2 border-[var(--color-text)] bg-[var(--color-surface)] p-4 shadow-[4px_4px_0_var(--color-accent)]"
            >
              <p className="font-display text-base font-bold text-[var(--color-accent)]">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-text)]">{item.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
