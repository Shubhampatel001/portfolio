"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { PowerId } from "@/lib/personas";
import { Balloons } from "./balloons";
import { Brief } from "./brief";
import { Detective } from "./detective";
import { Journey } from "./journey";
import { Kit } from "./kit";
import { Quiz } from "./quiz";
import { Swing } from "./swing";
import { Wall } from "./wall";

/** Listens for `guide-power` events (from the dock and the hero) and runs the active guide's power. */
export function PowerHost() {
  const [active, setActive] = useState<PowerId | null>(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    const onPower = (e: Event) => {
      const id = (e as CustomEvent<{ id: PowerId }>).detail.id;
      setActive((cur) => (cur === id ? null : id));
    };
    // Switching guide ends whatever the previous guide was doing.
    const reset = () => setActive(null);
    window.addEventListener("guide-power", onPower);
    window.addEventListener("persona-changed", reset);
    return () => {
      window.removeEventListener("guide-power", onPower);
      window.removeEventListener("persona-changed", reset);
    };
  }, []);

  return (
    <AnimatePresence>
      {active === "clones" && <Wall key="clones" onClose={close} />}
      {active === "brief" && <Brief key="brief" onClose={close} />}
      {active === "kit" && <Kit key="kit" onClose={close} />}
      {active === "journey" && <Journey key="journey" onClose={close} />}
      {active === "swing" && <Swing key="swing" onClose={close} />}
      {active === "quiz" && <Quiz key="quiz" onClose={close} />}
      {active === "balloons" && <Balloons key="balloons" onClose={close} />}
      {active === "detective" && <Detective key="detective" onClose={close} />}
    </AnimatePresence>
  );
}
