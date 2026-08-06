"use client";

import { motion } from "framer-motion";

// Each project gets a distinct, honest abstract visualization of what it does —
// not a fabricated screenshot. Built from CSS/SVG primitives.

function RagVisual() {
  const nodes = [
    { x: 20, y: 30 }, { x: 20, y: 60 }, { x: 20, y: 90 },
    { x: 20, y: 120 }, { x: 20, y: 150 },
  ];
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full">
      <defs>
        <linearGradient id="ragline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {nodes.map((n, i) => (
        <motion.line
          key={i}
          x1={n.x} y1={n.y} x2={170} y2={100}
          stroke="url(#ragline)" strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.08 }}
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="4" fill="var(--color-text-faint)" />
      ))}
      <motion.circle
        cx={170} cy={100} r="10"
        fill="var(--color-accent)"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: "spring" }}
      />
      <line x1={180} y1={100} x2={280} y2={100} stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3 4" />
      <rect x={282} y={80} width="34" height="40" rx="6" fill="var(--color-surface-hover)" stroke="var(--color-border-hover)" />
      <circle cx="299" cy="94" r="3" fill="var(--color-accent)" />
      <rect x="290" y="102" width="18" height="2" rx="1" fill="var(--color-text-faint)" />
      <rect x="290" y="108" width="12" height="2" rx="1" fill="var(--color-text-faint)" />
    </svg>
  );
}

function EvoDriveVisual() {
  const path = "M20,160 C 60,60 100,180 140,90 S 220,40 300,70";
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full">
      <path d={path} fill="none" stroke="var(--color-border-hover)" strokeWidth="1" strokeDasharray="4 5" />
      <motion.path
        d={path}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
      {[{cx:90,cy:120},{cx:180,cy:70},{cx:250,cy:130}].map((c,i)=>(
        <circle key={i} cx={c.cx} cy={c.cy} r="14" fill="var(--color-surface-hover)" stroke="var(--color-border-hover)" />
      ))}
      <motion.circle
        r="6" fill="var(--color-violet)"
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{ offsetPath: `path('${path}')` }}
      />
    </svg>
  );
}

function NeatVisual() {
  const layers = [3, 4, 2];
  const layerX = [30, 160, 290];
  const positions = layers.map((count, li) =>
    Array.from({ length: count }, (_, i) => ({
      x: layerX[li],
      y: 100 - ((count - 1) * 22) / 2 + i * 22,
    }))
  );
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full">
      {positions.slice(0, -1).map((layer, li) =>
        layer.map((n, ni) =>
          positions[li + 1].map((m, mi) => (
            <motion.line
              key={`${li}-${ni}-${mi}`}
              x1={n.x} y1={n.y} x2={m.x} y2={m.y}
              stroke="var(--color-border-hover)"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ delay: (li + ni * 0.1) * 0.15 }}
            />
          ))
        )
      )}
      {positions.flat().map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r="7"
          fill="var(--color-surface-hover)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, type: "spring" }}
        />
      ))}
    </svg>
  );
}

const VISUALS: Record<string, () => React.ReactElement> = {
  "perplexa-chat": RagVisual,
  evodrive: EvoDriveVisual,
  "flappy-bird-neat": NeatVisual,
};

export function ProjectVisual({ slug }: { slug: string }) {
  const Visual = VISUALS[slug] ?? RagVisual;
  return (
    <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <Visual />
    </div>
  );
}
