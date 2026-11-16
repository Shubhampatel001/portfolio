"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Hand, MousePointerClick, Repeat2, Sparkles, Zap } from "lucide-react";
import type { TourStep } from "@/lib/nudges";

const ICONS = { pointer: MousePointerClick, hold: Hand, zap: Zap, sparkles: Sparkles, swap: Repeat2 } as const;
const PAD = 8;

type Box = { x: number; y: number; w: number; h: number };

/**
 * The first-visit tour. Everything except the control being explained is dimmed, an arrow points at it,
 * and a small card says what it does. Steps without a target (the page effects) just show the card.
 */
export function GuideTour({ steps, index, onNext, onSkip }: { steps: TourStep[]; index: number; onNext: () => void; onSkip: () => void }) {
  const step = steps[index];
  const [box, setBox] = useState<Box | null>(null);
  const [vw, setVw] = useState(() => window.innerWidth);
  const [vh, setVh] = useState(() => window.innerHeight);

  // Follow the target every frame: the dock can move and the bar animates open.
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      setVw(window.innerWidth);
      setVh(window.innerHeight);
      const el = step.target ? document.querySelector(`[data-tour="${step.target}"]`) : null;
      if (!el) return setBox((b) => (b ? null : b));
      const r = el.getBoundingClientRect();
      setBox((b) =>
        b && Math.abs(b.x - r.left) < 0.5 && Math.abs(b.y - r.top) < 0.5 && Math.abs(b.w - r.width) < 0.5 && Math.abs(b.h - r.height) < 0.5
          ? b
          : { x: r.left, y: r.top, w: r.width, h: r.height }
      );
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [step.target]);

  const Icon = ICONS[step.icon];
  const cardW = Math.min(300, vw - 24);
  const last = index + 1 >= steps.length;

  // Card goes above the target (or below if there is no room); with no target it sits near the bottom left.
  let cardLeft = 12;
  let cardTop = vh - 230;
  let above = true;
  let arrowX = 0;
  if (box) {
    above = box.y > vh / 2 || box.y > 220;
    const cx = box.x + box.w / 2;
    cardLeft = Math.min(Math.max(cx - cardW / 2, 12), vw - cardW - 12);
    cardTop = above ? box.y - PAD - 64 - 130 : box.y + box.h + PAD + 64;
    arrowX = cx;
  }

  return (
    <>
      {/* Dim everything but the target, using a huge shadow around a transparent hole */}
      {box ? (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[88] rounded-2xl ring-2 ring-[var(--color-accent)] transition-[left,top,width,height] duration-200"
          style={{
            left: box.x - PAD,
            top: box.y - PAD,
            width: box.w + PAD * 2,
            height: box.h + PAD * 2,
            borderRadius: Math.min(box.h / 2 + PAD, 28),
            boxShadow: "0 0 0 100vmax rgba(8,8,14,.6)",
          }}
        />
      ) : (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[88] bg-[rgba(8,8,14,.28)]" />
      )}

      {/* Pointing arrow, bouncing toward the target */}
      {box && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed z-[89] text-[var(--color-accent)] drop-shadow"
          style={{ left: arrowX - 14, top: above ? box.y - PAD - 40 : box.y + box.h + PAD + 12 }}
          animate={{ y: above ? [0, 8, 0] : [0, -8, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        >
          {above ? <ArrowDown size={28} strokeWidth={3} /> : <ArrowUp size={28} strokeWidth={3} />}
        </motion.div>
      )}

      <motion.div
        key={index}
        role="dialog"
        aria-label="Quick guide"
        initial={{ opacity: 0, y: above ? 8 : -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto fixed z-[90] rounded-2xl border-2 border-[var(--color-text)] bg-[var(--color-surface)] p-4 text-[13px] leading-snug text-[var(--color-text)] shadow-[4px_4px_0_var(--color-text)]"
        style={{ left: cardLeft, top: Math.max(12, Math.min(cardTop, vh - 190)), width: cardW }}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)]">
            <Icon size={18} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-faint)]">
              Quick guide · {index + 1} of {steps.length}
            </p>
            <p className="mt-1">{step.text}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <button onClick={onSkip} className="text-xs text-[var(--color-text-muted)] underline underline-offset-2 hover:text-[var(--color-text)]">
            Skip
          </button>
          <button autoFocus onClick={onNext} className="rounded-full bg-[var(--color-text)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-bg)]">
            {last ? "Got it" : "Next"}
          </button>
        </div>
      </motion.div>
    </>
  );
}
