import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-[11px] tracking-tight text-[var(--color-text-muted)] transition-colors duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
        className
      )}
      {...props}
    />
  );
}
