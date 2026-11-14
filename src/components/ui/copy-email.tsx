"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/resume";

export function CopyEmail({ className, children }: { className?: string; children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      window.location.href = `mailto:${profile.email}`;
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      <button onClick={copy} className={className}>
        {children ?? profile.email}
      </button>
      <AnimatePresence>
        {copied && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-[var(--color-text)] px-5 py-2.5 font-mono text-xs text-[var(--color-bg)] shadow-lg"
          >
            copied! talk soon.
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
