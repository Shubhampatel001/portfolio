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

function LegalDocsVisual() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full">
      {[{ x: 82, y: 45 }, { x: 125, y: 70 }, { x: 168, y: 45 }].map((document, index) => (
        <motion.g
          key={index}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.12 }}
        >
          <rect x={document.x} y={document.y} width="70" height="92" rx="7" fill="var(--color-surface-hover)" stroke="var(--color-border-hover)" />
          <rect x={document.x + 14} y={document.y + 20} width="42" height="3" rx="1.5" fill="var(--color-accent)" />
          <rect x={document.x + 14} y={document.y + 36} width="38" height="2" rx="1" fill="var(--color-text-faint)" />
          <rect x={document.x + 14} y={document.y + 46} width="31" height="2" rx="1" fill="var(--color-text-faint)" />
          <rect x={document.x + 14} y={document.y + 56} width="36" height="2" rx="1" fill="var(--color-text-faint)" />
        </motion.g>
      ))}
    </svg>
  );
}

function DiceVisual() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full">
      {[{ x: 66, y: 56, dots: [[90, 80], [112, 80], [101, 100], [90, 120], [112, 120]] }, { x: 176, y: 56, dots: [[199, 80], [221, 80], [199, 120], [221, 120]] }].map((die, index) => (
        <motion.g key={index} initial={{ opacity: 0, rotate: index ? 10 : -10 }} whileInView={{ opacity: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12, type: "spring" }}>
          <rect x={die.x} y={die.y} width="70" height="88" rx="12" fill="var(--color-surface-hover)" stroke="var(--color-accent)" strokeWidth="1.5" />
          {die.dots.map(([cx, cy], dotIndex) => <circle key={dotIndex} cx={cx} cy={cy} r="4" fill="var(--color-accent)" />)}
        </motion.g>
      ))}
    </svg>
  );
}

function DrumVisual() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full">
      {[70, 160, 250].map((cx, index) => (
        <motion.g key={cx} initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1, type: "spring" }}>
          <circle cx={cx} cy={112} r={index === 1 ? 45 : 31} fill="var(--color-surface-hover)" stroke="var(--color-border-hover)" />
          <circle cx={cx} cy={112} r={index === 1 ? 31 : 20} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
        </motion.g>
      ))}
      <motion.path d="M48 48 L132 104 M272 48 L188 104" stroke="var(--color-violet)" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.45 }} />
    </svg>
  );
}

function SimonVisual() {
  const pads = [
    { x: 101, y: 46, color: "#5b6ef5" }, { x: 162, y: 46, color: "#8b5cf6" },
    { x: 101, y: 107, color: "#4f46e5" }, { x: 162, y: 107, color: "#7c3aed" },
  ];
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full">
      <rect x="83" y="28" width="156" height="156" rx="24" fill="var(--color-surface-hover)" stroke="var(--color-border-hover)" />
      {pads.map((pad, index) => (
        <motion.rect key={index} x={pad.x} y={pad.y} width="53" height="53" rx="12" fill={pad.color} initial={{ opacity: 0.35 }} whileInView={{ opacity: [0.35, 1, 0.35] }} viewport={{ once: true }} transition={{ delay: index * 0.18, duration: 0.55 }} />
      ))}
    </svg>
  );
}

const VISUALS: Record<string, () => React.ReactElement> = {
  "legal-docs": LegalDocsVisual,
  "dice-game": DiceVisual,
  "drum-kit": DrumVisual,
  "simon-game-challenge": SimonVisual,
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
