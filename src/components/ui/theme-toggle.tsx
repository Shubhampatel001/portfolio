"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Tip } from "./tip";

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}

const getTheme = () => document.documentElement.dataset.theme ?? "light";

export function ThemeToggle({ className, tipSide = "bottom" }: { className?: string; tipSide?: "top" | "bottom" }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light");

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <Tip label={theme === "dark" ? "Switch to the light theme" : "Switch to the dark theme"} side={tipSide} align="end">
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={
        className ??
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:border-[var(--color-border-hover)]"
      }
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
    </Tip>
  );
}
