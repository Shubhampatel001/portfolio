"use client";

import { motion } from "framer-motion";
import { education, experience } from "@/data/resume";
import { Overlay } from "./overlay";

type Step = { when: string; title: string; sub: string };

const exp = (start: string) => experience.find((e) => e.company.startsWith(start));

function steps(): Step[] {
  const [btech, xii, x] = education;
  const out: Step[] = [
    { when: "2018", title: x.degree, sub: x.school },
    { when: "2020", title: xii.degree, sub: xii.school },
    { when: "2021 – 2025", title: btech.degree, sub: `${btech.school} · ${btech.detail.split("·")[0].trim()}` },
  ];
  for (const key of ["Jindal", "AnsrCoach", "LTIMindtree", "LTM"]) {
    const e = exp(key);
    if (e) out.push({ when: e.duration, title: e.role, sub: e.company });
  }
  return out;
}

/** Thorfinn: the path so far, left to right. */
export function Journey({ onClose }: { onClose: () => void }) {
  const list = steps();
  return (
    <Overlay title="Career timeline" onClose={onClose} className="max-w-6xl">
      <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--color-text)]">The road so far</h2>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">Scroll sideways. Esc closes.</p>

      <div className="mt-8 overflow-x-auto pb-4">
        <ol className="relative flex min-w-max gap-0 pt-6">
          <motion.span
            aria-hidden
            className="absolute left-0 right-0 top-[30px] h-[2px] origin-left bg-[var(--color-accent)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          {list.map((s, i) => (
            <motion.li
              key={s.when + s.title}
              className="relative w-[230px] shrink-0 pr-6"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.12 }}
            >
              <span className="absolute left-0 top-[-0px] h-3 w-3 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-surface)]" />
              <p className="mt-6 text-xs text-[var(--color-text-faint)]">{s.when}</p>
              <p className="font-display mt-1 text-lg font-bold leading-tight text-[var(--color-text)]">{s.title}</p>
              <p className="mt-1 text-[13px] leading-snug text-[var(--color-text-muted)]">{s.sub}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </Overlay>
  );
}
