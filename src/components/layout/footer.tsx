"use client";

import { profile } from "@/data/resume";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Footer() {
  const linkCls = "text-[var(--color-text-muted)] underline-offset-4 hover:text-[var(--color-text)] hover:underline";
  return (
    <footer className="border-t border-[var(--color-text)] px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 font-mono text-xs sm:flex-row">
        <div className="flex items-center gap-5">
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className={linkCls}>linkedin</a>
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={linkCls}>github</a>
          <button onClick={() => window.dispatchEvent(new Event("mascot-trick"))} className={linkCls}>do a trick</button>
        </div>
        <div className="flex items-center gap-3 text-[var(--color-text-faint)]">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
