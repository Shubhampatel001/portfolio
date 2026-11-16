"use client";

import { profile } from "@/data/resume";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { openIntro } from "@/lib/persona-store";

export function Footer() {
  const linkCls = "text-[var(--color-text-muted)] underline-offset-4 hover:text-[var(--color-text)] hover:underline";
  return (
    <footer className="border-t border-[var(--color-text)] px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 font-mono text-xs sm:flex-row">
        <div className="flex items-center gap-5">
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className={linkCls}>linkedin</a>
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={linkCls}>github</a>
          <button data-tip="Pick a different guide" onClick={openIntro} className={linkCls}>change guide</button>
        </div>
        <div className="flex items-center gap-3 text-[var(--color-text-faint)]">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>· persona themes are fan-inspired, not affiliated</span>
          <ThemeToggle tipSide="top" />
        </div>
      </div>
    </footer>
  );
}
