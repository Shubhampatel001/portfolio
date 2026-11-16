"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";
import { DEFAULT_PERSONA, PERSONAS, getPersonaById } from "@/lib/personas";
import { closeIntro, previewPersona, setPersona, useIntroOpen } from "@/lib/persona-store";
import { Backdrop } from "@/components/backdrops/backdrop";
import { PersonaAvatar } from "./persona-avatar";

/**
 * First-visit screen. The markup is always server-rendered; CSS (`.guide-overlay` in globals.css)
 * shows it only while <html data-intro> is set, which the inline script in layout.tsx does before paint.
 * Five guides sit in one row (it scrolls sideways on narrow screens); each card wears its own colours.
 */
export function GuideSelect() {
  const open = useIntroOpen();
  const reduce = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  if (!open) return null;

  const choose = (id: string) => {
    setPersona(id);
    setHover(null);
    window.scrollTo(0, 0);
    setLeaving(true);
  };

  return (
    <motion.div
      className="guide-overlay fixed inset-0 z-[90] flex-col overflow-y-auto px-5 py-8 transition-colors duration-500 sm:px-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
      style={{
        // Hovering a guide floods the whole screen with its colour, on top of its palette and scene.
        backgroundColor: hover
          ? `color-mix(in srgb, ${getPersonaById(hover)?.tone.bg ?? "transparent"} 42%, var(--color-bg))`
          : "var(--color-bg)",
      }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.35 }}
      onAnimationComplete={() => {
        if (!leaving) return;
        closeIntro();
        setLeaving(false);
      }}
      onKeyDown={(e) => e.key === "Escape" && choose(DEFAULT_PERSONA)}
    >
      <Backdrop intro />
      <div className="mx-auto my-auto w-full max-w-[1400px]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 id="guide-title" className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-[var(--color-text)] sm:text-5xl">
            Who should show
            <br />
            you around?
          </h1>
          <p className="max-w-xs text-[15px] leading-relaxed text-[var(--color-text-muted)] sm:text-right">
            Pick a guide. Each one answers questions about Shubham and changes how this page looks and feels. Hover to preview, switch any time.
          </p>
        </div>

        <ul
          className="-mx-5 mt-6 flex snap-x gap-3 overflow-x-auto px-5 pb-6 pt-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:overflow-visible lg:px-0"
          onMouseLeave={() => {
            previewPersona(null);
            setHover(null);
          }}
        >
          {PERSONAS.map((p, i) => (
            <motion.li
              key={p.id}
              className="min-w-[220px] flex-1 snap-start"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                onClick={() => choose(p.id)}
                onMouseEnter={() => {
                  previewPersona(p.id);
                  setHover(p.id);
                }}
                onFocus={() => {
                  previewPersona(p.id);
                  setHover(p.id);
                }}
                whileHover={reduce ? undefined : { y: -10, rotate: i % 2 ? 1 : -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="group relative flex h-full min-h-[23rem] w-full flex-col items-start overflow-hidden rounded-3xl border-2 border-[#17141c] p-5 text-left shadow-[0_6px_0_#17141c] transition-shadow hover:shadow-[0_14px_0_#17141c] focus-visible:shadow-[0_14px_0_#17141c]"
                style={{ background: `${p.tone.pattern}, ${p.tone.bg}`, color: p.tone.fg }}
              >
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
                  style={{ background: p.tone.fg, color: p.tone.bg }}
                >
                  {p.origin}
                </span>

                <motion.span
                  className="mx-auto mt-5 block"
                  animate={reduce ? undefined : { y: [0, -6, 0] }}
                  transition={{ duration: 3.2 + i * 0.35, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                >
                  <span className="block transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 group-focus-visible:scale-110">
                    <PersonaAvatar id={p.id} size={140} ring={p.tone.fg} />
                  </span>
                </motion.span>

                <span className="font-display mt-6 text-3xl font-bold leading-none tracking-tight">{p.name}</span>
                <span className="mt-2 text-[13px] leading-snug opacity-85">{p.temperament}</span>

                <span
                  className="mt-auto inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold"
                  style={{ background: p.tone.fg, color: p.tone.bg }}
                >
                  <Zap size={13} /> {p.power.label}
                </span>
              </motion.button>
            </motion.li>
          ))}
        </ul>

        <button
          onClick={() => choose(DEFAULT_PERSONA)}
          className="text-sm text-[var(--color-text-muted)] underline underline-offset-4 hover:text-[var(--color-text)]"
        >
          Continue without a guide
        </button>
      </div>
    </motion.div>
  );
}
