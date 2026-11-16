"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { projects, type Project } from "@/data/resume";

const REVEAL_R = 200;

/**
 * Batman: a case board. The page goes dark and a flashlight follows the pointer. Each featured
 * project is a clue pinned to the page; sweep the light over one to reveal it, link them with red
 * string, and open its case file (problem, solution, what was learned). Touch screens have no
 * pointer, so there every clue starts revealed and the dimming is skipped.
 */
export function Detective({ onClose }: { onClose: () => void }) {
  const clues = useMemo(() => projects.filter((p) => p.featured), []);
  // Mounted only after a click, so window is available. A coarse pointer means touch: reveal everything.
  const [fine] = useState(() => !window.matchMedia("(pointer: coarse)").matches);
  const [found, setFound] = useState<Set<string>>(() => (fine ? new Set() : new Set(clues.map((c) => c.slug))));
  const [file, setFile] = useState<Project | null>(null);

  const dim = useRef<HTMLDivElement>(null);
  const string = useRef<SVGPathElement>(null);
  const tags = useRef<Record<string, HTMLDivElement | null>>({});
  const foundRef = useRef(found);
  const mouse = useRef({ x: 0, y: 0, seen: false });

  useEffect(() => {
    foundRef.current = found;
  }, [found]);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (file) setFile(null);
      else close();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.current = { x: e.clientX, y: e.clientY, seen: true };
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointermove", onMove);
    };
  }, [file, close]);

  // One frame loop: place each tag on its project, reveal what the light touches, draw the string.
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const m = mouse.current;
      const mx = m.seen ? m.x : vw / 2;
      const my = m.seen ? m.y : vh / 2;
      if (dim.current) {
        dim.current.style.background = fine
          ? `radial-gradient(circle ${REVEAL_R}px at ${mx}px ${my}px, rgba(4,6,10,0) 0%, rgba(4,6,10,0) 45%, rgba(4,6,10,0.84) 100%)`
          : "none";
      }
      const pts: [number, number][] = [];
      const reveal: string[] = [];
      for (const c of clues) {
        const el = document.getElementById(`project-${c.slug}`);
        const tag = tags.current[c.slug];
        if (!el || !tag) continue;
        const r = el.getBoundingClientRect();
        const visible = r.bottom > 110 && r.top < vh - 40;
        tag.style.opacity = visible ? "1" : "0";
        tag.style.pointerEvents = visible && foundRef.current.has(c.slug) ? "auto" : "none";
        if (!visible) continue;
        const px = Math.min(Math.max(r.left + 16, 12), vw - 200);
        const py = Math.min(Math.max(r.top + 36, 120), vh - 150);
        tag.style.transform = `translate(${px}px, ${py}px)`;
        if (foundRef.current.has(c.slug)) pts.push([px + 10, py + 10]);
        else if (fine && Math.hypot(px - mx, py - my) < REVEAL_R) reveal.push(c.slug);
      }
      if (reveal.length) setFound((f) => new Set([...f, ...reveal]));
      if (string.current) {
        let d = "";
        pts.forEach(([x, y], i) => {
          if (i === 0) d = `M${x} ${y}`;
          else {
            const [px, py] = pts[i - 1];
            d += ` Q${(px + x) / 2} ${Math.max(py, y) + 46} ${x} ${y}`;
          }
        });
        string.current.setAttribute("d", d);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [clues, fine]);

  const done = found.size === clues.length;

  return (
    <>
      {/* The dark, with a flashlight hole that follows the pointer */}
      <div ref={dim} aria-hidden className="pointer-events-none fixed inset-0 z-[68]" />

      {/* Red string between the clues you have found */}
      <svg aria-hidden className="pointer-events-none fixed inset-0 z-[69] h-full w-full">
        <path ref={string} d="" fill="none" stroke="#e23a3a" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 0" />
      </svg>

      {/* Evidence tags */}
      <div className="pointer-events-none fixed inset-0 z-[73]">
        {clues.map((c, i) => {
          const isFound = found.has(c.slug);
          return (
            <div
              key={c.slug}
              ref={(el) => {
                tags.current[c.slug] = el;
              }}
              className="absolute left-0 top-0 opacity-0 transition-opacity duration-200"
            >
              <motion.div animate={{ rotate: i % 2 ? 2 : -2 }} className="relative">
                <span aria-hidden className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-[#e23a3a] shadow-[0_0_0_2px_#17141c]" />
                {isFound ? (
                  <motion.button
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => setFile(c)}
                    className="block w-[190px] rounded-sm bg-[#f6e27a] px-3 pb-2.5 pt-3 text-left text-[#17141c] shadow-[3px_3px_0_#17141c] transition-transform hover:-translate-y-0.5"
                  >
                    <span className="block text-[10px] font-bold uppercase tracking-widest opacity-70">Exhibit {String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display block text-[15px] font-bold leading-tight">{c.name}</span>
                    <span className="mt-0.5 block text-[11px] opacity-80">{c.category} · {c.duration}</span>
                    <span className="mt-1.5 block text-[11px] font-bold underline underline-offset-2">Open case file</span>
                  </motion.button>
                ) : (
                  <span className="block rounded-sm border border-[#f6e27a] bg-[#17141c] px-3 py-2 text-xs font-bold tracking-widest text-[#f6e27a]">
                    ?  CLUE
                  </span>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed left-1/2 top-20 z-[77] flex w-[min(460px,calc(100vw-1.5rem))] -translate-x-1/2 items-center justify-between gap-3 rounded-full border-2 border-[#f5c518] bg-[#0b0f16] py-1.5 pl-4 pr-1.5 text-xs text-[#e8ecf2] shadow-[0_0_24px_rgba(245,197,24,.25)]"
      >
        <span role="status" className="flex items-center gap-2">
          <Search size={14} className="text-[#f5c518]" />
          {done
            ? "Case closed. Every clue found."
            : `${found.size} of ${clues.length} clues found. ${fine ? "Sweep the light and scroll." : "Tap an exhibit."}`}
        </span>
        <button data-tip="Leave the case board" onClick={close} className="rounded-full bg-[#f5c518] px-3 py-1 font-bold text-[#0b0f16]">
          Done
        </button>
      </motion.div>

      {/* Case file */}
      <AnimatePresence>
        {file && (
          <motion.aside
            key={file.slug}
            role="dialog"
            aria-label={`Case file: ${file.name}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="fixed bottom-4 right-4 top-36 z-[78] w-[min(380px,calc(100vw-2rem))] overflow-y-auto rounded-sm border-2 border-[#17141c] bg-[#f4efe0] p-5 text-[#17141c] shadow-[6px_6px_0_#f5c518]"
          >
            <button onClick={() => setFile(null)} aria-label="Close case file" className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-black/10">
              <X size={16} />
            </button>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#b3121a]">Case file · {file.category}</p>
            <h3 className="font-display mt-1 text-2xl font-bold leading-tight">{file.name}</h3>
            <p className="mt-1 text-[13px] opacity-75">{file.tagline}</p>
            <dl className="mt-4 space-y-3 text-[13px] leading-relaxed">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest opacity-60">The problem</dt>
                <dd>{file.problem}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest opacity-60">The solution</dt>
                <dd>{file.solution}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest opacity-60">What it taught</dt>
                <dd>{file.learnings[0]}</dd>
              </div>
            </dl>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {file.tech.map((t) => (
                <li key={t} className="rounded-sm border border-[#17141c] px-2 py-0.5 text-[11px]">
                  {t}
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                const slug = file.slug;
                close();
                window.setTimeout(() => document.getElementById(`project-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
              }}
              className="mt-5 rounded-full bg-[#17141c] px-4 py-2 text-xs font-bold text-[#f4efe0]"
            >
              Leave the case board and view it
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
