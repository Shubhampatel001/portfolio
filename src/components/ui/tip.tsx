import { cn } from "@/lib/utils";

/**
 * A small themed tooltip for icon buttons. Shows on hover (after a short pause) and on keyboard focus.
 * It is decoration for sighted users; the wrapped control must keep its own aria-label.
 */
export function Tip({
  label,
  children,
  side = "top",
  align = "center",
  className,
}: {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
  className?: string;
}) {
  return (
    <span data-tip-local className={cn("group/tip relative inline-flex", className)}>
      {children}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-[95] w-max max-w-[230px] rounded-md bg-[var(--color-text)] px-2.5 py-1.5 text-left text-[11px] font-medium leading-snug text-[var(--color-bg)] opacity-0 shadow-lg transition-opacity duration-150",
          "group-focus-within/tip:opacity-100 [@media(hover:hover)]:group-hover/tip:opacity-100 [@media(hover:hover)]:group-hover/tip:delay-300",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          align === "start" && "left-0",
          align === "end" && "right-0",
          align === "center" && "left-1/2 -translate-x-1/2"
        )}
      >
        {label}
      </span>
    </span>
  );
}
