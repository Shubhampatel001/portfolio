import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "persona-card rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-300",
        className
      )}
      {...props}
    />
  );
}
