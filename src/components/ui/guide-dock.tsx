"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useDragControls, useMotionValue, useReducedMotion } from "framer-motion";
import { ArrowUp, Repeat2, Sparkles, X, Zap } from "lucide-react";
import { MAX_INPUT, useChat } from "@/lib/use-chat";
import { NEUTRAL, getPersonaById } from "@/lib/personas";
import { openIntro, setCalm, useCalm, usePersona, useIntroOpen } from "@/lib/persona-store";
import { cn } from "@/lib/utils";
import { PersonaAvatar } from "./persona-avatar";
import { RichText } from "./rich-text";

const SUGGESTIONS = ["What has Shubham built?", "Is he open to roles?"];
/** How long a finished reply stays on screen (hovering or focusing keeps it). */
const REPLY_MS = 16000;

/**
 * The guide is just an avatar until it is needed. Click it (or press "/") to open a single
 * question line; the answer appears as one speech bubble that fades away. No transcript window.
 * Drag the avatar to move the whole thing.
 */
export function GuideDock() {
  const personaId = usePersona();
  const introOpen = useIntroOpen();
  const persona = getPersonaById(personaId);
  const name = persona?.name ?? NEUTRAL.name;
  const { messages, busy, send, clear } = useChat(personaId);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [hello, setHello] = useState<string | null>(null);
  const [showReply, setShowReply] = useState(false);
  const [hover, setHover] = useState(false);
  const field = useRef<HTMLInputElement>(null);
  const bounds = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const wrap = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const calm = useCalm();
  const controls = useDragControls();
  const reduce = useReducedMotion();

  const last = messages.length ? messages[messages.length - 1] : undefined;
  const reply = last?.role === "assistant" ? last : undefined;

  // Keep the whole dock (avatar, bar, bubbles) inside the viewport. When it grows near an edge it
  // slides over just enough to fit, so the guide can be parked anywhere, including the far right.
  const fit = useCallback(() => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 12;
    let dx = 0;
    let dy = 0;
    if (r.right > window.innerWidth - pad) dx = window.innerWidth - pad - r.right;
    if (r.left + dx < pad) dx = pad - r.left;
    if (r.top < pad) dy = pad - r.top;
    if (r.bottom + dy > window.innerHeight - pad) dy = window.innerHeight - pad - r.bottom;
    if (dx) animate(x, x.get() + dx, { type: "spring", stiffness: 320, damping: 34 });
    if (dy) animate(y, y.get() + dy, { type: "spring", stiffness: 320, damping: 34 });
  }, [x, y]);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(fit));
    return () => cancelAnimationFrame(id);
  }, [open, hello, showReply, reply?.id, fit]);

  useEffect(() => {
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit]);

  // Greeting bubble after choosing or switching a guide.
  useEffect(() => {
    let t: number;
    const onChange = (e: Event) => {
      setHello((e as CustomEvent<{ greeting: string }>).detail.greeting);
      setShowReply(false);
      clear();
      window.clearTimeout(t);
      t = window.setTimeout(() => setHello(null), 7000);
    };
    window.addEventListener("persona-changed", onChange);
    return () => {
      window.removeEventListener("persona-changed", onChange);
      window.clearTimeout(t);
    };
  }, [clear]);

  // Keyboard: "/" opens the question line, Escape closes it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !document.documentElement.dataset.intro) {
        e.preventDefault();
        setOpen(true);
        setHello(null);
        window.setTimeout(() => field.current?.focus(), 30);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
        setShowReply(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // A finished reply fades out on its own, unless the visitor is hovering over it.
  const done = !!reply && !busy;
  useEffect(() => {
    if (!done || hover) return;
    const t = window.setTimeout(() => setShowReply(false), REPLY_MS);
    return () => window.clearTimeout(t);
  }, [done, hover, reply?.id]);

  if (introOpen) return null;

  const ask = (q: string) => {
    setHello(null);
    setShowReply(true);
    send(q);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || busy) return;
    ask(input);
    setInput("");
  };
  const toggle = () => {
    if (moved.current) return;
    setHello(null);
    setOpen((o) => {
      if (!o) window.setTimeout(() => field.current?.focus(), 30);
      return !o;
    });
  };

  const power = persona?.power;
  const bubble = "pointer-events-auto relative ml-1 max-w-[min(340px,calc(100vw-2rem))] rounded-2xl rounded-bl-sm border border-[var(--color-text)] bg-[var(--color-surface)] text-[13px] leading-snug text-[var(--color-text)]";

  return (
    <div ref={bounds} className="pointer-events-none fixed inset-0 z-[70]">
      <motion.div
        ref={wrap}
        style={{ x, y }}
        drag={!reduce}
        dragControls={controls}
        dragListener={false}
        dragConstraints={bounds}
        dragMomentum
        dragElastic={0.15}
        dragTransition={{ power: 0.3, timeConstant: 260 }}
        onDragStart={() => (moved.current = true)}
        onDragEnd={() => window.setTimeout(() => (moved.current = false), 60)}
        className="pointer-events-none absolute bottom-3 left-3 flex w-fit max-w-[calc(100vw-1.5rem)] flex-col items-start gap-2 sm:bottom-5 sm:left-5"
      >
        {/* Greeting after picking a guide */}
        <AnimatePresence>
          {hello && !open && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(bubble, "px-4 py-2.5")}
            >
              {hello}
            </motion.p>
          )}
        </AnimatePresence>

        {/* The reply: one bubble, fades away */}
        <AnimatePresence>
          {open && showReply && reply && (
            <motion.div
              key={reply.id}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className={cn(bubble, "max-h-[min(40vh,320px)] overflow-y-auto py-3 pl-4 pr-9")}
            >
              <button
                onClick={() => setShowReply(false)}
                aria-label="Dismiss answer"
                className="absolute right-2 top-2 rounded-full p-1 text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
              >
                <X size={14} />
              </button>
              {!reply.content ? (
                <span className="flex gap-1 py-1" aria-label={`${name} is typing`}>
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-text-faint)]" style={{ animationDelay: `${d * 120}ms` }} />
                  ))}
                </span>
              ) : (
                <div className={cn(reply.error && "text-[var(--color-text-muted)]")}>
                  <RichText text={reply.content} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick actions, only while the line is open and nothing is on screen */}
        <AnimatePresence>
          {open && !showReply && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-auto ml-1 flex flex-wrap gap-1.5"
            >
              {power && (
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("guide-power", { detail: { id: power.id } }))}
                  title={power.blurb}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-[var(--color-on-accent)] transition-transform hover:-translate-y-0.5"
                >
                  <Zap size={12} /> {power.label}
                </button>
              )}
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-[var(--color-text)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text)] transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar, with the question line unfolding beside it */}
        <form
          onSubmit={submit}
          className={cn(
            "pointer-events-auto flex items-center gap-1.5 rounded-full border-2 border-[var(--color-text)] bg-[var(--color-surface)] p-1 shadow-[3px_3px_0_var(--color-text)] transition-[width] duration-300",
            open ? "w-[min(400px,calc(100vw-1.5rem))]" : "w-auto"
          )}
        >
          <button
            type="button"
            onClick={toggle}
            onPointerDown={(e) => controls.start(e)}
            aria-expanded={open}
            aria-label={open ? `Close ${name}` : `Ask ${name} a question`}
            title={open ? "Close" : `Ask ${name} (or press /). Drag to move.`}
            className="cursor-grab touch-none rounded-full transition-transform hover:scale-105 active:cursor-grabbing"
          >
            <PersonaAvatar id={personaId} size={44} />
          </button>
          {open && (
            <>
              <input
                ref={field}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={MAX_INPUT}
                placeholder={`Ask ${name} about Shubham`}
                aria-label="Your question"
                className="min-w-0 flex-1 bg-transparent px-1 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-faint)]"
              />
              <button
                type="button"
                onClick={() => setCalm(!calm)}
                aria-pressed={calm}
                aria-label={calm ? "Turn page effects on" : "Calm mode: turn page effects off"}
                title={calm ? "Page effects are off. Click to turn them on." : "Calm mode: switch off the click and pointer effects"}
                className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                <Sparkles size={16} className={calm ? "opacity-40" : undefined} />
                {calm && <span aria-hidden className="absolute h-px w-5 -rotate-45 bg-current" />}
              </button>
              <button
                type="button"
                onClick={openIntro}
                aria-label="Change guide"
                title="Change guide"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                <Repeat2 size={16} />
              </button>
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-text)] text-[var(--color-bg)] transition-opacity disabled:opacity-30"
              >
                <ArrowUp size={16} />
              </button>
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
}
