import { profile } from "@/data/resume";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 font-mono text-xs text-[var(--color-text-faint)] sm:flex-row">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Built with Next.js, Tailwind &amp; Framer Motion</span>
      </div>
    </footer>
  );
}
