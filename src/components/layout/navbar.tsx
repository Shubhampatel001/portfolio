"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certs" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl border px-4 py-2.5 backdrop-blur-xl transition-all duration-300",
            scrolled
              ? "border-[var(--color-border)] bg-[var(--color-bg)]/80 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
              : "border-transparent bg-transparent"
          )}
        >
          <button
            onClick={() => handleNavClick("hero")}
            className="font-display text-sm font-semibold tracking-tight text-[var(--color-text)]"
          >
            SP<span className="text-[var(--color-accent)]">.</span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200",
                  active === item.id
                    ? "text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                )}
              >
                {active === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-[var(--color-surface-hover)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => handleNavClick("contact")}
            className="hidden rounded-full bg-[var(--color-text)] px-4 py-2 text-[13px] font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-accent-hover)] hover:text-white md:block"
          >
            Let&apos;s talk
          </button>

          <button
            className="text-[var(--color-text)] md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-2 flex flex-col gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/95 p-3 backdrop-blur-xl md:hidden"
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors",
                    active === item.id
                      ? "bg-[var(--color-surface-hover)] text-[var(--color-text)]"
                      : "text-[var(--color-text-muted)]"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
