"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_ITEMS = [
  { id: "projects", label: "work" },
  { id: "experience", label: "experience" },
  { id: "about", label: "about" },
  { id: "contact", label: "contact" },
];

export function Navbar() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = NAV_ITEMS.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled && "bg-[var(--color-bg)]/85 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <button onClick={() => go("hero")} className="font-display text-lg font-semibold tracking-tight text-[var(--color-text)]">
          shubham<span className="text-[var(--color-accent)]">.</span>
        </button>
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={cn(
                "hidden rounded-full px-3 py-1.5 text-sm transition-colors sm:block",
                active === item.id
                  ? "bg-[var(--color-text)] text-[var(--color-bg)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              )}
            >
              {item.label}
            </button>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
