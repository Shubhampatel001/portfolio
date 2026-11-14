"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getMotion = () => window.matchMedia(QUERY).matches;

/** Lazy, muted, looping project clip. Plays only while on screen; poster only under reduced motion. */
export function ProjectVideo({ base, label }: { base: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useSyncExternalStore(subscribeMotion, getMotion, () => false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload={reduced ? "none" : "metadata"}
      poster={`${base}.jpg`}
      aria-label={`${label} demo recording`}
      className="h-full w-full object-cover object-top"
    >
      <source src={`${base}.webm`} type="video/webm" />
      <source src={`${base}.mp4`} type="video/mp4" />
    </video>
  );
}
