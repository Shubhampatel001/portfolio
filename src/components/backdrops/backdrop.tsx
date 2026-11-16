"use client";

import { useEffect, useRef } from "react";
import { useIntroOpen, usePersona } from "@/lib/persona-store";
import { SCENES, type Scene, type SceneState } from "./scenes";

/**
 * Two fixed canvases for the active guide: ambient scenery behind the page and cursor effects above it.
 * Nothing runs for the neutral guide, with reduced motion, or while the tab is hidden.
 */
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
      dark: false, mobile: false, calm: false, accent: "#000", alt: "#000", text: "#000",
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

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      s.mx = e.clientX;
      s.my = e.clientY;
      s.active = true;
    };
    const onLeave = () => (s.active = false);
    const onClick = (e: MouseEvent) => {
      if (e.button === 0 && !root.dataset.intro && root.dataset.fx !== "calm") scene.click?.(e.clientX, e.clientY, s);
    };
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
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
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
