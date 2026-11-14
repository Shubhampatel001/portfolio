"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";

const LINES: Record<string, string> = {
  hero: "hi, i'm pixel. scroll and i'll show you around.",
  projects: "psst. you can grab me and throw me.",
  work: "so many small experiments in here.",
  experience: "real jobs, real shipping.",
  about: "the stack is longer than it looks.",
  contact: "click the email. it copies itself.",
};

const TRICKS = ["dance", "hiccup", "vanish", "spin"] as const;
type Trick = (typeof TRICKS)[number];

export function Mascot() {
  const reduce = useReducedMotion();
  const controls = useAnimationControls();
  const [line, setLine] = useState(LINES.hero);
  const [menu, setMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const dragging = useRef(false);
  const bounds = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ids = Object.keys(LINES);
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setLine(LINES[e.target.id])),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const run = async (t: Trick) => {
    setMenu(false);
    if (reduce) return;
    if (t === "dance") {
      setLine("♪ ♫");
      await controls.start({ rotate: [0, -14, 14, -14, 14, 0], y: [0, -10, 0, -10, 0], transition: { duration: 1.2 } });
    } else if (t === "hiccup") {
      setLine("hic!");
      await controls.start({ y: [0, -16, 0, -8, 0], transition: { duration: 0.7 } });
    } else if (t === "spin") {
      setLine("wheee");
      await controls.start({ rotate: 360, transition: { duration: 0.8 } });
      controls.set({ rotate: 0 });
    } else {
      setLine("poof.");
      setHidden(true);
      window.setTimeout(() => setHidden(false), 1600);
    }
  };

  useEffect(() => {
    const onTrick = () => run(TRICKS[Math.floor(Math.random() * TRICKS.length)]);
    window.addEventListener("mascot-trick", onTrick);
    return () => window.removeEventListener("mascot-trick", onTrick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <div ref={bounds} className="pointer-events-none fixed inset-0 z-[65] hidden sm:block">
    <motion.div
      drag={!reduce}
      dragMomentum
      dragElastic={0.3}
      dragTransition={{ power: 0.35, timeConstant: 300 }}
      dragConstraints={bounds}
      whileDrag={{ scale: 1.08, cursor: "grabbing" }}
      onDragStart={() => (dragging.current = true)}
      onDragEnd={() => window.setTimeout(() => (dragging.current = false), 50)}
      className="pointer-events-auto absolute bottom-5 left-5 select-none"
      style={{ touchAction: "none" }}
    >
      <AnimatePresence>
        {!hidden && (
          <motion.div
            animate={controls}
            initial={{ scale: 0, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="relative cursor-grab"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={line}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-full left-8 mb-2 w-max max-w-[200px] rounded-xl rounded-bl-none border border-[var(--color-text)] bg-[var(--color-surface)] px-3 py-1.5 font-mono text-[11px] leading-snug text-[var(--color-text)]"
              >
                {line}
              </motion.p>
            </AnimatePresence>
            <button
              aria-label="Mascot tricks"
              onClick={() => !dragging.current && setMenu((m) => !m)}
              className="block"
            >
              <svg width="56" height="56" viewBox="0 0 14 14" shapeRendering="crispEdges" aria-hidden>
                <rect x="2" y="3" width="10" height="9" fill="var(--color-accent)" />
                <rect x="3" y="2" width="8" height="1" fill="var(--color-accent)" />
                <rect x="3" y="12" width="2" height="1" fill="var(--color-accent)" />
                <rect x="9" y="12" width="2" height="1" fill="var(--color-accent)" />
                <rect x="4" y="5" width="2" height="2" fill="#fff" />
                <rect x="8" y="5" width="2" height="2" fill="#fff" />
                <rect x="5" y="6" width="1" height="1" fill="#0b0b0c" />
                <rect x="9" y="6" width="1" height="1" fill="#0b0b0c" />
                <rect x="5" y="9" width="4" height="1" fill="#0b0b0c" />
                <rect x="6" y="0" width="2" height="2" fill="var(--color-lime)" />
              </svg>
            </button>
            <AnimatePresence>
              {menu && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-full left-0 mb-14 flex w-max gap-1 rounded-full border border-[var(--color-text)] bg-[var(--color-surface)] p-1"
                >
                  {TRICKS.map((t) => (
                    <button
                      key={t}
                      onClick={() => run(t)}
                      className="rounded-full px-3 py-1 font-mono text-[11px] text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
                    >
                      {t}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </div>
  );
}
