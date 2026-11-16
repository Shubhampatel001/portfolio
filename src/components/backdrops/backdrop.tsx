"use client";

import { useEffect, useRef } from "react";
import { useIntroOpen, usePersona } from "@/lib/persona-store";
import { SCENES, type Scene, type SceneState } from "./scenes";

/**
 * Two fixed canvases for the active guide: ambient scenery behind the page and cursor effects above it.
 * Nothing runs for the neutral guide, with reduced motion, or while the tab is hidden.
 */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** "#rrggbb" or "#rgb" to rgba(); other colour formats get a plain fallback. */
function hexAlpha(color: string, a: number) {
  let h = color.trim();
  if (!h.startsWith("#")) return `rgba(255,255,255,${a})`;
  h = h.slice(1);
  if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  const n = parseInt(h.slice(0, 6), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function Backdrop({ intro = false }: { intro?: boolean }) {
  const persona = usePersona();
  // The page-level backdrop steps aside while the guide picker is open; the picker runs its own copy
  // (intro) so hovering a guide previews its whole scene, not just its colours.
  const introOpen = useIntroOpen();
  const hidden = !intro && introOpen;
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const make = SCENES[persona];
    const bc = back.current;
    const fc = front.current;
    if (!bc || !fc) return;
    const bctx = bc.getContext("2d");
    const fctx = fc.getContext("2d");
    if (!bctx || !fctx) return;
    const clearAll = () => {
      bctx.setTransform(1, 0, 0, 1, 0, 0);
      fctx.setTransform(1, 0, 0, 1, 0, 0);
      bctx.clearRect(0, 0, bc.width, bc.height);
      fctx.clearRect(0, 0, fc.width, fc.height);
    };
    clearAll();
    if (!make || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const s: SceneState = {
      w: 0, h: 0, t: 0, dt: 0, mx: 0, my: 0, active: false, sv: 0,
      dark: false, mobile: false, calm: false, hold: 0, hx: 0, hy: 0, accent: "#000", alt: "#000", text: "#000",
    };
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      s.w = window.innerWidth;
      s.h = window.innerHeight;
      s.mobile = s.w < 640;
      for (const cv of [bc, fc]) {
        cv.width = Math.round(s.w * dpr);
        cv.height = Math.round(s.h * dpr);
      }
    };
    const readColors = () => {
      const cs = getComputedStyle(root);
      s.accent = cs.getPropertyValue("--color-accent").trim() || "#000";
      s.alt = cs.getPropertyValue("--color-lime").trim() || s.accent;
      s.text = cs.getPropertyValue("--color-text").trim() || "#000";
      s.dark = root.dataset.theme === "dark";
    };
    resize();
    readColors();
    const scene: Scene = make(s);

    const themeObs = new MutationObserver(readColors);
    themeObs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    // Effects belong to empty space and text. Anything the visitor can operate (or the guide dock) is left alone.
    const SKIP = "a, button, input, textarea, select, summary, label, video, iframe, [role='button'], [role='dialog'], [role='menu'], [data-no-fx]";
    const onControl = (t: EventTarget | null) => t instanceof Element && !!t.closest(SKIP);
    let pressed = false;
    let pressX = 0;
    let pressY = 0;
    let dragged = false;
    const onMove = (e: PointerEvent) => {
      // A press that travels is a drag (selecting text, scrubbing a slider...), not a tap or a hold.
      if (pressed && !dragged && Math.hypot(e.clientX - pressX, e.clientY - pressY) > 10) {
        dragged = true;
        downAt = -1;
        s.hold = 0;
      }
      if (e.pointerType !== "mouse") return;
      s.mx = e.clientX;
      s.my = e.clientY;
      s.active = true;
    };
    const onLeave = () => (s.active = false);
    const onClick = (e: MouseEvent) => {
      if (dragged || onControl(e.target)) return;
      if (e.button === 0 && !root.dataset.intro && root.dataset.fx !== "calm") scene.click?.(e.clientX, e.clientY, s);
    };
    // A tap is a click. Holding past HOLD_MIN charges (s.hold goes 0..1 by HOLD_FULL) and the release fires.
    const HOLD_MIN = 0.35;
    const HOLD_FULL = 3;
    const live = () => !root.dataset.intro && root.dataset.fx !== "calm";
    let downAt = -1;
    let downX = 0;
    let downY = 0;
    let touch = false;
    let lastBuzz = 0;
    let swallowUntil = 0;
    const onDown = (e: PointerEvent) => {
      pressed = e.button === 0;
      pressX = e.clientX;
      pressY = e.clientY;
      dragged = false;
      if (e.button !== 0 || !live() || !scene.release || onControl(e.target)) return;
      downAt = performance.now();
      downX = e.clientX;
      downY = e.clientY;
      touch = e.pointerType !== "mouse";
    };
    const onUp = (e: PointerEvent) => {
      pressed = false;
      if (downAt < 0) return;
      const held = (performance.now() - downAt) / 1000;
      downAt = -1;
      if (held < HOLD_MIN) {
        s.hold = 0;
        return;
      }
      const power = clamp01((held - HOLD_MIN) / (HOLD_FULL - HOLD_MIN));
      s.hold = 0;
      scene.release?.(e.clientX, e.clientY, s, power);
      // The browser's click that follows a long hold is not a tap: keep it from firing buttons or a second effect.
      swallowUntil = performance.now() + 80;
      if (touch) navigator.vibrate?.(30 + Math.round(power * 120));
    };
    const onCancel = () => {
      pressed = false;
      downAt = -1;
      s.hold = 0;
    };
    // No text selection or context menu while a hold is charging (long-press on a phone).
    const onMenu = (e: Event) => {
      if (downAt >= 0 && (performance.now() - downAt) / 1000 > HOLD_MIN) e.preventDefault();
    };
    const onSelect = (e: Event) => {
      if (downAt >= 0) e.preventDefault();
    };
    window.addEventListener("contextmenu", onMenu);
    document.addEventListener("selectstart", onSelect);
    const swallow = (e: MouseEvent) => {
      if (performance.now() < swallowUntil) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("blur", onCancel);
    window.addEventListener("click", swallow, true);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("click", onClick);
    window.addEventListener("resize", resize);

    let raf = 0;
    let prev = performance.now();
    let prevY = window.scrollY;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) {
        prev = now;
        return;
      }
      s.dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      s.t += s.dt;
      s.calm = root.dataset.fx === "calm";
      if (downAt >= 0) {
        const held = (performance.now() - downAt) / 1000;
        s.hold = held < HOLD_MIN ? 0 : clamp01((held - HOLD_MIN) / (HOLD_FULL - HOLD_MIN));
        s.hx = s.active ? s.mx : downX;
        s.hy = s.active ? s.my : downY;
        if (s.hold > 0 && touch && now - lastBuzz > 220 - s.hold * 130) {
          lastBuzz = now;
          navigator.vibrate?.(8 + Math.round(s.hold * 25));
        }
      }
      const y = window.scrollY;
      const perFrame = s.dt > 0 ? (y - prevY) / (s.dt * 60) : 0;
      prevY = y;
      s.sv += (perFrame - s.sv) * 0.2;

      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.clearRect(0, 0, s.w, s.h);
      fctx.clearRect(0, 0, s.w, s.h);
      scene.back?.(bctx, s);
      bctx.globalAlpha = 1;
      if (intro) {
        // On the guide picker there is little text to protect, so the scenery is drawn about twice as strong.
        bctx.setTransform(1, 0, 0, 1, 0, 0);
        bctx.drawImage(bc, 0, 0);
        bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      scene.front?.(fctx, s);
      fctx.globalAlpha = 1;
      if (s.hold > 0) {
        // Visual vibration: the whole effects layer shakes and the screen edges pulse, harder as the charge builds.
        const k = s.hold;
        const j = k * 3.5;
        fc.style.transform = `translate(${(Math.random() - 0.5) * j}px, ${(Math.random() - 0.5) * j}px)`;
        const pulse = 0.5 + 0.5 * Math.sin(s.t * (10 + k * 30));
        const g = fctx.createRadialGradient(s.w / 2, s.h / 2, Math.min(s.w, s.h) * (0.55 - k * 0.15), s.w / 2, s.h / 2, Math.max(s.w, s.h) * 0.75);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, hexAlpha(s.accent, (0.12 + k * 0.4) * (0.6 + pulse * 0.4)));
        fctx.fillStyle = g;
        fctx.fillRect(0, 0, s.w, s.h);
      } else if (fc.style.transform) {
        fc.style.transform = "";
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("blur", onCancel);
      window.removeEventListener("click", swallow, true);
      window.removeEventListener("contextmenu", onMenu);
      document.removeEventListener("selectstart", onSelect);
      fc.style.transform = "";
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      clearAll();
    };
  }, [persona, hidden, intro]);

  if (hidden) return null;

  return (
    <>
      <canvas ref={back} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen" />
      <canvas ref={front} aria-hidden className="pointer-events-none fixed inset-0 z-[65] h-screen w-screen" />
    </>
  );
}
