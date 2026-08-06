"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
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
      <div
        className={cn(
          "mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]",
          align === "center" && "justify-center"
        )}
      >
        <span className="h-px w-6 bg-[var(--color-accent)]" />
        {eyebrow}
      </div>
      <h2 className="font-display text-3xl font-medium tracking-tight text-[var(--color-text)] sm:text-4xl">
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
