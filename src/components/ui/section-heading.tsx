"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  align = "left",
  className,
}: {
  /** Accepted for compatibility; no longer rendered (labels above headings were template chrome). */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mb-14", align === "center" && "text-center", className)}
    >
      <h2 className="font-display text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--color-text-muted)]">
          {description}
        </p>
      )}
    </motion.div>
  );
}
