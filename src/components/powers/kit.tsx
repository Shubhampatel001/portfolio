"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { profile, skills } from "@/data/resume";
import { Overlay } from "./overlay";

/** Kakashi: everything a recruiter or teammate needs to copy, in one place. */
export function Kit({ onClose }: { onClose: () => void }) {
  const [done, setDone] = useState<string | null>(null);
  const site = typeof window !== "undefined" ? window.location.origin : "";

  const intro = `Hi, I'm ${profile.name}, a software engineer at LTM in Pune. I work across Java, Spring Boot, Angular and React, and on Guidewire PolicyCenter for insurance. I also build GenAI and machine-learning projects, like Perplexa (RAG search) and EvoDrive (a self-driving simulation). Portfolio: ${site} | Email: ${profile.email}`;
  const stack = [...skills.Languages, ...skills.Frameworks.slice(0, 6), ...skills.Databases].join(", ");

  const items: { label: string; value: string }[] = [
    { label: "Email", value: profile.email },
    { label: "GitHub", value: profile.links.github },
    { label: "LinkedIn", value: profile.links.linkedin },
    { label: "Short intro", value: intro },
    { label: "Tech stack", value: stack },
  ];

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(label);
      window.setTimeout(() => setDone((d) => (d === label ? null : d)), 1800);
    } catch {
      /* clipboard blocked: the value is visible and selectable */
    }
  };

  return (
    <Overlay title="Copy kit" onClose={onClose} className="max-w-xl">
      <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--color-text)]">Copy kit</h2>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">Everything you need to reach out or pass me along.</p>

      <ul className="mt-5 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {items.map((it) => (
          <li key={it.label} className="flex items-start gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--color-text-faint)]">{it.label}</p>
              <p className="mt-0.5 line-clamp-2 break-words text-sm text-[var(--color-text)]">{it.value}</p>
            </div>
            <button
              onClick={() => copy(it.label, it.value)}
              aria-label={`Copy ${it.label}`}
              className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-text)] px-3 py-1.5 text-xs text-[var(--color-text)] transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
            >
              {done === it.label ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
            </button>
          </li>
        ))}
      </ul>

      <a
        href="/resume.pdf"
        download
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-on-accent)]"
      >
        <Download size={15} /> Download resume (PDF)
      </a>
    </Overlay>
  );
}
