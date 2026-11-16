"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useDragControls, useMotionValue, useReducedMotion } from "framer-motion";
import { ArrowUp, Repeat2, Sparkles, X, Zap } from "lucide-react";
import { MAX_INPUT, useChat } from "@/lib/use-chat";
import { NEUTRAL, getPersonaById } from "@/lib/personas";
import { openIntro, setCalm, useCalm, usePersona, useIntroOpen } from "@/lib/persona-store";
import { cn } from "@/lib/utils";
import { PersonaAvatar } from "./persona-avatar";
import { RichText } from "./rich-text";
import { Tip } from "./tip";
import { GuideTour } from "./guide-tour";
import { NUDGE_SECTIONS, idleNudge, sectionNudge, tourSteps, type NudgeSection } from "@/lib/nudges";

// Unprompted guide lines: at most a few per visit, spaced out, and never once the visitor has engaged.
const MAX_NUDGES = 3;
const NUDGE_GAP_MS = 25000;
const IDLE_MS = 20000;
const NUDGE_SHOW_MS = 9000;

const sessionGet = (k: string) => {
  try {
    return sessionStorage.getItem(k);
  } catch {
    return null;
  }
};
const sessionSet = (k: string, v: string) => {
  try {
    sessionStorage.setItem(k, v);
  } catch {}
};
const tourSeen = () => {
  try {
    return localStorage.getItem("tour") === "1";
  } catch {
    return true;
  }
};

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
  const [nudge, setNudge] = useState<string | null>(null);
  const [tour, setTour] = useState<number | null>(null);
  const [hover, setHover] = useState(false);
  const field = useRef<HTMLInputElement>(null);
  const bounds = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const wrap = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLFormElement>(null);
  const [below, setBelow] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const calm = useCalm();
  const controls = useDragControls();
  const reduce = useReducedMotion();

  const last = messages.length ? messages[messages.length - 1] : undefined;
  const reply = last?.role === "assistant" ? last : undefined;

  // Keep the dock on screen. Sideways, the whole dock (bar and bubbles) is kept inside the viewport.
  // Vertically only the bar is: bubbles grow up (or down, near the top) and never shove the dock itself,
  // so chatting no longer drifts it upward. Near the top of the screen the bubbles open below the bar.
  const fit = useCallback(() => {
    const el = wrap.current;
    const bar = barRef.current;
    if (!el || !bar) return;
    const r = el.getBoundingClientRect();
    const br = bar.getBoundingClientRect();
    const pad = 12;
    let dx = 0;
    let dy = 0;
    if (r.right > window.innerWidth - pad) dx = window.innerWidth - pad - r.right;
    if (r.left + dx < pad) dx = pad - r.left;
    if (br.top < pad) dy = pad - br.top;
    if (br.bottom + dy > window.innerHeight - pad) dy = window.innerHeight - pad - br.bottom;
    if (dx) animate(x, x.get() + dx, { type: "spring", stiffness: 320, damping: 34 });
    if (dy) animate(y, y.get() + dy, { type: "spring", stiffness: 320, damping: 34 });
    setBelow(br.top + dy < window.innerHeight * 0.4);
  }, [x, y]);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(fit));
    return () => cancelAnimationFrame(id);
  }, [open, hello, showReply, reply?.id, fit]);

  useEffect(() => {
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit]);

  const steps = useMemo(() => tourSteps(personaId), [personaId]);
  const finishTour = useCallback(() => {
    setTour(null);
    try {
      localStorage.setItem("tour", "1");
    } catch {}
  }, []);

  // Nudges stay quiet unless the page is idle: no picker, calm mode, open dock, running tour or reply.
  const canNudge = useRef(false);
  useEffect(() => {
    canNudge.current = !introOpen && !calm && !reduce && !open && !busy && !showReply && tour === null && !hello;
  }, [introOpen, calm, reduce, open, busy, showReply, tour, hello]);
  const lastNudge = useRef(0);
  const nudgeTimer = useRef<number>(0);
  const personaRef = useRef(personaId);
  useEffect(() => {
    personaRef.current = personaId;
  }, [personaId]);

  const stopNudges = useCallback(() => {
    sessionSet("nudge-off", "1");
    window.clearTimeout(nudgeTimer.current);
    setNudge(null);
  }, []);

  const showNudge = useCallback((text: string) => {
    if (!canNudge.current || sessionGet("nudge-off")) return false;
    const count = Number(sessionGet("nudges") ?? 0);
    const now = Date.now();
    if (count >= MAX_NUDGES || now - lastNudge.current < NUDGE_GAP_MS) return false;
    sessionSet("nudges", String(count + 1));
    lastNudge.current = now;
    setNudge(text);
    window.clearTimeout(nudgeTimer.current);
    nudgeTimer.current = window.setTimeout(() => setNudge(null), NUDGE_SHOW_MS);
    return true;
  }, []);

  // Idle hint: once, after a stretch with no pointer, scroll or key activity.
  useEffect(() => {
    let t = 0;
    let done = false;
    const arm = (ms: number) => {
      window.clearTimeout(t);
      if (done) return;
      t = window.setTimeout(() => {
        if (showNudge(idleNudge(personaRef.current))) done = true;
        else arm(10000);
      }, ms);
    };
    const reset = () => arm(IDLE_MS);
    const evs = ["pointermove", "pointerdown", "scroll", "keydown"] as const;
    evs.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    arm(IDLE_MS);
    return () => {
      window.clearTimeout(t);
      evs.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [showNudge]);

  // A remark when a section has been in view for a moment (each section once per visit).
  useEffect(() => {
    const seen = new Set<string>();
    const timers = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          const id = en.target.id;
          if (en.isIntersecting && en.intersectionRatio >= 0.35) {
            if (seen.has(id) || timers.has(id)) continue;
            timers.set(
              id,
              window.setTimeout(() => {
                timers.delete(id);
                if (showNudge(sectionNudge(personaRef.current, id as NudgeSection))) seen.add(id);
              }, 2500)
            );
          } else if (timers.has(id)) {
            window.clearTimeout(timers.get(id));
            timers.delete(id);
          }
        }
      },
      { threshold: [0.35] }
    );
    for (const id of NUDGE_SECTIONS) {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    }
    return () => {
      obs.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [showNudge]);

  // The tour's last step opens the bar so the buttons it describes are visible.
  const goTo = (n: number) => {
    setTour(n);
    if (steps[n]?.open) setOpen(true);
  };

  // Greeting bubble after choosing or switching a guide.
  useEffect(() => {
    let t: number;
    let tourT = 0;
    const onChange = (e: Event) => {
      setHello((e as CustomEvent<{ greeting: string }>).detail.greeting);
      setShowReply(false);
      setNudge(null);
      clear();
      window.clearTimeout(t);
      t = window.setTimeout(() => setHello(null), 7000);
      // First visit: after the greeting, a short tour of the guide and the page effects.
      window.clearTimeout(tourT);
      if (!tourSeen()) tourT = window.setTimeout(() => {
        setHello(null);
        setTour(0);
      }, 2200);
    };
    window.addEventListener("persona-changed", onChange);
    return () => {
      window.removeEventListener("persona-changed", onChange);
      window.clearTimeout(t);
      window.clearTimeout(tourT);
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
        stopNudges();
        window.setTimeout(() => field.current?.focus(), 30);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
        setShowReply(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, stopNudges]);

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
    stopNudges();
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
    stopNudges();
    if (tour === 0 && steps.length > 1) goTo(1);
    setOpen((o) => {
      if (!o) window.setTimeout(() => field.current?.focus(), 30);
      return !o;
    });
  };

  const power = persona?.power;
  const bubble = "pointer-events-auto relative ml-1 max-w-[min(340px,calc(100vw-2rem))] rounded-2xl rounded-bl-sm border border-[var(--color-text)] bg-[var(--color-surface)] text-[13px] leading-snug text-[var(--color-text)]";

  return (
    <>
    {tour !== null && steps[tour] && (
      <GuideTour steps={steps} index={tour} onNext={() => (tour + 1 < steps.length ? goTo(tour + 1) : finishTour())} onSkip={finishTour} />
    )}
    <div ref={bounds} className="pointer-events-none fixed inset-0 z-[70]">
      <motion.div
        ref={wrap}
        style={{ x, y }}
        drag={!reduce}
        dragControls={controls}
        dragListener={false}
        dragMomentum
        onDragTransitionEnd={fit}
        dragElastic={0.15}
        dragTransition={{ power: 0.3, timeConstant: 260 }}
        onDragStart={() => (moved.current = true)}
        onDragEnd={() => {
          window.setTimeout(() => (moved.current = false), 60);
          fit();
        }}
        data-no-fx
        className={cn(
          "pointer-events-none absolute bottom-3 left-3 flex w-fit max-w-[calc(100vw-1.5rem)] items-start gap-2 sm:bottom-5 sm:left-5",
          below ? "flex-col-reverse" : "flex-col"
        )}
      >
        {/* An unprompted hint */}
        <AnimatePresence>
          {nudge && !open && !hello && tour === null && (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(bubble, "pointer-events-auto py-2.5 pl-4 pr-9")}
            >
              <button onClick={toggle} className="text-left">
                {nudge}
              </button>
              <button onClick={stopNudges} aria-label="Dismiss hint" data-tip="No more hints" className="absolute right-2 top-2 rounded-full p-1 text-[var(--color-text-faint)] hover:text-[var(--color-text)]">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
              className={cn(bubble, "max-h-[min(34vh,300px)] overflow-y-auto py-3 pl-4 pr-9")}
            >
              <button
                onClick={() => setShowReply(false)}
                aria-label="Dismiss answer" data-tip="Hide this answer"
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
                <Tip label={power.blurb} align="start">
                  <button
                    data-tour="power"
                    onClick={() => window.dispatchEvent(new CustomEvent("guide-power", { detail: { id: power.id } }))}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-[var(--color-on-accent)] transition-transform hover:-translate-y-0.5"
                  >
                    <Zap size={12} /> {power.label}
                  </button>
                </Tip>
              )}
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  data-tip={`Ask: ${s}`}
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
          ref={barRef}
          onSubmit={submit}
          className={cn(
            "pointer-events-auto flex items-center gap-1.5 rounded-full border-2 border-[var(--color-text)] bg-[var(--color-surface)] p-1 shadow-[3px_3px_0_var(--color-text)] transition-[width] duration-300",
            open ? "w-[min(400px,calc(100vw-1.5rem))]" : "w-auto"
          )}
        >
          <Tip label={open ? "Close" : `Ask ${name} about Shubham (or press /). Drag to move.`} align="start">
            <button
              type="button"
              data-tour="avatar"
              onClick={toggle}
              onPointerDown={(e) => controls.start(e)}
              aria-expanded={open}
              aria-label={open ? `Close ${name}` : `Ask ${name} a question`}
              className="cursor-grab touch-none rounded-full transition-transform hover:scale-105 active:cursor-grabbing"
            >
              <PersonaAvatar id={personaId} size={44} />
            </button>
          </Tip>
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
              <Tip label={calm ? "Page effects are off. Click to turn them on." : "Calm mode: switch off the click, hold and pointer effects"}>
                <button
                  type="button"
                  data-tour="calm"
                  onClick={() => setCalm(!calm)}
                  aria-pressed={calm}
                  aria-label={calm ? "Turn page effects on" : "Calm mode: turn page effects off"}
                  className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <Sparkles size={16} className={calm ? "opacity-40" : undefined} />
                  {calm && <span aria-hidden className="absolute h-px w-5 -rotate-45 bg-current" />}
                </button>
              </Tip>
              <Tip label="Pick a different guide">
                <button
                  type="button"
                  data-tour="swap"
                  onClick={openIntro}
                  aria-label="Change guide"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <Repeat2 size={16} />
                </button>
              </Tip>
              <Tip label="Replay the quick guide">
                <button
                  type="button"
                  onClick={() => goTo(0)}
                  aria-label="Replay the quick guide"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  ?
                </button>
              </Tip>
              <Tip label="Send your question" align="end">
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-text)] text-[var(--color-bg)] transition-opacity disabled:opacity-30"
                >
                  <ArrowUp size={16} />
                </button>
              </Tip>
            </>
          )}
        </form>
      </motion.div>
    </div>
    </>
  );
}
