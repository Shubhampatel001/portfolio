"use client";

import { useEffect, useRef, useState } from "react";

// One tooltip for the whole page, driven by event delegation. Any button or link with a data-tip (or an
// aria-label/title that differs from its visible text) explains itself on hover or keyboard focus.
// Controls inside <Tip> bring their own tooltip and are skipped here.
const TARGET = "button, a[href], summary, [role='button']";
const SHOW_MS = 350;

type Shown = { text: string; x: number; y: number; below: boolean };

function describe(el: Element): string | null {
  if (el.closest("[data-tip-local]") || el.closest("[data-no-tip]")) return null;
  const own = el.getAttribute("data-tip");
  if (own) return own;
  const title = el.getAttribute("title");
  if (title) {
    // Take over from the browser's slow native tooltip.
    el.setAttribute("data-tip", title);
    el.removeAttribute("title");
    return title;
  }
  const label = el.getAttribute("aria-label");
  const visible = (el.textContent ?? "").trim().toLowerCase();
  if (label && label.trim().toLowerCase() !== visible) return label;
  return null;
}

export function TooltipLayer() {
  const [shown, setShown] = useState<Shown | null>(null);
  const timer = useRef(0);
  const current = useRef<Element | null>(null);

  useEffect(() => {
    const hide = () => {
      window.clearTimeout(timer.current);
      current.current = null;
      setShown(null);
    };
    const show = (el: Element) => {
      const text = describe(el);
      if (!text || current.current === el) return;
      current.current = el;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        if (!el.isConnected) return;
        const r = el.getBoundingClientRect();
        const below = r.top < 64;
        setShown({ text, x: r.left + r.width / 2, y: below ? r.bottom : r.top, below });
      }, SHOW_MS);
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest?.(TARGET);
      if (el) show(el);
      else if (current.current) hide();
    };
    const onOut = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const to = e.relatedTarget as Element | null;
      if (current.current && !(to && current.current.contains(to))) hide();
    };
    const onFocus = (e: FocusEvent) => {
      const el = (e.target as Element | null)?.closest?.(TARGET);
      if (el && el.matches(":focus-visible")) show(el);
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", hide);
    document.addEventListener("pointerdown", hide);
    document.addEventListener("keydown", hide);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      window.clearTimeout(timer.current);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", hide);
      document.removeEventListener("pointerdown", hide);
      document.removeEventListener("keydown", hide);
      window.removeEventListener("scroll", hide);
    };
  }, []);

  if (!shown) return null;
  const maxW = 230;
  const left = Math.min(Math.max(shown.x, maxW / 2 + 8), window.innerWidth - maxW / 2 - 8);
  return (
    <div
      role="presentation"
      aria-hidden
      className="pointer-events-none fixed z-[96] w-max rounded-md bg-[var(--color-text)] px-2.5 py-1.5 text-center text-[11px] font-medium leading-snug text-[var(--color-bg)] shadow-lg"
      style={{
        left,
        top: shown.y,
        maxWidth: maxW,
        transform: `translate(-50%, ${shown.below ? "8px" : "calc(-100% - 8px)"})`,
      }}
    >
      {shown.text}
    </div>
  );
}
